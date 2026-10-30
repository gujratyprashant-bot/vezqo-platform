"use client";

import { useEffect, useRef } from "react";

export default function ThreeSculpture() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: import("three").WebGLRenderer | undefined;
    let frame = 0;
    let observer: ResizeObserver | undefined;
    let cleanup = () => {};
    let active = true;

    const boot = async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (!active || !host.current) return;

      const root = host.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      root.appendChild(renderer.domElement);

      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();

      scene.add(new THREE.AmbientLight(0xffffff, 0.65));
      const key = new THREE.DirectionalLight(0xffffff, 3.4);
      key.position.set(4, 5, 6);
      scene.add(key);
      const rim = new THREE.PointLight(0x8ecbff, 34, 18);
      rim.position.set(-4, 1, -2);
      scene.add(rim);
      const warm = new THREE.PointLight(0xff694c, 18, 14);
      warm.position.set(3, -3, 2);
      scene.add(warm);

      const group = new THREE.Group();
      scene.add(group);
      const chrome = new THREE.MeshPhysicalMaterial({
        color: 0xe6edf5, metalness: 1, roughness: 0.13,
        clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 2.2
      });
      const darkChrome = new THREE.MeshPhysicalMaterial({
        color: 0x243342, metalness: 0.96, roughness: 0.2,
        clearcoat: 1, envMapIntensity: 1.7
      });

      const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.12, 0.31, 220, 32, 2, 5), chrome);
      knot.scale.set(1.03, 1.03, 1.03);
      group.add(knot);

      const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.54, 2), darkChrome);
      inner.scale.setScalar(0.8);
      group.add(inner);

      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xa8c9e7, transparent: true, opacity: 0.58 });
      const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.008, 8, 180), orbitMaterial);
      orbitA.rotation.set(1.05, 0.3, -0.35);
      group.add(orbitA);
      const orbitB = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.006, 8, 180), new THREE.MeshBasicMaterial({ color: 0xf16a4c, transparent: true, opacity: 0.55 }));
      orbitB.rotation.set(0.4, 1.15, 0.7);
      group.add(orbitB);

      const particles = new THREE.Group();
      const particleGeo = new THREE.SphereGeometry(0.018, 8, 8);
      for (let i = 0; i < 44; i++) {
        const a = (i / 44) * Math.PI * 2;
        const p = new THREE.Mesh(particleGeo, new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? 0xf16a4c : 0xd7e9f8 }));
        p.position.set(Math.cos(a) * (2.35 + (i % 3) * 0.12), Math.sin(a * 2) * 0.45, Math.sin(a) * 1.6);
        particles.add(p);
      }
      group.add(particles);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
        pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.65;
      };
      root.addEventListener("pointermove", onMove);

      const resize = () => {
        const width = Math.max(1, root.clientWidth);
        const height = Math.max(1, root.clientHeight);
        renderer?.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(resize);
      observer.observe(root);
      resize();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();
      const animate = () => {
        if (!active || !renderer) return;
        frame = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        pointer.x += (pointer.tx - pointer.x) * 0.045;
        pointer.y += (pointer.ty - pointer.y) * 0.045;
        group.rotation.y = (reduced ? 0 : t * 0.16) + pointer.x;
        group.rotation.x = (reduced ? 0 : Math.sin(t * 0.32) * 0.12) + pointer.y;
        knot.rotation.z = reduced ? 0 : t * 0.12;
        inner.rotation.set(t * 0.12, -t * 0.18, t * 0.09);
        group.position.y = reduced ? 0 : Math.sin(t * 0.65) * 0.08;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
        root.removeEventListener("pointermove", onMove);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    };

    boot();
    return () => { active = false; cleanup(); };
  }, []);

  return <div ref={host} className="vx-three-host" aria-label="Interactive real-time chrome 3D sculpture" role="img" />;
}
