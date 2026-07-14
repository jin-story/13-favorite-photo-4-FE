import React from "react";

export default function Chip({ type="판매" }) {


  return (
    <>
      {type === "판매" && (
        <strong className="text-noto-10-regular font-normal text-white bg-black/50 rounded-xs px-2 py-1 tablet:text-noto-14-regular pc:text-noto-16-regular">
          판매 중
        </strong>
      )}
      {type === "교환" && (
        <strong className="text-noto-10-regular font-normal text-[#EFFF04] bg-black/50 rounded-xs px-2.5 py-1 tablet:text-noto-14-regular pc:text-noto-16-regular">
          교환 제시 대기 중
        </strong>
      )}
    </>
  );
}
