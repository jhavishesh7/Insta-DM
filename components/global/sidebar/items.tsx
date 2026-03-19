import { SIDEBAR_MENU } from "@/constants/menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  page: string;
  slug: string;
};

function Items({ page, slug }: Props) {
  return SIDEBAR_MENU.map((item) => (
    <Link
      key={item.id}
      href={`/dashboard/${slug}/${item.label === "home" ? "/" : item.label}`}
      className={cn(
        "capitalize flex gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all items-center relative group",
        (page === item.label || (page === slug && item.label === "home"))
          ? "bg-white/[0.05] text-white shadow-[0_0_20px_rgba(74,125,255,0.1)]"
          : "text-[#9D9D9D] hover:text-white/90 hover:bg-white/[0.02]"
      )}
    >
      <div className={cn(
        "transition-colors",
        (page === item.label || (page === slug && item.label === "home")) ? "text-[#4a7dff]" : "group-hover:text-white/80"
      )}>
        {item.icon}
      </div>
      {item.label}
      {(page === item.label || (page === slug && item.label === "home")) && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#4a7dff] rounded-l-full shadow-[0_0_10px_rgba(74,125,255,0.5)]" />
      )}
    </Link>
  ));
}

export default Items;
