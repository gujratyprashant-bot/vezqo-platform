import Logo from "./components/logo";

const steps = [
  { n: "01", title: "Put it out there.", text: "Give your idea a name. Explain what it does. Set the question." },
  { n: "02", title: "Let people decide.", text: "People choose WANT IT or KILL IT. No polite feedback. Just a clear vote." },
  { n: "03", title: "See the signal.", text: "Read the split, understand the reaction, and decide what deserves to exist." },
];

export default function Home() {
  return (
    <main className="vz-page">
      <div className="vz-topline"><span>INDEPENDENT IDEAS. UNFILTERED OPINIONS.</span><span>THE INTERNET IS THE FOCUS GROUP.</span></div>
      <nav className="vz-nav">
        <Logo />
        <div className="vz-navlinks"><a href="#how">HOW IT WORKS</a><a href="#manifesto">WHY VEZQO</a><a className="vz-nav-cta" href="/login">LOG IN <span>↗</span></a></div>
      </nav>

      <section className="vz-hero">
        <div className="vz-hero-copy">
          <div className="vz-stamp"><span className="vz-stamp-dot" /> IDEAS DON'T NEED PERMISSION.</div>
          <h1>MAKE IT.<br/><span>OR KILL IT.</span></h1>
          <p className="vz-lead">Before you spend months building something nobody asked for, put the idea to a vote. Real people. Two choices. No sugar-coating.</p>
          <div className="vz-hero-actions"><a className="vz-button" href="/signup">PUT YOUR IDEA UP <span>↗</span></a><a className="vz-text-link" href="#how">SEE HOW IT WORKS ↓</a></div>
          <div className="vz-note"><span>01</span> A PUBLIC REALITY CHECK FOR YOUR NEXT BIG IDEA.</div>
        </div>
        <div className="vz-stage" aria-label="Illustration of the VEZQO two-choice voting concept">
          <div className="vz-stage-index">THE PEOPLE HAVE THE FLOOR <b>● LIVE CONCEPT</b></div>
          <div className="vz-ticket vz-ticket-back"><span>YOUR IDEA</span><strong>THE NEXT<br/>BIG THING?</strong><small>DON'T TAKE OUR WORD FOR IT.</small></div>
          <div className="vz-vote-board">
            <div className="vz-board-top"><span>PUBLIC VERDICT / 001</span><span>VZQO®</span></div>
            <div className="vz-board-question">WOULD YOU<br/>USE THIS?</div>
            <div className="vz-choice vz-want"><strong>WANT IT</strong><span>↗</span></div>
            <div className="vz-choice vz-kill"><strong>KILL IT</strong><span>↘</span></div>
            <div className="vz-board-foot"><span>NO MAYBES.</span><span>JUST A SIGNAL.</span></div>
          </div>
          <div className="vz-side-note">HONEST<br/>BY DESIGN.</div>
          <div className="vz-stage-number">V / 01</div>
        </div>
        <div className="vz-marquee" aria-hidden="true"><div>LESS GUESSING <b>✳</b> MORE KNOWING <b>✳</b> LESS GUESSING <b>✳</b> MORE KNOWING <b>✳</b></div></div>
      </section>

      <section id="how" className="vz-how">
        <div className="vz-section-head"><div><span className="vz-overline">THE PROCESS / NO FLUFF</span><h2>Three steps.<br/><i>One clear signal.</i></h2></div><p>Good ideas deserve a fair shot. Bad assumptions deserve to be challenged early.</p></div>
        <div className="vz-steps">{steps.map((step) => <article className="vz-step" key={step.n}><span className="vz-step-no">{step.n}</span><span className="vz-step-arrow">↗</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section id="manifesto" className="vz-manifesto"><div className="vz-manifesto-left"><span className="vz-overline">A SMALL IDEA WITH A BIG QUESTION</span><h2>Would anyone<br/>actually <i>want it?</i></h2></div><div className="vz-manifesto-right"><div className="vz-big-mark">V.</div><p>Stop building in a bubble. Put your thinking in front of people who don't owe you a compliment.</p><a className="vz-button vz-button-dark" href="/signup">LET THE PEOPLE DECIDE <span>↗</span></a></div></section>
      <footer className="vz-footer"><Logo compact/><span>IDEAS DESERVE EVIDENCE.</span><span>© {new Date().getFullYear()} VEZQO</span></footer>
    </main>
  );
}