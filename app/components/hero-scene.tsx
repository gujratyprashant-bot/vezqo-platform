"use client";

import { useEffect, useRef } from "react";

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    let onMove = (_event: PointerEvent) => {};
    let onLeave = () => {};

    const boot = async () => {
      const T = await import("three");
      if (!alive || !host.current) return;
      const root = host.current;
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, 0.1, 80);
      camera.position.set(0, 0.25, 8.7);

      try {
        renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        root.dataset.fallback = "true";
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      root.appendChild(renderer.domElement);

      scene.add(new T.HemisphereLight(0xffe8dc, 0x13090b, 2.0));
      const key = new T.DirectionalLight(0xffe9d8, 4.1);
      key.position.set(4, 6, 7);
      scene.add(key);
      const red = new T.PointLight(0xff3d18, 65, 15);
      red.position.set(-3.5, 1.4, 2);
      scene.add(red);
      const amber = new T.PointLight(0xff8a32, 42, 12);
      amber.position.set(3, -2.5, 1);
      scene.add(amber);
      const rim = new T.PointLight(0x6b8cff, 22, 12);
      rim.position.set(0, 3, -3);
      scene.add(rim);

      const stage = new T.Group();
      scene.add(stage);
      const darkMetal = new T.MeshPhysicalMaterial({ color: 0x24252b, metalness: .88, roughness: .2, clearcoat: 1, clearcoatRoughness: .12 });
      const titanium = new T.MeshPhysicalMaterial({ color: 0xc5c7ce, metalness: .96, roughness: .17, clearcoat: 1 });
      const glass = new T.MeshPhysicalMaterial({ color: 0x090e16, metalness: .48, roughness: .09, clearcoat: 1, emissive: 0x25100d, emissiveIntensity: .55 });
      const orange = new T.MeshStandardMaterial({ color: 0xff5728, emissive: 0xff3513, emissiveIntensity: 2.7, metalness: .35, roughness: .22 });
      const softOrange = new T.MeshStandardMaterial({ color: 0xffa15a, emissive: 0xff4b18, emissiveIntensity: 1.3, metalness: .5, roughness: .26 });

      // A real product concept under test: a compact focus / audio device, not a decorative logo sculpture.
      const caseShape = new T.Shape();
      caseShape.moveTo(-1.24, -.48);
      caseShape.quadraticCurveTo(-1.24, -.7, -.98, -.7);
      caseShape.lineTo(.98, -.7);
      caseShape.quadraticCurveTo(1.24, -.7, 1.24, -.45);
      caseShape.lineTo(1.24, .48);
      caseShape.quadraticCurveTo(1.24, .7, .98, .7);
      caseShape.lineTo(-.98, .7);
      caseShape.quadraticCurveTo(-1.24, .7, -1.24, .45);
      caseShape.closePath();
      const caseGeo = new T.ExtrudeGeometry(caseShape, { depth: .48, bevelEnabled: true, bevelSegments: 6, steps: 1, bevelSize: .09, bevelThickness: .08, curveSegments: 18 });
      caseGeo.center();
      const caseGroup = new T.Group();
      caseGroup.position.set(0, -.05, 0);
      stage.add(caseGroup);
      const shell = new T.Mesh(caseGeo, darkMetal);
      caseGroup.add(shell);
      const lid = new T.Mesh(new T.BoxGeometry(2.15, .16, .49), titanium);
      lid.position.set(0, .47, .02);
      caseGroup.add(lid);
      const seam = new T.Mesh(new T.BoxGeometry(2.12, .018, .5), orange);
      seam.position.set(0, .37, .025);
      caseGroup.add(seam);
      const front = new T.Mesh(new T.BoxGeometry(1.72, .56, .045), glass);
      front.position.set(0, -.04, .275);
      caseGroup.add(front);
      const displayFrame = new T.Mesh(new T.BoxGeometry(1.3, .035, .025), titanium);
      displayFrame.position.set(0, .12, .305);
      caseGroup.add(displayFrame);
      const displayCore = new T.Mesh(new T.CircleGeometry(.095, 40), orange);
      displayCore.position.set(0, -.13, .315);
      caseGroup.add(displayCore);
      const displayRing = new T.Mesh(new T.TorusGeometry(.19, .012, 8, 60), softOrange);
      displayRing.position.set(0, -.13, .31);
      caseGroup.add(displayRing);
      for (const x of [-.84, .84]) {
        const hinge = new T.Mesh(new T.CylinderGeometry(.07, .07, .16, 24), titanium);
        hinge.rotation.z = Math.PI / 2;
        hinge.position.set(x, .42, .04);
        caseGroup.add(hinge);
      }

      // Two earbuds make the tested object immediately legible as a consumer product.
      const buds: import("three").Group[] = [];
      for (const side of [-1, 1]) {
        const bud = new T.Group();
        bud.position.set(side * .64, .86, .1);
        bud.rotation.z = side * -.34;
        stage.add(bud);
        const head = new T.Mesh(new T.SphereGeometry(.22, 32, 24), titanium);
        head.scale.set(1, 1.08, .72);
        bud.add(head);
        const stem = new T.Mesh(new T.CapsuleGeometry(.075, .38, 5, 12), darkMetal);
        stem.position.set(side * .02, -.28, .015);
        stem.rotation.z = side * -.12;
        bud.add(stem);
        const sensor = new T.Mesh(new T.SphereGeometry(.045, 16, 12), orange);
        sensor.position.set(0, -.04, .145);
        bud.add(sensor);
        buds.push(bud);
      }

      // The orange feedback rings are the WANT / KILL signal made physical.
      const orbitRig = new T.Group();
      orbitRig.position.set(0, .05, -.15);
      stage.add(orbitRig);
      const orbit1 = new T.Mesh(new T.TorusGeometry(2.03, .014, 10, 180), orange);
      orbit1.rotation.set(1.12, .15, -.2);
      orbitRig.add(orbit1);
      const orbit2 = new T.Mesh(new T.TorusGeometry(2.35, .008, 8, 180), softOrange);
      orbit2.rotation.set(1.28, -.55, .36);
      orbitRig.add(orbit2);
      const nodeA = new T.Mesh(new T.SphereGeometry(.095, 24, 18), orange);
      nodeA.position.set(1.72, .76, .58);
      orbitRig.add(nodeA);
      const nodeB = new T.Mesh(new T.SphereGeometry(.075, 24, 18), softOrange);
      nodeB.position.set(-1.75, -.65, .45);
      orbitRig.add(nodeB);

      const platform = new T.Mesh(new T.CylinderGeometry(1.42, 1.62, .16, 96), darkMetal);
      platform.position.set(0, -1.38, 0);
      stage.add(platform);
      const platformRing = new T.Mesh(new T.TorusGeometry(1.48, .018, 10, 120), orange);
      platformRing.rotation.x = Math.PI / 2;
      platformRing.position.set(0, -1.28, 0);
      stage.add(platformRing);
      const floor = new T.Mesh(new T.CircleGeometry(3.2, 80), new T.MeshBasicMaterial({ color: 0x170b0b, transparent: true, opacity: .5 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -1.49, 0);
      stage.add(floor);

      // Restrained particles read as sparks from the idea-to-feedback process.
      const particleCount = 240;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const radius = 2.3 + Math.random() * 3.8;
        const angle = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - .5) * 4.8;
        positions[i * 3 + 2] = -1.2 - Math.random() * 4;
      }
      const particleGeo = new T.BufferGeometry();
      particleGeo.setAttribute("position", new T.BufferAttribute(positions, 3));
      const particles = new T.Points(particleGeo, new T.PointsMaterial({ color: 0xff7745, size: .022, transparent: true, opacity: .72, sizeAttenuation: true }));
      scene.add(particles);

      stage.rotation.set(-.08, -.22, -.025);
      stage.scale.setScalar(.94);
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        pointer.tx = ((event.clientX - rect.left) / rect.width - .5) * .28;
        pointer.ty = ((event.clientY - rect.top) / rect.height - .5) * .2;
      };
      onLeave = () => { pointer.tx = 0; pointer.ty = 0; };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);

      const resize = () => {
        if (!renderer) return;
        const width = Math.max(1, root.clientWidth);
        const height = Math.max(1, root.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(resize);
      observer.observe(root);
      resize();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new T.Clock();
      const draw = () => {
        if (!alive) return;
        const t = clock.getElapsedTime();
        pointer.x += (pointer.tx - pointer.x) * .045;
        pointer.y += (pointer.ty - pointer.y) * .045;
        stage.rotation.y = -.22 + pointer.x + (reduced ? 0 : Math.sin(t * .24) * .045);
        stage.rotation.x = -.08 + pointer.y + (reduced ? 0 : Math.sin(t * .31) * .018);
        caseGroup.position.y = -.05 + (reduced ? 0 : Math.sin(t * .8) * .045);
        buds.forEach((bud, i) => { bud.position.y = .86 + (reduced ? 0 : Math.sin(t * 1.1 + i) * .07); });
        orbitRig.rotation.y = reduced ? 0 : Math.sin(t * .2) * .19;
        orbitRig.rotation.z = reduced ? 0 : Math.sin(t * .27) * .045;
        nodeA.scale.setScalar(reduced ? 1 : 1 + Math.sin(t * 2.1) * .16);
        nodeB.scale.setScalar(reduced ? 1 : 1 + Math.sin(t * 1.8 + 1) * .14);
        displayCore.scale.setScalar(reduced ? 1 : 1 + Math.sin(t * 2.4) * .15);
        particles.rotation.y = reduced ? 0 : t * .012;
        renderer?.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      draw();
    };

    void boot();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (host.current) {
        host.current.removeEventListener("pointermove", onMove);
        host.current.removeEventListener("pointerleave", onLeave);
      }
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return <div ref={host} className="hero-scene-canvas" aria-label="3D concept product surrounded by audience feedback signal rings" />;
}
