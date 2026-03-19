import { Spinner } from "@/components/global/loader/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-10 animate-in fade-in duration-500">
      <div className="flex gap-5 lg:flex-row flex-col">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-[140px] rounded-2xl bg-white/5 border border-white/5 animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] rounded-2xl bg-white/5 border border-white/5 animate-pulse relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
        <div className="h-[400px] rounded-2xl bg-white/5 border border-white/5 animate-pulse relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      <div className="h-[300px] rounded-2xl bg-white/5 border border-white/5 animate-pulse relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );
}
