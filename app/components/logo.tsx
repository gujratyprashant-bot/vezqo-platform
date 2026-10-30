export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand logo-brand${compact ? " logo-compact" : ""}`} href="/" aria-label="VEZQO home">
      <svg className="brand-mark" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="vezqo-chrome" x1="8" y1="3" x2="39" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset=".22" stopColor="#aebbc9" />
            <stop offset=".48" stopColor="#f7fbff" />
            <stop offset=".7" stopColor="#718096" />
            <stop offset="1" stopColor="#e9f1f8" />
          </linearGradient>
          <linearGradient id="vezqo-depth" x1="8" y1="7" x2="39" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#536273" />
            <stop offset=".5" stopColor="#17212d" />
            <stop offset="1" stopColor="#080d14" />
          </linearGradient>
        </defs>
        <path d="M24 2.5 44 14v20L24 45.5 4 34V14L24 2.5Z" fill="url(#vezqo-depth)" stroke="#9eacbb" strokeWidth="1.2"/>
        <path d="m11.5 13 10.2 23h4.6l10.2-23h-7.1L24 27.1 18.6 13h-7.1Z" fill="url(#vezqo-chrome)" stroke="#f8fbff" strokeOpacity=".7" strokeWidth=".7"/>
        <path d="m17 13 7 17.2L31 13" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="1.1"/>
        <path d="M8 14 24 4.8 40 14" fill="none" stroke="#fff" strokeOpacity=".65" strokeWidth="1"/>
        <circle cx="38" cy="9" r="3.2" fill="#fff" stroke="#687789" strokeWidth="1.2"/>
      </svg>
      <span className="brand-word">VEZQO<span className="brand-period">.</span></span>
    </a>
  );
}