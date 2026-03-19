"use client";

import React from "react";
import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  ArrowLeft,
  Search,
  Globe,
  Database,
  UserCheck
} from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Lock className="text-[#4a7dff]" size={20} />,
      title: "Data Protection",
      desc: "All authentication tokens are encrypted using AES-256 and never shared with anyone. Your Instagram login happens directly on Meta's official servers."
    },
    {
      icon: <Eye className="text-[#6c2bd9]" size={20} />,
      title: "Monitoring Policy",
      desc: "We only access message and comment data that you authorize through the API connection. We DO NOT store private message content longer than 30 days unless specified by logs."
    },
    {
      icon: <Database className="text-[#4a7dff]" size={20} />,
      title: "Third-Party Storage",
      desc: "Your data is stored securely in compliant cloud infrastructure. We will never sell your follower data or business performance metrics to any third party."
    },
    {
      icon: <Globe className="text-[#6c2bd9]" size={20} />,
      title: "Transparency",
      desc: "We are committed to clear communication about how we use your information. If our policy changes, you will be notified immediately through the dashboard."
    }
  ];

  return (
    <main className="bg-[#05060d] text-white min-h-screen py-32 px-6 font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4a7dff]/5 blur-[200px] pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/30 text-sm hover:text-white transition-colors mb-12">
           <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex flex-col gap-y-6 mb-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#4a7dff]/10 flex items-center justify-center text-[#4a7dff] mb-4 mx-auto shadow-xl shadow-[#4a7dff]/5">
            <Shield size={32} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Privacy <span className="text-[#4a7dff]">Policy</span></h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Your trust is our most valuable asset. Learn how ZeroPilot protects your data and your Instagram account.
          </p>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">Last Updated: March 20, 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, i) => (
            <div key={i} className="p-10 rounded-[40px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
               <div className="mb-6">{section.icon}</div>
               <h3 className="text-xl font-bold mb-3">{section.title}</h3>
               <p className="text-white/40 leading-relaxed text-sm">{section.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#0a0b14] p-12 rounded-[50px] border border-white/[0.06] flex flex-col gap-y-8">
           <h2 className="text-3xl font-black tracking-tight">Full Compliance Summary</h2>
           {[
             { title: "Meta Business Partner Guidelines", text: "We strictly adhere to all Meta Developer Policies. We never use unauthorized scraping or bot-methods that could risk your account shadow-banning or suspension." },
             { title: "User Control", text: "You have the absolute right to delete all your data and disconnect your Instagram account at any time through the dashboard settings." },
             { title: "Automated Decision Making", text: "Our AI (Gemini 2.0 Flash) is a support tool. We recommend regular monitoring of logs to ensure it matches your brand's ethical standards." }
           ].map((item, i) => (
             <div key={i} className="flex flex-col gap-y-2 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                <h4 className="flex items-center gap-2 font-bold text-lg"><UserCheck size={18} className="text-[#4a7dff]" /> {item.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center text-white/20 text-xs">
           <p>© 2026 ZeroPilot. Powered by ethical AI development.</p>
        </footer>
      </div>
    </main>
  );
}
