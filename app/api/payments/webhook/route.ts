import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!secret || !signature || !timestamp) return NextResponse.json({ error: "Missing webhook verification data." }, { status: 400 });

  const expected = createHmac("sha256", secret).update(timestamp + rawBody).digest("base64");
  const supplied = Buffer.from(signature);
  const calculated = Buffer.from(expected);
  if (supplied.length !== calculated.length || !timingSafeEqual(supplied, calculated)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);
    const orderId = event?.data?.order?.order_id;
    const payment = event?.data?.payment;
    const paymentId = String(payment?.cf_payment_id ?? "");
    const status = String(payment?.payment_status ?? "");
    if (!orderId || !paymentId || !status) return NextResponse.json({ received: true });

    const admin = createAdminClient();
    const eventId = `${paymentId}:${status}`;
    const { error: eventError } = await admin.from("webhook_events").insert({
      provider: "cashfree", event_id: eventId, event_type: event?.type ?? "PAYMENT_EVENT",
      payload: event, status: "received"
    });
    if (eventError?.code === "23505") return NextResponse.json({ received: true, duplicate: true });
    if (eventError) throw eventError;

    const { data: order, error: orderError } = await admin.from("orders")
      .select("id,test_id,creator_id,amount_paise,status")
      .eq("cashfree_order_id", orderId).maybeSingle();
    if (orderError || !order) throw new Error("Matching order was not found.");

    if (status === "SUCCESS") {
      const paidAmount = Math.round(Number(payment.payment_amount) * 100);
      if (paidAmount !== Number(order.amount_paise)) throw new Error("Payment amount does not match the order.");
      const { data: savedPayment, error: paymentError } = await admin.from("payments").upsert({
        order_id: order.id, cashfree_payment_id: paymentId, amount_paise: paidAmount,
        status: "captured", method: payment.payment_group ?? null, verified_via: "cashfree_webhook"
      }, { onConflict: "cashfree_payment_id" }).select("id").single();
      if (paymentError) throw paymentError;
      const { error: updateError } = await admin.from("orders").update({ status: "paid" }).eq("id", order.id);
      if (updateError) throw updateError;
      await admin.from("tests").update({
        status: "active", order_id: order.id, payment_id: savedPayment.id, activated_at: new Date().toISOString()
      }).eq("id", order.test_id).eq("creator_id", order.creator_id).eq("status", "draft");
    } else if (status === "FAILED" || status === "USER_DROPPED") {
      await admin.from("payments").upsert({
        order_id: order.id, cashfree_payment_id: paymentId,
        amount_paise: Math.round(Number(payment.payment_amount ?? 0) * 100),
        status: status.toLowerCase(), verified_via: "cashfree_webhook"
      }, { onConflict: "cashfree_payment_id" });
    }

    await admin.from("webhook_events").update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("provider", "cashfree").eq("event_id", eventId);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed; event can be retried." }, { status: 500 });
  }
}
