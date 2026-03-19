"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function TermsPage() {
  const terms = [
    {
      title: "1. Service Access",
      desc: "ZeroPilot provides a suite of tools for Instagram automation. By connecting your account, you authorize ZeroPilot to act on your behalf via official Facebook API endpoints."
    },
    {
      title: "2. Usage Limitations",
      desc: "You may not use ZeroPilot to send spam, harrass, or participate in any illegal activities. Violation will result in immediate termination of service."
    },
    {
      title: "3. Payments and Tiers",
      desc: "Subscription fees are charged based on the selected tier (Free, Pro, Ultra). Features like the AI Super Agent and Chat Commerce are only available in specified plans."
    },
    {
      title: "4. Modification of Service",
      desc: "We reserve the right to modify or discontinue features based on changes to the Meta Developers API or for other strategic reasons. You'll be notified of any significant changes."
    }
  ];

  return (
    <main className="bg-[#0a0b14] text-white min-h-screen py-32 px-6 font-sans">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6c2bd9]/5 blur-[150px] pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 text-sm hover:text-white transition-colors mb-12">
           <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex flex-col gap-y-6 mb-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#6c2bd9]/10 flex items-center justify-center text-[#6c2bd9] mb-4 mx-auto shadow-xl shadow-[#6c2bd9]/10">
            <FileText size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Terms of <span className="text-[#6c2bd9]">Service</span></h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Please read these terms carefully before starting your first automation journey with ZeroPilot.
          </p>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">Effective Date: March 20, 2026</p>
        </div>

        <div className="grid gap-8 mb-20">
          {terms.map((term, i) => (
            <div key={i} className="p-10 rounded-[40px] border border-white/[0.06] bg-white/[0.02] hover:bg-[#6c2bd9]/5 hover:border-[#6c2bd9]/30 transition-all">
               <h3 className="text-xl font-bold mb-3">{term.title}</h3>
               <p className="text-white/40 leading-relaxed text-sm">{term.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-10 rounded-[50px] border border-[#6c2bd9]/40 bg-gradient-to-b from-[#6c2bd9]/10 to-transparent flex flex-col gap-6 items-center text-center">
           <AlertCircle className="text-[#6c2bd9] animate-pulse" size={40} />
           <h3 className="text-3xl font-black">Our Responsibility</h3>
           <p className="text-white/60 text-sm max-w-xl">
             While ZeroPilot integrates with official APIs, we are not responsible for account suspensions caused by inappropriate user configuration or violation of Meta's Community Standards. Always monitor your bot's behavior through our analytics logs.
           </p>
        </div>
      </div>
    </main>
  );
}
