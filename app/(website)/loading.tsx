import { Spinner } from "@/components/global/loader/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#0a0b14]">
      <Spinner size="lg" />
    </div>
  );
}
