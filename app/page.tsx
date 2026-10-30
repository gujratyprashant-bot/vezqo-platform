import HeroScene from "./components/hero-scene";

const steps = [
  { n: "01", title: "Drop your idea", text: "Describe the product, app, or service you want to bring into the world." },
  { n: "02", title: "Get real reactions", text: "Put it in front of people and collect honest WANT IT or KILL IT votes." },
  { n: "03", title: "Move with a signal", text: "See what resonates before you commit your time and money to building." },
];

export default function Home() {
  return (
    <main>
      <nav className="nav wrap">
        <a className="brand" href="/">VEZQO<span>.</span></a>
        <div className="navlinks"><a href="#how">How it works</a><a href="#manifesto">The why</a><a className="navlogin" href="/login">Log in</a></div>
      </nav>

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><i /> THE INTERNET IS YOUR TEST MARKET</div>
          <h1>Don’t just<br />build an idea.<br /><em>Prove it.</em></h1>
          <p className="lead">Your next big thing deserves more than a guess. Put it in front of real people and discover whether they want it before you build it.</p>
          <div className="actions"><a className="btn primary" href="/signup">Test your idea <span>↗</span></a><a className="btn secondary" href="#how">Explore the process <span>↓</span></a></div>
          <div className="hero-proof"><span className="proof-dot" /> A clearer signal for your next move</div>
        </div>
        <HeroScene />
        <div className="hero-bottomline"><span>01 / THINK</span><span>02 / TEST</span><span>03 / KNOW</span></div>
      </section>

      <section id="how" className="section wrap">
        <div className="sectionhead"><div><span className="kicker">FROM MAYBE TO MOMENTUM</span><h2>Make the next move<br /><em>with a reason.</em></h2></div><p className="section-intro">A simple loop that puts the people who matter in the middle of your decision.</p></div>
        <div className="steps">{steps.map((step) => <article className="step" key={step.n}><span className="stepno">{step.n}</span><div className="step-arrow">↗</div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section id="manifesto" className="manifesto wrap"><span className="kicker">LESS GUESSWORK. MORE SIGNAL.</span><h2>Build for people.<br /><em>Not assumptions.</em></h2><a className="btn primary" href="/signup">Put your idea to the test <span>↗</span></a><div className="manifesto-orbit" /></section>

      <footer className="footer wrap"><a className="brand" href="/">VEZQO<span>.</span></a><span>Ideas deserve evidence.</span><span>© {new Date().getFullYear()} VEZQO</span></footer>
    </main>
  );
}
