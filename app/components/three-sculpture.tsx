"use client";
import { useEffect, useRef } from "react";

export default function ThreeSculpture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true, raf = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    let cleanup = () => {};
    (async () => {
      const T = await import("three");
      if (!alive || !host.current) return;
      const el = host.current;
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(32, 1, .1, 40);
      camera.position.set(0, 0, 8.5);
      renderer = new T.WebGLRenderer({ alpha:true, antialias:true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      el.appendChild(renderer.domElement);
      scene.add(new T.HemisphereLight(0xe9f3ff, 0x111820, 2.1));
      const key = new T.DirectionalLight(0xffffff, 4.2); key.position.set(4,5,6); scene.add(key);
      const edge = new T.PointLight(0x8ca9ff, 35, 12); edge.position.set(-4,1,2); scene.add(edge);
      const warm = new T.PointLight(0xff633f, 24, 10); warm.position.set(3,-3,-1); scene.add(warm);
      const rig = new T.Group(); scene.add(rig);

      // VEZQO signal orbit: distinct response paths around the concept device.
      const signalOrbit = new T.Group(); scene.add(signalOrbit);
      const orbitMat = new T.MeshBasicMaterial({ color: 0x8ea9d2, transparent: true, opacity: .42 });
      const wantMat = new T.MeshStandardMaterial({ color: 0xc9e0ff, emissive: 0x7aaeff, emissiveIntensity: 2.1, metalness: .45, roughness: .2 });
      const rethinkMat = new T.MeshStandardMaterial({ color: 0xff9b7f, emissive: 0xff5938, emissiveIntensity: 1.5, metalness: .35, roughness: .25 });
      const orbitA = new T.Mesh(new T.TorusGeometry(2.02, .009, 8, 180), orbitMat);
      orbitA.rotation.set(1.18, .12, -.2); signalOrbit.add(orbitA);
      const orbitB = new T.Mesh(new T.TorusGeometry(2.22, .006, 8, 180), orbitMat.clone());
      orbitB.rotation.set(1.36, -.5, .34); signalOrbit.add(orbitB);
      const orbitNodes: import("three").Mesh[] = [];
      const addSignalNode = (x:number,y:number,z:number,material:import("three").Material,size=.075) => {
        const mesh = new T.Mesh(new T.SphereGeometry(size, 20, 16), material);
        mesh.position.set(x,y,z); signalOrbit.add(mesh); orbitNodes.push(mesh); return mesh;
      };
      addSignalNode(1.58,.78,.68,wantMat,.09);
      addSignalNode(-1.62,-.62,.54,rethinkMat,.075);
      addSignalNode(-.9,1.58,-.25,wantMat,.045);
      addSignalNode(1.05,-1.55,-.2,rethinkMat,.045);
      const signalHalo = new T.Mesh(new T.TorusGeometry(.17,.012,8,48), wantMat);
      signalHalo.position.set(1.58,.78,.68); signalHalo.rotation.x=.9; signalOrbit.add(signalHalo);
      const graphite = new T.MeshPhysicalMaterial({color:0x202630,metalness:.86,roughness:.24,clearcoat:1});
      const titanium = new T.MeshPhysicalMaterial({color:0xb9c5d4,metalness:.96,roughness:.18});
      const glass = new T.MeshPhysicalMaterial({color:0x101c2c,metalness:.45,roughness:.08,clearcoat:1,emissive:0x10284a,emissiveIntensity:.55});
      const signal = new T.MeshStandardMaterial({color:0x9ebcff,emissive:0x416fff,emissiveIntensity:2.4});
      const bodyShape = new T.Shape();
      bodyShape.moveTo(-1.12,-1.55); bodyShape.quadraticCurveTo(-1.3,-1.55,-1.3,-1.32);
      bodyShape.lineTo(-1.3,1.28); bodyShape.quadraticCurveTo(-1.3,1.55,-1.04,1.55);
      bodyShape.lineTo(1.04,1.55); bodyShape.quadraticCurveTo(1.3,1.55,1.3,1.28);
      bodyShape.lineTo(1.3,-1.32); bodyShape.quadraticCurveTo(1.3,-1.55,1.05,-1.55); bodyShape.closePath();
      const bodyGeo = new T.ExtrudeGeometry(bodyShape,{depth:.34,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.09,bevelThickness:.08,curveSegments:16});
      bodyGeo.center();
      const body = new T.Mesh(bodyGeo,graphite); rig.add(body);
      const face = new T.Mesh(new T.BoxGeometry(2.03,2.65,.055),titanium); face.position.z=.245; rig.add(face);
      const screen = new T.Mesh(new T.BoxGeometry(1.78,2.38,.07),glass); screen.position.set(0,.02,.3); rig.add(screen);
      const display = new T.Group(); display.position.set(0,.02,.35); rig.add(display);
      const bar = (w:number,h:number,y:number,mat:import("three").Material) => { const m=new T.Mesh(new T.BoxGeometry(w,h,.025),mat); m.position.y=y; display.add(m); return m; };
      bar(1.22,.025,.82,titanium); bar(.62,.055,.57,signal); bar(1.22,.018,.32,titanium);
      bar(.92,.018,-.15,titanium); bar(.72,.018,-.28,titanium);
      const meter = new T.Mesh(new T.TorusGeometry(.32,.035,12,90),signal); meter.position.set(0,-.78,.03); display.add(meter);
      const core = new T.Mesh(new T.SphereGeometry(.12,32,24),signal); core.position.set(0,-.78,.04); display.add(core);
      const side = new T.Mesh(new T.BoxGeometry(.12,.55,.22),titanium); side.position.set(1.32,.42,0); rig.add(side);
      const lower = new T.Mesh(new T.BoxGeometry(.12,.28,.22),signal); lower.position.set(1.32,-.45,0); rig.add(lower);
      for(let i=0;i<4;i++){const screw=new T.Mesh(new T.CylinderGeometry(.045,.045,.025,24),titanium);screw.rotation.x=Math.PI/2;screw.position.set(i%2? .98:-.98,i<2?1.28:-1.28,.34);rig.add(screw);}
      const cable = new T.Mesh(new T.CylinderGeometry(.045,.045,.75,24),titanium); cable.rotation.z=.18; cable.position.set(-.15,-1.92,-.12); rig.add(cable);
      const foot = new T.Mesh(new T.CylinderGeometry(.32,.38,.16,48),graphite); foot.position.set(-.15,-2.34,-.12); rig.add(foot);
      const shadow = new T.Mesh(new T.CircleGeometry(1.8,64),new T.MeshBasicMaterial({color:0x101b31,transparent:true,opacity:.24})); shadow.scale.set(1.3,.42,1); shadow.position.set(0,-2.45,-.8); rig.add(shadow);
      rig.rotation.set(-.12,-.28,-.08); rig.scale.setScalar(.94);
      const resize=()=>{if(!renderer)return;const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
      observer=new ResizeObserver(resize);observer.observe(el);resize();
      const pointer={x:0,y:0,tx:0,ty:0};
      const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();pointer.tx=((e.clientX-r.left)/r.width-.5)*.32;pointer.ty=((e.clientY-r.top)/r.height-.5)*.24;};
      el.addEventListener("pointermove",move);
      const clock=new T.Clock();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const draw=()=>{if(!alive)return;const t=clock.getElapsedTime();pointer.x+=(pointer.tx-pointer.x)*.045;pointer.y+=(pointer.ty-pointer.y)*.045;rig.rotation.y=-.28+(reduceMotion?0:Math.sin(t*.32)*.12)+pointer.x;rig.rotation.x=-.12+pointer.y+(reduceMotion?0:Math.sin(t*.45)*.025);core.scale.setScalar(1+(reduceMotion?0:Math.sin(t*2)*.12));signalOrbit.rotation.y=reduceMotion?-.18:Math.sin(t*.18)*.22;signalOrbit.rotation.z=reduceMotion?0:Math.sin(t*.24)*.055;orbitNodes.forEach((m,i)=>{const pulse=reduceMotion?1:1+Math.sin(t*1.8+i*1.7)*.13;m.scale.setScalar(pulse);});signalHalo.rotation.z=reduceMotion?0:t*.55;renderer?.render(scene,camera);raf=requestAnimationFrame(draw);};
      draw(); cleanup=()=>el.removeEventListener("pointermove",move);
    })();
    return ()=>{alive=false;cancelAnimationFrame(raf);observer?.disconnect();cleanup();renderer?.dispose();renderer?.domElement.remove();};
  },[]);
  return <div ref={host} style={{width:"100%",height:"100%",minHeight:360}} aria-label="Animated 3D industrial concept device"/>;
}
