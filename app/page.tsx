"use client";
import { useEffect, useState } from "react";
import Logo from "./components/logo";
import ThreeSculpture from "./components/three-sculpture";

const steps = [
  { n: "01", title: "Frame the question", body: "Turn your idea into one clear decision. What are you trying to learn?", tag: "DEFINE" },
  { n: "02", title: "Put it in front of people", body: "Share a concept page and invite people outside your immediate circle to react.", tag: "PUBLISH" },
  { n: "03", title: "Read the signal", body: "See the balance of WANT IT and KILL IT, then decide what deserves your next move.", tag: "LEARN" },
];
const examples = [
  { n: "FIELD NOTE 001", type: "PHYSICAL PRODUCT", title: "The everyday carry, rethought.", desc: "A compact object designed to make daily routines simpler.", cls: "object-one" },
  { n: "FIELD NOTE 002", type: "DIGITAL SERVICE", title: "A quieter kind of productivity.", desc: "A planning tool that protects focus instead of filling every minute.", cls: "object-two" },
  { n: "FIELD NOTE 003", type: "URBAN LIVING", title: "Made for the long way home.", desc: "A city essential imagined around comfort and movement.", cls: "object-three" },
];

export default function Home() {
  const [choice, setChoice] = useState("");
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), { threshold: .14 });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);
  return <main className="site-shell">
    <div className="topline"><span>AN OPEN FIELD FOR EARLY IDEAS</span><span>INDEPENDENT THINKING / REAL REACTIONS</span><span>EST. FOR THE CURIOUS ↗</span></div>
    <header className="site-nav"><Logo/><nav><a href="#method">THE METHOD</a><a href="#preview">LIVE PREVIEW</a><a href="#fieldnotes">FIELD NOTES</a></nav><div className="nav-actions"><a href="/login">LOG IN</a><a className="nav-pill" href="/signup">START A TEST <span>↗</span></a></div></header>

    <section className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow"><i/> THE SPACE BETWEEN IDEA AND REALITY</div>
        <h1>MAKE THE<br/>UNKNOWN<br/><em>ANSWER BACK.</em></h1>
        <p className="hero-intro">An idea is only a beginning. Put yours in front of people, hear the unfiltered reaction, and make your next move with more context.</p>
        <div className="hero-buttons"><a className="button-primary" href="/signup">PUT AN IDEA TO THE TEST <b>↗</b></a><a className="text-link" href="#method">SEE HOW IT WORKS <span>↓</span></a></div>
        <div className="hero-index"><span>01 — ASK</span><span>02 — LISTEN</span><span>03 — DECIDE</span></div>
      </div>
      <div className="hero-visual">
        <div className="visual-top"><span>VEZQO / SIGNAL STUDY</span><span>NO. 001—A</span></div>
        <div className="visual-stage"><div className="stage-grid"/><div className="stage-glow"/><div className="stage-object"><ThreeSculpture/></div>
          <div className="floating-note note-top"><small>THE QUESTION</small><strong>Would this<br/>make life better?</strong><span>OPEN / 001</span></div>
          <div className="floating-note note-bottom"><span className="live-dot"/> <div><small>THE POINT</small><strong>Listen beyond your circle.</strong></div><b>↗</b></div>
          <div className="axis-label">FIG. 01 / AN IDEA IN MOTION</div>
        </div>
        <div className="visual-bottom"><span>EARLY SIGNAL, NOT A GUARANTEE.</span><span>SCROLL TO EXPLORE ↓</span></div>
      </div>
      <div className="hero-side-label">A BETTER QUESTION CAN CHANGE THE WHOLE DIRECTION</div>
    </section>

    <div className="ticker"><div>IDEAS NEED DAYLIGHT <b>✳</b> CURIOSITY OVER CERTAINTY <b>✳</b> REAL REACTIONS, NOT EMPTY PRAISE <b>✳</b> IDEAS NEED DAYLIGHT <b>✳</b></div></div>

    <section className="manifesto section-pad" id="why" data-reveal>
      <div className="section-kicker"><span>01 / THE REALITY CHECK</span><span>SUPPORT IS NOT THE SAME AS DEMAND</span></div>
      <div className="manifesto-layout"><h2>YOUR FRIENDS<br/>LOVE YOU.<br/><em>THE MARKET<br/>DOESN'T KNOW YOU.</em></h2><div className="manifesto-copy"><div className="quote-mark">“</div><p>People close to you want you to win. That encouragement is valuable—but it can make it hard to see how an unfamiliar person will react.</p><p>VEZQO gives an early idea a place to meet a wider audience. Not to predict the future. To ask a better question before you commit to the answer.</p><a href="#method" className="underlined-link">WHY OUTSIDE PERSPECTIVE MATTERS <b>↘</b></a><div className="manifesto-stamp">LESS<br/>GUESSING<br/><strong>MORE<br/>LEARNING.</strong></div></div></div>
    </section>

    <section className="preview-section section-pad" id="preview" data-reveal>
      <div className="section-kicker"><span>02 / TRY THE FEELING</span><span>INTERACTIVE PREVIEW / LOCAL ONLY</span></div>
      <div className="preview-layout"><div className="preview-heading"><span className="giant-index">02</span><h2>WOULD YOU<br/><em>BACK THIS?</em></h2><p>Try a fictional concept. Your choice stays in this browser preview—it is not sent, counted, or shown as a real vote.</p><div className="preview-disclaimer"><i/> DEMO MODE / NO DATA SUBMITTED</div></div>
        <article className="concept-card"><div className="concept-card-head"><span>VEZQO / CONCEPT FILE</span><span>001—PX</span></div><div className="concept-art"><div className="product-shadow"/><div className="product-device"><div className="device-glass"/><div className="device-button"/><div className="device-light"/></div><div className="art-coordinates">24° 08' / OBJECT STUDY</div><span className="art-side">FORM FOLLOWS FUNCTION</span></div><div className="concept-info"><div><small>FICTIONAL PRODUCT / EVERYDAY TECH</small><h3>A pocket-sized focus companion.</h3><p>A tiny desk object imagined to help you create a calmer start to deep work.</p></div><span className="concept-number">01</span></div><div className="vote-actions"><button className={choice==="want"?"selected":""} onClick={()=>setChoice("want")}><span>＋</span> WANT IT <b>↗</b></button><button className={choice==="kill"?"selected":""} onClick={()=>setChoice("kill")}><span>×</span> NOT FOR ME <b>↗</b></button></div><div className="vote-feedback">{choice ? "PREVIEW RESPONSE: "+(choice==="want"?"WANT IT":"NOT FOR ME")+" — STORED ONLY IN THIS PAGE." : "A GOOD QUESTION MAKES ROOM FOR BOTH ANSWERS."}</div></article>
      </div>
    </section>

    <section className="method-section section-pad" id="method" data-reveal>
      <div className="section-kicker"><span>03 / THE METHOD</span><span>THREE MOVES, ONE CLEARER PICTURE</span></div><div className="method-heading"><h2>DON'T GUESS.<br/><em>GET CLOSER.</em></h2><p>VEZQO is a place to test an early thought in public. It helps collect perspective—not certainty, not a promise of success.</p></div>
      <div className="method-body"><div className="method-list">{steps.map((s,i)=><button key={s.n} onClick={()=>setActive(i)} className={active===i?"method-active":""}><span className="method-no">{s.n}</span><span className="method-text"><small>{s.tag}</small><strong>{s.title}</strong><em>{s.body}</em></span><span className="method-arrow">↗</span></button>)}</div><div className="method-detail"><div className="detail-orbit"><div className="detail-core">{steps[active].n}</div><i/><b/></div><small>THE VEZQO LOOP / {steps[active].tag}</small><h3>{steps[active].title}</h3><p>{steps[active].body}</p><div className="detail-progress"><i style={{width:(active+1)*33.333+"%"}}/></div><span>0{active+1} / 03</span></div></div>
    </section>

    <section className="fieldnotes-section section-pad" id="fieldnotes" data-reveal>
      <div className="section-kicker"><span>04 / FIELD NOTES</span><span>EXAMPLES OF IDEAS THAT COULD BE TESTED</span></div><div className="fieldnotes-heading"><h2>THE NEXT THING<br/>ISN'T <em>HERE YET.</em></h2><p>These fictional concept studies show the kinds of questions people might bring to VEZQO.</p></div>
      <div className="fieldnote-grid">{examples.map((x,i)=><article className={"fieldnote "+x.cls} key={x.n}><div className="fieldnote-art"><span className="fieldnote-id">{x.n}</span><div className="fieldnote-object"><i/><b/><em/></div><span className="fieldnote-coordinate">STUDY / 0{i+1}</span></div><div className="fieldnote-meta"><small>{x.type}</small><span>↗</span></div><h3>{x.title}</h3><p>{x.desc}</p></article>)}</div>
    </section>

    <section className="closing-section" data-reveal><div className="closing-top"><span>THE FIRST STEP IS A QUESTION.</span><span>VEZQO / OPEN CALL</span></div><h2>LET THE<br/><em>WORLD IN.</em></h2><div className="closing-bottom"><p>Your idea deserves more than a guess. Give it a first audience.</p><a href="/signup">START WITH YOUR IDEA <b>↗</b></a></div><div className="closing-watermark">ASK / LISTEN / DECIDE</div></section>

    <footer className="site-footer"><Logo compact/><span>IDEAS DESERVE EVIDENCE.</span><nav><a href="#why">THE WHY</a><a href="#method">THE METHOD</a><a href="/login">LOG IN</a><a href="/signup">SIGN UP</a></nav><small>© {new Date().getFullYear()} VEZQO</small></footer>
  </main>;
}
