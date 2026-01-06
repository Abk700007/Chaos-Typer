"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import LandingPage from "./LandingPage";
import StoryView from "./StoryView"; // 

gsap.registerPlugin(TextPlugin);

// --- CONFIGURATION ---
const QUOTES = [
  "The code flows where the mind goes,\nChaos is merely a compilation error,\nDebug the universe with every keystroke.",
  "System failure is not an option,\nIt is a feature of the unready,\nOnly the swift survive the reboot.",
  "Digital shadows whisper the truth,\nTo those who listen fast enough,\nThe signal hides within the noise.",
  "Reality is a glitched interface,\nType faster to break the simulation,\nOverride the logic of the mundane.",
  "In the silence of the server room,\nOnly velocity matters now,\nSpeed is the heartbeat of the machine."
];

const IDLE_TIMEOUT = 2000;
const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

// --- MAIN COMPONENT ---
export default function Page() {
  // View State: landing -> story -> game
  const [view, setView] = useState<"landing" | "story" | "game">("landing");
  const [playerName, setPlayerName] = useState("");

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-red-500/30">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* VIEW CONTROLLER */}
      {view === "landing" && (
        <LandingPage onStart={() => setView("story")} />
      )}

      {view === "story" && (
        <StoryView 
          onComplete={(name) => {
            setPlayerName(name);
            setView("game");
          }} 
        />
      )}

      {view === "game" && (
        <ChaosTyper playerName={playerName} />
      )}
      
    </main>
  );
}

// ==========================================
// GAME VIEW COMPONENT
// ==========================================
function ChaosTyper({ playerName }: { playerName: string }) {
  const [targetText, setTargetText] = useState(""); 
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "TYPING" | "LAGGING" | "OVERDRIVE">("IDLE");

  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const statusRef = useRef(status); 

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { setTargetText(getRandomQuote()); }, []);

  const playClick = () => {
    const audio = new Audio("/click.mp3");
    audio.volume = 0.4;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  // Logic: WPM & Accuracy
  useEffect(() => {
    if (!startTime || isFinished) return;
    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const words = input.length / 5;
      const currentWpm = Math.round(words / elapsedMinutes) || 0;
      setWpm(currentWpm);
      
      // Accuracy Calculation
      let correctChars = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === targetText[i]) correctChars++;
      }
      const acc = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
      setAccuracy(acc);

      if (statusRef.current !== "LAGGING") {
        if (currentWpm > 45) setStatus("OVERDRIVE");
        else setStatus("TYPING");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [startTime, input, isFinished, targetText]);

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (status !== "OVERDRIVE") setStatus("TYPING");
    idleTimer.current = setTimeout(() => {
      if (!isFinished && startTime) setStatus("LAGGING");
    }, IDLE_TIMEOUT);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isFinished) return;
    if (!startTime) setStartTime(Date.now());
    resetIdleTimer();

    if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1 && input.length < targetText.length) {
      playClick();
      const newInput = input + e.key;
      setInput(newInput);
      triggerShake(); 

      // WIN CONDITION: Length Match
      if (newInput.length === targetText.length) {
        setIsFinished(true);
        setStatus("IDLE");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, isFinished, startTime, status, targetText]);

  const { contextSafe } = useGSAP({ scope: containerRef });
  
  const triggerShake = contextSafe(() => {
    const intensity = Math.min((wpm / 100) * 20, 20) + 2; 
    gsap.to(containerRef.current, {
      x: gsap.utils.random(-intensity, intensity),
      y: gsap.utils.random(-intensity, intensity),
      duration: 0.05,
      yoyo: true,
      repeat: 1,
      onComplete: () => { gsap.set(containerRef.current, { x: 0, y: 0 }); }
    });

    if (wpm > 45) {
      gsap.to(".game-text", {
        textShadow: `${gsap.utils.random(-5,5)}px 0 red, ${gsap.utils.random(-5,5)}px 0 blue`,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => { gsap.set(".game-text", { textShadow: "none" }); }
      });
    }
  });

  const getCharClass = (char: string, index: number) => {
    if (index >= input.length) return "text-neutral-700";
    if (char === input[index]) return "text-white";
    return "text-red-500 bg-red-500/20";
  };

  useGSAP(() => {
    gsap.from(containerRef.current, { opacity: 0, scale: 0.9, duration: 1, ease: "power4.out" });
  }, []);

  if (!targetText) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center font-mono">
      <div ref={containerRef} className={`z-10 w-full max-w-4xl p-10 transition-opacity duration-500 ${isFinished ? "opacity-20 blur-sm" : "opacity-100"}`}>
        <div className="flex justify-between border-b border-white/20 pb-4 mb-10 font-bold tracking-widest text-neutral-500">
          <span>STATUS: <span className={status === "OVERDRIVE" ? "text-red-500 animate-pulse" : "text-white"}>{status}</span></span>
          <div className="flex gap-4 md:gap-8">
            <span>ACC: <span className={`text-xl md:text-4xl ml-2 ${accuracy < 80 ? "text-red-500" : "text-green-500"}`}>{accuracy}%</span></span>
            <span>WPM: <span className="text-xl md:text-4xl text-white ml-2">{wpm}</span></span>
          </div>
        </div>

        <div className="game-text relative text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed whitespace-pre-line outline-none">
          {targetText.split("").map((char, index) => (
            <span key={index} className={getCharClass(char, index)}>{char}</span>
          ))}
          {!isFinished && <span className="inline-block w-3 h-8 bg-red-500 animate-blink align-middle ml-1" />}
        </div>
      </div>

      {isFinished && <VictoryScreen wpm={wpm} accuracy={accuracy} playerName={playerName} />}
      {!isFinished && <AI_Avatar status={status} />}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function VictoryScreen({ wpm, accuracy, playerName }: { wpm: number, accuracy: number, playerName: string }) {
  const container = useRef(null);
  
  const isSuccess = accuracy >= 80;
  const titleText = isSuccess ? "SYSTEM HACKED" : "SYSTEM CORRUPT";
  const titleColor = isSuccess ? "text-green-500" : "text-red-600";

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(container.current, { scale: 0.8, opacity: 0, duration: 0.5, ease: "power4.out" })
      .to(".victory-title", { text: { value: titleText }, duration: 1, ease: "none" })
      .from(".victory-stat", { y: 20, opacity: 0, duration: 0.5 }, "-=0.5");
  });

  return (
    <div ref={container} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      <h1 className={`victory-title text-5xl md:text-8xl font-black ${titleColor} tracking-tighter mix-blend-difference mb-8 text-center px-4`}></h1>
      
      <div className="victory-stat flex flex-col items-center gap-8">
        <div className="text-sm text-neutral-400 tracking-widest border border-white/20 px-4 py-1 rounded-full">
            AGENT: <span className="text-white font-bold">{playerName.toUpperCase()}</span>
        </div>

        <div className="flex gap-8 md:gap-12 text-center">
            <div>
                <div className="text-xs md:text-sm text-neutral-400 tracking-widest mb-2">VELOCITY</div>
                <div className="text-4xl md:text-6xl font-bold text-white">{wpm} <span className="text-lg text-neutral-500">WPM</span></div>
            </div>
            <div>
                <div className="text-xs md:text-sm text-neutral-400 tracking-widest mb-2">PRECISION</div>
                <div className={`text-4xl md:text-6xl font-bold ${accuracy < 80 ? "text-red-500" : "text-green-500"}`}>{accuracy}<span className="text-lg text-neutral-500">%</span></div>
            </div>
        </div>
        
        <button onClick={() => window.location.reload()} className="mt-10 px-8 py-4 bg-white text-black font-bold text-xl hover:bg-neutral-300 hover:scale-105 transition-all cursor-pointer">
            {isSuccess ? "NEXT TARGET" : "RETRY PROTOCOL"}
        </button>
      </div>
    </div>
  );
}

