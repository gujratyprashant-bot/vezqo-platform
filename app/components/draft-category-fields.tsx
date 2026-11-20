"use client";

import { useMemo, useState } from "react";

type Category = { id: string; name: string; slug: string };
type Field = { key: string; label: string; placeholder: string; type?: "text" | "url" | "number" };
const configs: Record<string, { icon: string; eyebrow: string; image: string; link: string; hint: string; fields: Field[]; networks: string[] }> = {
  ideas: { icon: "✳", eyebrow: "CONCEPT / EARLY SIGNAL", image: "CONCEPT IMAGE URL", link: "PROJECT OR DEMO LINK", hint: "Share the problem, intended audience and current stage.", networks: ["cuelinks","impact","partnerstack","other"], fields: [
    {key:"stage",label:"IDEA STAGE",placeholder:"Concept, prototype, beta, launched"},
    {key:"audience",label:"WHO IS IT FOR?",placeholder:"Describe your target audience"},
    {key:"problem",label:"PROBLEM IT SOLVES",placeholder:"What problem does it solve?"},
    {key:"difference",label:"WHAT MAKES IT DIFFERENT?",placeholder:"Your key differentiator"}
  ]},
  products: { icon: "◈", eyebrow: "PRODUCT / SHOPPING", image: "PRODUCT PHOTO URL", link: "OFFICIAL PRODUCT PAGE", hint: "Add the exact product page, price and key product details.", networks: ["cuelinks","impact","other"], fields: [
    {key:"brand",label:"BRAND",placeholder:"Brand name"},
    {key:"price",label:"PRICE",placeholder:"e.g. 1499",type:"number"},
    {key:"currency",label:"CURRENCY",placeholder:"INR, USD…"},
    {key:"product_type",label:"PRODUCT TYPE",placeholder:"Category or model"},
    {key:"features",label:"KEY FEATURES",placeholder:"Main features, separated by commas"}
  ]},
  apps: { icon: "▣", eyebrow: "APP / DOWNLOAD", image: "APP ICON OR SCREENSHOT URL", link: "OFFICIAL APP STORE LINK", hint: "Use official Apple App Store or Google Play listing.", networks: ["cuelinks","impact","partnerstack","other"], fields: [
    {key:"platform",label:"PLATFORM",placeholder:"iOS, Android, Web or all"},
    {key:"developer",label:"DEVELOPER",placeholder:"Developer / publisher"},
    {key:"pricing_model",label:"PRICING MODEL",placeholder:"Free, freemium, subscription, paid"},
    {key:"version",label:"VERSION (OPTIONAL)",placeholder:"Current version"},
    {key:"features",label:"KEY FEATURES",placeholder:"Main features, separated by commas"}
  ]},
  websites: { icon: "⌘", eyebrow: "WEBSITE / DIGITAL TOOL", image: "WEBSITE PREVIEW IMAGE URL", link: "OFFICIAL WEBSITE URL", hint: "Tell visitors what the site or digital tool does.", networks: ["partnerstack","impact","cuelinks","other"], fields: [
    {key:"website_type",label:"WEBSITE / TOOL TYPE",placeholder:"SaaS, store, portfolio, marketplace…"},
    {key:"platform",label:"PLATFORM",placeholder:"Web, mobile web, desktop…"},
    {key:"pricing_model",label:"PRICING MODEL",placeholder:"Free, freemium, subscription…"},
    {key:"audience",label:"TARGET AUDIENCE",placeholder:"Who is this for?"},
    {key:"features",label:"KEY FEATURES",placeholder:"Main features, separated by commas"}
  ]},
  services: { icon: "✧", eyebrow: "SERVICE / BOOKING", image: "SERVICE COVER IMAGE URL", link: "OFFICIAL SERVICE OR BOOKING LINK", hint: "Explain what is included, where it is available and how it is delivered.", networks: ["impact","partnerstack","cuelinks","other"], fields: [
    {key:"provider",label:"PROVIDER",placeholder:"Business or professional name"},
    {key:"service_area",label:"LOCATION / SERVICE AREA",placeholder:"City, region or online"},
    {key:"delivery",label:"DELIVERY MODE",placeholder:"Online, in-person, hybrid"},
    {key:"price_range",label:"PRICE / PRICE RANGE",placeholder:"Starting price or range"},
    {key:"duration",label:"DURATION / TURNAROUND",placeholder:"e.g. 60 minutes, 3–5 days"}
  ]}
};
const networkLabels: Record<string,string> = {cuelinks:"Cuelinks",impact:"Impact",partnerstack:"PartnerStack",other:"Other network"};

