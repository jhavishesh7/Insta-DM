import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  trigger: JSX.Element;
  children: React.ReactNode;
  className?: string;
};

function PopOver({ children, className, trigger }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={cn("bg-[#1D1D1D] shadow-2xl border border-white/10 p-5 z-[100]", className)}
        align="center"
        side="bottom"
        sideOffset={12}
        collisionPadding={20}
      >
        <div className="max-h-[85vh] overflow-y-auto scrollbar-hide">
            {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default PopOver;
