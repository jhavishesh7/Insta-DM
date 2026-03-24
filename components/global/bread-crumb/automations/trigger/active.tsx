import { InstagramBlue, PlaneBlue } from "@/icons";
import { PencilIcon } from "lucide-react";
import React from "react";

type Props = {
  type: string;
  keywords: {
    id: string;
    word: string;
    automationId: string | null;
  }[];
  onEdit?: () => void;
};

function ActiveTrigger({ type, keywords, onEdit }: Props) {
  return (
    <div className="bg-background-80 p-5 rounded-xl w-full border-[1px] border-white/5 relative group">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg text-[#4a7dff]"
        >
          <PencilIcon size={16} />
        </button>
      )}
      <div className="flex gap-x-2 items-center">
        {type == "COMMENT" ? <InstagramBlue /> : <PlaneBlue />}
        <p className="text-xl font-medium">
          {type == "COMMENT"
            ? "User Comments on my post"
            : "User Sends me a direct message"}
        </p>
      </div>
      <p className="text-text-secondary">
        {type == "COMMENT"
          ? "If the user comments on a video that is setup to listen for keywords, this automation will fire"
          : "If the user send your a message that contains a keyword, this automation will fire"}
      </p>
      <div className="flex gap-2 mt-5 flex-wrap">
        {keywords.map((word) => (
          <div
            key={word.id}
            className="bg-gradient-to-br from-[#4a7dff] to-[#6c2bd9] flex items-center gap-x-2 capitalize text-white font-light py-1 px-4 rounded-full"
          >
            <p>{word.word}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveTrigger;
