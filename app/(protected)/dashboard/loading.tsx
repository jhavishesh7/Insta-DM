import { Spinner } from "@/components/global/loader/spinner";
import React from "react";

type Props = {};

function Loading({}: Props) {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-y-4 bg-[#050505]">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl bg-[#4a7dff]/20 rounded-full animate-pulse" />
        <Spinner size="lg" />
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <h2 className="text-white font-medium tracking-tight">ZeroPilot is Syncing</h2>
        <p className="text-white/30 text-xs animate-pulse">Initializing your automations...</p>
      </div>
    </div>
  );
}

export default Loading;

