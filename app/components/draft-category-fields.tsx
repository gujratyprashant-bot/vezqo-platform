"use client";

import { useMemo, useState } from "react";

type Category = { id: string; name: string; slug: string };
const visuals: Record<string, { icon: string; eyebrow: string; imageLabel: string; linkLabel: string; network: string[]; hint: string }> = {
  ideas: { icon: "✳", eyebrow: "CONCEPT / EARLY SIGNAL", imageLabel: "CONCEPT IMAGE URL", linkLabel: "PROJECT OR DEMO LINK", network: ["cuelinks", "impact", "partnerstack", "other"], hint: "Add a reference image and a demo or project page if available." },
  products: { icon: "◈", eyebrow: "PRODUCT / SHOPPING", imageLabel: "PRODUCT PHOTO URL", linkLabel: "OFFICIAL PRODUCT PAGE", network: ["cuelinks", "impact", "other"], hint: "Use a real product image and its exact product page. Add your approved tracking link below." },
  apps: { icon: "▣", eyebrow: "APP / DOWNLOAD", imageLabel: "APP ICON OR SCREENSHOT URL", linkLabel: "OFFICIAL APP STORE LINK", network: ["cuelinks", "impact", "partnerstack", "other"], hint: "Use the official App Store or Google Play listing, not an unofficial APK page." },
  websites: { icon: "⌘", eyebrow: "WEBSITE / DIGITAL TOOL", imageLabel: "WEBSITE PREVIEW IMAGE URL", linkLabel: "OFFICIAL WEBSITE URL", network: ["partnerstack", "impact", "cuelinks", "other"], hint: "For SaaS and software referrals, PartnerStack or Impact may have suitable programmes." },
  services: { icon: "✧", eyebrow: "SERVICE / BOOKING", imageLabel: "SERVICE COVER IMAGE URL", linkLabel: "OFFICIAL SERVICE OR BOOKING LINK", network: ["impact", "partnerstack", "cuelinks", "other"], hint: "Choose a programme that explicitly allows your traffic source and region." },
};
const networkLabels: Record<string, string> = { cuelinks: "Cuelinks", impact: "Impact", partnerstack: "PartnerStack", other: "Other network" };

export default function DraftCategoryFields({ categories }: { categories: Category[] }) {
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [network, setNetwork] = useState("");
  const selected = categories.find((item) => item.id === categoryId);
  const slug = selected?.slug ?? "";
  const config = visuals[slug] ?? visuals.ideas;
  const availableNetworks = config.network;
  const preview = useMemo(() => {
    if (!imageUrl.trim()) return "";
    try { const url = new URL(imageUrl); return url.protocol === "https:" ? url.toString() : ""; }
    catch { return ""; }
  }, [imageUrl]);

  function changeCategory(id: string) {
    setCategoryId(id);
    setImageUrl("");
    setNetwork("");
  }

  return <>
    <div className="vz-workspace-field">
      <label>CHOOSE WHAT YOU'RE SHARING <span>03</span></label>
      <input type="hidden" name="category_id" value={categoryId} />
      <div className="vz-category-picker">
        {categories.map((category) => {
          const item = visuals[category.slug] ?? visuals.ideas;
          return <button type="button" key={category.id} className={categoryId === category.id ? "vz-category-option selected" : "vz-category-option"} onClick={() => changeCategory(category.id)} aria-pressed={categoryId === category.id}>
            <span className="vz-category-icon">{item.icon}</span><span className="vz-category-name">{category.name}</span><span className="vz-category-arrow">↗</span>
          </button>;
        })}
      </div>
    </div>
    {selected && <>
      <div className="vz-category-detail-head"><span>{config.eyebrow}</span><p>{config.hint}</p></div>
      <div className="vz-category-detail-grid">
        <div className="vz-workspace-field">
          <label htmlFor="image_url">{config.imageLabel}</label>
          <input id="image_url" name="image_url" type="url" inputMode="url" placeholder="https://…" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <small>HTTPS IMAGE URL · JPG, PNG OR WEBP</small>
          {preview && <div className="vz-image-preview"><img src={preview} alt="Preview of the selected listing image" /><span>IMAGE PREVIEW</span></div>}
        </div>
        <div className="vz-workspace-field">
          <label htmlFor="official_url">{config.linkLabel}</label>
          <input id="official_url" name="official_url" type="url" inputMode="url" placeholder="https://…" />
          <small>VISITORS WILL BE SENT TO THIS OFFICIAL PAGE.</small>
        </div>
      </div>
      <div className="vz-affiliate-panel">
        <div className="vz-affiliate-panel-copy"><span>MONETISATION / OPTIONAL</span><h4>Add your affiliate tracking link.</h4><p>Only use a link issued by a programme that has approved your account. A normal website URL does not earn commission.</p></div>
        <div className="vz-workspace-field">
          <label htmlFor="affiliate_network">AFFILIATE NETWORK</label>
          <select id="affiliate_network" name="affiliate_network" value={network} onChange={(e) => setNetwork(e.target.value)}>
            <option value="">Select network (if you have one)</option>
            {availableNetworks.map((value) => <option key={value} value={value}>{networkLabels[value]}</option>)}
          </select>
        </div>
        <div className="vz-workspace-field">
          <label htmlFor="affiliate_url">YOUR TRACKED AFFILIATE LINK</label>
          <input id="affiliate_url" name="affiliate_url" type="url" inputMode="url" placeholder="Paste approved affiliate link…" />
        </div>
      </div>
    </>}
    {!selected && <p className="vz-category-prompt">Choose a category to reveal its image, official link and monetisation fields.</p>}
  </>;
}
