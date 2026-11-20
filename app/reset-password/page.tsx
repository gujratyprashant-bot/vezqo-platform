"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../components/logo";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router=useRouter();
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setNotice("");
    if(password!==confirm){setNotice("The passwords do not match.");return;}
    setBusy(true);
    try{
      const supabase=createClient();
      const {error}=await supabase.auth.updateUser({password});
      if(error)throw error;
      setNotice("Your password has been updated. Taking you to login…");
      window.setTimeout(()=>router.replace("/login"),1200);
    }catch(error){setNotice(error instanceof Error?error.message:"Unable to update your password. Request a fresh reset link.");}
    finally{setBusy(false);}
  }
  return <main className="auth-page"><header><Logo/><a href="/">← BACK TO VEZQO</a></header><section className="auth-layout" style={{gridTemplateColumns:"1fr",justifyItems:"center",minHeight:"65vh"}}><div className="auth-recovery-wrap"><div className="auth-form-kicker"><i/> ACCOUNT RECOVERY / 02</div><h1>Set a new<br/>password.</h1><p>Choose a strong password with at least 8 characters.</p><form onSubmit={submit}><label htmlFor="password">NEW PASSWORD</label><div className="auth-password-field"><input id="password" type={showPassword?"text":"password"} autoComplete="new-password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required/><button className="auth-password-toggle" type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"HIDE":"SHOW"}</button></div><label htmlFor="confirm">CONFIRM PASSWORD</label><input id="confirm" type={showPassword?"text":"password"} autoComplete="new-password" minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} required/><button type="submit" disabled={busy}>{busy?"UPDATING…":"UPDATE PASSWORD"} ↗</button>{notice&&<p className="auth-notice" role="status" style={{marginTop:16}}>{notice}</p>}</form><a className="auth-home" href="/login">← BACK TO LOG IN</a></div></section><footer><Logo compact/><span>© {new Date().getFullYear()} VEZQO / INDEPENDENT IDEAS</span><span>ASK BETTER QUESTIONS.</span></footer></main>;
}
