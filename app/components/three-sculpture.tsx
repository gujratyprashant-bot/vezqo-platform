"use client";
import { useEffect, useRef } from "react";

export default function ThreeSculpture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    let raf = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      if (!alive || !host.current) return;
      const el = host.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
      camera.position.set(0, 0, 7);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      el.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff, .65));
      const key = new THREE.DirectionalLight(0xffe9df, 4.5); key.position.set(4, 5, 6); scene.add(key);
      const red = new THREE.PointLight(0xff2415, 55, 14); red.position.set(-3, 1, 2); scene.add(red);
      const rim = new THREE.PointLight(0xff8b55, 28, 12); rim.position.set(3, -2, -2); scene.add(rim);
      const assembly = new THREE.Group(); scene.add(assembly);
      const chrome = new THREE.MeshPhysicalMaterial({ color: 0xdce2e9, metalness: .96, roughness: .16, clearcoat: 1 });
      const black = new THREE.MeshPhysicalMaterial({ color: 0x17191e, metalness: .9, roughness: .22 });
      const ember = new THREE.MeshPhysicalMaterial({ color: 0xff3825, metalness: .35, roughness: .18, clearcoat: 1, emissive: 0x4b0800, emissiveIntensity: .55 });
      const heart = new THREE.Mesh(new THREE.IcosahedronGeometry(.82, 5), ember); assembly.add(heart);
      const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, .17, 220, 24, 2, 5), chrome);
      knot.rotation.set(.3, .2, .15); assembly.add(knot);
      const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.72, .035, 12, 160), black);
      orbit.rotation.set(1.1, .25, .4); assembly.add(orbit);
      const orbitRed = new THREE.Mesh(new THREE.TorusGeometry(1.95, .014, 8, 160), ember);
      orbitRed.rotation.set(.2, 1.05, .7); assembly.add(orbitRed);
      const fragments = new THREE.Group();
      for (let i = 0; i < 20; i++) {
        const a = i / 20 * Math.PI * 2;
        const shard = new THREE.Mesh(new THREE.OctahedronGeometry(.09 + (i % 3) * .025), i % 4 === 0 ? ember : chrome);
        shard.position.set(Math.cos(a) * 2.05, Math.sin(a) * 1.5, Math.sin(a * 2) * .35);
        shard.rotation.set(a, a * .7, 0); fragments.add(shard);
      }
      assembly.add(fragments);
      const resize = () => {
        if (!renderer) return;
        const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(resize); observer.observe(el); resize();
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointer.tx = ((e.clientX - r.left) / r.width - .5) * .4;
        pointer.ty = ((e.clientY - r.top) / r.height - .5) * .3;
      };
      el.addEventListener("pointermove", move);
      const clock = new THREE.Clock();
      const draw = () => {
        if (!alive) return;
        const t = clock.getElapsedTime();
        pointer.x += (pointer.tx - pointer.x) * .04; pointer.y += (pointer.ty - pointer.y) * .04;
        assembly.rotation.y = t * .15 + pointer.x;
        assembly.rotation.x = Math.sin(t * .25) * .1 + pointer.y;
        heart.rotation.y = -t * .2; fragments.rotation.y = -t * .08;
        renderer?.render(scene, camera); raf = requestAnimationFrame(draw);
      };
      draw();
      cleanup = () => el.removeEventListener("pointermove", move);
    })();
    return () => {
      alive = false; cancelAnimationFrame(raf); observer?.disconnect(); cleanup();
      renderer?.dispose(); renderer?.domElement.remove();
    };
  }, []);
  return <div ref={host} style={{ width: "100%", height: "100%", minHeight: 360 }} aria-label="Animated chrome and ember 3D sculpture" />;
}
