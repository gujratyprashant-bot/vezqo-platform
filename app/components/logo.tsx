export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand logo-brand${compact ? " logo-compact" : ""}`} href="/" aria-label="VEZQO home">
      <svg className="brand-mark" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="vezqo-flame-chrome" x1="7" y1="3" x2="41" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff0df" />
            <stop offset=".2" stopColor="#ff9b58" />
            <stop offset=".48" stopColor="#ff3d20" />
            <stop offset=".72" stopColor="#a81712" />
            <stop offset="1" stopColor="#ffb36b" />
          </linearGradient>
          <linearGradient id="vezqo-flame-depth" x1="8" y1="7" x2="39" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff6a35" />
            <stop offset=".5" stopColor="#38100d" />
            <stop offset="1" stopColor="#09090c" />
          </linearGradient>
        </defs>
        <path d="M24 2.5 44 14v20L24 45.5 4 34V14L24 2.5Z" fill="url(#vezqo-flame-depth)" stroke="#ff8a54" strokeWidth="1.2"/>
        <path d="m11.5 13 10.2 23h4.6l10.2-23h-7.1L24 27.1 18.6 13h-7.1Z" fill="url(#vezqo-flame-chrome)" stroke="#ffe2c8" strokeOpacity=".8" strokeWidth=".7"/>
        <path d="m17 13 7 17.2L31 13" fill="none" stroke="#fff0e4" strokeOpacity=".8" strokeWidth="1.1"/>
        <path d="M8 14 24 4.8 40 14" fill="none" stroke="#ffc49a" strokeOpacity=".8" strokeWidth="1"/>
        <circle cx="38" cy="9" r="3.2" fill="#ffb36b" stroke="#7c2116" strokeWidth="1.2"/>
      </svg>
      <span className="brand-word">VEZQO<span className="brand-period">.</span></span>
    </a>
  );
}
