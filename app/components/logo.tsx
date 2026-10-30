export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand logo-brand${compact ? " logo-compact" : ""}`} href="/" aria-label="VEZQO home">
      <svg className="brand-mark" viewBox="0 0 44 44" role="img" aria-hidden="true">
        <defs><linearGradient id="vezqo-mark" x1="5" y1="4" x2="39" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#e3ff9b"/><stop offset="1" stopColor="#9be52d"/></linearGradient></defs>
        <path d="M22 3.5 39.5 13.6v16.8L22 40.5 4.5 30.4V13.6L22 3.5Z" fill="url(#vezqo-mark)"/>
        <path d="m12.5 13 9.5 19 9.5-19h-6.2L22 22.3 18.7 13h-6.2Z" fill="#10170b"/>
        <circle cx="34.5" cy="9.5" r="3.5" fill="#f4ffd9" stroke="#10170b" strokeWidth="1.5"/>
      </svg>
      <span className="brand-word">VEZQO<span className="brand-period">.</span></span>
    </a>
  );
}