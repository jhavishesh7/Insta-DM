import DoubleGradientCard from "@/components/global/double-gradient-card";
import { DASHBOARD_CARDS } from "@/constants/dashboard";
import { BarDuoToneBlue } from "@/icons";
import Chart from "./_components/metrics";
import MetricsCard from "./_components/metrics/metrics-card";
import { getAutomationLogs, getInteractionsData } from "@/actions/webhook/queries";
import { onCurrentUser } from "@/actions/user";
import { Zap, MessageSquare, ClipboardList } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserMetrics } from "@/actions/user/queries";

type Props = {};

async function Page({}: Props) {
  const user = await onCurrentUser();
  const logs = await getAutomationLogs(user.id);
  const chartData = await getInteractionsData(user.id);
  const metrics = await getUserMetrics(user.id);

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex gap-5 lg:flex-row flex-col">
        {DASHBOARD_CARDS.map((card) => (
          <DoubleGradientCard key={card.id} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0c0d18] p-6 rounded-2xl border border-white/[0.06] flex flex-col gap-y-8">
          <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 rounded-xl bg-[#4a7dff]/10 flex items-center justify-center text-[#4a7dff]">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white px-1">Automated Activity</h2>
              <p className="text-white/30 text-xs px-1">Engagement trends over time</p>
            </div>
          </div>
          <div className="h-[300px]">
            <Chart data={chartData} />
          </div>
        </div>

        <div className="bg-[#0c0d18] p-6 rounded-2xl border border-white/[0.06] flex flex-col gap-y-6 max-h-[420px] overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="w-10 h-10 rounded-xl bg-[#6c2bd9]/10 flex items-center justify-center text-[#6c2bd9]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white px-1">Recent Activity</h2>
                <p className="text-white/30 text-xs px-1">Live interaction stream</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {logs.length > 0 ? (
              logs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                   <div className="flex flex-col gap-y-1">
                      <p className="text-xs font-bold text-white group-hover:text-[#4a7dff] transition-colors line-clamp-1 italic">&quot;{log.message}&quot;</p>
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-tighter">{log.automationId ? "Automation" : "Global Agent"}</span>
                   </div>
                   <span className="text-[9px] text-white/20 whitespace-nowrap">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                </div>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-white/20 italic text-xs py-10 opacity-50">
                  Waiting for Pilot interaction...
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0c0d18] p-8 rounded-2xl border border-white/[0.06]">
         <MetricsCard dmCount={metrics?.metrics?.dmCount || 0} commentCount={metrics?.metrics?.commentCount || 0} />
      </div>
    </div>
  );
}

export default Page;
