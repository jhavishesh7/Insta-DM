"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useQueryAutomations } from "@/hooks/user-queries";
import { PlaneBlue, SmartAi, Warning } from "@/icons";
import { PencilIcon } from "lucide-react";
import PostButton from "../post";
import CommentReplyConfig from "./comment-config";
import ThenActions from "./then-actions";

type Props = {
  id: string;
};

function ThenNode({ id }: Props) {
  const { data } = useQueryAutomations(id);
  const [isEditing, setIsEditing] = useState(false);
  const commentTrigger = data?.data?.trigger?.find((t: any) => t.type === "COMMENT");

  if (!data?.data?.listener || isEditing) {
    return (
      <div className="flex flex-col gap-y-10 w-full items-center">
        {!data?.data?.listener ? (
           <></> // No listener yet, parent will show ThenActions or handled by empty state
        ) : (
           <div className="flex flex-col items-center gap-y-10 w-full">
            <div className="w-full lg:w-10/12 xl:w-6/12 relative">
                <div className="absolute h-20 left-1/2 bottom-full flex flex-col items-center z-50">
                    <span className="h-[9px] w-[9px] bg-connector/10 rounded-full" />
                    <Separator orientation="vertical" className="bottom-full flex-1 border-[1px] border-connector/10" />
                    <span className="h-[9px] w-[9px] bg-connector/10 rounded-full" />
                </div>
                <div className="flex justify-end mb-2">
                    <button onClick={() => setIsEditing(false)} className="text-[#4a7dff] text-sm hover:underline">
                        Cancel Edit
                    </button>
                </div>
                <ThenActions id={id} onSuccess={() => setIsEditing(false)} />
             </div>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10 w-full items-center">
      <div className="group w-full lg:w-10/12 relative xl:w-6/12 p-5 rounded-xl flex flex-col bg-[#1D1D1D] gap-y-3 border-[1px] border-white/5">
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg text-[#4a7dff]"
        >
          <PencilIcon size={16} />
        </button>
        <div className="absolute h-20 left-1/2 bottom-full flex flex-col items-center z-50">
          <span className="h-[9px] w-[9px] bg-connector/10 rounded-full" />
          <Separator
            orientation="vertical"
            className="bottom-full flex-1 border-[1px] border-connector/10"
          />
          <span className="h-[9px] w-[9px] bg-connector/10 rounded-full" />
        </div>
        <div className="flex gap-x-2">
          <Warning />
          Then...
        </div>
        <div className="bg-background-80 p-5 rounded-xl flex flex-col gap-y-2">
          <div className="flex gap-x-2 items-center">
            {data.data.listener.listener === "MESSAGE" ? (
              <PlaneBlue />
            ) : (
              <SmartAi />
            )}
            <p className="text-xl font-medium">
              {data.data.listener.listener === "MESSAGE"
                ? "Send The User Message"
                : "Let Smart AI Take Over"}
            </p>
          </div>
          <p className="font-light text-text-secondary">
            {data.data.listener.prompt}
          </p>
        </div>
        {data.data.posts.length > 0 ? (
          <></>
        ) : commentTrigger ? (
          <PostButton id={id} />
        ) : (
          <></>
        )}
      </div>

      {/* Comment Interaction Logic Settings - Only show if comment trigger exists */}
      {commentTrigger && (
        <div className="w-full lg:w-10/12 xl:w-6/12">
          <CommentReplyConfig id={id} />
        </div>
      )}
    </div>
  );
}

export default ThenNode;
