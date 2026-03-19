"use client";

import React from "react";
import { 
  MessageCircle, 
  Search, 
  UserPlus, 
  ArrowRight, 
  CreditCard, 
  CheckCircle2 
} from "lucide-react";

export const CRMFlowChart = () => {
  const steps = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Inquiry",
      desc: "Client DMs you on Instagram",
      color: "#4a7dff"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "AI Analysis",
      desc: "Agent reads intent & sentiment",
      color: "#6c2bd9"
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: "CRM Sync",
      desc: "Profile saved automatically",
      color: "#4a7dff"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Invoicing",
      desc: "Generate & send links in DM",
      color: "#6c2bd9"
    }
  ];

  return (
    <div className="mt-12 bg-[#0c0d18] p-10 rounded-[40px] border border-white/[0.06] shadow-2xl overflow-hidden relative group">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#4a7dff]/5 rounded-full blur-3xl group-hover:bg-[#4a7dff]/10 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#6c2bd9]/5 rounded-full blur-3xl group-hover:bg-[#6c2bd9]/10 transition-all duration-700" />

      <div className="relative z-10 flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
             <span className="px-4 py-1.5 bg-[#4a7dff]/10 text-[#4a7dff] text-[10px] font-bold rounded-full uppercase tracking-widest border border-[#4a7dff]/20 shadow-[0_0_15px_rgba(74,125,255,0.1)]">Development Preview</span>
          </div>
          <h2 className="text-3xl font-black text-white">The Future of Instagram Sales</h2>
          <p className="text-white/40 text-sm max-w-xl">
            A complete commerce engine inside your DMs. No more jumping between apps to close deals.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="col-span-1 flex flex-col items-center justify-center text-center gap-y-4 p-4 aspect-square bg-white/[0.02] rounded-[32px] border border-white/[0.03] hover:border-[#4a7dff]/20 transition-all duration-500 hover:translate-y-[-8px] group/item shadow-lg">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-white font-bold text-[13px] tracking-tight">{step.title}</span>
                    <p className="text-[10px] text-white/30 leading-tight font-medium px-2">{step.desc}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex justify-center text-white/10 col-span-1">
                    <ArrowRight className="w-8 h-8 opacity-20" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-x-4 p-5 bg-[#4a7dff]/5 rounded-2xl border border-[#4a7dff]/10">
           <div className="w-10 h-10 rounded-xl bg-[#4a7dff]/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#4a7dff]" />
           </div>
           <div className="flex flex-col gap-y-1">
              <span className="text-white font-bold text-xs">Closing Velocity Engine</span>
              <p className="text-[10px] text-white/50">Automated lead qualification and one-tap invoicing will decrease your closing time by 70%.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
