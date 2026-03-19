"use client";

import React, { useEffect, useState } from "react";
import { getPersonalAssistant, updatePersonalAssistant } from "@/actions/agent";
import { useUser } from "@clerk/nextjs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SmartAi } from "@/icons";

type Props = {};

function AgentConfig({}: Props) {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAgent();
    }
  }, [user]);

  const fetchAgent = async () => {
    const res = (await getPersonalAssistant(user?.id!)) as any;
    if (res?.personalAssistant) {
      setPrompt(res.personalAssistant.prompt);
      setActive(res.personalAssistant.active);
    }
    setLoading(false);
  };

  const onSave = async () => {
    setSaving(true);
    const res = await updatePersonalAssistant(user?.id!, prompt, active);
    if (res.status === 200) {
      toast.success("Agent updated successfully");
    } else {
      toast.error("Failed to update agent");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#4a7dff]" /></div>;

  return (
    <div className="flex flex-col gap-y-10 max-w-4xl">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4a7dff]/10 flex items-center justify-center text-[#4a7dff]">
            <SmartAi />
          </div>
          Global AI Agent
        </h2>
        <p className="text-white/40 text-sm">Configure your global account assistant. This agent will handle all messages that don&apos;t match a specific keyword automation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0c0d18] p-8 rounded-3xl border border-white/[0.06] flex flex-col gap-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <span className="text-lg font-semibold text-white">Agent Status</span>
              <p className="text-xs text-white/30">Turn on to enable global account intelligence</p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <div className="bg-[#0c0d18] p-8 rounded-3xl border border-white/[0.06] flex flex-col gap-y-6 shadow-2xl col-span-1 md:col-span-2">
          <div className="flex flex-col gap-y-2">
            <span className="text-lg font-semibold text-white">Agent Instructions</span>
            <p className="text-xs text-white/30">Deeply define how your AI should behave, its personality, and sentiment handling rules.</p>
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: You are a friendly shop assistant for King of Neon. Always be helpful, detect if user is frustrated and escalate to human if needed..."
            className="min-h-[250px] bg-white/[0.03] border-white/10 text-white rounded-2xl focus:border-[#4a7dff]/50 transition-all text-sm leading-relaxed"
          />
          <div className="flex justify-end pt-4">
            <Button 
                onClick={onSave} 
                disabled={saving}
                className="bg-[#4a7dff] hover:bg-[#4a7dff]/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-[#4a7dff]/20 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin mr-2" /> : null}
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentConfig;
