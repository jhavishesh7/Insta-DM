"use client";

import { generateAIPrompt } from "@/actions/automation";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/global/loader";
import { Sparkles } from "lucide-react";

type Props = {
  onSuccess: (prompt: string) => void;
};

const AIBusinessForm = ({ onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    niche: "",
    audience: "",
    tone: "",
    goals: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      generateAIPrompt(
        formData.name,
        formData.niche,
        formData.audience,
        formData.tone,
        formData.goals
      ),
    onSuccess: (res) => {
      if (res.status === 200 && res.data) {
        onSuccess(res.data);
        toast.success("AI Brain Generated Successfully!");
      } else {
        toast.error("Failed to generate AI Brain.");
      }
    },
  });

  return (
    <div className="flex flex-col gap-y-4 p-4 bg-[#0c0d18] rounded-xl border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-x-2">
        <Sparkles className="text-[#4a7dff] w-5 h-5" />
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a7dff] to-[#6c2bd9] bg-clip-text text-transparent">ZeroPilot Engine</h2>
      </div>
      <p className="text-xs text-white/40 leading-relaxed italic">
        Configure your AI identity once and let ZeroPilot handle your brand voice across all Instagram interactions.
      </p>

      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-1">
          <Label>Business Name</Label>
          <Input
            placeholder="e.g. Neon Kings"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-[#0a0b14] border-white/10 text-xs py-1.5 focus-visible:ring-[#4a7dff]/50"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Niche</Label>
          <Input
            placeholder="e.g. E-commerce Signage"
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            className="bg-[#0a0b14] border-white/10 text-xs py-1.5 focus-visible:ring-[#4a7dff]/50"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Target Audience</Label>
          <Input
            placeholder="e.g. Small business owners"
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            className="bg-[#0a0b14] border-white/10 text-xs py-1.5 focus-visible:ring-[#4a7dff]/50"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Tone of Voice</Label>
          <Input
            placeholder="e.g. Professional yet edgy"
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            className="bg-[#0a0b14] border-white/10 text-xs py-1.5 focus-visible:ring-[#4a7dff]/50"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Key Goals</Label>
          <Textarea
            placeholder="e.g. Answer customer questions and drive to website"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            className="bg-[#0a0b14] border-white/10 text-xs py-1.5 focus-visible:ring-[#4a7dff]/50"
          />
        </div>
      </div>

      <Button
        onClick={() => mutate()}
        disabled={isPending}
        className="w-full bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] mt-2 font-bold hover:scale-105 transition-all duration-300"
      >
        <Loader state={isPending}>
          <div className="flex items-center gap-x-2">
            <Sparkles className="w-4 h-4" />
            Generate ZeroPilot Brain
          </div>
        </Loader>
      </Button>
    </div>
  );
};

export default AIBusinessForm;
