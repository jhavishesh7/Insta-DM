import { useEffect } from "react";
import Loader from "@/components/global/loader";
import SubscriptionPlan from "@/components/global/subscription-plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AUTOMATION_LISTENERS } from "@/constants/automation";
import { useListener } from "@/hooks/use-automation";
import { useQueryAutomations } from "@/hooks/user-queries";
import { cn } from "@/lib/utils";
import { Plus, Trash, StopCircle, ListFilter, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import TriggerButton from "../trigger-button";

type Props = {
  id: string;
  onSuccess?: () => void;
};

function ThenActions({ id, onSuccess }: Props) {
  const {
    onSetListener,
    onFormSubmit,
    register,
    isPending,
    listener: Listener,
    watch,
    setValue,
    reset
  } = useListener(id, onSuccess);
  
  const { data } = useQueryAutomations(id);
  const commentTrigger = data?.data?.trigger?.find((t: any) => t.type === "COMMENT");
  
  const ctas = watch("ctas") || [];
  const isEndBlock = watch("isEndBlock") || false;
  const ctasActive = watch("ctasActive") || false;

  useEffect(() => {
    if (data?.data?.listener) {
      const l = data.data.listener as any;
      onSetListener(l.listener);
      setValue("prompt", l.prompt);
      setValue("reply", l.commentReply || "");
      setValue("ctas", l.ctas || []);
      setValue("isEndBlock", l.isEndBlock || false);
      setValue("ctasActive", l.ctasActive || false);
    }
  }, [data?.data?.listener, setValue]);

  const onSelectListener = (type: "MESSAGE" | "SMARTAI") => {
    onSetListener(type);
    if(type !== (data?.data?.listener as any)?.listener) {
        reset();
    }
  };

  const addCta = () => {
    if (commentTrigger) {
        if (ctas.length >= 1) return;
        setValue("ctas", [{ title: "View Link", url: "https://", type: "web_url" }]);
    } else {
        if (ctas.length >= 3) return;
        setValue("ctas", [...ctas, { title: "New Button", payload: "KEYWORD", url: "https://", type: "postback" }]);
    }
  };

  const removeCta = (index: number) => {
    setValue("ctas", ctas.filter((_: any, i: number) => i !== index));
  };

  const updateCta = (index: number, key: string, value: string) => {
    const newCtas = [...ctas];
    newCtas[index] = { ...newCtas[index], [key]: value };
    // Force web_url for comment triggers
    if (commentTrigger) {
        newCtas[index].type = 'web_url';
    }
    setValue("ctas", newCtas);
  };

  return (
    <TriggerButton label="Then">
      <div className="flex flex-col gap-y-2">
        {AUTOMATION_LISTENERS.map((listener) =>
          listener.type === "SMARTAI" ? (
            <SubscriptionPlan key={listener.id} type="PRO">
              <div
                onClick={() => onSelectListener(listener.type)}
                className={cn(
                  Listener === listener.type
                    ? "bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9]"
                    : "bg-background-80",
                  "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100"
                )}
              >
                <div className="flex gap-x-2 items-center">
                  {listener.icon}
                  <p>{listener.label}</p>
                </div>
                <p className="text-xs text-white/60">{listener.description}</p>
              </div>
            </SubscriptionPlan>
          ) : (
            <div
              onClick={() => onSelectListener(listener.type)}
              key={listener.id}
              className={cn(
                Listener === listener.type
                  ? "bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9]"
                  : "bg-background-80",
                "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100"
              )}
            >
              <div className="flex gap-x-2 items-center">
                {listener.icon}
                <p>{listener.label}</p>
              </div>
              <p className="text-xs text-white/60">{listener.description}</p>
            </div>
          )
        )}
      </div>
      
      <form onSubmit={onFormSubmit} className="flex flex-col gap-y-4 mt-4">
        {Listener === "MESSAGE" && (
            <div className="space-y-4 pt-1">
                <Label className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Message Style</Label>
                <Tabs value={ctasActive ? "CTA" : "TEXT"} onValueChange={(v) => setValue("ctasActive", v === "CTA")} className="w-full">
                    <TabsList className="bg-black/40 border border-white/5 w-full grid grid-cols-2 h-9 p-1">
                        <TabsTrigger value="TEXT" className="text-xs data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Standard Text</TabsTrigger>
                        <TabsTrigger value="CTA" className="text-xs data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Interactive {commentTrigger ? 'Link' : 'CTAs'}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        )}

        <div className="space-y-2">
            <Label className="text-[10px] uppercase text-white/40 font-bold tracking-widest">
                {ctasActive ? (commentTrigger ? "Card Description" : "Card Body Text") : "Main message content"}
            </Label>
            <Textarea
                placeholder={
                    Listener === "SMARTAI"
                    ? "Add a prompt that your smart ai can use..."
                    : "Add the message you want to send..."
                }
                {...register("prompt")}
                className="bg-background-80 outline-none border-none ring-0 focus:ring-1 focus:ring-blue-500/50 min-h-[100px]"
            />
        </div>

        {Listener === "MESSAGE" && ctasActive && (
            <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <ListFilter className="w-4 h-4 text-blue-400" />
                        {commentTrigger ? 'Link Button' : `CTA Buttons (Max 3)`}
                    </Label>
                    {!commentTrigger || ctas.length === 0 ? (
                        <Button type="button" size="sm" variant="outline" onClick={addCta} disabled={commentTrigger ? ctas.length >= 1 : ctas.length >= 3} className="h-7 border-white/10 hover:bg-white/5">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    ) : null}
                </div>
                
                <div className="space-y-6">
                    {ctas.map((cta: any, i: number) => (
                        <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-black/40 border border-white/5 animate-in slide-in-from-right-2 duration-200">
                             <div className="flex items-center justify-between gap-4">
                                <Input 
                                    placeholder="Button Label (e.g. Visit Blog)" 
                                    value={cta.title}
                                    onChange={(e) => updateCta(i, 'title', e.target.value)}
                                    className="h-8 text-xs bg-background-90 border-transparent focus:border-white/10"
                                />
                                <button type="button" onClick={() => removeCta(i)} className="text-white/20 hover:text-red-400 shrink-0">
                                    <Trash className="w-4 h-4" />
                                </button>
                             </div>

                             {!commentTrigger && (
                                <div className="flex rounded-lg overflow-hidden border border-white/5 h-7">
                                    <button
                                        type="button"
                                        onClick={() => updateCta(i, 'type', 'postback')}
                                        className={cn("flex-1 text-[10px] flex items-center justify-center gap-2 transition-all", cta.type === 'postback' ? 'bg-blue-600 text-white' : 'bg-black/20 text-white/40')}
                                    >
                                        <MessageCircle className="w-3 h-3" /> Keyword
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateCta(i, 'type', 'web_url')}
                                        className={cn("flex-1 text-[10px] flex items-center justify-center gap-2 transition-all", cta.type === 'web_url' ? 'bg-blue-600 text-white' : 'bg-black/20 text-white/40')}
                                    >
                                        <ExternalLink className="w-3 h-3" /> Website Link
                                    </button>
                                </div>
                             )}

                             {commentTrigger || cta.type === 'web_url' ? (
                                <Input 
                                    placeholder="URL (e.g. https://yourwebsite.com)" 
                                    value={cta.url}
                                    onChange={(e) => updateCta(i, 'url', e.target.value)}
                                    className="h-8 text-xs bg-background-90 border-transparent focus:border-white/10"
                                />
                             ) : (
                                <Input 
                                    placeholder="Keyword Payload (e.g. GET_INFO)" 
                                    value={cta.payload}
                                    onChange={(e) => updateCta(i, 'payload', e.target.value)}
                                    className="h-8 text-xs bg-background-90 border-transparent focus:border-white/10"
                                />
                             )}
                        </div>
                    ))}
                    {ctas.length === 0 && (
                        <div className="p-8 rounded-xl border border-dashed border-white/10 flex flex-col items-center gap-2 opacity-30">
                            <Plus className="w-5 h-5" />
                            <p className="text-xs">Add your first interactive button</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {!commentTrigger && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5 pb-2">
                <div className="flex flex-col">
                    <Label className="text-sm flex items-center gap-2">
                        <StopCircle className="w-4 h-4 text-red-500/80" />
                        Final Flow Block
                    </Label>
                    <span className="text-[10px] text-white/30">Prevent any further automated fallbacks.</span>
                </div>
                <Switch 
                    checked={isEndBlock}
                    onCheckedChange={(v) => setValue("isEndBlock", v)}
                    className="data-[state=checked]:bg-red-500"
                />
            </div>
        )}

        <Button className="bg-gradient-to-br w-full from-[#4a7dff] font-bold text-white to-[#6c2bd9] h-12 shadow-lg shadow-blue-500/10">
          <Loader state={isPending}>{data?.data?.listener ? "Save Changes" : "Create Automation"}</Loader>
        </Button>
      </form>
    </TriggerButton>
  );
}

export default ThenActions;
