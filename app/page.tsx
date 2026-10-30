"use client";

import { useEffect, useState } from "react";
import Logo from "./components/logo";
import ThreeSculpture from "./components/three-sculpture";

const steps = [
  { n: "01", title: "Drop the idea", text: "Give the world the one-line version. Make the question impossible to misunderstand.", tag: "THE CONCEPT" },
  { n: "02", title: "Put it to a vote", text: "People choose WANT IT or KILL IT. No long surveys. No polite maybe.", tag: "THE CROWD" },
  { n: "03", title: "Read the signal", text: "See the split, study the reactions, and decide what deserves your next move.", tag: "THE VERDICT" },
];

export default function Home() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [vote, setVote] = useState<"want" | "kill" | null>(null);
  useEffect(() => {
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty("--vx-scroll-progress", String(progress));
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    const items = document.querySelectorAll(".vx-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vx-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach((item) => observer.observe(item));

    // Tactile 3D interactions: cards tilt toward the pointer; CTAs respond magnetically.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const tiltItems = Array.from(document.querySelectorAll<HTMLElement>(".vx-step, .vx-float, .vx-morph-stage"));
    const magneticItems = Array.from(document.querySelectorAll<HTMLElement>(".vx-primary, .vx-final-button, .vx-morph-link"));
    const moveTilt = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      el.style.setProperty("--vx-tilt-x", String(-y * 7));
      el.style.setProperty("--vx-tilt-y", String(x * 9));
      el.style.setProperty("--vx-glow-x", `${(x + .5) * 100}%`);
      el.style.setProperty("--vx-glow-y", `${(y + .5) * 100}%`);
      el.classList.add("vx-pointer-active");
    };
    const resetTilt = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement;
      el.style.setProperty("--vx-tilt-x", "0");
      el.style.setProperty("--vx-tilt-y", "0");
      el.classList.remove("vx-pointer-active");
    };
    const moveMagnet = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--vx-magnet-x", `${x * .12}px`);
      el.style.setProperty("--vx-magnet-y", `${y * .16}px`);
    };
    const resetMagnet = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement;
      el.style.setProperty("--vx-magnet-x", "0px");
      el.style.setProperty("--vx-magnet-y", "0px");
    };
    if (finePointer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tiltItems.forEach((el) => {
        el.addEventListener("pointermove", moveTilt);
        el.addEventListener("pointerleave", resetTilt);
      });
      magneticItems.forEach((el) => {
        el.addEventListener("pointermove", moveMagnet);
        el.addEventListener("pointerleave", resetMagnet);
      });
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      tiltItems.forEach((el) => { el.removeEventListener("pointermove", moveTilt); el.removeEventListener("pointerleave", resetTilt); });
      magneticItems.forEach((el) => { el.removeEventListener("pointermove", moveMagnet); el.removeEventListener("pointerleave", resetMagnet); });
    };
  }, []);
  return (
    <main className="vx-page" onMouseMove={(e) => {
      const r=e.currentTarget.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      setPointer({x,y});
      e.currentTarget.style.setProperty("--vx-pointer-x", `${e.clientX}px`);
      e.currentTarget.style.setProperty("--vx-pointer-y", `${e.clientY}px`);
    }}>
      <div className="vx-scroll-meter" aria-hidden="true"><span /></div>
      <div className="vx-motion-film" aria-hidden="true"><i/><i/><i/><span/></div>
      <div className="vx-pointer-light" aria-hidden="true" />
      <div className="vx-grain" />
      <div className="vx-topbar"><span>AN OPEN SIGNAL FOR UNFINISHED IDEAS</span><span className="vx-live"><i/> THE CROWD IS THE FOCUS GROUP</span></div>
      <nav className="vx-nav"><Logo/><div className="vx-links"><a href="#mechanism">THE MECHANISM</a><a href="#signal">THE SIGNAL</a><a className="vx-login" href="/login">LOG IN <b>↗</b></a></div></nav>

      <section className="vx-hero">
        <div className="vx-copy">
          <div className="vx-eyebrow"><span>V / 001</span><i/> VALIDATE BEFORE REALITY GETS EXPENSIVE</div>
          <h1>YOUR IDEA.<br/><span>UNDER</span><br/><em>PRESSURE.</em></h1>
          <p className="vx-intro">The internet has an opinion. Put your next big idea in front of real people and find out what survives.</p>
          <div className="vx-actions"><a className="vx-primary" href="/signup">SUBMIT YOUR IDEA <b>↗</b></a><a className="vx-secondary" href="#mechanism">EXPLORE THE SYSTEM <span>↓</span></a></div>
          <div className="vx-proof"><span className="vx-proof-line"/> NOT ANOTHER WAITLIST. A REALITY CHECK.</div>
        </div>

        <div className="vx-art" style={{"--mx":pointer.x,"--my":pointer.y} as React.CSSProperties}>
          <div className="vx-art-grid"/>
          <div className="vx-art-index"><span>OBJECT / 001</span><span>VEZQO LABS <b>●</b></span></div>
          <div className="vx-orbit vx-orbit-one"/><div className="vx-orbit vx-orbit-two"/><div className="vx-orbit vx-orbit-three"/>
          <div className="vx-chrome-shadow"/>
          <div className="vx-monolith">
            <svg viewBox="0 0 360 420" className="vx-sculpture" aria-label="Chrome VEZQO V sculpture">
              <defs>
                <linearGradient id="chromeFace" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".16" stopColor="#75869b"/><stop offset=".31" stopColor="#f7fbff"/><stop offset=".48" stopColor="#8799ad"/><stop offset=".66" stopColor="#fff"/><stop offset=".82" stopColor="#586b82"/><stop offset="1" stopColor="#e9f3ff"/></linearGradient>
                <linearGradient id="chromeSide" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#273444"/><stop offset=".5" stopColor="#b8c9db"/><stop offset="1" stopColor="#182330"/></linearGradient>
                <filter id="chromeGlow"><feGaussianBlur stdDeviation="9"/></filter>
              </defs>
              <path d="M72 72 146 72 190 270 236 72 310 72 220 354 160 354Z" fill="#b8d5f4" opacity=".22" filter="url(#chromeGlow)"/>
              <path d="M53 58 127 58 181 257 232 58 307 58 212 355 151 355Z" fill="url(#chromeSide)" stroke="#f5faff" strokeOpacity=".65" strokeWidth="2"/>
              <path d="M53 58 127 58 181 257 232 58 307 58 212 355 151 355Z" fill="url(#chromeFace)" opacity=".95"/>
              <path d="M53 58 127 58 181 257 232 58 307 58 212 355 151 355Z" fill="none" stroke="#fff" strokeWidth="2.5"/>
              <path d="M75 80 112 80 181 305 252 80 285 80 205 333 165 333Z" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2"/>
              <path d="M127 58 181 257 232 58" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="4"/>
              <path d="M160 355 212 355 307 58 281 58 198 316Z" fill="#111e2c" opacity=".18"/>
            </svg>
            <div className="vx-sculpture-caption">V / VEZQO</div>
          </div>
          <div className="vx-float vx-float-top"><span>LIVE VERDICT</span><strong>THE NEXT<br/>BIG THING?</strong><small>THE CROWD DECIDES.</small></div>
          <div className="vx-float vx-float-bottom vx-interactive-vote"><div className="vx-vote-head"><span>TRY THE VERDICT</span><span>DEMO</span></div><div className="vx-vote-question">Would you use an app that turns ideas into public votes?</div><button className={`vx-vote-choice vx-choice-want ${vote === "want" ? "is-picked" : ""}`} onClick={() => setVote("want")}>WANT IT <b>↗</b></button><button className={`vx-vote-choice vx-choice-kill ${vote === "kill" ? "is-picked" : ""}`} onClick={() => setVote("kill")}>KILL IT <b>×</b></button><div className="vx-vote-foot">{vote ? "YOUR DEMO VOTE: " + (vote === "want" ? "WANT IT" : "KILL IT") : "INTERACTIVE PREVIEW / NOT A LIVE PUBLIC VOTE"}</div></div>
          <div className="vx-art-coordinate">26°N / IDEA IN MOTION</div>
          <div className="vx-art-cross vx-cross-a">+</div><div className="vx-art-cross vx-cross-b">+</div>
        </div>
        <div className="vx-hero-bottom"><span>01 / THINK</span><span>02 / TEST</span><span>03 / DECIDE</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>

      <div className="vx-ticker"><div>LESS GUESSING <b>✳</b> MORE KNOWING <b>✳</b> PUT IT TO THE PEOPLE <b>✳</b> LESS GUESSING <b>✳</b> MORE KNOWING <b>✳</b> PUT IT TO THE PEOPLE <b>✳</b></div></div>

      <section className="vx-morph-section vx-reveal">
        <div className="vx-morph-copy"><span className="vx-morph-kicker">FROM THOUGHT TO SIGNAL / 002</span><h2>AN IDEA IS<br/><em>JUST POTENTIAL.</em></h2><p>Give it a shape. Put it in the open. Let real people turn a hunch into a signal you can actually use.</p><a href="/signup" className="vx-morph-link">TEST YOUR IDEA <b>↗</b></a></div>
        <div className="vx-morph-stage"><div className="vx-morph-grid"/><div className="vx-morph-halo"/><ThreeSculpture/><div className="vx-morph-label vx-morph-label-a">RAW THOUGHT</div><div className="vx-morph-label vx-morph-label-b">PUBLIC SIGNAL</div><div className="vx-morph-cross">✳</div><div className="vx-morph-index">FIG. 02 <span>FORM / SIGNAL / MOTION</span></div></div>
      </section>

      <section id="mechanism" className="vx-mechanism vx-reveal">
        <div className="vx-section-label"><span>THE MECHANISM</span><span>02 — HOW IT WORKS</span></div>
        <div className="vx-section-title"><h2>NO GUESSES.<br/><i>JUST SIGNAL.</i></h2><p>Three moves between “I have an idea” and “I know what people think.”</p></div>
        <div className="vx-steps">{steps.map((s,i)=><article className="vx-step" key={s.n}><div className="vx-step-top"><span>{s.n} / {s.tag}</span><b>↗</b></div><div className={"vx-step-art vx-step-art-"+i}><div className="vx-step-glyph">{i===0?"✳":i===1?"↗":"◉"}</div><div className="vx-step-orbit"/></div><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
      </section>

      <section id="signal" className="vx-signal vx-reveal">
        <div className="vx-signal-visual"><div className="vx-signal-ring"/><div className="vx-signal-core">V<span>.</span></div><div className="vx-signal-chip vx-chip-a">HONEST BY DESIGN</div><div className="vx-signal-chip vx-chip-b">NO MAYBES</div></div>
        <div className="vx-signal-copy"><div className="vx-eyebrow vx-eyebrow-light"><span>03 / THE POINT</span><i/> BUILT FOR THE MOMENT BEFORE YOU BUILD</div><h2>THE WORLD<br/>DOESN'T OWE<br/><em>YOU A YES.</em></h2><p>And that's exactly why you should ask. VEZQO gives ideas a place to meet unfiltered public opinion—before time, money, and momentum are on the line.</p><a className="vx-primary vx-primary-light" href="/signup">PUT YOUR IDEA UP <b>↗</b></a></div>
      </section>

      <section className="vx-proof-lab vx-reveal">
        <div className="vx-lab-head"><span>THE VEZQO DIFFERENCE / 004</span><span>LESS NOISE. MORE SIGNAL.</span></div>
        <div className="vx-lab-grid">
          <article className="vx-lab-card vx-lab-feature">
            <div className="vx-lab-number">01</div><div className="vx-lab-orb">◎</div>
            <span>NO POLITE MAYBES</span><h3>MAKE THE<br/><em>CHOICE</em> CLEAR.</h3>
            <p>One focused question. Two honest directions. A signal you can actually interpret.</p>
          </article>
          <article className="vx-lab-card">
            <div className="vx-lab-number">02</div><div className="vx-lab-symbol">⌁</div>
            <span>BUILT FOR REAL REACTIONS</span><h3>BEYOND<br/>THE CLICK.</h3>
            <p>Look past the vote. Understand what makes people lean in, hesitate, or walk away.</p>
          </article>
          <article className="vx-lab-card">
            <div className="vx-lab-number">03</div><div className="vx-lab-symbol">↗</div>
            <span>DECIDE WITH INTENT</span><h3>MOVE WITH<br/><em>EVIDENCE.</em></h3>
            <p>Use the response as input for your next move—not as a promise of guaranteed success.</p>
          </article>
        </div>
        <div className="vx-lab-foot"><span>IDEAS ARE CHEAP. CLARITY ISN'T.</span><a href="/signup">PUT YOUR IDEA TO THE TEST <b>↗</b></a></div>
      </section>

      <section className="vx-final vx-reveal"><div className="vx-final-kicker">YOUR MOVE / 004</div><h2>MAKE THE IDEA.<br/><span>FACE THE CROWD.</span></h2><a href="/signup" className="vx-final-button">LET THEM DECIDE <b>↗</b></a><div className="vx-final-orb"/></section>
      <footer className="vx-footer"><Logo compact/><span>IDEAS DESERVE EVIDENCE.</span><span>© {new Date().getFullYear()} VEZQO</span></footer>
    </main>
  );
}