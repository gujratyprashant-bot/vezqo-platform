"use client";

import { useEffect, useState } from "react";
import Logo from "./components/logo";
import ThreeSculpture from "./components/three-sculpture";

const steps = [
  { n: "01", tag: "THE SPARK", title: "Bring the idea.", copy: "A product, a service, a feature, a wild thought. Start with the thing you cannot stop thinking about." },
  { n: "02", tag: "THE CROWD", title: "Put it in public.", copy: "Give people one clear choice. Let real reactions—not your own assumptions—shape the signal." },
  { n: "03", tag: "THE SIGNAL", title: "Make your next move.", copy: "Read the split, understand the hesitation, and decide what deserves to happen next." },
];

export default function Home() {
  const [vote, setVote] = useState<"want" | "kill" | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-vzn-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vzn-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="vzn">
      <div className="vzn-grain" aria-hidden="true" />
      <div className="vzn-top"><span>INDEPENDENT IDEAS. PUBLIC VERDICTS.</span><span><i /> THE SIGNAL IS OPEN</span></div>
      <nav className="vzn-nav">
        <Logo />
        <div className="vzn-nav-links"><a href="#how">HOW IT WORKS</a><a href="#demo">TRY THE SIGNAL</a><a className="vzn-login" href="/login">LOG IN <b>↗</b></a></div>
      </nav>

      <section className="vzn-hero">
        <div className="vzn-hero-copy">
          <div className="vzn-index"><span>VQ—001</span><i /> BEFORE YOU BUILD, ASK.</div>
          <h1>DON'T<br />GUESS.<br /><em>KNOW.</em></h1>
          <p>Put your idea in front of people. Get a straight answer. Find out what has a pulse before you give it a life.</p>
          <div className="vzn-actions"><a className="vzn-button" href="/signup">PUT YOUR IDEA OUT THERE <b>↗</b></a><a className="vzn-scroll" href="#how">DISCOVER VEZQO <span>↓</span></a></div>
          <div className="vzn-footnote"><span>01 / IDEA</span><span>02 / PEOPLE</span><span>03 / VERDICT</span></div>
        </div>
        <div className="vzn-hero-object">
          <div className="vzn-object-grid" />
          <div className="vzn-object-orbit vzn-orbit-one" /><div className="vzn-object-orbit vzn-orbit-two" /><div className="vzn-object-orbit vzn-orbit-three" />
          <div className="vzn-object-tag vzn-tag-top"><small>OBJECT STUDY / 001</small><strong>THE<br/>UNFINISHED.</strong><span>BUILT TO BE QUESTIONED</span></div>
          <div className="vzn-sculpture"><ThreeSculpture /></div>
          <div className="vzn-object-tag vzn-tag-bottom"><span>REAL PEOPLE</span><b>×</b><span>REAL REACTIONS</span></div>
          <div className="vzn-object-cross">✳</div>
          <div className="vzn-object-coord">26°N / 75°E — IDEAS IN MOTION</div>
        </div>
        <div className="vzn-hero-side">A PUBLIC REALITY CHECK <b>—</b> 2026</div>
      </section>

      <div className="vzn-marquee"><div>LESS GUESSING <b>✳</b> MORE KNOWING <b>✳</b> IDEAS NEED HONEST ANSWERS <b>✳</b> LESS GUESSING <b>✳</b> MORE KNOWING <b>✳</b> IDEAS NEED HONEST ANSWERS <b>✳</b></div></div>

      <section className="vzn-statement" data-vzn-reveal>
        <div className="vzn-statement-label"><span>THE PROBLEM / 001</span><span>ASSUMPTION IS EXPENSIVE.</span></div>
        <div className="vzn-statement-body"><h2>YOUR FRIENDS<br />WILL BE NICE.<br /><em>THE INTERNET<br />WON'T.</em></h2><div className="vzn-statement-aside"><div className="vzn-aside-mark">V.</div><p>You don't need another person telling you your idea is amazing. You need a clearer picture of what people actually think.</p><a href="#demo">SEE HOW IT FEELS <b>↘</b></a></div></div>
      </section>

      <section className="vzn-demo" id="demo" data-vzn-reveal>
        <div className="vzn-demo-head"><span>INTERACTION / 002</span><span>YOUR FIRST PUBLIC VERDICT</span></div>
        <div className="vzn-demo-layout">
          <div className="vzn-demo-copy"><div className="vzn-demo-number">01—03</div><h2>MAKE A<br /><em>CALL.</em></h2><p>Try the experience. This is a local preview—not a live public vote.</p><div className="vzn-demo-note"><i /> NO SIGN-UP NEEDED TO TEST THIS DEMO</div></div>
          <div className="vzn-vote-card">
            <div className="vzn-vote-top"><span>VEZQO / DEMO TEST</span><span>NOT LIVE <i /></span></div>
            <div className="vzn-vote-category">PRODUCT CONCEPT — 001</div>
            <h3>An app that turns your everyday ideas into public votes.</h3>
            <p>Would you actually use something like this?</p>
            <button className={vote === "want" ? "vzn-choice vzn-choice-want vzn-picked" : "vzn-choice vzn-choice-want"} onClick={() => setVote("want")}><span>WANT IT</span><b>↗</b></button>
            <button className={vote === "kill" ? "vzn-choice vzn-choice-kill vzn-picked" : "vzn-choice vzn-choice-kill"} onClick={() => setVote("kill")}><span>KILL IT</span><b>×</b></button>
            <div className="vzn-vote-result">{vote ? <><strong>YOUR VERDICT: {vote === "want" ? "WANT IT" : "KILL IT"}</strong><span>That was a demo response. No vote was submitted.</span></> : <><strong>THE FLOOR IS YOURS.</strong><span>Choose one. No maybe button.</span></>}</div>
            <div className="vzn-card-corner">VQ—001</div>
          </div>
        </div>
        <div className="vzn-demo-bottom"><span>ONE QUESTION.</span><span>TWO DIRECTIONS.</span><span>ZERO POLITE MAYBES.</span></div>
      </section>

      <section className="vzn-how" id="how" data-vzn-reveal>
        <div className="vzn-how-head"><div><span className="vzn-overline">THE MECHANISM / 003</span><h2>FROM THOUGHT<br />TO <em>TRUTH.</em></h2></div><p>A simple process designed to turn uncertainty into something you can work with.</p></div>
        <div className="vzn-steps">{steps.map((step, index) => <button className={active === index ? "vzn-step vzn-step-active" : "vzn-step"} key={step.n} onClick={() => setActive(index)}><div className="vzn-step-top"><span>{step.n} / {step.tag}</span><b>↗</b></div><div className="vzn-step-symbol">{index === 0 ? "✳" : index === 1 ? "↗" : "◎"}</div><h3>{step.title}</h3><p>{step.copy}</p><div className="vzn-step-progress"><i /></div></button>)}</div>
        <div className="vzn-step-detail"><span>NOW VIEWING / {steps[active].n}</span><strong>{steps[active].tag}</strong><p>{steps[active].copy}</p></div>
      </section>

      <section className="vzn-transform" data-vzn-reveal>
        <div className="vzn-transform-art"><div className="vzn-transform-ring" /><div className="vzn-transform-ring vzn-transform-ring-b" /><div className="vzn-transform-core">V<span>.</span></div><div className="vzn-transform-label">SIGNAL / FORM / MOMENTUM</div></div>
        <div className="vzn-transform-copy"><span className="vzn-overline">THE VEZQO PRINCIPLE / 004</span><h2>DON'T FALL<br />IN LOVE WITH<br /><em>THE GUESS.</em></h2><p>Fall in love with finding out. A vote is not a guarantee of success—it is a starting point for a smarter next decision.</p><a href="/signup" className="vzn-button vzn-button-light">START WITH YOUR IDEA <b>↗</b></a></div>
      </section>

      <section className="vzn-final" data-vzn-reveal><div className="vzn-final-stamp">THE NEXT MOVE IS YOURS / 005</div><div className="vzn-final-big">PUT IT<br />OUT <em>THERE.</em></div><div className="vzn-final-bottom"><p>Give your idea a moment in the real world.</p><a href="/signup">LET THE CROWD DECIDE <b>↗</b></a></div><div className="vzn-final-orb" /></section>
      <footer className="vzn-footer"><Logo compact /><span>IDEAS DESERVE EVIDENCE.</span><div><a href="/login">LOG IN</a><a href="/signup">CREATE ACCOUNT</a><span>© {new Date().getFullYear()} VEZQO</span></div></footer>
    </main>
  );
}
