"use client";

import { useEffect, useState } from "react";
import Logo from "./components/logo";
import HeroScene from "./components/hero-scene";
import { createClient } from "@/lib/supabase/client";

const steps = [
  { n: "01", title: "Bring the idea", body: "Describe the product, service or concept you want people to react to.", tag: "CREATE" },
  { n: "02", title: "Let people decide", body: "Put it in front of an audience and collect a clear WANT IT or KILL IT response.", tag: "VOTE" },
  { n: "03", title: "Move with evidence", body: "Read the response, understand the signal and choose your next move.", tag: "LEARN" },
];

const concepts = [
  { id: "01", type: "CONSUMER TECH", title: "A calmer way to focus.", body: "A compact audio companion designed around deep work.", kind: "audio" },
  { id: "02", type: "FOOTWEAR", title: "Built for the long way.", body: "A next-generation everyday sneaker concept.", kind: "shoe" },
  { id: "03", type: "FUTURE LIVING", title: "A smarter daily ritual.", body: "A home object reimagined around a simpler routine.", kind: "home" },
];

export default function Home() {
  const [choice, setChoice] = useState<"want" | "kill" | "">("");
  const [activeStep, setActiveStep] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const entryHref = signedIn ? "/account" : "/signup";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="vz-shell">
      <div className="vz-topline">
        <span>IDEAS IN. REAL SIGNAL OUT.</span>
        <span>AN OPEN PLATFORM FOR WHAT COMES NEXT <b>●</b></span>
      </div>

      <header className="vz-nav">
        <Logo />
        <nav className="vz-navlinks" aria-label="Main navigation">
          <a href="#how-it-works">HOW IT WORKS</a>
          <a href="#live-vote">LIVE VOTE</a>
          <a href="#discover">DISCOVER</a>
        </nav>
        <div className="vz-nav-actions">
          <a className="vz-login" href={signedIn ? "/account" : "/login"}>{signedIn ? "MY SPACE" : "LOG IN"}</a>
          <a className="vz-nav-cta" href={entryHref}>{signedIn ? "OPEN WORKSPACE" : "LAUNCH AN IDEA"} <span>↗</span></a>
        </div>
      </header>

      <section className="vz-hero">
        <div className="vz-hero-copy">
          <div className="vz-kicker"><i /> THE FUTURE ISN'T BUILT ON GUESSES</div>
          <h1>DON'T JUST<br />IMAGINE.<br /><em>LET THEM</em><br /><strong>DECIDE.</strong></h1>
          <p>Put your idea in front of real people. Get a clear signal before you spend your time building the wrong thing.</p>
          <div className="vz-hero-actions">
            <a className="vz-button" href={entryHref}>PUT YOUR IDEA TO THE TEST <span>↗</span></a>
            <a className="vz-watch" href="#how-it-works"><span>▶</span> SEE HOW VEZQO WORKS</a>
          </div>
          <div className="vz-hero-proof">
            <span><i /> REAL PEOPLE</span><b />
            <span><i /> HONEST VOTES</span><b />
            <span><i /> CLEARER DECISIONS</span>
          </div>
        </div>

        <div className="vz-hero-art">
          <div className="vz-art-grid" />
          <div className="vz-art-glow" />
          <HeroScene />
          <div className="vz-float-card vz-card-vote">
            <small>THE CROWD'S SIGNAL</small>
            <strong>WANT IT <b>↗</b></strong>
            <div className="vz-mini-track"><i /></div>
            <span>OR KILL IT?</span>
          </div>
          <div className="vz-float-card vz-card-live">
            <i /><div><small>VEZQO / LIVE FEEDBACK</small><strong>Every vote counts.</strong></div>
          </div>
          <div className="vz-art-caption"><span>FIG. 001</span><span>AN IDEA MEETS ITS AUDIENCE</span></div>
        </div>
        <div className="vz-scroll-cue"><span /> SCROLL TO EXPLORE</div>
      </section>

      <section className="vz-marquee" aria-label="VEZQO principles">
        <div>IDEAS DESERVE A REAL AUDIENCE <b>✳</b> LESS GUESSING. MORE SIGNAL. <b>✳</b> WANT IT OR KILL IT. <b>✳</b> IDEAS DESERVE A REAL AUDIENCE <b>✳</b></div>
      </section>

      <section className="vz-intro vz-section" data-reveal>
        <div className="vz-section-label"><span>01 / THE PROBLEM</span><span>SUPPORT ISN'T THE SAME AS DEMAND</span></div>
        <div className="vz-intro-grid">
          <h2>YOUR IDEA<br />NEEDS MORE<br /><em>THAN AN ECHO.</em></h2>
          <div className="vz-intro-copy">
            <span className="vz-quote">“</span>
            <p>Friends may encourage you. Followers may like your post. But neither tells you how people who don't know you will react to your idea.</p>
            <p>VEZQO gives concepts a place to meet real opinions—so the next move starts with a signal, not a guess.</p>
            <a href="#how-it-works" className="vz-text-link">GET TO KNOW THE PROCESS <b>↗</b></a>
          </div>
        </div>
      </section>

      <section className="vz-vote-section vz-section" data-reveal id="live-vote">
        <div className="vz-section-label"><span>02 / FEEL THE DECISION</span><span>INTERACTIVE PREVIEW / NOT A REAL VOTE</span></div>
        <div className="vz-vote-layout">
          <div className="vz-vote-heading">
            <span className="vz-index-ghost">02</span>
            <div className="vz-kicker"><i /> THE FIRST REACTION MATTERS</div>
            <h2>WOULD YOU<br /><em>WANT IT?</em></h2>
            <p>Here's a fictional concept. Cast a preview vote and see how VEZQO captures a simple decision.</p>
            <div className="vz-demo-note"><i /> DEMO ONLY · YOUR RESPONSE IS NOT SUBMITTED</div>
          </div>
          <article className="vz-vote-card">
            <div className="vz-vote-card-top"><span>CONCEPT / 001</span><span>VEZQO TEST LAB</span></div>
            <div className="vz-product-visual">
              <div className="vz-product-aura" />
              <div className="vz-earbud-case"><i /><b /><span /></div>
              <div className="vz-earbud bud-left"><i /></div>
              <div className="vz-earbud bud-right"><i /></div>
              <div className="vz-product-orbit orbit-one" />
              <div className="vz-product-orbit orbit-two" />
              <small>PRODUCT STUDY / FOCUS AUDIO</small>
            </div>
            <div className="vz-vote-info">
              <div><small>CONSUMER TECH / FICTIONAL CONCEPT</small><h3>Focus, without the noise.</h3><p>A pocket-sized audio companion imagined for people who need room to think.</p></div>
              <span>01—PX</span>
            </div>
            <div className="vz-vote-buttons">
              <button className={choice === "want" ? "is-selected" : ""} onClick={() => setChoice("want")}><span>＋</span> WANT IT <b>↗</b></button>
              <button className={choice === "kill" ? "is-selected is-kill" : "is-kill"} onClick={() => setChoice("kill")}><span>×</span> KILL IT <b>↗</b></button>
            </div>
            <div className="vz-vote-status" role="status">{choice ? "PREVIEW SIGNAL: " + (choice === "want" ? "WANT IT" : "KILL IT") + " — THIS IS NOT A LIVE PLATFORM VOTE." : "ONE IDEA. TWO HONEST ANSWERS. NO PRESSURE."}</div>
          </article>
        </div>
      </section>

      <section className="vz-how vz-section" data-reveal id="how-it-works">
        <div className="vz-section-label"><span>03 / HOW VEZQO WORKS</span><span>FROM FIRST THOUGHT TO CLEARER SIGNAL</span></div>
        <div className="vz-how-heading"><h2>IDEAS IN MOTION.<br /><em>DECISIONS WITH DIRECTION.</em></h2><p>Three simple steps. One better-informed next move.</p></div>
        <div className="vz-how-grid">
          <div className="vz-step-list">
            {steps.map((step, index) => (
              <button key={step.n} className={activeStep === index ? "active" : ""} onClick={() => setActiveStep(index)}>
                <span className="vz-step-no">{step.n}</span>
                <span className="vz-step-copy"><small>{step.tag}</small><strong>{step.title}</strong><em>{step.body}</em></span>
                <b>↗</b>
              </button>
            ))}
          </div>
          <div className="vz-step-scene">
            <div className="vz-step-orbit"><div className="vz-step-core">{steps[activeStep].n}</div><i /><b /></div>
            <small>THE VEZQO LOOP / {steps[activeStep].tag}</small>
            <h3>{steps[activeStep].title}</h3>
            <p>{steps[activeStep].body}</p>
            <div className="vz-step-progress"><i style={{ width: (activeStep + 1) * 33.333 + "%" }} /></div>
            <span>0{activeStep + 1} / 03</span>
          </div>
        </div>
      </section>

      <section className="vz-discover vz-section" data-reveal id="discover">
        <div className="vz-section-label"><span>04 / IDEAS WORTH TESTING</span><span>CONCEPTS ARE EXAMPLES, NOT LIVE LISTINGS</span></div>
        <div className="vz-discover-heading"><h2>WHAT COULD<br />THE WORLD <em>WANT?</em></h2><p>From products to digital experiences, every big thing starts as a question.</p></div>
        <div className="vz-concept-grid">
          {concepts.map((concept) => (
            <article className="vz-concept" key={concept.id}>
              <div className={"vz-concept-art " + concept.kind}>
                <span>{concept.id} / CONCEPT STUDY</span>
                <div className="vz-concept-object"><i /><b /><em /></div>
                <small>{concept.type}</small>
              </div>
              <div className="vz-concept-copy"><small>{concept.type}</small><h3>{concept.title}</h3><p>{concept.body}</p><a href="/signup" aria-label={"Test an idea like " + concept.title}>TEST AN IDEA <b>↗</b></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="vz-final" data-reveal>
        <div className="vz-final-orbit orbit-a" /><div className="vz-final-orbit orbit-b" />
        <div className="vz-final-label"><span>THE NEXT MOVE STARTS HERE</span><span>VEZQO / OPEN CALL</span></div>
        <h2>DON'T BUILD<br />ON A <em>GUESS.</em></h2>
        <div className="vz-final-bottom"><p>Give your idea a first audience. See what comes back.</p><a href="/signup" className="vz-button">LAUNCH YOUR IDEA <span>↗</span></a></div>
      </section>

      <footer className="vz-footer">
        <div className="vz-footer-brand"><Logo /><p>Ideas. Votes. Impact.</p></div>
        <nav><a href="#how-it-works">HOW IT WORKS</a><a href="#live-vote">LIVE VOTE</a><a href="/login">LOG IN</a><a href="/signup">SIGN UP</a></nav>
        <div className="vz-footer-bottom"><span>© {new Date().getFullYear()} VEZQO. ALL RIGHTS RESERVED.</span><span>BUILT FOR IDEAS THAT DESERVE A REAL ANSWER.</span></div>
      </footer>
    </main>
  );
}
