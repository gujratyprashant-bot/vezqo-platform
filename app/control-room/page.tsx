import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Logo from "@/app/components/logo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ControlRoomPage() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) redirect("/login?next=/control-room");

  const allowedEmails = (process.env.VEZQO_OWNER_EMAILS ?? "")
    .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const { data: role } = await auth.from("user_roles")
    .select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  const isOwner = Boolean(user.email && allowedEmails.includes(user.email.toLowerCase()));
  if (!isOwner && !role) redirect("/account");

  const db = createAdminClient();
  const [
    { count: users },
    { count: tests },
    { count: activeTests },
    { count: orders },
    { count: payments },
    { count: affiliateClicks },
    { data: categories },
    { data: recentOrders },
    { data: recentTests },
    { count: partnershipInquiries },
    { data: recentInquiries },
  ] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("tests").select("id", { count: "exact", head: true }),
    db.from("tests").select("id", { count: "exact", head: true }).eq("status", "active"),
    db.from("orders").select("id", { count: "exact", head: true }),
    db.from("payments").select("id", { count: "exact", head: true }),
    db.from("affiliate_clicks").select("id", { count: "exact", head: true }),
    db.from("categories").select("id,name,slug").eq("active", true).order("sort"),
    db.from("orders").select("id,amount_paise,currency,status,created_at,payment_provider").order("created_at", { ascending: false }).limit(8),
    db.from("tests").select("id,title,status,created_at,creator_id,categories(name)").order("created_at", { ascending: false }).limit(8),
    db.from("partnership_inquiries").select("id", { count: "exact", head: true }),
    db.from("partnership_inquiries").select("id,contact_name,email,company,inquiry_type,status,created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const stats = [
    ["MEMBERS", users ?? 0], ["ALL TESTS", tests ?? 0], ["LIVE TESTS", activeTests ?? 0],
    ["ORDERS", orders ?? 0], ["PAYMENT RECORDS", payments ?? 0], ["AFFILIATE CLICKS", affiliateClicks ?? 0], ["PARTNERSHIP LEADS", partnershipInquiries ?? 0],
  ];

  return (
    <main className="vz-shell vz-control-room">
      <div className="vz-topline"><span>VEZQO / OWNER ACCESS ONLY</span><span>PRIVATE CONTROL ROOM <b>●</b></span></div>
      <header className="vz-nav"><Logo /><nav className="vz-navlinks"><a href="/">PUBLIC SITE</a><a href="/leaderboard">LEADERBOARD</a><a href="/account">MEMBER WORKSPACE</a></nav><div className="vz-nav-actions"><span className="vz-account-email">OWNER SESSION</span><a className="vz-workspace-signout" href="/account">ACCOUNT ↗</a></div></header>
      <section className="vz-control-hero"><div className="vz-kicker"><i/> PRIVATE / PLATFORM INTELLIGENCE</div><h1>YOUR CONTROL<br/><em>ROOM.</em></h1><p>Everything private about VEZQO, kept away from the public website. Platform activity, payments, listings and affiliate traffic.</p><div className="vz-control-identity">SIGNED IN AS <b>{user.email}</b><span>· ADMIN ACCESS VERIFIED</span></div></section>
      <section className="vz-control-content">
        <div className="vz-section-label"><span>01 / PLATFORM OVERVIEW</span><span>LIVE DATABASE COUNTS</span></div>
        <div className="vz-control-stats">{stats.map(([label,value])=><article key={label}><span>{label}</span><b>{Number(value).toLocaleString("en-IN")}</b><i>PLATFORM TOTAL</i></article>)}</div>
        <div className="vz-control-grid">
          <section className="vz-control-panel"><div className="vz-control-panel-head"><span>02 / CATEGORY ACTIVITY</span><b>ALL CATEGORIES</b></div><h2>THE SIGNAL MAP.</h2>{(categories??[]).map((category:any)=><div className="vz-control-row" key={category.id}><span>{category.name}</span><a href={"/leaderboard#category-"+category.slug}>VIEW PUBLIC RANKING ↗</a></div>)}</section>
          <section className="vz-control-panel"><div className="vz-control-panel-head"><span>03 / RECENT ORDERS</span><b>{(recentOrders??[]).length} SHOWN</b></div><h2>PAYMENT ACTIVITY.</h2>{(recentOrders??[]).length===0?<p className="vz-control-empty">No orders recorded yet.</p>:(recentOrders??[]).map((order:any)=><div className="vz-control-row" key={order.id}><span>{order.currency} {(order.amount_paise/100).toLocaleString("en-IN")}<small>{new Date(order.created_at).toLocaleDateString("en-IN")}</small></span><b>{String(order.status).toUpperCase()}</b></div>)}</section>
          <section className="vz-control-panel vz-control-wide"><div className="vz-control-panel-head"><span>04 / RECENT LISTINGS</span><b>{(recentTests??[]).length} SHOWN</b></div><h2>WHAT'S BEING BUILT.</h2>{(recentTests??[]).length===0?<p className="vz-control-empty">No listings created yet.</p>:(recentTests??[]).map((test:any)=><div className="vz-control-row" key={test.id}><span>{test.title}<small>{Array.isArray(test.categories)?test.categories[0]?.name:test.categories?.name} · {new Date(test.created_at).toLocaleDateString("en-IN")}</small></span><b>{String(test.status).toUpperCase()}</b></div>)}</section>
        </div>
        <section className="vz-control-panel vz-control-wide" style={{marginTop:14}}><div className="vz-control-panel-head"><span>05 / COMMERCIAL PIPELINE</span><b>{(recentInquiries??[]).length} RECENT ENQUIRIES</b></div><h2>PARTNERSHIP LEADS.</h2>{(recentInquiries??[]).length===0?<p className="vz-control-empty">No partnership enquiries yet.</p>:(recentInquiries??[]).map((lead:any)=><div className="vz-control-row" key={lead.id}><span>{lead.company} · {lead.contact_name}<small>{lead.email} · {String(lead.inquiry_type).replace(/_/g," ").toUpperCase()} · {new Date(lead.created_at).toLocaleDateString("en-IN")}</small></span><b>{String(lead.status).toUpperCase()}</b></div>)}</section>
        <p className="vz-control-note">Private operational view. Payment counts are records, not verified settlement totals. Affiliate click counts are traffic events, not confirmed commissions. Check provider dashboards for settled funds and approved commissions.</p>
      </section>
      <footer className="vz-footer"><div className="vz-footer-brand"><Logo/><p>Private owner tools.</p></div><nav><a href="/">PUBLIC SITE</a><a href="/account">MEMBER WORKSPACE</a></nav><div className="vz-footer-bottom"><span>© {new Date().getFullYear()} VEZQO</span><span>OWNER ACCESS ONLY</span></div></footer>
    </main>
  );
}
