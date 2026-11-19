"use client";
import { useState } from "react";
import Logo from "../components/logo";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email,setEmail]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setNotice("");
    try{
      const supabase=createClient();
      const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});
      if(error)throw error;
      setNotice("If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.");
    }catch(error){setNotice(error instanceof Error?error.message:"Unable to send the reset email right now.");}
    finally{setBusy(false);}
  }
  return <main className="auth-page"><header><Logo/><a href="/">← BACK TO VEZQO</a></header><section className="auth-layout" style={{gridTemplateColumns:"1fr",justifyItems:"center",minHeight:"65vh"}}><div className="auth-recovery-wrap"><div className="auth-form-kicker"><i/> ACCOUNT RECOVERY / 01</div><h1>Forgot<br/>your password?</h1><p>Enter the email address linked to your VEZQO account. We’ll send you a secure link to choose a new password.</p><form onSubmit={submit}><label htmlFor="email">EMAIL ADDRESS</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/><button type="submit" disabled={busy}>{busy?"SENDING…":"SEND RESET LINK"} ↗</button>{notice&&<p className="auth-notice" role="status" style={{marginTop:16}}>{notice}</p>}</form><a className="auth-home" href="/login">← BACK TO LOG IN</a></div></section><footer><Logo compact/><span>© {new Date().getFullYear()} VEZQO / INDEPENDENT IDEAS</span><span>ASK BETTER QUESTIONS.</span></footer></main>;
}
