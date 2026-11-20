import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function PublicIdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: item, error } = await supabase
    .from("tests")
    .select("id,slug,title,description,image_url,official_url,affiliate_url,affiliate_network,category_details,want_count,kill_count,categories(name,slug)")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error || !item) notFound();

  const category = Array.isArray(item.categories) ? item.categories[0] : item.categories;
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
        <div className="vz-public-votes"><div><b>{item.want_count ?? 0}</b><span>WANT IT</span></div><i/><div><b>{item.kill_count ?? 0}</b><span>KILL IT</span></div></div>
        {item.category_details && Object.entries(item.category_details as Record<string,string>).filter(([,value])=>Boolean(value)).length>0 && <dl className="vz-public-details">{Object.entries(item.category_details as Record<string,string>).filter(([,value])=>Boolean(value)).map(([key,value])=><div key={key}><dt>{key.replace(/_/g," ").toUpperCase()}</dt><dd>{value}</dd></div>)}</dl>}
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
