import React from "react";
import ProfileMessage from "./ProfileMessage";
import Link from "next/link";
import clsx from "clsx";

export default function Profile({ nickname, point, onLogout, className }) {
  return (
    <div
      className={clsx(
        "bg-gray-500 w-[260px] flex flex-col h-dvh tablet:h-auto",
        className,
      )}
    >
      <ProfileMessage nickname={nickname} point={point} />
      <div className="flex flex-col flex-1">
        <div className="text-noto-14-bold text-white flex flex-col gap-[15px] px-5 py-5 flex-1">
          <Link href={"/"}>마켓플레이스</Link> {/*추후 주소 등록*/}
          <Link href={"/"}>마이갤러리</Link> {/*추후 주소 등록*/}
          <Link href={"/"}>판매 중인 포토카드</Link> {/*추후 주소 등록*/}
        </div>
        <div className="pb-5 text-noto-14-regular text-gray-400 px-5 tablet:hidden">
          <button type="button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
