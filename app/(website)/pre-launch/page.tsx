"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { joinWaitlist } from "./actions";
import BlurText from "./BlurText";

const Silk = dynamic(() => import("./silk"), { ssr: false });

// Countdown Logic - Set to April 1st, 2026
const LAUNCH_DATE = new Date("2026-04-10T00:00:00Z");

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, LAUNCH_DATE.getTime() - now.getTime());
      
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function Slot({ val }: { val: string }) {
  return (
    <div className="relative w-7 h-10 md:w-16 md:h-20 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
      <span className="text-base md:text-4xl font-black text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        {val}
      </span>
      <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-900/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
    </div>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <Slot val={str[0]} />
        <Slot val={str[1]} />
      </div>
      <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">{label}</span>
    </div>
  );
}

function WaitlistPopover() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    startTransition(async () => {
      const res = await joinWaitlist(email, name || undefined);
      setMsg(res.message);
      setState(res.status === 200 || res.status === 201 ? "success" : "error");
      if (res.status === 201) {
          setEmail("");
          setName("");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-72 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl z-50 pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {state === "success" ? (
        <div className="text-center py-2">
          <p className="text-white font-semibold text-sm">✓ {msg}</p>
          <p className="text-zinc-500 text-xs mt-1">Check your inbox soon.</p>
        </div>
      ) : (
        <form onSubmit={handle} className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Name</p>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-zinc-900 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 placeholder-zinc-800 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase text-zinc-500 font-bold ml-1">Email</p>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-900 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 placeholder-zinc-800 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-40"
          >
            {isPending ? "Joining..." : "Join Waitlist"}
          </button>
          {state === "error" && <p className="text-red-400 text-[10px] text-center">{msg}</p>}
        </form>
      )}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-r border-b border-zinc-900 rotate-45 -mt-2" />
    </motion.div>
  );
}

function SurveyPopover() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-64 p-3 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl z-50 pointer-events-auto flex flex-col gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-[10px] uppercase text-zinc-500 font-bold ml-2 mb-1">Choose your identity</p>
      
      <a 
        href="/survey?type=influencer"
        target="_blank"
        className="w-full px-4 py-3 bg-black border border-zinc-900 hover:border-zinc-700 rounded-xl transition-all flex flex-col gap-0.5"
      >
        <span className="text-white text-[13px] font-bold">Influencer</span>
        <span className="text-zinc-500 text-[10px]">I create and engage.</span>
      </a>

      <a 
        href="/survey?type=business"
        target="_blank"
        className="w-full px-4 py-3 bg-black border border-zinc-900 hover:border-zinc-700 rounded-xl transition-all flex flex-col gap-0.5"
      >
        <span className="text-white text-[13px] font-bold">Business</span>
        <span className="text-zinc-500 text-[10px]">I scale and convert.</span>
      </a>

      <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-r border-b border-zinc-900 rotate-45 -mt-2" />
    </motion.div>
  );
}

function OrbGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-zinc-600/10 blur-[150px]" />
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-zinc-500/10 blur-[150px]" />
    </div>
  );
}

export default function PreLaunchPage() {
  const { days, hours, minutes, seconds } = useCountdown();
  const [loading, setLoading] = useState(true);
  const [showBg, setShowBg] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [openPopover, setOpenPopover] = useState<"waitlist" | "survey" | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 1200);
    const t2 = setTimeout(() => setShowBg(true), 1300);
    const t3 = setTimeout(() => setShowText(true), 2000);
    const t4 = setTimeout(() => setShowRest(true), 2800);

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".popover-container")) {
        setOpenPopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center py-20 md:py-0 overflow-y-auto overflow-x-hidden overscroll-none select-none">
      {/* Dynamic Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showBg ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 opacity-25">
          <Silk speed={2} scale={2.5} color="#333333" noiseIntensity={1.5} rotation={0.2} />
        </div>
        <OrbGrid />
        <div
          className="absolute inset-0 z-[1] opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
      </motion.div>

      {/* Perfectly Centered Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center">
        <div className="flex flex-col items-center gap-10 md:gap-14">
          
          {/* Top Section: Branding & Headline */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-1 md:gap-2">
              {showText && (
                <>
                  <BlurText
                    text="Your Instagram."
                    delay={80}
                    animateBy="words"
                    direction="top"
                    className="text-[clamp(2.5rem,10vw,5.5rem)] font-black leading-[0.9] tracking-tighter text-white justify-center"
                  />
                  <BlurText
                    text="On Autopilot."
                    delay={120}
                    animateBy="words"
                    direction="top"
                    className="text-[clamp(2.5rem,10vw,5.5rem)] font-black leading-[0.9] tracking-tighter text-white justify-center"
                  />
                </>
              )}
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-[11px] md:text-[14px] text-zinc-500 max-w-[500px] mx-auto leading-relaxed font-black uppercase tracking-[0.45em] mt-8 md:mt-10 mb-4"
            >
              THE CREATOR <span className="text-white/60">ECONOMY</span>
              <br />
              ON <span className="text-white/80">CRUISE CONTROL.</span>
            </motion.p>
          </div>

          {/* Middle Section: CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: showRest ? 1 : 0, y: showRest ? 0 : 15 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 relative"
          >
            <div className="relative popover-container">
              <AnimatePresence>
                {openPopover === "waitlist" && <WaitlistPopover />}
              </AnimatePresence>
              <button
                onClick={() => setOpenPopover(openPopover === "waitlist" ? null : "waitlist")}
                className="px-12 py-3.5 bg-white text-black text-[12px] font-black rounded-full hover:scale-[1.04] active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </div>

            <div className="relative popover-container">
              <AnimatePresence>
                {openPopover === "survey" && <SurveyPopover />}
              </AnimatePresence>
              <button
                onClick={() => setOpenPopover(openPopover === "survey" ? null : "survey")}
                className="px-12 py-3.5 bg-black border border-zinc-800 text-white text-[12px] font-black rounded-full hover:border-zinc-500 hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center justify-center whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                Take Surveys
              </button>
            </div>
          </motion.div>

          {/* Bottom Section: Countdown */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: showRest ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 font-extrabold">Launching in</p>
            <div className="flex items-center gap-2 md:gap-6">
              <CountUnit value={days} label="Days" />
              <Colon />
              <CountUnit value={hours} label="Hours" />
              <Colon />
              <CountUnit value={minutes} label="Min" />
              <Colon />
              <CountUnit value={seconds} label="Sec" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Brand Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: showRest ? 1 : 0, y: showRest ? 0 : 10, filter: showRest ? "blur(0px)" : "blur(10px)" }}
        transition={{ delay: 3.5, duration: 2, ease: "easeOut" }}
        className="absolute bottom-[20px] md:bottom-[40px] left-0 right-0 flex items-center justify-center pointer-events-auto"
      >
        <span className="text-[10px] md:text-[12px] font-black tracking-[0.8em] uppercase text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] hover:text-white hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-all duration-700 cursor-default select-none">
          A BLACKBYTES PRODUCT
        </span>
      </motion.div>

      {/* Initial Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            >
              <span className="text-black font-black text-2xl tracking-tighter">ZP</span>
            </motion.div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-bold opacity-50">Initializing</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Colon() {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVis((v) => !v), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col gap-1.5 items-center mb-4 md:mb-6">
      <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-zinc-800 transition-opacity duration-300 ${vis ? "opacity-100" : "opacity-30"}`} />
      <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-zinc-800 transition-opacity duration-300 ${vis ? "opacity-100" : "opacity-30"}`} />
    </div>
  );
}
