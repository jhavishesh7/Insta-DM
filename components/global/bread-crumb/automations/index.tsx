"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteAutomation, useEditAutomation } from "@/hooks/use-automation";
import { useMutationDataState } from "@/hooks/use-mutation-data";
import { useQueryAutomations } from "@/hooks/user-queries";
import { ChevronRight, PencilIcon, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import ActiveAutomationButton from "../../active-automation-button";
import Loader from "../../loader";

type Props = {
  id: string;
};

function AutomationBreadCrumb({ id }: Props) {
  const { data } = useQueryAutomations(id);
  const { slug } = useParams();

  const { edit, enableEdit, disableEdit, inputRef, isPending } =
    useEditAutomation(id);

  const { isPending: deletePending, mutate: deleteAutomation } = useDeleteAutomation(id, slug as string);

  const { latestVariable } = useMutationDataState(["update-automation"]);

  return (
    <div className="rounded-full w-full p-5 bg-[#18181B1A] flex items-center justify-between">
      <div className="flex items-center gap-x-3 min-w-0">
        <p className="text-[#9B9CA0] truncate">Automation</p>
        <ChevronRight className="flex-shrink-0" color="#9B9CA0" />
        <span className="flex gap-x-3 items-center min-w-0">
          {edit ? (
            <Input
              ref={inputRef}
              placeholder={
                isPending ? latestVariable?.variables?.name : "Add a new Name"
              }
              className="bg-transparent h-auto outline-none text-base border-none p-0"
            />
          ) : (
            <p className="text-[#9B9CA0] truncate">
              {latestVariable?.variables?.name
                ? latestVariable.variables.name
                : data?.data?.name}
            </p>
          )}
          {!edit && (
            <span
              className="cursor-pointer hover:opacity-75 duration-100 transition flex-shrink-0"
              onClick={enableEdit}
            >
              <PencilIcon size={14} />
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-x-5 ml-auto">
        <div className="hidden md:flex gap-x-5">
          <p className="text-text-secondary/60 text-sm">
            All pages are automatically Saved
          </p>
          <p className="text-text-secondary text-sm font-medium">Changes Saved</p>
        </div>
        
        <div className="flex items-center gap-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteAutomation({})}
            className="hover:bg-red-500/10 text-red-500 transition-colors"
          >
            <Loader state={deletePending}>
              <Trash2 size={18} />
            </Loader>
          </Button>
          <ActiveAutomationButton id={id} />
        </div>
      </div>
    </div>
  );
}

export default AutomationBreadCrumb;
