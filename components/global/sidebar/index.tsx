"use client";

import { Separator } from "@/components/ui/separator";
import { usePath } from "@/hooks/user-nav";
import { HelpDuoToneWhite } from "@/icons";
import { LogoSmall } from "@/svgs/logo-small";
import React from "react";
import ClerkAuthState from "../clerk-auth-state";
import SubscriptionPlan from "../subscription-plan";
import Items from "./items";
import UpgradeCard from "./upgrade";

type Props = {
  slug: string;
};

function Sidebar({ slug }: Props) {
  const { page } = usePath();

  return (
    <div className="w-[250px] border-r border-white/[0.06] fixed left-0 lg:inline-block bg-[#05060b] hidden bottom-0 top-0 overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a7dff]/[0.1] via-transparent to-transparent pointer-events-none" />
      <div className="flex flex-col gap-y-5 w-full h-full p-6 relative z-10 backdrop-blur-3xl">
        <div className="flex px-1 mb-10">
          <LogoSmall />
        </div>
        <div className="flex flex-col py-3">
          <Items page={page} slug={slug} />
        </div>
        <div className="px-16">
          <Separator orientation="horizontal" className="bg-white/[0.06]" />
        </div>
        <div className="px-3 flex flex-col gap-y-5">
          <div className="flex gap-x-2 items-center">
            <ClerkAuthState />
            <p className="text-white/40 text-sm font-medium">Profile</p>
          </div>
          <div className="flex gap-x-3 items-center">
            <HelpDuoToneWhite />
            <p className="text-white/40 text-sm font-medium">Help</p>
          </div>
        </div>
        <SubscriptionPlan type="FREE">
          <div className="flex-1 flex flex-col justify-end">
            <UpgradeCard />
          </div>
        </SubscriptionPlan>
      </div>
    </div>

    // 02.03
  );
}

export default Sidebar;
