"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "../components/logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(params.get("error") === "confirmation" ? "Email confirmation could not be completed. Please try the link again." : "");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setNotice("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/"); router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to log in right now.");
    } finally { setBusy(false); }
  }

  return <main className="auth-page"><header><Logo/><a href="/">← BACK TO VEZQO</a></header><section className="auth-layout"><div className="auth-editorial"><span>VEZQO / MEMBER ACCESS</span><h1>YOUR NEXT<br/>MOVE STARTS<br/><em>HERE.</em></h1><p>Come back to the question worth asking.</p><div className="auth-art-mark"><i/><b/><span>01—A</span></div><small>IDEAS DESERVE EVIDENCE.</small></div><div className="auth-form-wrap"><div className="auth-form-kicker"><i/> MEMBER SPACE / 01</div><h2>Welcome<br/>back.</h2><p className="auth-lead">Log in to continue to your workspace.</p><form onSubmit={submit}><label htmlFor="email">EMAIL ADDRESS</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/><label htmlFor="password">PASSWORD</label><input id="password" type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="submit" disabled={busy}>{busy ? "PLEASE WAIT…" : "LOG IN"} <span>↗</span></button>{notice&&<p className="auth-notice" role="status">{notice}</p>}</form><div className="auth-switch">NEW TO VEZQO? <a href="/signup">CREATE AN ACCOUNT ↗</a></div><a className="auth-home" href="/">← RETURN TO HOMEPAGE</a></div></section><footer><Logo compact/><span>© {new Date().getFullYear()} VEZQO / INDEPENDENT IDEAS</span><span>ASK BETTER QUESTIONS.</span></footer></main>;
}
