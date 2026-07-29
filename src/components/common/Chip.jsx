import clsx from "clsx";
import React from "react";

export default function Chip({ type, className }) {
  if (type !== "판매" && type !== "교환") return null;
  return (
    <span
      className={clsx(
        "relative inline-flex items-center font-normal bg-black/50 rounded-xs py-1 text-noto-10-regular tablet:text-noto-14-regular pc:text-noto-16-regular",
        className,
      )}
    >
      {type === "판매" && <span className="text-white px-2">판매 중</span>}
      {type === "교환" && (
        <span className="text-[#EFFF04] px-2.5">교환 제시 대기 중</span>
      )}
    </span>
  );
}
