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
    type: type, // Store the type
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
    <div key="0" className="space-y-5">
      <StepLabel num={1} total={5} label={isBusiness ? "Business Details" : "Who are you?"} />
      <Field label={isBusiness ? "Business Name" : "Your Name"} placeholder={isBusiness ? "e.g. Acme Studio" : "e.g. Priya Sharma"}>
        <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={isBusiness ? "e.g. Acme Studio" : "e.g. Priya Sharma"} />
      </Field>
      <Field label="Email Address *" placeholder="">
        <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@yourbrand.com" required />
      </Field>
      <Field label="Instagram Handle" placeholder="">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-sm">@</span>
          <input className={input} value={form.instagramHandle} onChange={(e) => set("instagramHandle", e.target.value)} placeholder="yourusername" />
        </div>
      </Field>
    </div>,

    // 1: Audience
    <div key="1" className="space-y-5">
      <StepLabel num={2} total={5} label={isBusiness ? "Current Reach" : "Your audience size"} />
      <div className="grid grid-cols-1 gap-3">
        {FOLLOWERS.map((f) => (
          <button key={f} onClick={() => set("followerCount", f)}
            className={`w-full px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${form.followerCount === f ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-400"}`}>
            {f} {isBusiness ? "reach/followers" : "followers"}
          </button>
        ))}
      </div>
    </div>,

    // 2: Pain
    <div key="2" className="space-y-5">
      <StepLabel num={3} total={5} label="What's your current setup?" />
      <Field label="Tools you currently use for engagement">
        <textarea className={`${input} resize-none h-24`} value={form.currentTools} onChange={(e) => set("currentTools", e.target.value)} placeholder="ManyChat, manual replies, etc." />
      </Field>
      <Field label="Biggest bottleneck in your Instagram workflow">
        <textarea className={`${input} resize-none h-24`} value={form.biggestChallenge} onChange={(e) => set("biggestChallenge", e.target.value)} placeholder={isBusiness ? "Scaling support, lead capture, etc." : "Managing DMs, converting comments, etc."} />
      </Field>
    </div>,

    // 3: Features
    <div key="3" className="space-y-5">
      <StepLabel num={4} total={5} label="Which features excite you most?" />
      <p className="text-xs text-zinc-500">Select all that apply</p>
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f) => (
          <button key={f} onClick={() => toggleFeature(f)}
            className={`px-4 py-3 rounded-xl text-xs font-medium border transition-all duration-200 text-left ${form.interestedFeatures.includes(f) ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-400"}`}>
            {form.interestedFeatures.includes(f) && <span className="mr-1">✓</span>}{f}
          </button>
        ))}
      </div>
    </div>,

    // 4: Pricing & beta
    <div key="4" className="space-y-5">
      <StepLabel num={5} total={5} label="Final thoughts" />
      <Field label="Target monthly investment for automation?">
        <div className="space-y-2">
          {PAY.map((p) => (
            <button key={p} onClick={() => set("willingToPay", p)}
              className={`w-full px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${form.willingToPay === p ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-400"}`}>
              {p}
            </button>
          ))}
        </div>
      </Field>
      <button onClick={() => set("betaTester", !form.betaTester)}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${form.betaTester ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900/60 text-zinc-300"}`}>
        <span className="w-5 h-5 rounded border-2 border-current flex items-center justify-center text-xs">{form.betaTester ? "✓" : ""}</span>
        Yes! Register for {isBusiness ? "Business" : ""} Beta Access
      </button>
      <Field label="Anything else we should know?">
        <textarea className={`${input} resize-none h-20`} value={form.additionalComments} onChange={(e) => set("additionalComments", e.target.value)} placeholder="Ideas, specific needs, etc." />
      </Field>
    </div>,
  ];

  const totalSteps = steps.length;

  const canNext = () => {
    if (step === 0) return form.email.includes("@") && form.email.includes(".");
    if (step === 1) return !!form.followerCount;
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
