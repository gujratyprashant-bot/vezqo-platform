"use client";

import { useState } from "react";

type Props = {
  slug: string;
  initialWant: number;
  initialKill: number;
  active: boolean;
};

export default function PublicVotePanel({ slug, initialWant, initialKill, active }: Props) {
  const [want, setWant] = useState(initialWant);
  const [kill, setKill] = useState(initialKill);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function vote(verdict: "want" | "kill") {
    if (busy || !active) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, verdict }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Vote could not be recorded.");
      if (typeof result.wantCount === "number") setWant(result.wantCount);
      if (typeof result.killCount === "number") setKill(result.killCount);
      setMessage("Your vote has been recorded. Thanks for giving this idea a real signal.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Vote could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Vote on this idea | VEZQO", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
        } catch {
          setMessage("Sharing is unavailable in this browser. Copy the page URL from your address bar.");
        }
      }
    }
  }

  return (
    <section className="vz-public-participate" aria-label="Vote on this idea">
      <div className="vz-public-vote-heading">
        <span>YOUR TURN / COMMUNITY SIGNAL</span>
        <p>One idea. Two honest answers. Your vote helps the creator decide what comes next.</p>
      </div>
      <div className="vz-public-vote-buttons">
        <button type="button" onClick={() => vote("want")} disabled={busy || !active}>
          <span>＋</span> WANT IT <b>↗</b>
        </button>
        <button type="button" className="kill" onClick={() => vote("kill")} disabled={busy || !active}>
          <span>×</span> KILL IT <b>↗</b>
        </button>
      </div>
      <div className="vz-public-vote-foot">
        <span>{active ? "ONE VOTE PER BROWSER · RATE LIMITED" : "VOTING CLOSED"}</span>
        <button type="button" onClick={share}>{copied ? "LINK COPIED ✓" : "SHARE THIS IDEA ↗"}</button>
      </div>
      {message && <p className="vz-public-vote-message" role="status">{message}</p>}
      <div className="vz-public-live-counts" aria-live="polite">
        <span><b>{want.toLocaleString("en-IN")}</b> WANT IT</span>
        <i />
        <span><b>{kill.toLocaleString("en-IN")}</b> KILL IT</span>
      </div>
    </section>
  );
}
