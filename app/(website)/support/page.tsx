"use client";

import React from "react";
import { 
  Mail, 
  MessageCircle, 
  HelpCircle, 
  FileText, 
  ArrowRight,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const faqs = [
    {
      q: "How many Instagram accounts can I connect?",
      a: "On the Free plan, you can connect 1 account. Pro and Ultra plans allow for multiple account management under a single dashboard."
    },
    {
      q: "Is it safe for my Instagram account?",
      a: "Yes. ZeroPilot uses the official Instagram Graph API via Facebook Login. We never ask for your password and we strictly follow Meta's platform policies."
    },
    {
      q: "What are 'Trigger Words'?",
      a: "Trigger words are specific keywords (like 'PRICE' or 'SHOP') that, when detected in a DM or comment, automatically fire off your pre-set response."
    },
    {
      q: "Can the AI handle customer complaints?",
      a: "Absolutely. Our Global AI Agent (Pro+) uses sentiment analysis to detect frustration and can be configured to escalate complex issues to a human or provide helpful alternatives."
    }
  ];

  return (
    <main className="bg-[#0a0b14] text-white min-h-screen pt-32 pb-20 font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#4a7dff]/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-y-6 mb-20">
          <div className="w-16 h-16 rounded-3xl bg-[#4a7dff]/10 flex items-center justify-center text-[#4a7dff] mb-4 shadow-xl shadow-[#4a7dff]/10 animate-pulse">
            <LifeBuoy size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Support <span className="text-[#4a7dff]">Center</span></h1>
          <p className="text-white/40 text-lg max-w-xl">
            Everything you need to get the most out of ZeroPilot. If you can&apos;t find what you&apos;re looking for, our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="p-8 rounded-[32px] border border-white/[0.06] bg-white/[0.02] hover:border-[#4a7dff]/30 transition-all group">
            <Mail className="text-[#4a7dff] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-white/30 text-sm mb-6">Average response time: 2-4 hours. Perfect for technical inquiries.</p>
            <a href="mailto:support@zeropilot.io" className="text-[#4a7dff] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              support@zeropilot.io <ArrowRight size={16} />
            </a>
          </div>
          <div className="p-8 rounded-[32px] border border-white/[0.06] bg-white/[0.02] hover:border-[#6c2bd9]/30 transition-all group">
            <MessageCircle className="text-[#6c2bd9] mb-4 group-hover:scale-110 transition-transform" size={28} />
            <h3 className="text-xl font-bold mb-2">Live Community</h3>
            <p className="text-white/30 text-sm mb-6">Join our Discord to chat with other creators and get live help.</p>
            <a href="#" className="text-[#6c2bd9] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
              Join Discord <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-y-10 mb-20">
          <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                <h4 className="text-white font-bold mb-2 flex items-center gap-3">
                  <HelpCircle size={18} className="text-[#4a7dff]" />
                  {faq.q}
                </h4>
                <p className="text-white/40 text-sm leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 rounded-[40px] bg-gradient-to-br from-[#4a7dff]/20 to-[#6c2bd9]/20 border border-white/10 text-center flex flex-col items-center gap-y-6">
           <h3 className="text-3xl font-black">Still have questions?</h3>
           <p className="text-white/60 text-sm max-w-sm">We&apos;re building the future of social selling and we&apos;d love to hear your feedback or feature requests.</p>
           <Button className="bg-white text-black font-bold px-10 rounded-full h-12 hover:bg-white/90">Contact Sales</Button>
        </div>
      </div>

      <footer className="mt-20 border-t border-white/5 py-10 text-center">
         <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors">Return to Home</Link>
      </footer>
    </main>
  );
}
