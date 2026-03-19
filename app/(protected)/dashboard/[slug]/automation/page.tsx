import { getAllAutomation } from "@/actions/automation";
import AutomationList from "@/components/global/automation-list";
import CreateAutomation from "@/components/global/create-automation";
import { getMonth } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {};

async function Page({}: Props) {
  const automations = await getAllAutomation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
      <div className="lg:col-span-4">
        <AutomationList />
      </div>
      <div className="lg:col-span-2">
        <div className="flex flex-col rounded-xl bg-background-80 gap-y-6 p-5 border-[1px] overflow-hidden border-in-active">
          <div>
            <h2 className="text-xl">Automation</h2>
            <p className="text-text-secondary">
              All live automation will show here.
            </p>
          </div>
          <div className="flex flex-col gap-y-3">
            {automations.data && automations.data.length > 0 ? (
              automations.data.slice(0, 3).map((item: any) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-text-secondary text-sm">
                      {getMonth(new Date(item.createdAt).getUTCMonth() + 1)}{" "}
                      {new Date(item.createdAt).getUTCDate()}
                      {new Date(item.createdAt).getUTCDate() === 1 ? "st" : "th"}{" "}
                      {new Date(item.createdAt).getUTCFullYear()}
                    </p>
                  </div>
                  <Check />
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-y-2">
                <p className="text-text-secondary text-sm">
                  No active automations yet.
                </p>
              </div>
            )}
          </div>
          <CreateAutomation />
        </div>
      </div>
    </div>
  );
}

export default Page;

//04.06
