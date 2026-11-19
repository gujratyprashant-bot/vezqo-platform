"use client";
import { useState } from "react";
import Logo from "../components/logo";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name,setName]=useState(""); const [phone,setPhone]=useState("");
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [notice,setNotice]=useState(""); const [busy,setBusy]=useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setNotice("");
    try {
      const supabase=createClient();
      const { error }=await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { display_name: name.trim(), phone: phone.trim() }
        }
      });
      if(error) throw error;
      setNotice("Account request received. Check your email to confirm your address before logging in.");
    } catch(error) {
      setNotice(error instanceof Error ? error.message : "Unable to create your account right now.");
    } finally { setBusy(false); }
  }

  return <main className="auth-page"><header><Logo/><a href="/">← BACK TO VEZQO</a></header><section className="auth-layout"><div className="auth-editorial signup-editorial"><span>VEZQO / YOUR FIRST TEST</span><h1>GIVE YOUR<br/>IDEA A<br/><em>FIRST AUDIENCE.</em></h1><p>Start with a question. Let new perspectives shape what comes next.</p><div className="auth-art-mark"><i/><b/><span>02—B</span></div><small>MAKE ROOM FOR A DIFFERENT ANSWER.</small></div><div className="auth-form-wrap"><div className="auth-form-kicker"><i/> CREATE YOUR SPACE / 02</div><h2>Start<br/>something.</h2><p className="auth-lead">Create an account to begin shaping your idea.</p><form onSubmit={submit}><label htmlFor="name">YOUR NAME</label><input id="name" autoComplete="name" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/><label htmlFor="phone">MOBILE NUMBER</label><input id="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" value={phone} onChange={e=>setPhone(e.target.value)} pattern="[0-9]{10}" maxLength={10} required/><label htmlFor="email">EMAIL ADDRESS</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/><label htmlFor="password">CREATE PASSWORD</label><input id="password" type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="submit" disabled={busy}>{busy ? "PLEASE WAIT…" : "CREATE ACCOUNT"} <span>↗</span></button>{notice&&<p className="auth-notice" role="status">{notice}</p>}</form><div className="auth-switch">ALREADY HAVE AN ACCOUNT? <a href="/login">LOG IN ↗</a></div><a className="auth-home" href="/">← RETURN TO HOMEPAGE</a></div></section><footer><Logo compact/><span>© {new Date().getFullYear()} VEZQO / INDEPENDENT IDEAS</span><span>ASK BETTER QUESTIONS.</span></footer></main>;
}
