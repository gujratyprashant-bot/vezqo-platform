import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function readCookie(header: string, name: string) {
  const prefix = name + "=";
  const item = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const verdict = body?.verdict;
    if (!/^[a-z0-9-]{3,100}$/i.test(slug) || !["want", "kill"].includes(verdict)) {
      return NextResponse.json({ error: "A valid listing and vote are required." }, { status: 400 });
    }

    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) return NextResponse.json({ error: "Voting is temporarily unavailable." }, { status: 503 });

    const cookieHeader = request.headers.get("cookie") ?? "";
    let voterId = readCookie(cookieHeader, "vz_voter");
    const isNewVoter = !/^[0-9a-f-]{36}$/i.test(voterId);
    if (isNewVoter) voterId = randomUUID();

    const forwarded = request.headers.get("x-forwarded-for") ?? "";
    const ip = (forwarded.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
    const ipHash = createHmac("sha256", secret).update(ip).digest("hex");
    const voterHash = createHmac("sha256", secret).update(voterId).digest("hex");

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("cast_vote", {
      _slug: slug,
      _verdict: verdict,
      _voter_hash: voterHash,
      _ip_hash: ipHash,
    });
    if (error) {
      console.error("VEZQO vote RPC failed", error.code);
      return NextResponse.json({ error: "Your vote could not be recorded. Please retry." }, { status: 503 });
    }

    const result = data as { ok?: boolean; error?: string } | null;
    if (!result?.ok) {
      const reason = result?.error ?? "unknown";
      const messages: Record<string, string> = {
        not_found: "This listing could not be found.",
        not_active: "Voting for this listing is closed.",
        already_voted: "You have already voted on this idea from this browser.",
        rate_limited: "Too many votes from this network. Please try again later.",
      };
      const status = reason === "already_voted" ? 409 : reason === "rate_limited" ? 429 : reason === "not_found" ? 404 : 400;
      const response = NextResponse.json({ error: messages[reason] ?? "This vote could not be accepted." }, { status });
      if (isNewVoter) response.cookies.set("vz_voter", voterId, {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
        path: "/", maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }

    const { data: listing, error: listingError } = await admin
      .from("tests").select("want_count,kill_count,status").eq("slug", slug).maybeSingle();
    if (listingError || !listing) {
      return NextResponse.json({ ok: true, message: "Vote recorded." });
    }
    const response = NextResponse.json({
      ok: true,
      wantCount: listing.want_count ?? 0,
      killCount: listing.kill_count ?? 0,
      status: listing.status,
    });
    if (isNewVoter) response.cookies.set("vz_voter", voterId, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Your vote could not be recorded. Please retry." }, { status: 400 });
  }
}
