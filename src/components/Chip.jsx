import React from "react";

export default function Chip({ type }) {
  return type === "판매중" ? (
    <strong className="text-[10px] font-normal text-white bg-black/50 rounded-xs px-2 py-1">
      판매중
    </strong>
  ) : (
    <strong className="text-[10px] font-normal text-[#EFFF04] bg-black/50 rounded-xs px-2.5 py-1">
      교환 제시 대기 중
    </strong>
  );
}
