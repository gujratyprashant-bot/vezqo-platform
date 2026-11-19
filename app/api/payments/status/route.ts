import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in is required." }, { status: 401 });
  const orderId = new URL(request.url).searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  const { data, error } = await supabase.from("orders")
    .select("cashfree_order_id,status,amount_paise,currency")
    .eq("cashfree_order_id", orderId).eq("creator_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to read payment status." }, { status: 503 });
  if (!data) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order: data });
}
