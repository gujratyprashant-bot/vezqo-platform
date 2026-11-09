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
  searchParams: Promise<{ created?: string; existing?: string; error?: string }>;
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
  const visibleTests = allTests.filter((test, index) =>
    allTests.findIndex((candidate) =>
      candidate.title.trim().toLocaleLowerCase() === test.title.trim().toLocaleLowerCase() &&
      candidate.description.trim().toLocaleLowerCase() === test.description.trim().toLocaleLowerCase()
    ) === index
  );
  const categoryOptions = categories ?? [];

  return (
    <main className="auth-page">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <header><Logo /><a href="/">← BACK TO VEZQO</a></header>
      <section className="auth-layout">
        <div className="auth-editorial">
          <span>VEZQO / YOUR WORKSPACE</span>
          <h1>YOUR IDEAS.<br />YOUR NEXT<br /><em>MOVE.</em></h1>
          <p>Manage your tests and turn a good question into a clearer decision.</p>
          <div className="auth-art-mark"><i /><b /><span>03—C</span></div>
          <small>MAKE ROOM FOR A DIFFERENT ANSWER.</small>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form-kicker"><i /> MEMBER WORKSPACE</div>
          <h2>Your<br />space.</h2>
          <p className="auth-lead">{user.email ?? "Signed in"} · Your ideas stay connected to this account.</p>
          {params.created === "1" && <p className="auth-notice" role="status">Your draft has been created.</p>}
          {params.existing === "1" && <p className="auth-notice" role="status">This draft was already saved. No duplicate was created.</p>}
          {params.error && <p className="auth-notice" role="alert">{params.error === "validation" ? "Check the title, description and category." : params.error === "category" ? "Categories could not be verified. Refresh the page and try again." : "We couldn't create that draft. Please try again."}</p>}
          {categoriesError && <p className="auth-notice" role="alert">Categories could not load. Refresh the page before creating a draft.</p>}
          <form action={createDraft}>
            <label htmlFor="title">IDEA / TEST TITLE</label>
            <input id="title" name="title" minLength={3} maxLength={120} placeholder="What do you want people to decide?" required />
            <label htmlFor="description">DESCRIPTION</label>
            <textarea id="description" name="description" minLength={10} maxLength={600} rows={4} placeholder="Explain the idea clearly (10–600 characters)." required />
            <label htmlFor="category_id">CATEGORY</label>
            <select id="category_id" name="category_id" required defaultValue="">
              <option value="" disabled>{categoryOptions.length ? "Select a category" : "Categories unavailable — refresh"}</option>
              {categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <CreateDraftButton disabled={categoryOptions.length === 0 || Boolean(categoriesError)} />
          </form>
          <div className="auth-switch">YOUR IDEAS / {allTests.length} TOTAL</div>
          {visibleTests.length < allTests.length && <p className="auth-lead">Identical drafts are grouped here. All {allTests.length} records are preserved; nothing was deleted.</p>}
          {testsError && <p className="auth-notice" role="alert">Your ideas could not be loaded. Refresh the page.</p>}
          {packagesError && <p className="auth-notice" role="alert">Package options could not be loaded. Refresh the page.</p>}
          <div className="vz-account-list">
            {visibleTests.length === 0 ? (
              <p className="auth-lead">No ideas yet. Create your first draft above.</p>
            ) : visibleTests.map((test) => (
              <article className="vz-account-item" key={test.id}>
                <div>
                  <small>{String(test.status).toUpperCase()} · {new Date(test.created_at).toLocaleDateString("en-IN")}</small>
                  <h3>{test.title}</h3>
                  <p>{test.description}</p>
                  <span>WANT {test.want_count} · KILL {test.kill_count}</span>
                  {test.status === "draft" && (
                    <div className="vz-checkout-grid">
                      {(packages ?? []).map((pack) => (
                        <CheckoutButton key={pack.id} testId={test.id} packageCode={pack.code} packageName={`${pack.name} · ${pack.responses} responses`} pricePaise={pack.price_paise} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          <form action={signOut}><button className="auth-home" type="submit">SIGN OUT</button></form>
        </div>
      </section>
    </main>
  );
}
