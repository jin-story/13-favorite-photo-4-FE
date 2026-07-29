// src/components/common/TabletPhotocard.jsx
import React from "react";
import Grade from "./Grade";
import mook_img from "@/assets/images/card_woman.svg";
import logo from "@/assets/images/logo.svg";
import soldout from "@/assets/icons/soldout.svg";
import Image from "next/image";
import Chip from "./Chip";

const GENRE_MAP = {
  ALBUM: "앨범",
  SPECIAL: "특전",
  FAN_SIGN: "팬싸",
  SEASON_GREETING: "시즌그리팅",
  FAN_MEETING: "팬미팅",
  CONCERT: "콘서트",
  MD: "MD",
  COLLABORATION: "콜라보",
  FAN_CLUB: "팬클럽",
  ETC: "기타",
};

export default function TabletPhotoCard({
  card = {},
  type = "나의 판매 카드",
  state,
}) {
  const {
    makerNickname = "알 수 없음",
    name = "이름 없는 카드",
    grade = "COMMON",
    genre = "기타",
    price = 0,
    totalQuantity = 0,
    lastQuantity = 0,
    imageUrl,
    description = "포토카드 설명글",
  } = card;

  const soldOut =
    (lastQuantity === 0 && type === "마켓 카드") ||
    (totalQuantity === 0 && type === "나의 판매 카드");

  const showStateChip = !soldOut && ["판매", "교환"].includes(state);

  return (
    <div className="bg-gray-500 border border-white/10 flex flex-col w-[342px] p-5 gap-5">
      {/* 이미지 영역 (태블릿 고정 사이즈: 302 x 227) */}
      <div className="relative overflow-hidden w-[302px] h-[227px]">
        {showStateChip && (
          <Chip type={state} className="absolute top-2.5 left-2.5 z-10" />
        )}
        <Image
          alt={description}
          src={imageUrl || mook_img}
          fill
          unoptimized
          sizes="302px"
          className="object-cover z-0"
        />
        {soldOut && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
            <div className="relative w-[200px] h-[200px]">
              <Image alt="품절" src={soldout} fill className="object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* 카드 정보 및 구분선 */}
      <div className="flex flex-col gap-[5px]">
        <span className="text-noto-22-bold text-white truncate">{name}</span>
        <div className="flex items-center justify-between border-b border-b-gray-400 pb-2.5">
          <div className="flex items-center">
            <Grade grade={grade} type="card" />
            <span className="border-l border-l-gray-400 pl-2.5 ml-2.5 text-gray-300 text-noto-16-regular truncate">
              {GENRE_MAP[genre] || genre}
            </span>
          </div>
          <span className="text-white underline truncate text-noto-16-regular">
            {makerNickname}
          </span>
        </div>
      </div>

      {/* 가격 영역 */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-300 text-noto-16-regular">가격</span>
        <span className="text-white text-noto-18-regular">{price} P</span>
      </div>

      {/* 수량 영역 */}
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-noto-16-regular">
          {type === "마켓 카드" || type === "나의 판매 카드" ? "잔여" : "수량"}
        </span>
        <span className="text-noto-18-regular text-white">
          {type === "마켓 카드" ? (
            <>
              <span>{lastQuantity}</span> /{" "}
              <span className="text-gray-300">{totalQuantity}</span>
            </>
          ) : (
            totalQuantity
          )}
        </span>
      </div>

      {/* 하단 푸터 로고 */}
      <div className="flex justify-center mt-7.5 pb-[10px]">
        <Image alt="최애의 포토 로고" src={logo} width={100} height={18} />
      </div>
    </div>
  );
}