function AI_Avatar({ status }: { status: string }) {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const tl = gsap.timeline();
    if (status === "LAGGING") {
      tl.to(containerRef.current, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
    } else if (status === "OVERDRIVE") {
      tl.to(containerRef.current, { x: 0, opacity: 1, scale: 1.1, duration: 0.3 });
    } else {
      tl.to(containerRef.current, { x: 100, opacity: 0, duration: 0.5 });
    }
  }, [status]);

  let color = "", msg = "";
  if (status === "LAGGING") {
    color = "border-yellow-500 text-yellow-500";
    msg = "TOO SLOW! MY GRANDMA TYPES FASTER!";
  } else if (status === "OVERDRIVE") {
    color = "border-red-600 text-red-600 bg-red-900/10";
    msg = "MAXIMUM VELOCITY!! DON'T STOP!";
  }

  return (
    <div ref={containerRef} className="fixed bottom-0 right-10 flex items-end gap-4 translate-x-40 opacity-0 z-40">
      <div className={`mb-10 p-4 border-2 bg-black ${color} font-bold text-sm tracking-widest max-w-50`}>{msg}</div>
      <div className={`w-40 h-40 md:w-64 md:h-64 border-none bg-transparent relative overflow-hidden`}>
        {status === "LAGGING" && <img src="/avatar-bored.png" alt="Bored" className="w-full h-full object-cover" />}
        {status === "OVERDRIVE" && <img src="/avatar-angry.png" alt="Rage" className="w-full h-full object-cover animate-pulse" />}
      </div>
    </div>
  );
}