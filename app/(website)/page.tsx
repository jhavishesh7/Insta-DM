"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Zap,
  MessageSquare,
  Brain,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
  Bot,
  Store,
  CreditCard,
  Users,
  Workflow,
  Bell,
  TrendingUp,
  Globe,
  ChevronDown,
  Star,
  X,
  Menu,
} from "lucide-react";

// ─────────────────── DATA ───────────────────

const features = [
  {
    icon: <Brain className="w-7 h-7" />,
    tag: "AI",
    title: "Global AI Agent",
    description:
      "Give your account a brain. Configure a personality, tone, and sentiment strategy. Your AI will handle inquiries, qualify leads, and convert prospects — 24/7 — without you lifting a finger.",
    color: "#4a7dff",
    glow: "rgba(74,125,255,0.15)",
  },
  {
    icon: <Workflow className="w-7 h-7" />,
    tag: "Automation",
    title: "Keyword Trigger Engine",
    description:
      "Set specific keywords that instantly fire pre-built response sequences. Works across DMs and post comments simultaneously. Every keyword is a sales trigger.",
    color: "#6c2bd9",
    glow: "rgba(108,43,217,0.15)",
  },
  {
    icon: <MessageSquare className="w-7 h-7" />,
    tag: "Commerce",
    title: "Chat Commerce (Coming Soon)",
    description:
      "Close deals right in the DM thread. Generate quotes, send payment links, and create invoices — all without leaving Instagram. The future of social selling.",
    color: "#4a7dff",
    glow: "rgba(74,125,255,0.15)",
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    tag: "Analytics",
    title: "Live Activity Dashboard",
    description:
      "Real-time logs of every automated interaction. Track DM count, comment replies, AI responses, and monthly trends through a beautiful analytics engine.",
    color: "#6c2bd9",
    glow: "rgba(108,43,217,0.15)",
  },
  {
    icon: <Bell className="w-7 h-7" />,
    tag: "Smart",
    title: "Sentiment Analysis",
    description:
      "Your AI doesn&apos;t just reply — it reads the room. It detects frustration, excitement, and purchasing intent to tailor every response for maximum conversion.",
    color: "#4a7dff",
    glow: "rgba(74,125,255,0.15)",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    tag: "Security",
    title: "Enterprise-Grade Security",
    description:
      "Built on Instagram&apos;s official API with OAuth 2.0. Your tokens are encrypted and refreshed automatically. Zero risk. Full compliance.",
    color: "#6c2bd9",
    glow: "rgba(108,43,217,0.15)",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect Instagram",
    desc: "Link your Instagram Business account in one click with official OAuth. No browser hacks, no risky third-party tools.",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    step: "02",
    title: "Configure Automations",
    desc: "Set keyword triggers, connect specific reels, and activate your Global AI Agent. Decide exactly how your account should engage.",
    icon: <Workflow className="w-6 h-6" />,
  },
  {
    step: "03",
    title: "Launch & Go Live",
    desc: "Turn your automations live. ZeroPilot&apos;s engine handles every interaction instantly, tracking everything on your dashboard.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    step: "04",
    title: "Analyze & Scale",
    desc: "Review your detailed activity logs, see what&apos;s converting, and optimize your flows for maximum ROI.",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: "Reel Comment to DM",
      icon: <Users className="w-5 h-5" />,
      content: {
        title: "Convert Comments to Customers",
        desc: "Turn every &apos;Send me this!&apos; or &apos;Price?&apos; comment into a direct sales opportunity. Your bot detects specific keywords in comments and instantly sends a private DM with the information.",
        points: ["Automated Post/Reel detection", "Instant Private DM delivery", "No manual moderation needed"],
        visual: (
          <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold">User Comment</span>
                <span className="text-[9px] text-white/40">&quot;Info please!&quot;</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="w-2/3 p-3 bg-[#4a7dff] rounded-2xl rounded-tr-none text-[9px] font-medium">
                Sent: &quot;Hey! Just sent you the details via DM. Check your inbox! 🚀&quot;
              </div>
            </div>
          </div>
        )
      }
    },
    {
      title: "DM Automation",
      icon: <MessageSquare className="w-5 h-5" />,
      content: {
        title: "Keyword Trigger Engine",
        desc: "Build instant response flows for your most common inquiries. Whether it&apos;s &apos;Hiring&apos;, &apos;Booking&apos;, or &apos;Shop&apos;, your bot responds in milliseconds.",
        points: ["Unlimited Trigger Words", "Interactive Button Support", "24/7 Instant Response"],
        visual: (
          <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
             <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Keyword Detected: &quot;SHOP&quot;</span>
             </div>
             <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] leading-relaxed">
                &quot;Welcome to the store! ✨ Here are our current bestsellers. Which one interests you?&quot;
                <div className="flex gap-2 mt-2">
                   <div className="px-3 py-1 bg-[#4a7dff]/20 text-[#4a7dff] rounded-full border border-[#4a7dff]/30 text-[8px]">New Arrivals</div>
                   <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[8px]">Sale Items</div>
                </div>
             </div>
          </div>
        )
      }
    },
    {
      title: "Global AI Agent",
      icon: <Bot className="w-5 h-5" />,
      content: {
        title: "The Super-Global Brain",
        desc: "The ultimate safety net. If a user sends a message that doesn&apos;t match a keyword, your Global AI Agent steps in with your brand&apos;s unique personality to help.",
        points: ["Advanced Sentiment Detection", "Natural Language Processing", "Autonomous Problem Solving"],
        visual: (
          <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-[#6c2bd9]/30 shadow-lg shadow-[#6c2bd9]/10">
             <div className="flex gap-2 items-start opacity-50">
                <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                <p className="text-[9px] p-2 bg-white/5 rounded-lg border border-white/10">&quot;I&apos;m confused about my order from last week...&quot;</p>
             </div>
             <div className="flex gap-2 items-start justify-end">
                <p className="text-[9px] p-2 bg-[#6c2bd9] rounded-lg rounded-tr-none max-w-[80%] leading-normal font-medium">
                  &quot;I&apos;d love to help! I&apos;ve located your recent order. Could you confirm the email address used so I can check its live status for you?&quot;
                </p>
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
             </div>
          </div>
        )
      }
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 mt-20">
      <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 max-w-fit mx-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${
              activeTab === i 
                ? "bg-[#4a7dff] text-white shadow-lg shadow-[#4a7dff]/20" 
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      <div className="relative group min-h-[400px]">
        {/* Glow behind tabs */}
        <div className="absolute inset-0 bg-[#4a7dff]/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#0a0b14]/50 backdrop-blur-3xl p-10 md:p-14 rounded-[42px] border border-white/[0.06] shadow-2xl">
          <div className="flex flex-col gap-y-6">
             <div className="flex items-center gap-x-2">
                <span className="w-8 h-px bg-[#4a7dff]" />
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[#4a7dff]">Use Case #{activeTab + 1}</span>
             </div>
             <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">{tabs[activeTab].content.title}</h3>
             <p className="text-white/40 leading-relaxed text-base md:text-lg">{tabs[activeTab].content.desc}</p>
             <ul className="flex flex-col gap-y-3">
                {tabs[activeTab].content.points.map((p, i) => (
                  <li key={i} className="flex items-center gap-x-3 text-sm font-medium text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {p}
                  </li>
                ))}
             </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#4a7dff]/10 to-transparent blur-3xl rounded-full" />
             <div className="relative transform hover:scale-[1.02] hover:rotate-1 transition-all duration-700">
                {tabs[activeTab].content.visual}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    name: "Free",
    price: "NPR 0",
    period: "/month",
    desc: "For creators just getting started.",
    features: [
      "1 active automation",
      "Keyword-based DM triggers",
      "Comment auto-replies",
      "Basic activity log",
      "No AI features",
    ],
    cta: "Get Started Free",
    highlighted: false,
    badge: null,
    accent: "#ffffff",
  },
  {
    name: "Pro",
    price: "NPR 1,499",
    period: "/month",
    desc: "Unlimited power for serious creators.",
    features: [
      "Unlimited automations",
      "Smart AI-powered conversations",
      "Global AI Agent access",
      "Sentiment analysis engine",
      "Full analytics dashboard",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
    badge: "Most Popular",
    accent: "#4a7dff",
  },
  {
    name: "Ultra",
    price: "NPR 4,999",
    period: "/month",
    desc: "The complete Instagram commerce stack.",
    features: [
      "Everything in Pro",
      "Chat Commerce (DM Invoicing)",
      "Custom CRM integration",
      "Instagram Storefront (Coming Soon)",
      "Dedicated AI fine-tuning",
      "White-glove onboarding",
    ],
    cta: "Go Ultra",
    highlighted: false,
    badge: "Best Value",
    accent: "#6c2bd9",
  },
];

// ─────────────────── COMPONENTS ───────────────────

function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ${
          scrolled
            ? "w-[95%] max-w-5xl bg-white/[0.03] backdrop-blur-[20px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-3xl"
            : "w-full max-w-7xl bg-transparent border-transparent"
        } px-8 py-4 flex items-center justify-between`}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="ZeroPilot Logo" width={40} height={40} className="rounded-xl" />
          <span className="text-xl font-black tracking-tighter">
            Zero<span className="text-[#6c2bd9]">Pilot</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/50 font-medium">
          {["features", "how-it-works", "pricing"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="hover:text-white transition-colors capitalize"
            >
              {id.replace("-", " ")}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#4a7dff] to-[#6c2bd9] text-white font-bold px-5 rounded-full hover:opacity-90 transition shadow-lg shadow-[#4a7dff]/20 text-sm"
            >
              Launch App →
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-white/60"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] bg-[#0a0b14]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl font-black">
          {["features", "how-it-works", "pricing"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMobileOpen(false)}
              className="text-white/70 hover:text-white capitalize"
            >
              {id.replace("-", " ")}
            </a>
          ))}
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <Button className="bg-gradient-to-r from-[#4a7dff] to-[#6c2bd9] text-white font-bold px-8 py-4 rounded-full text-base">
              Launch App →
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

function GlowOrb({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
      style={{ background: color }}
    />
  );
}

// ─────────────────── PAGE ───────────────────

// ─────────────────── COMPONENTS ───────────────────



function AutomationNode() {
  return (
    <div className="absolute bottom-40 left-[5%] hidden lg:flex items-center gap-4 z-20 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] flex items-center justify-center shadow-lg shadow-[#4a7dff]/20">
         <Zap className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-black text-white uppercase italic">Keyword Trigger</span>
        <div className="h-0.5 w-12 bg-gradient-to-r from-[#4a7dff] to-transparent mt-1" />
      </div>
    </div>
  );
}

// ─────────────────── PAGE ───────────────────

export default function Home() {
  return (
    <main className="bg-[#020308] text-white overflow-hidden font-sans selection:bg-[#4a7dff]/30">
      <FloatingNav />

      {/* ======= HERO ======= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-32 pb-20 group">
        
        {/* Animated Scanlines */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
        
        {/* Background Grid - Cyberpunk Style */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a7dff08_1px,transparent_1px),linear-gradient(to_bottom,#4a7dff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Massive Dynamic Glows */}
        <GlowOrb
          color="rgba(74,125,255,0.15)"
          className="top-[-20%] left-[-10%] w-[1000px] h-[1000px] animate-pulse-slow"
        />
        <GlowOrb
          color="rgba(108,43,217,0.12)"
          className="bottom-[-10%] right-[-10%] w-[800px] h-[800px] animate-pulse"
        />
        
        {/* Hovering Cyber Elements */}
        <AutomationNode />

        <div className="relative z-20 max-w-6xl mx-auto px-6 flex flex-col items-center gap-12">
          
          {/* Top Badge */}
          <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-2 animate-fade-in">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">System Online: v1.4.2</span>
          </div>

          {/* Title - Hyper Bold & Glitchy */}
          <div className="relative">
            <h1 className="text-7xl md:text-9xl lg:text-[140px] font-black tracking-tighter leading-[0.8] mb-4">
              <span className="relative inline-block hover:skew-x-2 transition-transform duration-75 group-hover:text-[#4a7dff]/90 text-white">
                YOUR INSTAGRAM
              </span>
              <br />
              <span
                className="bg-clip-text text-transparent italic relative"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #4a7dff 0%, #a855f7 50%, #6c2bd9 100%)",
                }}
              >
                RUNS ITSELF.
                {/* Secondary Ghost Title for Glitch Feel */}
                <span className="absolute inset-0 text-white opacity-[0.03] select-none translate-x-1 translate-y-1 pointer-events-none">RUNS ITSELF.</span>
              </span>
            </h1>
            
            {/* Decal Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.015] -z-10 select-none pointer-events-none hidden lg:block whitespace-nowrap tracking-tighter mix-blend-overlay">
               ZERO PILOT
            </div>
          </div>

          {/* Subtitle - More technical/cleaner */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl md:text-2xl text-white/50 max-w-3xl leading-[1.4] font-medium">
              Autonomous engagement for the <span className="text-white">modern creator economy</span>. 
              ZeroPilot handles your entire DM pipeline so you can focus on the vision.
            </p>
            <div className="flex items-center gap-4 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
               <div className="h-px w-8 bg-white/20" />
               <Sparkles className="w-4 h-4" />
               <div className="h-px w-8 bg-white/20" />
            </div>
          </div>

          {/* CTAs - Cyber styled */}
          <div className="flex flex-col items-center gap-10 mt-10">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="relative overflow-hidden group/btn bg-white text-black font-black text-2xl px-16 h-20 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#4a7dff] to-[#6c2bd9] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover/btn:text-white transition-colors uppercase tracking-tighter">Initiate Pilot</span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover/btn:text-white" />
              </Button>
            </Link>
            
            {/* Visual Engine Core replacement for stats */}
            <div className="relative w-full max-w-lg h-32 flex items-center justify-center group/core">
               <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.05] rounded-full blur-2xl group-hover/core:bg-[#4a7dff]/5 transition-all" />
               <div className="relative flex items-center gap-16 px-10">
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] font-black text-[#4a7dff] uppercase tracking-[0.4em] mb-2 opacity-50">Core Sync</span>
                     <div className="flex gap-1 h-1.5 items-end">
                        {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="w-0.5 bg-[#4a7dff] animate-pulse" style={{ height: `${20 + (i*15)}%`, animationDelay: `${i*0.2}s` }} />
                        ))}
                     </div>
                  </div>
                  <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center relative p-1 group-hover/core:rotate-180 transition-transform duration-1000">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] rounded-full opacity-20 blur-xl animate-pulse" />
                     <div className="w-full h-full rounded-full bg-[#020308] border border-white/10 flex items-center justify-center relative z-10 shadow-inner">
                        <Bot className="w-8 h-8 text-white group-hover/core:scale-125 transition-transform" />
                     </div>
                     {/* Orbit dots */}
                     <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-[#4a7dff] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#4a7dff]" />
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] font-black text-[#6c2bd9] uppercase tracking-[0.4em] mb-2 opacity-50">Stream AI</span>
                     <div className="flex gap-1 h-1.5 items-end rotate-180">
                        {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="w-0.5 bg-[#6c2bd9] animate-pulse" style={{ height: `${20 + (i*15)}%`, animationDelay: `${i*0.2}s` }} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic bottom decor */}
        <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-[#020308] to-transparent z-30 pointer-events-none" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* Sections removed as requested */}


      {/* Visual Explainer removed as requested */}


      {/* ======= PRICING ======= */}
      <section id="pricing" className="relative py-32 px-6 md:px-16">
        <GlowOrb
          color="rgba(74,125,255,0.08)"
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#6c2bd9] mb-4">
              Pricing
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Simple. Transparent.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #4a7dff, #6c2bd9)",
                }}
              >
                Worth every paisa.
              </span>
            </h2>
            <p className="text-white/40 mt-4 text-base">
              Start free. Upgrade when you are ready to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-[32px] border transition-all duration-500 overflow-hidden ${
                  plan.highlighted
                    ? "border-[#4a7dff]/40 bg-gradient-to-b from-[#4a7dff]/8 to-transparent shadow-2xl shadow-[#4a7dff]/10 scale-105"
                    : i === 2
                    ? "border-[#6c2bd9]/30 bg-gradient-to-b from-[#6c2bd9]/5 to-transparent"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    style={{
                      backgroundColor: `${plan.accent}20`,
                      color: plan.accent,
                      border: `1px solid ${plan.accent}30`,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 flex flex-col gap-6 flex-1">
                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black">{plan.name}</h3>
                    <p className="text-white/40 text-sm">{plan.desc}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-white/30 text-sm pb-1">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: plan.accent }}
                        />
                        <span className="text-sm text-white/50">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/dashboard">
                    <Button
                      className="w-full font-black rounded-2xl h-12 text-sm transition-all hover:opacity-90 hover:scale-105"
                      style={
                        plan.highlighted || i === 2
                          ? {
                              background: `linear-gradient(135deg, ${plan.accent}, ${
                                i === 2 ? "#8b5cf6" : "#6c2bd9"
                              })`,
                              color: "white",
                              boxShadow: `0 10px 30px ${plan.accent}25`,
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              color: "white",
                            }
                      }
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="relative py-40 px-6 md:px-16 overflow-hidden">
        <GlowOrb
          color="rgba(74,125,255,0.12)"
          className="top-0 left-0 w-[600px] h-[600px]"
        />
        <GlowOrb
          color="rgba(108,43,217,0.10)"
          className="bottom-0 right-0 w-[500px] h-[500px]"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white/50">
              Join Nepal&apos;s fastest-growing creator tool
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Ready to put your
            <br />
            Instagram on{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #4a7dff, #6c2bd9)",
              }}
            >
              autopilot?
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl">
            Stop responding manually. Start selling automatically. Your followers
            deserve instant replies — and you deserve your time back.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4a7dff] to-[#6c2bd9] text-white font-black text-base px-14 h-14 rounded-full shadow-2xl shadow-[#4a7dff]/30 hover:opacity-90 transition-all hover:scale-105"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="border-t border-white/[0.04] px-6 md:px-16 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] flex items-center justify-center font-black text-sm">
              Z
            </div>
            <span className="text-lg font-black tracking-tighter">
              Zero<span className="text-[#6c2bd9]">Pilot</span>
            </span>
          </div>
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} ZeroPilot. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/25">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
            <Link href="/support" className="hover:text-white/50 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
