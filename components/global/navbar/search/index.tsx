import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

type Props = {};

function Search({}: Props) {
  return (
    <div className="flex overflow-hidden gap-x-2 border-[1px] border-[#4a7dff] rounded-full px-4 py-1 items-center flex-1">
      <SearchIcon color="#4a7dff" />
      <Input
        placeholder="Search by name, email or status"
        className="border-none outline-none ring-0 focus:ring-0 flex-1"
      />
    </div>
  );
}
Search;
export default Search;
