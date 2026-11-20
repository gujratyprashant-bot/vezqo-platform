import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ testId: string; destination: string }> }) {
  const { testId, destination } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(testId) || !["official", "affiliate"].includes(destination)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = createAdminClient();
  const { data: item, error } = await supabase
    .from("tests")
    .select("id,official_url,affiliate_url,status")
    .eq("id", testId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !item) return new NextResponse("Not found", { status: 404 });
  const target = destination === "affiliate" ? item.affiliate_url : item.official_url;
  if (!target) return new NextResponse("Link unavailable", { status: 404 });

  try {
    const url = new URL(target);
    if (url.protocol !== "https:" || url.username || url.password) return new NextResponse("Link unavailable", { status: 404 });
  } catch {
    return new NextResponse("Link unavailable", { status: 404 });
  }

  await supabase.from("affiliate_clicks").insert({ test_id: item.id, destination });
  return NextResponse.redirect(target, { status: 302 });
}
