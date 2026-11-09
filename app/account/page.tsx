import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/app/components/logo";
import CheckoutButton from "@/app/components/checkout-button";
import CreateDraftButton from "@/app/components/create-draft-button";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

async function savePhone(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(phone)) redirect("/account?error=phone");
  const { error } = await supabase.auth.updateUser({ data: { phone } });
  if (error) redirect("/account?error=phone");
  revalidatePath("/account");
  redirect("/account?phoneSaved=1");
}

async function createDraft(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");

  if (title.length < 3 || title.length > 120 || description.length < 10 || description.length > 600 || !categoryId) {
    redirect("/account?error=validation");
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .eq("active", true)
    .maybeSingle();

  if (categoryError || !category) redirect("/account?error=category");

  // A rapid repeat of the same form submission should reuse the existing draft.
  const duplicateWindow = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { data: recentDraft } = await supabase
    .from("tests")
    .select("id")
    .eq("creator_id", user.id)
    .eq("status", "draft")
    .eq("title", title)
    .eq("description", description)
    .gte("created_at", duplicateWindow)
    .limit(1)
    .maybeSingle();

  if (recentDraft) {
    revalidatePath("/account");
    redirect("/account?existing=1");
  }

  const slugBase = title.toLowerCase().normalize("NFKD").replace(/\p{M}+/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "idea";
  const slug = `${slugBase}-${randomUUID().slice(0, 8)}`;

  const { error } = await supabase.from("tests").insert({
    creator_id: user.id,
    slug,
    title,
    description,
    category_id: categoryId,
  });

  if (error) redirect("/account?error=create");
  revalidatePath("/account");
  redirect("/account?created=1");
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; existing?: string; error?: string; phoneSaved?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const [
    { data: tests, error: testsError },
    { data: categories, error: categoriesError },
    { data: packages, error: packagesError },
  ] = await Promise.all([
    supabase.from("tests")
      .select("id,title,description,status,want_count,kill_count,created_at,slug")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name").eq("active", true).order("sort"),
    supabase.from("packages").select("id,code,name,responses,price_paise").eq("active", true).order("sort"),
  ]);
  const params = await searchParams;

  // Group exact duplicate drafts in the UI without deleting or modifying any records.
  const allTests = tests ?? [];
  const visibleTests = allTests.filter((test, index) => {
    if (test.status !== "draft") return true;
    return allTests.findIndex((candidate) =>
      candidate.status === "draft" &&
      candidate.title.trim().toLocaleLowerCase() === test.title.trim().toLocaleLowerCase() &&
      candidate.description.trim().toLocaleLowerCase() === test.description.trim().toLocaleLowerCase()
    ) === index;
  });
  const categoryOptions = categories ?? [];

  return (
    <main className="vz-shell vz-workspace">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <div className="vz-topline"><span>IDEAS IN. REAL SIGNAL OUT.</span><span>VEZQO / PRIVATE WORKSPACE <b>●</b></span></div>
      <header className="vz-nav">
        <Logo />
        <nav className="vz-navlinks" aria-label="Workspace navigation">
          <a href="/">HOME</a><a href="#create-idea">CREATE IDEA</a><a href="#your-ideas">YOUR IDEAS</a>
        </nav>
        <div className="vz-nav-actions">
          <span className="vz-account-email">{user.email}</span>
          <form action={signOut}><button className="vz-workspace-signout" type="submit">SIGN OUT ↗</button></form>
        </div>
      </header>

      <section className="vz-workspace-hero">
        <div className="vz-workspace-hero-copy">
          <div className="vz-kicker"><i /> MEMBER WORKSPACE / 01</div>
          <h1>YOUR IDEAS.<br />YOUR NEXT<br /><strong>MOVE.</strong></h1>
          <p>Turn a good question into a clearer decision. Create a test, put it in front of people, and follow the signal.</p>
          <div className="vz-workspace-stats">
            <div><strong>{allTests.length.toString().padStart(2,"0")}</strong><span>IDEAS SAVED</span></div>
            <i />
            <div><strong>{allTests.reduce((n,t)=>n+(t.want_count??0)+(t.kill_count??0),0).toString().padStart(2,"0")}</strong><span>VOTES RECEIVED</span></div>
          </div>
        </div>
        <div className="vz-workspace-hero-art">
          <div className="vz-workspace-orbit orbit-one" /><div className="vz-workspace-orbit orbit-two" />
          <div className="vz-workspace-core"><span>V</span><i>IDEA SIGNAL / 001</i></div>
          <div className="vz-workspace-float vz-workspace-float-a"><small>THE CROWD'S SIGNAL</small><b>WANT IT <em>↗</em></b><span><i /></span></div>
          <div className="vz-workspace-float vz-workspace-float-b"><i /> YOUR NEXT MOVE STARTS HERE</div>
          <div className="vz-workspace-art-caption">FIG. 003 — IDEAS IN MOTION</div>
        </div>
      </section>

      <section className="vz-workspace-content">
        <div className="vz-workspace-section-head" id="create-idea">
          <div><span className="vz-section-index">01 / START WITH A QUESTION</span><h2>MAKE IT <em>REAL.</em></h2></div>
          <p>A clear idea gets a clearer response. Give people something specific to react to.</p>
        </div>
        {params.created === "1" && <p className="vz-workspace-alert success" role="status">Your idea draft is saved. Choose a package when you're ready.</p>}
        {params.phoneSaved === "1" && <p className="vz-workspace-alert success" role="status">Mobile number saved. You can continue to checkout.</p>}
        {params.existing === "1" && <p className="vz-workspace-alert" role="status">This draft was already saved. No duplicate was created.</p>}
        {params.error && <p className="vz-workspace-alert" role="alert">{params.error === "validation" ? "Check your title, description and category." : params.error === "category" ? "Categories could not be verified. Refresh and try again." : params.error === "phone" ? "Enter a valid 10-digit mobile number." : "We couldn't complete that action. Please try again."}</p>}
        {categoriesError && <p className="vz-workspace-alert" role="alert">Categories could not load. Refresh the page before creating a draft.</p>}

        <div className="vz-workspace-create-grid">
          <div className="vz-workspace-create-aside">
            <span>THE FIRST STEP</span><b>01</b><h3>What's the<br /><em>question?</em></h3>
            <p>Describe what you're testing in plain language. The best tests make one decision easy to understand.</p>
            <div className="vz-workspace-aside-rule"><i /></div>
            <small>BE CLEAR. BE SPECIFIC. STAY CURIOUS.</small>
          </div>
          <form action={createDraft} className="vz-workspace-form">
            <div className="vz-workspace-field"><label htmlFor="title">IDEA / TEST TITLE <span>01</span></label><input id="title" name="title" minLength={3} maxLength={120} placeholder="What do you want people to decide?" required /></div>
            <div className="vz-workspace-field"><label htmlFor="description">THE CONTEXT <span>02</span></label><textarea id="description" name="description" minLength={10} maxLength={600} rows={4} placeholder="Explain the idea clearly. What is it, who is it for, and what do you want to learn?" required /><small>10–600 CHARACTERS</small></div>
            <div className="vz-workspace-field"><label htmlFor="category_id">CHOOSE A CATEGORY <span>03</span></label><select id="category_id" name="category_id" required defaultValue=""><option value="" disabled>{categoryOptions.length ? "Select the closest category" : "Categories unavailable — refresh"}</option>{categoryOptions.map((category)=><option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
            <div className="vz-workspace-submit-row"><span>YOUR IDEA STARTS AS A PRIVATE DRAFT.</span><CreateDraftButton disabled={categoryOptions.length===0 || Boolean(categoriesError)} /></div>
          </form>
        </div>

        <div className="vz-workspace-phone">
          <div><span>CHECKOUT PROFILE</span><h3>One detail before launch.</h3><p>Save a 10-digit mobile number for your secure Cashfree checkout.</p></div>
          <form action={savePhone}><input id="phone" name="phone" aria-label="10-digit mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" minLength={10} maxLength={10} defaultValue={String(user.user_metadata?.phone ?? "").replace(/\D/g,"").slice(-10)} placeholder="10-digit mobile number" required /><button type="submit">SAVE NUMBER ↗</button></form>
        </div>

        <div className="vz-workspace-section-head vz-workspace-ideas-head" id="your-ideas">
          <div><span className="vz-section-index">02 / YOUR PRIVATE COLLECTION</span><h2>YOUR <em>IDEAS.</em></h2></div>
          <p>{allTests.length} saved records · Your ideas stay connected to this account.</p>
        </div>
        {visibleTests.length < allTests.length && <p className="vz-workspace-muted">Identical draft entries are grouped here. All {allTests.length} records remain safely stored.</p>}
        {testsError && <p className="vz-workspace-alert" role="alert">Your ideas could not be loaded. Refresh the page.</p>}
        {packagesError && <p className="vz-workspace-alert" role="alert">Package options could not be loaded. Refresh the page.</p>}
        <div className="vz-workspace-idea-grid">
          {visibleTests.length===0 ? <div className="vz-workspace-empty"><span>NO IDEAS YET / 000</span><h3>Your first idea<br /><em>starts here.</em></h3><a href="#create-idea">CREATE YOUR FIRST DRAFT ↗</a></div> :
          visibleTests.map((test,index)=>(
            <article className="vz-workspace-idea-card" key={test.id}>
              <div className="vz-workspace-idea-top"><span>IDEA / {String(index+1).padStart(3,"0")}</span><span className={test.status==="active"?"live":""}>{String(test.status).toUpperCase()} · {new Date(test.created_at).toLocaleDateString("en-IN")}</span></div>
              <div className="vz-workspace-idea-mark"><span>V</span><i /></div>
              <h3>{test.title}</h3><p>{test.description}</p>
              <div className="vz-workspace-votes"><div><b>{test.want_count??0}</b><span>WANT IT</span></div><i /><div><b>{test.kill_count??0}</b><span>KILL IT</span></div></div>
              {test.status==="draft" && <div className="vz-workspace-packages">{(packages??[]).map(pack=><CheckoutButton key={pack.id} testId={test.id} packageCode={pack.code} packageName={pack.name} pricePaise={pack.price_paise} />)}</div>}
              {test.status==="active" && <a className="vz-workspace-open" href={`/test/${test.slug}`}>VIEW LIVE TEST ↗</a>}
            </article>
          ))}
        </div>
      </section>
      <footer className="vz-footer"><div className="vz-footer-brand"><Logo /><p>Ideas. Votes. Impact.</p></div><nav><a href="/">HOME</a><a href="#create-idea">CREATE IDEA</a><a href="#your-ideas">YOUR IDEAS</a></nav><div className="vz-footer-bottom"><span>© {new Date().getFullYear()} VEZQO. ALL RIGHTS RESERVED.</span><span>BUILT FOR IDEAS THAT DESERVE A REAL ANSWER.</span></div></footer>
    </main>
  );
}