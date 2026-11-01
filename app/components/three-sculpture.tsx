"use client";
import { useEffect, useRef } from "react";

export default function ThreeSculpture() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    let renderer: import("three").WebGLRenderer | undefined;
    let frame = 0;
    let observer: ResizeObserver | undefined;
    const boot = async () => {
      const T = await import("three");
      if (!active || !host.current) return;
      const root = host.current;
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, .1, 100);
      camera.position.set(0, 0, 8);
      renderer = new T.WebGLRenderer({ alpha:true, antialias:true, powerPreference:"high-performance" });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      root.appendChild(renderer.domElement);
      scene.add(new T.AmbientLight(0xffffff, .5));
      const key = new T.DirectionalLight(0xffe7dc, 5); key.position.set(4,5,6); scene.add(key);
      const red = new T.PointLight(0xff241b, 65, 16); red.position.set(-3,1,2); scene.add(red);
      const rim = new T.PointLight(0xff8052, 38, 15); rim.position.set(3,-3,-2); scene.add(rim);
      const rig = new T.Group(); scene.add(rig);
      const steel = new T.MeshPhysicalMaterial({color:0xcbd4df,metalness:.96,roughness:.16,clearcoat:1,clearcoatRoughness:.08});
      const dark = new T.MeshPhysicalMaterial({color:0x171b23,metalness:.9,roughness:.22});
      const ruby = new T.MeshPhysicalMaterial({color:0xff321f,metalness:.38,roughness:.18,clearcoat:1,emissive:0x3b0500,emissiveIntensity:.5});
      const core = new T.Mesh(new T.IcosahedronGeometry(.88,5),ruby); rig.add(core);
      const shell = new T.Mesh(new T.TorusKnotGeometry(1.28,.19,240,24,2,5),steel);
      shell.rotation.set(.35,.2,.1); rig.add(shell);
      const ring = new T.Mesh(new T.TorusGeometry(1.8,.035,12,180),dark);
      ring.rotation.set(1.08,.25,.45); rig.add(ring);
      const ring2 = new T.Mesh(new T.TorusGeometry(2.08,.012,8,180),ruby);
      ring2.rotation.set(.25,1.1,.8); rig.add(ring2);
      const shards = new T.Group();
      for(let i=0;i<18;i++){
        const a=i/18*Math.PI*2;
        const mesh=new T.Mesh(new T.OctahedronGeometry(.12+(i%3)*.035,1),i%4===0?ruby:steel);
        mesh.position.set(Math.cos(a)*2.15,Math.sin(a)*1.55,Math.sin(a*2)*.42);
        mesh.rotation.set(a,a*.7,0); shards.add(mesh);
      }
      rig.add(shards);
      const resize=()=>{if(!renderer)return;const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
      observer=new ResizeObserver(resize);observer.observe(root);resize();
      const pointer={x:0,y:0,tx:0,ty:0};
      const move=(e:PointerEvent)=>{const r=root.getBoundingClientRect();pointer.tx=((e.clientX-r.left)/r.width-.5)*.45;pointer.ty=((e.clientY-r.top)/r.height-.5)*.35;};
      root.addEventListener("pointermove",move);
      const clock=new T.Clock();
      const animate=()=>{if(!active)return;const t=clock.getElapsedTime();pointer.x+=(pointer.tx-pointer.x)*.035;pointer.y+=(pointer.ty-pointer.y)*.035;rig.rotation.y=t*.16+pointer.x;rig.rotation.x=Math.sin(t*.28)*.12+pointer.y;core.rotation.y=-t*.22;shards.rotation.y=-t*.08;renderer?.render(scene,camera);frame=requestAnimationFrame(animate);};
      animate();
      return ()=>root.removeEventListener("pointermove",move);
    };
    let remove=()=>{}; boot().then(fn=>{if(fn)remove=fn;});
    return ()=>{active=false;cancelAnimationFrame(frame);observer?.disconnect();remove();renderer?.dispose();renderer?.domElement.remove();};
  },[]);
  return <div ref={host} style={{width:"100%",height:"100%",minHeight:360}} aria-label="Abstract chrome and ruby 3D sculpture"/>;
}