export default function DraftCategoryFields({categories}:{categories:Category[]}) {
 const [categoryId,setCategoryId]=useState("");
 const [imageUrl,setImageUrl]=useState("");
 const [network,setNetwork]=useState("");
 const [details,setDetails]=useState<Record<string,string>>({});
 const selected=categories.find(c=>c.id===categoryId);
 const config=configs[selected?.slug ?? ""] ?? configs.ideas;
 const preview=useMemo(()=>{try{const u=new URL(imageUrl);return u.protocol==="https:"?u.toString():""}catch{return ""}},[imageUrl]);
 const serialized=JSON.stringify(details);
 function changeCategory(id:string){setCategoryId(id);setImageUrl("");setNetwork("");setDetails({});}
 function update(key:string,value:string){setDetails(old=>({...old,[key]:value}));}
 return <>
  <div className="vz-workspace-field">
   <label>CHOOSE WHAT YOU'RE SHARING <span>03</span></label>
   <input type="hidden" name="category_id" value={categoryId}/>
   <div className="vz-category-picker">{categories.map(category=>{const item=configs[category.slug]??configs.ideas;return <button type="button" key={category.id} className={categoryId===category.id?"vz-category-option selected":"vz-category-option"} onClick={()=>changeCategory(category.id)} aria-pressed={categoryId===category.id}><span className="vz-category-icon">{item.icon}</span><span className="vz-category-name">{category.name}</span><span className="vz-category-arrow">↗</span></button>})}</div>
  </div>
  {selected&&<>
   <input type="hidden" name="category_details" value={serialized}/>
   <div className="vz-category-detail-head"><span>{config.eyebrow}</span><p>{config.hint}</p></div>
   <div className="vz-category-detail-grid">
    <div className="vz-workspace-field"><label htmlFor="image_url">{config.image}</label><input id="image_url" name="image_url" type="url" inputMode="url" placeholder="https://…" value={imageUrl} onChange={e=>setImageUrl(e.target.value)}/><small>HTTPS IMAGE URL · JPG, PNG OR WEBP</small>{preview&&<div className="vz-image-preview"><img src={preview} alt="Listing image preview"/><span>IMAGE PREVIEW</span></div>}</div>
    <div className="vz-workspace-field"><label htmlFor="official_url">{config.link}</label><input id="official_url" name="official_url" type="url" inputMode="url" placeholder="https://…"/><small>VISITORS CAN OPEN THIS OFFICIAL PAGE.</small></div>
   </div>
   <div className="vz-category-detail-grid">{config.fields.map(field=><div className="vz-workspace-field" key={field.key}><label htmlFor={"detail_"+field.key}>{field.label}</label><input id={"detail_"+field.key} type={field.type??"text"} min={field.type==="number"?0:undefined} maxLength={field.type==="number"?undefined:500} placeholder={field.placeholder} value={details[field.key]??""} onChange={e=>update(field.key,e.target.value)}/></div>)}</div>
   <div className="vz-affiliate-panel"><div className="vz-affiliate-panel-copy"><span>MONETISATION / OPTIONAL</span><h4>Add your affiliate tracking link.</h4><p>Only use a tracking link issued by a programme that has approved your account. A normal website URL does not earn commission.</p></div>
    <div className="vz-workspace-field"><label htmlFor="affiliate_network">AFFILIATE NETWORK</label><select id="affiliate_network" name="affiliate_network" value={network} onChange={e=>setNetwork(e.target.value)}><option value="">Select network (if available)</option>{config.networks.map(value=><option key={value} value={value}>{networkLabels[value]}</option>)}</select></div>
    <div className="vz-workspace-field"><label htmlFor="affiliate_url">YOUR TRACKED AFFILIATE LINK</label><input id="affiliate_url" name="affiliate_url" type="url" inputMode="url" placeholder="Paste approved affiliate link…"/></div>
   </div>
  </>}
  {!selected&&<p className="vz-category-prompt">Choose a category to reveal its tailored details, image, official link and optional monetisation fields.</p>}
 </>;
}
