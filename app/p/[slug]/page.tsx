import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import PublicVotePanel from "@/app/components/public-vote-panel";

type PageProps = { params: Promise<{ slug: string }> };

async function getListing(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("tests")
    .select("id,slug,title,description,image_url,official_url,affiliate_url,affiliate_network,category_details,want_count,kill_count,status,categories(name,slug)")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getListing(slug);
  if (!item) return { title: "Idea not found | VEZQO" };
  const title = item.title + " — Vote on VEZQO";
  const description = item.description.slice(0, 160);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "VEZQO",
      ...(item.image_url ? { images: [{ url: item.image_url, alt: item.title }] } : {}),
    },
    twitter: {
      card: item.image_url ? "summary_large_image" : "summary",
      title,
      description,
      ...(item.image_url ? { images: [item.image_url] } : {}),
    },
  };
}

export default async function PublicIdeaPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getListing(slug);
  if (!item) notFound();

  const category = Array.isArray(item.categories) ? item.categories[0] : item.categories;
  const details = item.category_details && typeof item.category_details === "object"
    ? Object.entries(item.category_details as Record<string, unknown>).filter(([, value]) => typeof value === "string" && value.trim())
    : [];

  return <main className="vz-public-listing">
    <header className="vz-public-top"><a href="/" className="vz-public-brand">VEZQO<span>.</span></a><span>AN IDEA WORTH A CLOSER LOOK</span></header>
    <article className="vz-public-card">
      <div className="vz-public-visual">
        {item.image_url ? <img src={item.image_url} alt={item.title + " preview"} /> : <div className="vz-public-placeholder"><span>V</span><i>IDEA / IN MOTION</i></div>}
        <span className="vz-public-category">{category?.name ?? "FEATURED"}</span>
      </div>
      <div className="vz-public-copy">
        <span className="vz-public-kicker">VEZQO / COMMUNITY TEST</span>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <PublicVotePanel
          slug={item.slug}
          initialWant={item.want_count ?? 0}
          initialKill={item.kill_count ?? 0}
          active={item.status === "active"}
        />
        {details.length > 0 && <dl className="vz-public-details">{details.map(([key, value]) => <div key={key}><dt>{key.replace(/_/g, " ").toUpperCase()}</dt><dd>{String(value)}</dd></div>)}</dl>}
        <div className="vz-public-actions">
          {item.official_url && <a className="vz-public-official" href={"/go/" + item.id + "/official"} rel="nofollow sponsored">VISIT OFFICIAL PAGE <span>↗</span></a>}
          {item.affiliate_url && <a className="vz-public-affiliate" href={"/go/" + item.id + "/affiliate"} rel="nofollow sponsored">EXPLORE THIS PICK <span>↗</span></a>}
        </div>
        {item.affiliate_url && <p className="vz-public-disclosure">Disclosure: VEZQO's publisher may earn a commission if you make a qualifying purchase through an affiliate link. It does not change your price.</p>}
      </div>
    </article>
    <footer className="vz-public-footer"><a href="/">VEZQO<span>.</span></a><span>IDEAS IN. REAL SIGNAL OUT.</span></footer>
  </main>;
}
