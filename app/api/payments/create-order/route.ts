import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const cashfreeBase = () => process.env.CASHFREE_ENV === "production"
  ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

export async function POST(request: Request) {
  try {
    const userClient = await createUserClient();
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Sign in is required." }, { status: 401 });

    const { testId, packageCode } = await request.json();
    if (typeof testId !== "string" || !/^[0-9a-f-]{36}$/i.test(testId) || typeof packageCode !== "string") {
      return NextResponse.json({ error: "A valid test and package are required." }, { status: 400 });
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return NextResponse.json({ error: "Cashfree credentials are not configured on the server." }, { status: 503 });

    const phone = String(user.user_metadata?.phone ?? "").replace(/\D/g, "");
    if (!/^\d{10}$/.test(phone)) return NextResponse.json({ error: "Add a valid 10-digit mobile number to your account before checkout." }, { status: 400 });

    const admin = createAdminClient();
    const [{ data: test, error: testError }, { data: pack, error: packError }] = await Promise.all([
      admin.from("tests").select("id,creator_id,title,status").eq("id", testId).eq("creator_id", user.id).maybeSingle(),
      admin.from("packages").select("id,code,name,responses,price_paise,currency,active").eq("code", packageCode).eq("active", true).maybeSingle()
    ]);
    if (testError || !test || test.status !== "draft") return NextResponse.json({ error: "Draft test not found for this account." }, { status: 404 });
    if (packError || !pack) return NextResponse.json({ error: "Selected package is unavailable." }, { status: 404 });
    if (pack.currency !== "INR") return NextResponse.json({ error: "Only INR checkout is enabled in this integration." }, { status: 400 });

    const internalId = randomUUID();
    const cashfreeOrderId = `vz_${internalId.replace(/-/g, "").slice(0, 24)}`;
    const amount = Number(pack.price_paise) / 100;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl || !appUrl.startsWith("https://") && process.env.CASHFREE_ENV === "production") {
      return NextResponse.json({ error: "Set the public HTTPS application URL before enabling production checkout." }, { status: 503 });
    }
    const { error: insertError } = await admin.from("orders").insert({
      id: internalId, test_id: test.id, creator_id: user.id, package_id: pack.id,
      amount_paise: pack.price_paise, currency: "INR", cashfree_order_id: cashfreeOrderId,
      payment_provider: "cashfree", status: "created"
    });
    if (insertError) throw new Error("Could not create the local order.");

    const response = await fetch(`${cashfreeBase()}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", "x-client-id": clientId,
        "x-client-secret": clientSecret, "x-api-version": "2025-01-01",
        "x-idempotency-key": internalId
      },
      body: JSON.stringify({
        order_id: cashfreeOrderId, order_amount: amount, order_currency: "INR",
        customer_details: {
          customer_id: user.id, customer_name: String(user.user_metadata?.display_name ?? "VEZQO member").slice(0, 100),
          customer_email: user.email, customer_phone: phone
        },
        order_meta: {
          return_url: `${appUrl}/payment/return?order_id={order_id}`,
          notify_url: `${appUrl}/api/payments/webhook`
        },
        order_note: `VEZQO ${pack.name} package for test ${test.id}`
      })
    });
    const payload = await response.json();
    if (!response.ok || !payload.payment_session_id) {
      await admin.from("orders").update({ status: "failed" }).eq("id", internalId);
      return NextResponse.json({ error: "Cashfree could not initialize checkout. Please retry." }, { status: 502 });
    }
    return NextResponse.json({ orderId: cashfreeOrderId, paymentSessionId: payload.payment_session_id, environment: process.env.CASHFREE_ENV === "production" ? "production" : "sandbox" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to initialize checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
