"use client";

import { Button } from "@/components/ui/button";
import { useMutationDataState } from "@/hooks/use-mutation-data";
import { usePath } from "@/hooks/user-nav";
import { useQueryAutomation } from "@/hooks/user-queries";
import { cn, getMonth } from "@/lib/utils";
import Link from "next/link";
import { useMemo } from "react";
import CreateAutomation from "../create-automation";
import GradientButton from "../gradient-button";

type Props = {};

function AutomationList({}: Props) {
  const { data, isPending } = useQueryAutomation();

  const { latestVariable } = useMutationDataState(["create-automation"]);
  // console.log("🚀 ~ AutomationList ~ latestVariables:", latestVariables);

  const { pathname } = usePath();

  const optimisticUiData = useMemo(() => {
    if (latestVariable && latestVariable?.variables && data) {
      const newData = [latestVariable.variables, ...data.data];
      return { data: newData };
    }
    return data || { data: [] };
  }, [latestVariable, data]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[140px] rounded-2xl bg-white/5 border border-white/5 animate-pulse relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (data?.status !== 200 || data?.data.length <= 0) {
    return (
      <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
        <h3 className="text-lg text-gray-400">No Automation</h3>
        <CreateAutomation />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      {optimisticUiData.data!.map((automation) => (
        <Link
          href={`${pathname}/${automation.id}`}
          key={automation.id}
          className="bg-[#0c0d18] border border-white/[0.06] hover:border-[#4a7dff]/20 transition-all duration-300 rounded-2xl p-6 flex group"
        >
          <div className="flex flex-col flex-1 items-start">
            <h2 className="text-xl font-bold group-hover:text-[#4a7dff] transition-colors">{automation.name}</h2>
            <p className="text-white/30 text-sm mt-1">
              AI-Powered Automation
            </p>

            {automation.keywords.length > 0 ? (
              <div className="flex gap-x-2 flex-wrap mt-3">
                {
                  // @ts-ignore
                  automation.keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-full px-4 py-1 capitalize",
                        (0 + 1) % 1 == 0 &&
                          "bg-keyword-green/15 border-2 border-keyword-green",
                        (1 + 1) % 2 == 0 &&
                          "bg-keyword-purple/15 border-2 border-keyword-purple",
                        (2 + 1) % 3 == 0 &&
                          "bg-keyword-yellow/15 border-2 border-keyword-yellow",
                        (3 + 1) % 4 == 0 &&
                          "bg-keyword-red/15 border-2 border-keyword-red"
                      )}
                    >
                      {keyword.word}
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="rounded-full border-2 mt-3 border-dashed border-white/60 px-3 py-1">
                <p className="text-sm text-[#bfc0c3]">No Keywords</p>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between">
            <p className="capitalize text-sm font-light text-[#9B9CA0]">
              {getMonth(new Date(automation.createdAt).getUTCMonth() + 1)}{" "}
              {new Date(automation.createdAt).getUTCDate() === 1
                ? `${new Date(automation.createdAt).getUTCDate()}st`
                : `${new Date(automation.createdAt).getUTCDate()}th`}{" "}
              {new Date(automation.createdAt).getUTCFullYear()}
            </p>

            {automation.listener?.listener === "SMARTAI" ? (
              <div className="bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] px-4 py-1.5 rounded-full text-[10px] font-bold text-center uppercase tracking-wider shadow-lg shadow-[#4a7dff]/15">
                ZeroPilot Brain
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold text-center uppercase tracking-tighter">
                Standard
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}


export default AutomationList;
