"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditAutomation } from "@/hooks/use-automation";
import { useQueryAutomations } from "@/hooks/user-queries";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Instagram,
  MessageCircle,
  PencilIcon,
  Zap,
} from "lucide-react";
import React from "react";
import Keywords from "../bread-crumb/automations/trigger/keywords";
import AIBusinessForm from "./ai-business-form";
import { toast } from "sonner";
import { saveListener } from "@/actions/automation";

type Props = {
  id: string;
};

const AutomationSummary = ({ id }: Props) => {
  const { data } = useQueryAutomations(id);
  const {
    edit,
    enableEdit,
    inputRef,
    isPending: namePending,
  } = useEditAutomation(id);

  if (!data?.data) return null;

  const {
    name,
    active,
    trigger,
    listener,
    keywords: existingKeywords,
    posts,
  } = data.data;

  return (
    <div className="hidden lg:flex flex-col w-[380px] sticky top-20 h-fit bg-[#0c0d18] rounded-2xl p-6 border border-white/[0.06] gap-y-6 shadow-2xl">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          {edit ? (
            <Input
              ref={inputRef}
              defaultValue={name}
              className="bg-transparent h-auto outline-none text-xl font-bold border-b border-white/20 p-0 rounded-none focus-visible:ring-0"
            />
          ) : (
            <h3 className="text-xl font-bold truncate pr-4 text-gradient">
              {name}
            </h3>
          )}
          {!edit && (
            <Button
              onClick={enableEdit}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/5"
            >
              <PencilIcon size={14} className="text-[#9D9D9D]" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              active ? "bg-green-500" : "bg-red-500"
            )}
          />
          <p className="text-sm font-medium">
            {active ? "Active & Running" : "Inactive / Pending"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-y-5">
        {/* Trigger Keywords - Interactive */}
        <div className="flex flex-col gap-y-3 bg-[#0a0b14] p-4 rounded-xl border border-white/[0.04] shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 text-[#6c2bd9]">
              <MessageCircle size={18} />
              <p className="font-semibold text-sm">Quick Keywords</p>
            </div>
            {existingKeywords.length === 0 && (
              <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full animate-bounce">
                Required
              </span>
            )}
          </div>

          <div className="mt-1">
            <Keywords id={id} />
          </div>
        </div>

        {/* Action Quick Access */}
        <div className="flex flex-col gap-y-3 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 text-orange-400">
              <CheckCircle size={18} />
              <p className="font-medium text-sm">Response Action</p>
            </div>
            <Button
              variant="link"
              className="text-[10px] text-[#4a7dff] h-fit p-0"
            >
              Settings
            </Button>
          </div>
          <div className="">
            {listener ? (
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-1">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Private Message</p>
                  <div className="bg-[#111111]/50 p-3 rounded-lg border-l-2 border-orange-400/50">
                    <p className="text-xs text-[#9D9D9D] leading-relaxed line-clamp-3 italic">
                      &quot;{listener.prompt}&quot;
                    </p>
                  </div>
                </div>

                {trigger.some(t => t.type === "COMMENT") && listener.commentReply && (
                  <div className="flex flex-col gap-y-1">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Public Reply</p>
                    <div className="bg-[#111111]/50 p-3 rounded-lg border-l-2 border-[#4a7dff]/50">
                      <p className="text-xs text-[#9D9D9D] leading-relaxed line-clamp-3 italic">
                        &quot;{listener.commentReply}&quot;
                      </p>
                    </div>
                  </div>
                )}
                
                <p className="text-[9px] text-orange-400/70 font-bold uppercase tracking-widest mt-1">
                  {listener.listener} MODE
                </p>
              </div>
            ) : (
              <div className="p-3 bg-orange-400/5 border border-dashed border-orange-400/20 rounded-lg">
                <p className="text-[10px] text-orange-400/60 text-center">
                  No action defined yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Triggers Quick Access */}
        <div className="flex flex-col gap-y-3 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 text-[#4a7dff]">
              <Zap size={18} />
              <p className="font-medium text-sm">Active Triggers</p>
            </div>
            <Button
              variant="link"
              className="text-[10px] text-[#4a7dff] h-fit p-0"
            >
              Modify
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pl-6">
            {trigger.length > 0 ? (
              trigger.map((t) => (
                <span
                  key={t.id}
                  className="text-[10px] bg-[#4a7dff]/10 border border-[#4a7dff]/20 px-2.5 py-1 rounded-md text-[#4a7dff] font-bold uppercase tracking-wider"
                >
                  {t.type === "DM" ? "Direct Message" : "Comment"}
                </span>
              ))
            ) : (
              <p className="text-[10px] text-[#9D9D9D] italic">
                Select a trigger type...
              </p>
            )}
          </div>
        </div>

        {/* Posts Quick Access - Only show if not DM only trigger */}
        {(trigger.length === 0 || trigger.some((t) => t.type === "COMMENT")) && (
          <div className="flex flex-col gap-y-3 px-1 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2 text-pink-400">
                <Instagram size={18} />
                <p className="font-medium text-sm">Target Posts</p>
              </div>
              <Button
                variant="link"
                className="text-[10px] text-[#4a7dff] h-fit p-0"
              >
                Attach
              </Button>
            </div>

            {posts.length > 0 ? (
              <div className="flex gap-2 flex-wrap pl-6">
                {posts.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 shadow-lg"
                  >
                    {p.mediaType === "VIDEO" ? (
                      <video
                        src={p.media}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={p.media}
                        className="w-full h-full object-cover"
                        alt="post"
                      />
                    )}
                  </div>
                ))}
                {posts.length > 5 && (
                  <div className="w-10 h-10 flex items-center justify-center bg-[#111111] rounded-lg text-[10px] font-bold text-[#9D9D9D] border border-white/10">
                    +{posts.length - 5}
                  </div>
                )}
              </div>
            ) : (
              <div className="pl-6 pt-1">
                <div className="w-full py-4 border border-dashed border-pink-400/20 rounded-xl bg-pink-400/5 flex items-center justify-center">
                  <p className="text-[10px] text-pink-400/60 uppercase font-bold tracking-tighter">
                    No Media Selected
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-y-4">
        {listener?.listener === "SMARTAI" && (
          <AIBusinessForm 
            onSuccess={async (prompt) => {
              const res = await saveListener(id, "SMARTAI", prompt);
              if (res.status === 200) {
                toast.success("AI Brain Updated!");
                // Manually invalidate since we're not using the mutation hook here
                window.location.reload(); // Quick fix or use a proper mutation
              } else {
                toast.error("Failed to update AI Brain");
              }
            }} 
          />
        )}
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#9D9D9D]">Engine Version:</span>
          <span className="text-white/40 font-mono italic">ZeroPilot v2.0-stable</span>
        </div>
      </div>
    </div>
  );
};

export default AutomationSummary;
