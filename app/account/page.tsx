import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/app/components/logo";

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

  const { error } = await supabase.from("tests").insert({
    creator_id: user.id,
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
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const [{ data: tests }, { data: categories }] = await Promise.all([
    supabase.from("tests")
      .select("id,title,description,status,want_count,kill_count,created_at,slug")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name").eq("active", true).order("sort"),
  ]);
  const params = await searchParams;

  return (
    <main className="auth-page">
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
          {params.error && <p className="auth-notice" role="alert">{params.error === "validation" ? "Check the title, description and category." : "We couldn't create that draft. Please try again."}</p>}
          <form action={createDraft}>
            <label htmlFor="title">IDEA / TEST TITLE</label>
            <input id="title" name="title" minLength={3} maxLength={120} placeholder="What do you want people to decide?" required />
            <label htmlFor="description">DESCRIPTION</label>
            <textarea id="description" name="description" minLength={10} maxLength={600} rows={4} placeholder="Explain the idea clearly (10–600 characters)." required />
            <label htmlFor="category_id">CATEGORY</label>
            <select id="category_id" name="category_id" required defaultValue="">
              <option value="" disabled>Select a category</option>
              {(categories ?? []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <button type="submit">CREATE DRAFT <span>↗</span></button>
          </form>
          <div className="auth-switch">YOUR IDEAS / {tests?.length ?? 0} TOTAL</div>
          <div className="vz-account-list">
            {(tests ?? []).length === 0 ? (
              <p className="auth-lead">No ideas yet. Create your first draft above.</p>
            ) : (tests ?? []).map((test) => (
              <article className="vz-account-item" key={test.id}>
                <div><small>{String(test.status).toUpperCase()} · {new Date(test.created_at).toLocaleDateString("en-IN")}</small><h3>{test.title}</h3><p>{test.description}</p><span>WANT {test.want_count} · KILL {test.kill_count}</span></div>
              </article>
            ))}
          </div>
          <form action="/auth/signout" method="post"><button className="auth-home" type="submit">SIGN OUT</button></form>
        </div>
      </section>
    </main>
  );
}
