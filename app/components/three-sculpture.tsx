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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      root.appendChild(renderer.domElement);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = environment.texture;
      pmrem.dispose();

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 4.2);
      key.position.set(4, 5, 6);
      scene.add(key);
      const rim = new THREE.PointLight(0x8ecbff, 42, 18);
      rim.position.set(-4, 1, -2);
      scene.add(rim);
      const warm = new THREE.PointLight(0xff694c, 24, 14);
      warm.position.set(3, -3, 2);
      scene.add(warm);

      const group = new THREE.Group();
      scene.add(group);
      const chrome = new THREE.MeshPhysicalMaterial({
        color: 0xe8f0f8, metalness: 1, roughness: 0.11,
        clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 2.5
      });
      const shadowChrome = new THREE.MeshPhysicalMaterial({
        color: 0x243342, metalness: 0.98, roughness: 0.19,
        clearcoat: 1, envMapIntensity: 1.8
      });

      // Custom extruded V mark: the sculpture is the VEZQO identity, not a stock primitive.
      const mark = new THREE.Shape();
      mark.moveTo(-1.48, 1.22);
      mark.lineTo(-0.72, 1.22);
      mark.lineTo(0, -0.48);
      mark.lineTo(0.72, 1.22);
      mark.lineTo(1.48, 1.22);
      mark.lineTo(0.39, -1.28);
      mark.lineTo(-0.39, -1.28);
      mark.closePath();

      const geometry = new THREE.ExtrudeGeometry(mark, {
        depth: 0.42, bevelEnabled: true, bevelSegments: 5,
        steps: 1, bevelSize: 0.075, bevelThickness: 0.075, curveSegments: 12
      });
      geometry.center();
      const emblem = new THREE.Mesh(geometry, chrome);
      group.add(emblem);

      const backGeometry = geometry.clone();
      const back = new THREE.Mesh(backGeometry, shadowChrome);
      back.scale.set(1.035, 1.035, 0.78);
      back.position.z = -0.28;
      group.add(back);

      const orbitA = new THREE.Mesh(
        new THREE.TorusGeometry(1.95, 0.009, 8, 200),
        new THREE.MeshBasicMaterial({ color: 0xa8c9e7, transparent: true, opacity: 0.68 })
      );
      orbitA.rotation.set(1.05, 0.3, -0.35);
      group.add(orbitA);
      const orbitB = new THREE.Mesh(
        new THREE.TorusGeometry(2.18, 0.007, 8, 200),
        new THREE.MeshBasicMaterial({ color: 0xf16a4c, transparent: true, opacity: 0.7 })
      );
      orbitB.rotation.set(0.4, 1.15, 0.7);
      group.add(orbitB);

      const satellites = new THREE.Group();
      const particleGeo = new THREE.SphereGeometry(0.018, 8, 8);
      for (let i = 0; i < 52; i++) {
        const a = (i / 52) * Math.PI * 2;
        const particle = new THREE.Mesh(
          particleGeo,
          new THREE.MeshBasicMaterial({ color: i % 5 === 0 ? 0xf16a4c : 0xd7e9f8 })
        );
        particle.position.set(Math.cos(a) * (2.35 + (i % 3) * 0.12), Math.sin(a * 2) * 0.5, Math.sin(a) * 1.55);
        satellites.add(particle);
      }
      group.add(satellites);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.72;
        pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.55;
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
        group.rotation.y = (reduced ? 0 : Math.sin(t * 0.22) * 0.18) + pointer.x;
        group.rotation.x = (reduced ? 0 : Math.sin(t * 0.32) * 0.09) + pointer.y;
        group.rotation.z = reduced ? 0 : Math.sin(t * 0.18) * 0.035;
        satellites.rotation.y = reduced ? 0 : -t * 0.07;
        group.position.y = reduced ? 0 : Math.sin(t * 0.65) * 0.07;
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
        environment.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    };

    boot();
    return () => { active = false; cleanup(); };
  }, []);

  return <div ref={host} className="vx-three-host" aria-label="Interactive real-time chrome VEZQO emblem" role="img" />;
}
