import { getAutomationLogs } from "@/actions/webhook/queries";
import { onCurrentUser } from "@/actions/user";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User, Zap } from "lucide-react";

async function LogsPage() {
  const user = await onCurrentUser();
  const logs = await getAutomationLogs(user.id);

  return (
    <div className="flex flex-col gap-y-6 p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-bold text-gradient">Automation Logs</h1>
        <p className="text-sm text-white/40">
          Monitor your ZeroPilot interactions in real-time.
        </p>
      </div>

      <div className="bg-[#0c0d18] rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold text-sm">Target / Sender</th>
                <th className="p-4 font-semibold text-sm">Automation</th>
                <th className="p-4 font-semibold text-sm">Message</th>
                <th className="p-4 font-semibold text-sm text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#4a7dff]/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-[#4a7dff]" />
                        </div>
                        <span className="text-sm font-medium">
                          {log.type === "DM" ? "Direct Message" : "Comment Reply"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-x-2">
                        <Zap className="w-3 h-3 text-[#6c2bd9]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6c2bd9]">
                          {log.automationId ? "Automation" : "Global Agent"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="flex items-start gap-x-2">
                        <MessageSquare className="w-4 h-4 text-white/30 shrink-0 mt-1" />
                        <p className="text-sm text-white/40 line-clamp-2 italic">
                          &quot;{log.message}&quot;
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs text-white/20 whitespace-nowrap">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-white/20 italic">
                    No automation logs found yet. Start engaging to see activity!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LogsPage;
