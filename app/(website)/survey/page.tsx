"use client";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { submitSurvey } from "./actions";

const FEATURES = [
  "Keyword DM Automation",
  "Comment-to-DM (Reel Replies)",
  "AI Smart Reply",
  "Follower Verification Gate",
  "Interactive CTA Buttons",
  "Link-in-Bio Automation",
  "Story Mention Response",
  "Analytics Dashboard",
];

const FOLLOWERS = ["Under 10K", "10K – 50K", "50K – 100K", "100K – 500K", "500K+"];
const PAY = ["Free (I'm just curious)", "$9/mo", "$19/mo", "$49/mo", "Enterprise"];

function SurveyContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "influencer";
  const isBusiness = type === "business";

  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    instagramHandle: "",
    followerCount: "",
    currentTools: "",
    biggestChallenge: "",
    interestedFeatures: [] as string[],
    willingToPay: "",
    betaTester: false,
    additionalComments: "",
    type: type,
    igUsage: "",
    manualDmVolume: "",
    automationDepth: "",
    primaryGoal: "",
  });

  const set = (key: string, val: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleFeature = (f: string) => {
    set(
      "interestedFeatures",
      form.interestedFeatures.includes(f)
        ? form.interestedFeatures.filter((x) => x !== f)
        : [...form.interestedFeatures, f]
    );
  };

  const steps = [
    // 0: Identity
    <div key="0" className="space-y-6">
      <StepLabel num={1} total={8} label={isBusiness ? "Business Identification" : "Tell us about yourself"} />
      <p className="text-zinc-500 text-sm leading-relaxed">
        Let&apos;s start with the basics so we can personalize your experience.
      </p>
      <div className="space-y-4">
        <Field label={isBusiness ? "Company / Brand Name" : "Full Name"} placeholder={isBusiness ? "e.g. Acme Creative" : "e.g. Sarah Jenkins"}>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={isBusiness ? "Brand Name" : "Full Name"} />
        </Field>
        <Field label="Business Email *" placeholder="">
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@company.com" required />
        </Field>
        <Field label="Instagram Handle (Optional)" placeholder="">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-mono text-sm">@</span>
            <input className={input} value={form.instagramHandle} onChange={(e) => set("instagramHandle", e.target.value)} placeholder="username" />
          </div>
        </Field>
      </div>
    </div>,

    // 1: Platform Usage (Usage)
    <div key="1" className="space-y-6">
      <StepLabel num={2} total={8} label="Platform Habits" />
      <p className="text-zinc-500 text-sm leading-relaxed">
        How deep is your daily interaction with Instagram currently?
      </p>
      <div className="space-y-4">
        <Field label="How many hours do you spend on Instagram daily for work?">
          <div className="grid grid-cols-2 gap-2">
            {["< 1 hr", "1-3 hrs", "3-5 hrs", "5+ hrs"].map(v => (
              <button key={v} onClick={() => set("igUsage", v)}
                className={`px-4 py-3 rounded-xl text-xs font-medium border transition-all ${form.igUsage === v ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900/40"}`}>
                {v}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Primary content focus">
           <div className="grid grid-cols-3 gap-2">
            {["Reels", "Stories", "Static"].map(v => (
              <button key={v} onClick={() => set("primaryGoal", v)}
                className={`px-4 py-3 rounded-xl text-[10px] font-medium border transition-all ${form.primaryGoal === v ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900/40"}`}>
                {v}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </div>,

    // 2: Audience (Audience)
    <div key="2" className="space-y-6">
      <StepLabel num={3} total={8} label="Audience Scale" />
      <p className="text-zinc-500 text-sm leading-relaxed">
        Select the bracket that best represents your current follower base.
      </p>
      <div className="grid grid-cols-1 gap-2.5">
        {FOLLOWERS.map((f) => (
          <button key={f} onClick={() => set("followerCount", f)}
            className={`w-full px-5 py-3.5 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${form.followerCount === f ? "border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600"}`}>
            {f} {isBusiness ? "active reach" : "followers"}
          </button>
        ))}
      </div>
    </div>,

    // 3: Workflow (DM Volume)
    <div key="3" className="space-y-6">
      <StepLabel num={4} total={8} label="Manual Workload" />
      <p className="text-zinc-500 text-sm leading-relaxed">
        Let&apos;s talk numbers. This helps us understand the ROI we can provide.
      </p>
      <div className="space-y-4">
        <Field label="Average manual DMs/Comments per week">
          <div className="grid grid-cols-2 gap-2">
            {["0 - 100", "100 - 500", "500 - 1,000", "1,000+"].map(v => (
              <button key={v} onClick={() => set("manualDmVolume", v)}
                className={`px-4 py-3 rounded-xl text-xs font-medium border transition-all ${form.manualDmVolume === v ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900/40"}`}>
                {v}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Current Tools (if any)">
           <input className={input} value={form.currentTools} onChange={(e) => set("currentTools", e.target.value)} placeholder="e.g. ManyChat, Meta Suite, Manual" />
        </Field>
      </div>
    </div>,

    // 4: Pain Points (Challenges)
    <div key="4" className="space-y-6">
      <StepLabel num={5} total={8} label="Core Bottlenecks" />
      <p className="text-zinc-500 text-sm leading-relaxed">
        What keeps you from scaling your Instagram organic growth?
      </p>
      <div className="space-y-4">
        <Field label="Describe your biggest challenge in details">
          <textarea 
            className={`${input} resize-none h-32 leading-relaxed`} 
            value={form.biggestChallenge} 
            onChange={(e) => set("biggestChallenge", e.target.value)} 
            placeholder={isBusiness ? "How does manual engagement affect your sales pipeline?" : "How much time are you losing every day responding to repetitive questions?"} 
          />
        </Field>
      </div>
    </div>,

    // 5: Features (Selection)
    <div key="5" className="space-y-6">
      <StepLabel num={6} total={8} label="The Autopilot Wishlist" />
      <p className="text-zinc-500 text-[11px] uppercase tracking-widest font-bold">Select all that apply</p>
      <div className="grid grid-cols-2 gap-2.5">
        {FEATURES.map((f) => (
          <button key={f} onClick={() => toggleFeature(f)}
            className={`px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all duration-200 text-center flex flex-col items-center justify-center gap-2 ${form.interestedFeatures.includes(f) ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900/40 text-zinc-500"}`}>
            {form.interestedFeatures.includes(f) ? <span className="text-[14px]">⭐</span> : null}
            {f}
          </button>
        ))}
      </div>
    </div>,

    // 6: Automation Philosophy (Depth)
    <div key="6" className="space-y-6">
      <StepLabel num={7} total={8} label="Automation Philosophy" />
      <p className="text-zinc-500 text-sm leading-relaxed">
        How much do you want to rely on AI?
      </p>
      <div className="space-y-3">
        {[
          { id: "FULL", t: "Hands-off", d: "100% AI handled responses" },
          { id: "HYBRID", t: "Hybrid", d: "AI suggests, I approve" },
          { id: "SIMPLE", t: "Basic", d: "Just keyword-based triggers" },
        ].map(v => (
          <button key={v.id} onClick={() => set("automationDepth", v.id)}
            className={`w-full p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 ${form.automationDepth === v.id ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900/40"}`}>
            <span className="font-black uppercase text-xs tracking-widest">{v.t}</span>
            <span className={`text-[10px] ${form.automationDepth === v.id ? "text-black/60" : "text-zinc-500"}`}>{v.d}</span>
          </button>
        ))}
      </div>
    </div>,

    // 7: Finalize & Pricing
    <div key="7" className="space-y-6">
      <StepLabel num={8} total={8} label="Ready for ZeroPilot?" />
      <div className="space-y-5">
        <Field label="Desired Investment (Monthly)">
          <div className="grid grid-cols-2 gap-2">
            {PAY.map((p) => (
              <button key={p} onClick={() => set("willingToPay", p)}
                className={`px-4 py-3 rounded-xl text-[10px] font-bold border transition-all duration-200 text-center ${form.willingToPay === p ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-400"}`}>
                {p}
              </button>
            ))}
          </div>
        </Field>
        
        <button onClick={() => set("betaTester", !form.betaTester)}
          className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all ${form.betaTester ? "border-[#4a7dff] bg-[#4a7dff] text-white" : "border-zinc-800 bg-zinc-900/40 text-zinc-400"}`}>
          <span>Register for Beta</span>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.betaTester ? "border-white bg-white text-[#4a7dff]" : "border-zinc-700"}`}>
            {form.betaTester ? "✓" : ""}
          </div>
        </button>

        <Field label="Anything else? (Future ideas / Goals)">
          <textarea className={`${input} resize-none h-20 text-xs`} value={form.additionalComments} onChange={(e) => set("additionalComments", e.target.value)} placeholder="I want to see feature X..." />
        </Field>
      </div>
    </div>,
  ];

  const totalSteps = steps.length;

  const canNext = () => {
    if (step === 0) return form.email.includes("@") && form.email.includes(".");
    if (step === 1) return !!form.igUsage;
    if (step === 2) return !!form.followerCount;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) return setStep(step + 1);
    startTransition(async () => {
      const res = await submitSurvey(form);
      if (res.status === 201) setDone(true);
      else setError(res.message);
    });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl animate-pulse">🎉</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mission Received.</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your {isBusiness ? "business" : "influencer"} insights will shape the next era of Autopilot. We&apos;ll be in touch soon.
          </p>
          <button onClick={() => window.close()} className="mt-4 px-6 py-3 rounded-full border border-zinc-700 text-sm text-zinc-300 hover:border-white transition-all">
            Close this tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-zinc-900">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <span className="text-black font-black text-xs">Z</span>
        </div>
        <span className="font-semibold text-sm tracking-tight capitalize">ZeroPilot — {type} Survey</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-zinc-900">
        <div
          className="h-full bg-white transition-all duration-500 ease-in-out"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="transition-all duration-300">
            {steps[step]}
          </div>

          {error && (
            <p className="mt-4 text-red-400 text-xs text-center">{error}</p>
          )}

          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="text-sm text-zinc-500 hover:text-white transition-colors">
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              onClick={handleNext}
              disabled={!canNext() || isPending}
              className="px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : step === totalSteps - 1 ? "Submit Survey ✓" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const input = "w-full bg-zinc-900/80 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-zinc-500 placeholder-zinc-600 transition-colors";

function StepLabel({ num, total, label }: { num: number; total: number; label: string }) {
  return (
    <div className="space-y-1 mb-2">
      <p className="text-xs text-zinc-500 font-mono">{num} / {total}</p>
      <h2 className="text-2xl font-bold tracking-tight">{label}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; placeholder?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export default function SurveyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SurveyContent />
    </Suspense>
  );
}
