import { createAdminClient } from "@/lib/supabase/admin";
import Logo from "@/app/components/logo";

export const revalidate = 60;

type Listing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  want_count: number | null;
  kill_count: number | null;
  categories: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null;
};

export default async function LeaderboardPage() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: tests, error }] = await Promise.all([
    supabase.from("categories").select("id,name,slug").eq("active", true).order("sort"),
    supabase.from("tests")
      .select("id,slug,title,description,image_url,want_count,kill_count,categories(id,name,slug)")
      .eq("status", "active")
      .order("want_count", { ascending: false })
      .limit(250),
  ]);

  const listings = (tests ?? []) as Listing[];
  const categoryList = categories ?? [];
  const totalVotes = listings.reduce((sum, item) => sum + (item.want_count ?? 0) + (item.kill_count ?? 0), 0);
  const totalIdeas = listings.length;

  return (
    <main className="vz-shell vz-leaderboard">
      <div className="vz-topline"><span>IDEAS IN. REAL SIGNAL OUT.</span><span>VEZQO / COMMUNITY RANKINGS <b>●</b></span></div>
      <header className="vz-nav">
        <Logo />
        <nav className="vz-navlinks" aria-label="Main navigation"><a href="/">HOME</a><a href="/#how-it-works">HOW IT WORKS</a><a href="/leaderboard" aria-current="page">LEADERBOARD</a></nav>
        <div className="vz-nav-actions"><a className="vz-login" href="/login">LOG IN</a><a className="vz-nav-cta" href="/signup">LAUNCH AN IDEA <span>↗</span></a></div>
      </header>

      <section className="vz-lb-hero">
        <div className="vz-kicker"><i /> THE CROWD DECIDES / LIVE RANKINGS</div>
        <h1>THE SIGNAL<br /><em>BOARD.</em></h1>
        <p>See what people want, category by category. Rankings are based on real WANT IT votes from active VEZQO tests.</p>
        <div className="vz-lb-stats">
          <div><b>{String(totalIdeas).padStart(2,"0")}</b><span>LIVE TESTS</span></div><i />
          <div><b>{totalVotes.toLocaleString("en-IN")}</b><span>COMMUNITY VOTES</span></div><i />
          <div><b>{String(categoryList.length).padStart(2,"0")}</b><span>CATEGORIES</span></div>
        </div>
        <div className="vz-lb-orbit"><span>V</span><i /><b /></div>
      </section>

      <nav className="vz-lb-categories" aria-label="Jump to category">
        <a href="#all" className="active">ALL CATEGORIES <span>↘</span></a>
        {categoryList.map((category) => <a key={category.id} href={"#category-" + category.slug}>{category.name.toUpperCase()} <span>↘</span></a>)}
      </nav>

      <section className="vz-lb-overview" id="all">
        <div className="vz-section-label"><span>01 / CATEGORY LEADERBOARDS</span><span>UPDATED EVERY 60 SECONDS</span></div>
        <div className="vz-lb-intro"><h2>WHAT'S GETTING<br /><em>THE YES?</em></h2><p>Each category has its own ranking, so an emerging app is compared with apps—not with shoes, services or unrelated ideas.</p></div>
        {error && <p className="vz-workspace-alert" role="alert">Live rankings are temporarily unavailable. Please refresh in a moment.</p>}
        <div className="vz-lb-category-grid">
          {categoryList.map((category, index) => {
            const items = listings
              .filter((item) => {
                const value = Array.isArray(item.categories) ? item.categories[0] : item.categories;
                return value?.id === category.id;
              })
              .sort((a, b) => (b.want_count ?? 0) - (a.want_count ?? 0))
              .slice(0, 5);
            return (
              <section className="vz-lb-category" id={"category-" + category.slug} key={category.id}>
                <div className="vz-lb-category-head"><span>{String(index + 1).padStart(2,"0")} / {category.slug.toUpperCase()}</span><b>{String(items.length).padStart(2,"0")} RANKED</b></div>
                <h3>{category.name}<em>.</em></h3>
                {items.length === 0 ? <div className="vz-lb-empty"><span>NO LIVE SIGNAL YET</span><p>The first active {category.name.toLowerCase()} test will appear here.</p><a href="/signup">BE THE FIRST TO LAUNCH ↗</a></div> :
                  <ol className="vz-lb-list">
                    {items.map((item, rank) => {
                      const want = item.want_count ?? 0;
                      const kill = item.kill_count ?? 0;
                      const total = want + kill;
                      const share = total ? Math.round((want / total) * 100) : 0;
                      return <li key={item.id}>
                        <span className="vz-lb-rank">{String(rank + 1).padStart(2,"0")}</span>
                        <a className="vz-lb-item" href={"/p/" + item.slug}>
                          <span className="vz-lb-thumb">{item.image_url ? <img src={item.image_url} alt="" /> : <b>V</b>}</span>
                          <span className="vz-lb-item-copy"><strong>{item.title}</strong><small>{want.toLocaleString("en-IN")} WANT IT · {kill.toLocaleString("en-IN")} KILL IT</small><i><b style={{ width: share + "%" }} /></i></span>
                          <span className="vz-lb-score"><b>{share}%</b><small>YES SIGNAL</small></span>
                        </a>
                      </li>;
                    })}
                  </ol>}
                <a className="vz-lb-category-link" href={"/leaderboard/" + category.slug}>EXPLORE {category.name.toUpperCase()} <span>↗</span></a>
              </section>
            );
          })}
        </div>
      </section>

      <section className="vz-lb-method"><span>HOW RANKING WORKS</span><p>Listings are grouped by their assigned category and ranked by WANT IT vote count. The YES SIGNAL shows WANT IT votes as a share of all WANT IT and KILL IT votes. Only active tests appear; rankings are not paid placements.</p></section>
      <footer className="vz-footer"><div className="vz-footer-brand"><Logo /><p>Ideas. Votes. Impact.</p></div><nav><a href="/">HOME</a><a href="/leaderboard">LEADERBOARD</a><a href="/signup">LAUNCH AN IDEA</a></nav><div className="vz-footer-bottom"><span>© {new Date().getFullYear()} VEZQO. ALL RIGHTS RESERVED.</span><span>BUILT FOR IDEAS THAT DESERVE A REAL ANSWER.</span></div></footer>
    </main>
  );
}
