import { NextResponse } from "next/server";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createUserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in is required." }, { status: 401 });
  const orderId = new URL(request.url).searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("orders").select("cashfree_order_id,status,amount_paise,currency")
      .eq("cashfree_order_id", orderId).eq("creator_id", user.id).maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: "Payment status is not configured yet." }, { status: 503 });
  }
}
