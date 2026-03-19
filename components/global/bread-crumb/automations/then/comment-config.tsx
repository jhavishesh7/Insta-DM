"use client";

import { saveCommentReply, saveFollowerCheck } from "@/actions/automation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutationData } from "@/hooks/use-mutation-data";
import { useQueryAutomations } from "@/hooks/user-queries";
import { Check, Plus, Trash, UserPlus, MessageSquare, Bot } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
};

const CommentReplyConfig = ({ id }: Props) => {
  const { data } = useQueryAutomations(id);
  const listener = data?.data?.listener;
  
  const [commentType, setCommentType] = useState<"SINGLE" | "MULTIPLE" | "AI">("SINGLE");
  const [singleReply, setSingleReply] = useState("");
  const [multipleReplies, setMultipleReplies] = useState<string[]>([]);
  const [newReply, setNewReply] = useState("");
  const [followerCheck, setFollowerCheck] = useState(false);
  const [unfollowedMsg, setUnfollowedMsg] = useState("");

  useEffect(() => {
    if (listener) {
      setCommentType((listener.commentReplyType as any) || "SINGLE");
      setSingleReply(listener.commentReply || "");
      setMultipleReplies(listener.multipleCommentReplies || []);
      setFollowerCheck(listener.followerCheckActive || false);
      setUnfollowedMsg(listener.unfollowedMessage || "");
    }
  }, [listener]);

  const { mutate: updateComment, isPending: updatingComment } = useMutationData(
    ["update-comment-reply"],
    (data: any) => saveCommentReply(id, data),
    "automation-info"
  );

  const { mutate: updateFollower, isPending: updatingFollower } = useMutationData(
    ["update-follower-check"],
    (data: any) => saveFollowerCheck(id, data.status, data.message),
    "automation-info"
  );

  const handleSaveComment = () => {
    updateComment({
      type: commentType,
      reply: singleReply,
      replies: multipleReplies,
    });
  };

  const handleUpdateFollower = (status: boolean) => {
    setFollowerCheck(status);
    updateFollower({ status, message: unfollowedMsg });
  };

  const addReply = () => {
    if (!newReply.trim()) return;
    setMultipleReplies([...multipleReplies, newReply.trim()]);
    setNewReply("");
  };

  const removeReply = (index: number) => {
    setMultipleReplies(multipleReplies.filter((_, i) => i !== index));
  };

  if (!data?.data?.trigger?.find(t => t.type === "COMMENT")) return null;

  return (
    <div className="flex flex-col gap-y-6 mt-10 p-5 rounded-xl bg-background-90 border border-white/5">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          Comment Automation Settings
        </h3>
        <p className="text-sm text-text-secondary">Configure how the bot replies to public comments.</p>
      </div>

      <div className="space-y-4">
        <Label className="text-white/70">Reply Method</Label>
        <Tabs value={commentType} onValueChange={(v: any) => setCommentType(v)} className="w-full">
          <TabsList className="bg-black/40 border border-white/5 w-full grid grid-cols-3">
            <TabsTrigger value="SINGLE" className="data-[state=active]:bg-blue-600">Single</TabsTrigger>
            <TabsTrigger value="MULTIPLE" className="data-[state=active]:bg-blue-600">Multiple</TabsTrigger>
            <TabsTrigger value="AI" className="data-[state=active]:bg-blue-600">Smart AI</TabsTrigger>
          </TabsList>

          <TabsContent value="SINGLE" className="mt-4 space-y-3">
            <Label className="text-xs">Public Reply Text</Label>
            <Input 
              placeholder="e.g. Check your DMs! 🚀" 
              value={singleReply}
              onChange={(e) => setSingleReply(e.target.value)}
              className="bg-black/20 border-white/10 text-white"
            />
          </TabsContent>

          <TabsContent value="MULTIPLE" className="mt-4 space-y-3">
            <Label className="text-xs">Randomized Replies</Label>
            <div className="flex gap-x-2">
              <Input 
                placeholder="Add a new reply option..." 
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
                onKeyDown={(e) => e.key === 'Enter' && addReply()}
              />
              <Button size="icon" onClick={addReply} variant="outline" className="border-white/10">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {multipleReplies.map((reply, i) => (
                <div key={i} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                  <span className="text-sm text-blue-100">{reply}</span>
                  <button onClick={() => removeReply(i)} className="text-blue-400 hover:text-red-400">
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="AI" className="mt-4">
             <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                <Bot className="w-5 h-5 text-blue-400 mt-1" />
                <div className="space-y-1">
                  <p className="text-sm text-blue-100 font-medium">Smart AI Replies Enabled</p>
                  <p className="text-xs text-blue-200/60 leading-relaxed">
                    Our AI will analyze the context of the user's comment and generate a unique, friendly public reply automatically.
                  </p>
                </div>
             </div>
          </TabsContent>
        </Tabs>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" 
          onClick={handleSaveComment}
          disabled={updatingComment}
        >
          {updatingComment ? "Saving..." : "Save Comment Settings"}
        </Button>
      </div>

      <div className="pt-6 border-t border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" />
              Follower-Only Automation
            </h4>
            <p className="text-xs text-text-secondary">Only send the main automation if they follow you.</p>
          </div>
          <Switch 
            checked={followerCheck} 
            onCheckedChange={handleUpdateFollower}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>

        {followerCheck && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-xs">Message for non-followers</Label>
            <Input 
              placeholder="e.g. Follow us to unlock this content! 😉" 
              value={unfollowedMsg}
              onChange={(e) => setUnfollowedMsg(e.target.value)}
              onBlur={() => handleUpdateFollower(true)}
              className="bg-black/20 border-white/10 text-white"
            />
            <p className="text-[10px] text-purple-400/60 italic">
              Note: If active, the bot will send this message instead of the main reply to non-followers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentReplyConfig;
