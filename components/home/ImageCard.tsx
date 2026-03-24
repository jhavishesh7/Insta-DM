import { ImageCardProps } from "@/types/types";
import React from "react";

type Props = {};

function ImageCard({ src, aspectRatio, marginTop = "" }: ImageCardProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        src={src}
        alt=""
        className={`object-contain w-full aspect-[${aspectRatio}] ${marginTop}`}
      />
    </>
  );
}

export default ImageCard;
