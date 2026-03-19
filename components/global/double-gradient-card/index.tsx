import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

type Props = {
  label: string;
  subLabel: string;
  description: string;
};

function DoubleGradientCard({ description, label, subLabel }: Props) {
  return (
    <div className="relative border border-white/[0.08] p-7 rounded-2xl flex flex-col gap-y-16 overflow-hidden bg-[#0c0d18]/40 backdrop-blur-3xl group hover:border-[#4a7dff]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(74,125,255,0.05)]">
      <div className="flex flex-col z-40">
        <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-[#4a7dff] transition-colors">{label}</h2>
        <p className="text-white/40 text-xs mt-1 font-medium">{subLabel}</p>
      </div>
      <div className="flex justify-between items-center z-40 gap-x-10 mt-auto">
        <p className="text-[#9D9D9D] text-xs leading-relaxed max-w-[200px]">{description}</p>
        <Button className="rounded-full bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] w-12 h-12 shadow-xl shadow-[#4a7dff]/20 group-hover:scale-110 active:scale-95 transition-all flex-shrink-0 border border-white/10">
          <ArrowRight color="white" size={20} />
        </Button>
      </div>
      <div className="w-full h-full absolute radial--gradient--premium top-0 left-0 z-10 opacity-40 group-hover:opacity-60 transition-opacity" />
    </div>
  );
}

export default DoubleGradientCard;
