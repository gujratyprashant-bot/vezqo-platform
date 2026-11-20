import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const allowedTypes = new Set(["brand_campaign","sponsored_listing","advertising","research","affiliate_partnership","other"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Honeypot field for basic automated-spam filtering.
    if (typeof body?.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true });
    }
    const contact_name = String(body?.contact_name ?? "").trim().slice(0,100);
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0,254);
    const company = String(body?.company ?? "").trim().slice(0,160);
    const inquiry_type = String(body?.inquiry_type ?? "");
    const budget_range = String(body?.budget_range ?? "").trim().slice(0,80) || null;
    const message = String(body?.message ?? "").trim().slice(0,3000);
    if (contact_name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || company.length < 2 ||
        !allowedTypes.has(inquiry_type) || message.length < 20) {
      return NextResponse.json({ error: "Please complete all required fields with valid details." }, { status: 400 });
    }
    const supabase = await createClient();
    const { error } = await supabase.from("partnership_inquiries").insert({
      contact_name, email, company, inquiry_type, budget_range, message
    });
    if (error) {
      console.error("Partnership inquiry insert failed", error.code);
      return NextResponse.json({ error: "We couldn't submit your request. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We couldn't submit your request. Please try again." }, { status: 500 });
  }
}
