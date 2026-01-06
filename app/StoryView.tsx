"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default function StoryView({ onComplete }: { onComplete: (name: string) => void }) {
  const [step, setStep] = useState<"input" | "briefing">("input");
  const [name, setName] = useState("");
  const [showButton, setShowButton] = useState(false); // <--- New State for safety
  
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const avatarRef = useRef(null);
  
  // Audio helper
  const playTypeSound = () => {
    const audio = new Audio("/click.mp3");
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  // ANIMATION: Step 1 (Input Entry)
  useGSAP(() => {
    if (step === "input") {
      gsap.from(".identity-box", { scale: 0.9, opacity: 0, duration: 0.5, ease: "back.out" });
    }
  }, [step]);

  // ANIMATION: Step 2 (The Briefing)
  useGSAP(() => {
    if (step === "briefing") {
      const tl = gsap.timeline();
      
      // 1. Avatar slides in
      tl.from(avatarRef.current, { x: -50, opacity: 0, duration: 0.5 });
      
      // 2. Text types out
      tl.to(textRef.current, {
          text: {
            value: `LISTEN CLOSELY, AGENT ${name.toUpperCase()}... <br/><br/> THE SYSTEM CORE IS CRITICAL. "CHAOS" HAS INFECTED THE NETWORK. <br/><br/> YOU ARE OUR LAST DEFENSE. SYNCHRONIZE YOUR KEYSTROKES TO OVERRIDE THE CORRUPTION. <br/><br/> DO NOT FAIL US.`,
            delimiter: "" 
          },
          duration: 2.5, 
          ease: "none",
          onUpdate: () => {
             if (Math.random() > 0.8) playTypeSound(); 
          }
      });

      // 3. FORCE BUTTON SHOW (Safety Timer)
      // We set a timeout to ensure the button appears even if GSAP hangs
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 2500); 

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      setStep("briefing");
    }
  };

  return (
    <div ref={containerRef} className="relative z-20 flex h-screen w-full flex-col items-center justify-center p-8 bg-black/90 backdrop-blur-md text-white font-mono overflow-hidden">
      
      {/* --- STEP 1: NAME INPUT --- */}
      {step === "input" && (
        <form onSubmit={handleNameSubmit} className="identity-box flex flex-col items-center gap-6 z-30">
          <div className="text-sm font-mono text-green-500 tracking-widest animate-pulse">
            &gt; IDENTIFICATION REQUIRED
          </div>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ENTER CODENAME"
            className="bg-transparent border-b-2 border-white/20 text-center text-4xl md:text-6xl font-black text-white outline-none focus:border-green-500 transition-colors uppercase placeholder:text-neutral-800"
            maxLength={12}
          />
          <button 
            type="submit" 
            className="mt-4 px-8 py-2 border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all font-mono text-xs tracking-widest uppercase cursor-pointer"
          >
            CONFIRM IDENTITY
          </button>
        </form>
      )}

      {/* --- STEP 2: THE BRIEFING --- */}
      {step === "briefing" && (
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-10 z-30">
          
          {/* Hologram Avatar */}
          <div ref={avatarRef} className="briefing-avatar w-48 h-48 md:w-64 md:h-64 border-2 border-green-500/30 bg-green-900/10 relative overflow-hidden shrink-0 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
             <img 
               src="/avatar-bored.png" 
               alt="Operator"
               className="w-full h-full object-cover opacity-80 mix-blend-screen" 
               style={{ filter: "grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(300%) contrast(1.2)" }} 
             />
             <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />
             <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none" />
          </div>

          {/* Typewriter Text Area */}
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-xs font-mono text-green-500 tracking-widest">INCOMING TRANSMISSION...</span>
             </div>
             
             {/* TextPlugin target */}
             <p ref={textRef} className="briefing-text text-xl md:text-2xl font-bold font-mono leading-relaxed text-neutral-200 min-h-[200px]"></p>

             {/* BUTTON with React State Control (Guaranteed Visibility) */}
             <button 
               onClick={() => onComplete(name)}
               className={`mission-btn mt-8 px-8 py-3 bg-green-600 text-black font-black hover:bg-green-400 hover:scale-105 transition-all duration-1000 skew-x-[-10deg] cursor-pointer ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
             >
               ESTABLISH LINK
             </button>
          </div>
        </div>
      )}
    </div>
  );
}