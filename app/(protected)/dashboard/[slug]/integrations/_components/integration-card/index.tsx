"use client";

import { onOathInstagram } from "@/actions/integration";
import { onUserInfo } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useQueryAutomationPosts } from "@/hooks/user-queries";
import { InstagramPostProps } from "@/types/types";
import Image from "next/image";
import React from "react";
import { CRMFlowChart } from "../crm-flow-chart";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  strategy: "INSTAGRAM" | "CRM";
};

function IntegrationCard({ title, description, icon, strategy }: Props) {
  const onInstOAuth = () => onOathInstagram(strategy);

  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: onUserInfo,
  });

  const { data: posts } = useQueryAutomationPosts();

  const integrated = data?.data?.integrations?.find((i: any) => i.name === strategy);

  return (
    <div className="flex flex-col gap-y-5 group transition-all">
      <div className="bg-[#0c0d18]/60 backdrop-blur-xl border border-white/[0.08] hover:border-[#4a7dff]/30 rounded-2xl gap-x-5 p-7 flex items-center justify-between transition-all shadow-xl hover:shadow-[#4a7dff]/5">
        <div className="bg-[#4a7dff]/10 p-4 rounded-2xl group-hover:bg-[#4a7dff]/15 transition-colors">
          {icon}
        </div>
        <div className="flex flex-col flex-1 pl-2">
          <h3 className="text-2xl font-semibold text-white tracking-tight"> {title}</h3>
          <p className="text-[#9D9D9D] text-sm mt-1 max-w-[400px] leading-relaxed">{description}</p>
        </div>
        {strategy === "CRM" ? (
          <div className="flex flex-col items-center gap-y-2">
            <div className="px-5 py-2.5 bg-[#4a7dff]/10 text-[#4a7dff] text-xs font-bold rounded-full uppercase tracking-widest border border-[#4a7dff]/20 shadow-lg shadow-[#4a7dff]/5 animate-pulse">
              Coming Soon
            </div>
          </div>
        ) : (
          <Button
            onClick={onInstOAuth}
            disabled={integrated?.name === strategy}
            className="px-8 py-6 bg-gradient-to-br text-white rounded-xl text-md from-[#4a7dff] font-bold to-[#6c2bd9] hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#4a7dff]/20 border border-white/10"
          >
            {integrated ? "Connected" : "Connect"}
          </Button>
        )}
      </div>
      {strategy === "CRM" && <CRMFlowChart />}
      {integrated && strategy === "INSTAGRAM" && posts?.status === 200 && (
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Recent Posts</h3>
            <p className="text-text-secondary text-sm">Successfully connected to Meta</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {posts.data.data.map((post: InstagramPostProps) => (
              <div
                key={post.id}
                className="relative w-[150px] aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5"
              >
                {post.media_type === "VIDEO" ? (
                  <video
                    src={post.media_url}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <Image
                    fill
                    sizes="150px"
                    src={post.media_url}
                    alt="IG post"
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IntegrationCard;
