"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const container = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null); // <--- New Ref for stability

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Intro Animation
    tl.from(titleRef.current, { y: 100, opacity: 0, duration: 1, ease: "power4.out" })
      .from(".landing-sub", { opacity: 0, y: 20, stagger: 0.2 }, "-=0.5")
      // Changed to a safer Fade-In + Slide-Up animation
      .from(buttonRef.current, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" }, "-=0.2");
  }, { scope: container });

  const handleStart = () => {
    // Play sound immediately
    const audio = new Audio("/click.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});

    // Exit Animation
    gsap.to(container.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.5,
      onComplete: onStart 
    });
  };

  return (
    <div ref={container} className="relative z-10 flex h-screen w-full flex-col items-center justify-center p-8 bg-black text-white selection:bg-red-500/30 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="landing-sub mb-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
        System Online
      </div>

      <h1 ref={titleRef} className="text-center text-7xl font-black tracking-tighter mix-blend-difference md:text-9xl lg:text-[12rem] leading-none">
        CHAOS<br/><span className="text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-700">TYPER</span>
      </h1>

      <p className="landing-sub mt-8 max-w-md text-center text-neutral-400 font-mono text-sm">
        Connect to the mainframe. Speed is your only weapon against the glitch.
      </p>

      {/* Button with direct REF and fixed visibility */}
      <button 
        ref={buttonRef}
        onClick={handleStart}
        className="group mt-12 relative overflow-hidden bg-white px-12 py-4 text-black font-bold tracking-widest transition-transform hover:scale-105 active:scale-95 cursor-pointer z-20"
      >
        <span className="relative z-10">INITIALIZE LINK</span>
        <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-red-600 transition-transform duration-300 group-hover:translate-y-0"/>
      </button>

      {/* Footer */}
      <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/50 py-2 backdrop-blur-sm z-10">
        <div className="flex w-full justify-between px-8 text-[10px] text-neutral-500 font-mono">
          <span>V.1.0.0 // BUILD: PRODUCTION</span>
          <span>(C) 2026 ABK</span>
        </div>
      </div>
    </div>
  );
}