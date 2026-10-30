"use client";

import { useState } from "react";

export default function HeroScene() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <div
      className="scene"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -14, y: x * 18 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      aria-label="Interactive 3D idea validation illustration"
    >
      <div className="scene-grid" />
      <div className="orb-halo" />
      <div className="orb" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="orb-core" />
        <div className="orb-ring ring-a" />
        <div className="orb-ring ring-b" />
        <div className="orb-shine" />
        <span className="orb-label">IDEA<br />IN MOTION</span>
      </div>
      <div className="float-card vote-card">
        <span className="float-label">THE CROWD IS DECIDING</span>
        <div className="vote-choice want"><strong>WANT IT</strong><span>↗</span></div>
        <div className="vote-track"><i /></div>
        <div className="vote-choice kill"><strong>KILL IT</strong><span>↘</span></div>
        <div className="vote-track kill-track"><i /></div>
        <small>Every vote moves the signal</small>
      </div>
      <div className="float-card insight-card">
        <span className="insight-dot" />
        <div><strong>Signal detected</strong><small>Real people. Honest reactions.</small></div>
      </div>
      <div className="scene-caption"><span /> REAL PEOPLE. REAL SIGNAL.</div>
    </div>
  );
}