import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";
  const secret = process.env.CASHFREE_CLIENT_SECRET;

  if (!secret || !signature || !timestamp) {
    return NextResponse.json({ error: "Missing webhook verification data." }, { status: 400 });
  }

  const expected = createHmac("sha256", secret).update(timestamp + rawBody).digest("base64");
  const supplied = Buffer.from(signature);
  const calculated = Buffer.from(expected);
  if (supplied.length !== calculated.length || !timingSafeEqual(supplied, calculated)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let eventId = "";
  let admin: ReturnType<typeof createAdminClient> | undefined;

  try {
    const event = JSON.parse(rawBody);
    const orderId = event?.data?.order?.order_id;
    const payment = event?.data?.payment;
    const paymentId = String(payment?.cf_payment_id ?? "");
    const paymentStatus = String(payment?.payment_status ?? "");

    if (!orderId || !paymentId || !paymentStatus) {
      return NextResponse.json({ received: true, ignored: true });
    }

    admin = createAdminClient();
    eventId = `${paymentId}:${paymentStatus}`;

    const { error: insertEventError } = await admin.from("webhook_events").insert({
      provider: "cashfree",
      event_id: eventId,
      event_type: event?.type ?? "PAYMENT_EVENT",
      payload: event,
      status: "received",
    });

    if (insertEventError?.code === "23505") {
      const { data: previousEvent, error: previousEventError } = await admin
        .from("webhook_events")
        .select("status")
        .eq("provider", "cashfree")
        .eq("event_id", eventId)
        .maybeSingle();

      if (previousEventError) throw previousEventError;
      if (previousEvent?.status === "processed") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      // A previous attempt may have failed after recording the event.
      // Continue processing so Cashfree retries can safely recover it.
    } else if (insertEventError) {
      throw insertEventError;
    }

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id,test_id,creator_id,package_id,amount_paise,status")
      .eq("cashfree_order_id", orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) throw new Error("Matching order was not found.");

    if (paymentStatus === "SUCCESS") {
      const paidAmount = Math.round(Number(payment.payment_amount) * 100);
      if (!Number.isFinite(paidAmount) || paidAmount !== Number(order.amount_paise)) {
        throw new Error("Payment amount does not match the order.");
      }

      const { data: pack, error: packageError } = await admin
        .from("packages")
        .select("id,responses")
        .eq("id", order.package_id)
        .maybeSingle();

      if (packageError) throw packageError;
      if (!pack) throw new Error("The package linked to this order was not found.");

      const { data: savedPayment, error: paymentError } = await admin
        .from("payments")
        .upsert({
          order_id: order.id,
          cashfree_payment_id: paymentId,
          amount_paise: paidAmount,
          status: "captured",
          method: payment.payment_group ?? null,
          verified_via: "cashfree_webhook",
        }, { onConflict: "cashfree_payment_id" })
        .select("id")
        .single();

      if (paymentError) throw paymentError;

      const { error: orderUpdateError } = await admin
        .from("orders")
        .update({ status: "paid" })
        .eq("id", order.id);
      if (orderUpdateError) throw orderUpdateError;

      const { error: testUpdateError } = await admin
        .from("tests")
        .update({
          status: "active",
          package_id: pack.id,
          target_responses: pack.responses,
          order_id: order.id,
          payment_id: savedPayment.id,
          activated_at: new Date().toISOString(),
        })
        .eq("id", order.test_id)
        .eq("creator_id", order.creator_id)
        .eq("status", "draft");
      if (testUpdateError) throw testUpdateError;

      const { error: packageLinkError } = await admin
        .from("test_packages")
        .upsert({
          test_id: order.test_id,
          package_id: pack.id,
          order_id: order.id,
          responses: pack.responses,
          price_paise: order.amount_paise,
        }, { onConflict: "order_id" });
      if (packageLinkError) throw packageLinkError;
    } else if (paymentStatus === "FAILED" || paymentStatus === "USER_DROPPED") {
      const { error: failedPaymentError } = await admin.from("payments").upsert({
        order_id: order.id,
        cashfree_payment_id: paymentId,
        amount_paise: Math.round(Number(payment.payment_amount ?? 0) * 100),
        status: paymentStatus.toLowerCase(),
        verified_via: "cashfree_webhook",
      }, { onConflict: "cashfree_payment_id" });
      if (failedPaymentError) throw failedPaymentError;
    } else {
      // Pending/unknown states are acknowledged but not treated as paid.
      return NextResponse.json({ received: true, pending: true });
    }

    const { error: processedError } = await admin
      .from("webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString(), error: null })
      .eq("provider", "cashfree")
      .eq("event_id", eventId);
    if (processedError) throw processedError;

    return NextResponse.json({ received: true });
  } catch (error) {
    if (admin && eventId) {
      const safeMessage = error instanceof Error ? error.message.slice(0, 500) : "Unknown webhook processing error";
      await admin.from("webhook_events")
        .update({ status: "failed", error: safeMessage })
        .eq("provider", "cashfree")
        .eq("event_id", eventId);
    }
    return NextResponse.json(
      { error: "Webhook processing failed; the event can be retried." },
      { status: 500 },
    );
  }
}
