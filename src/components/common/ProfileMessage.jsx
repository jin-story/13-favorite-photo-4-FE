import React from "react";

export default function ProfileMessage({ nickname, point }) {
  const safePoint = Number(point || 0);
  return (
    <div className="flex flex-col gap-5 items-center w-[260px] pb-5 border-b border-b-gray-400 px-5">
      <p className="text-noto-18-bold text-white">안녕하세요, {nickname}님!</p>
      <div className="flex justify-between w-full">
        <p className="text-noto-12-light text-gray-300">보유 포인트</p>
        <p className="text-noto-12-regular text-main">
          {safePoint.toLocaleString("ko-KR")} P
        </p>
      </div>
    </div>
  );
}
