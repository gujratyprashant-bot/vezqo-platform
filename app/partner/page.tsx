"use client";

import { FormEvent, useState } from "react";
import Logo from "@/app/components/logo";

const types = [
  ["brand_campaign","Brand campaign / product testing"],
  ["sponsored_listing","Sponsored or featured listing"],
  ["advertising","Advertising / media placement"],
  ["research","Consumer research / audience insights"],
  ["affiliate_partnership","Affiliate / commerce partnership"],
  ["other","Something else"],
];

export default function PartnerPage() {
  const [busy,setBusy] = useState(false);
  const [done,setDone] = useState(false);
  const [error,setError] = useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/partnership-inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result = await response.json();
      if(!response.ok) throw new Error(result.error || "Submission failed.");
      setDone(true); event.currentTarget.reset();
    } catch(e) { setError(e instanceof Error?e.message:"Something went wrong."); }
    finally { setBusy(false); }
  }
  return <main className="vz-shell vz-partner-page">
    <div className="vz-topline"><span>VEZQO / PARTNERSHIPS</span><span>BRANDS · CREATORS · RESEARCH <b>●</b></span></div>
    <header className="vz-nav"><Logo/><nav className="vz-navlinks"><a href="/">HOME</a><a href="/leaderboard">LEADERBOARD</a><a href="/account">CREATOR SPACE</a></nav><div className="vz-nav-actions"><a className="vz-nav-cta" href="/signup">LAUNCH AN IDEA ↗</a></div></header>
    <section className="vz-partner-hero">
      <div className="vz-kicker"><i/> COMMERCIAL PARTNERSHIPS / OPEN ENQUIRIES</div>
      <h1>PUT YOUR<br/><em>BRAND IN</em><br/>THE SIGNAL.</h1>
      <p>Work with VEZQO on product discovery, sponsored tests, audience research and relevant brand placements. Tell us what you're trying to achieve; our team will review the fit and contact you.</p>
      <div className="vz-partner-tags"><span>01 / PRODUCT TESTING</span><span>02 / SPONSORED PLACEMENTS</span><span>03 / RESEARCH</span><span>04 / AFFILIATE PARTNERSHIPS</span></div>
    </section>
    <section className="vz-partner-content">
      <div className="vz-partner-aside"><span>PARTNER WITH VEZQO / 2026</span><h2>GOOD FIT.<br/><em>REAL SIGNAL.</em></h2><p>For brands, agencies, product teams and commerce partners interested in reaching people who actively respond to ideas.</p><div className="vz-partner-offers"><article><b>01</b><div><strong>BRAND CAMPAIGNS</strong><small>Product testing and sponsored research enquiries.</small></div></article><article><b>02</b><div><strong>FEATURED PLACEMENTS</strong><small>Discuss relevant sponsored visibility opportunities.</small></div></article><article><b>03</b><div><strong>COMMERCE PARTNERSHIPS</strong><small>Affiliate and product discovery collaborations.</small></div></article></div></div>
      <div className="vz-partner-form-wrap">{done?<div className="vz-partner-success"><span>REQUEST RECEIVED / 001</span><h2>THANK<br/><em>YOU.</em></h2><p>Your partnership enquiry has been submitted. The VEZQO team can review it and contact you using the email provided.</p><button type="button" onClick={()=>setDone(false)}>SEND ANOTHER ENQUIRY ↗</button></div>:<form className="vz-partner-form" onSubmit={submit}>
        <div className="vz-partner-form-head"><span>PARTNERSHIP ENQUIRY / 01</span><b>RESPONSE REQUEST</b></div>
        <label>YOUR NAME<input name="contact_name" required minLength={2} maxLength={100} placeholder="Full name"/></label>
        <label>WORK EMAIL<input name="email" type="email" required maxLength={254} placeholder="you@company.com"/></label>
        <label>COMPANY / BRAND<input name="company" required minLength={2} maxLength={160} placeholder="Company or brand name"/></label>
        <label>WHAT ARE YOU INTERESTED IN?<select name="inquiry_type" required defaultValue=""><option value="" disabled>Select partnership type</option>{types.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
        <label>ESTIMATED BUDGET <span className="vz-partner-optional">OPTIONAL</span><select name="budget_range" defaultValue=""><option value="">Prefer not to say</option><option>Under ₹10,000</option><option>₹10,000–₹50,000</option><option>₹50,000–₹2,00,000</option><option>₹2,00,000+</option><option>International / USD</option></select></label>
        <label>WHAT WOULD YOU LIKE TO DO?<textarea name="message" required minLength={20} maxLength={3000} rows={5} placeholder="Tell us about your product, audience, goals and timeline…"/></label>
        <div className="vz-partner-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <p className="vz-partner-privacy">Submitting this form asks VEZQO to contact you about this enquiry. It does not create a paid campaign or guarantee placement.</p>
        {error&&<p className="vz-partner-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy?"SENDING…":"SUBMIT PARTNERSHIP ENQUIRY ↗"}</button>
      </form>}</div>
    </section>
    <footer className="vz-footer"><div className="vz-footer-brand"><Logo/><p>Ideas. Votes. Impact.</p></div><nav><a href="/">HOME</a><a href="/leaderboard">LEADERBOARD</a><a href="/account">CREATOR SPACE</a></nav><div className="vz-footer-bottom"><span>© {new Date().getFullYear()} VEZQO</span><span>PARTNERSHIPS / OPEN ENQUIRIES</span></div></footer>
  </main>;
}
