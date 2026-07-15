import React from "react";
import Grade from "./Grade";
import mook_img from "@/assets/images/card_woman.svg";
import logo from "@/assets/images/logo.svg";
import soldout from "@/assets/icons/soldout.svg";
import Image from "next/image";
import clsx from "clsx";
import Chip from "./Chip";

const CARD_RESPONSIVE_STYLING = clsx(
  "p-2.5 gap-2.5 w-[170px]",
  "tablet:w-[342px] tablet:p-5 tablet:gap-5",
  "pc:w-[440px] pc:p-10 ",
);

const IMAGE_RESPONSIVE_STYLING = clsx(
  "w-[150px] h-[112px]",
  "tablet:w-[302px] tablet:h-[227px]",
  "pc:w-[360px] pc:h-[270px]",
);

const TEXT_RESPONSIVE_STYLING = clsx(
  "text-noto-10-regular",
  "tablet:text-noto-16-regular",
);

const ALLOWED_TYPES = ["마켓 카드", "나의 판매 카드", "나의 카드"];
const ALLOWED_STATES = ["판매", "교환"];

/**
 * @component Photocard
 * @description 마켓, 나의 판매 카드, 나의 카드 도메인에서 공통으로 사용하는 반응형 포토카드 컴포넌트입니다.
 *
 * ### 📱 반응형 가이드 (CSS Breakpoints)
 * - Mobile: 기본 스타일 적용 (width: 170px)
 * - Tablet: `tablet:` 접두사 적용 (width: 342px)
 * - PC: `pc:` 접두사 적용 (width: 440px)
 *
 * ### 🎨 타입별(type) 차이점 요약
 * 1. `"마켓 카드"` (공백 주의)
 *    - 하단 표기: `잔여` (남은수량 / 총수량)
 *    - 품절 기준: `lastQuantity === 0` 일 때 SOLD OUT 마스크 노출
 * 2. `"나의 판매 카드"`
 *    - 하단 표기: `잔여` (총수량)
 *    - 품절 기준: `totalQuantity === 0` 일 때 SOLD OUT 마스크 노출
 * 3. `"나의 카드"`
 *    - 하단 표기: `수량` (총수량)
 *    - 품절 기준: 본인 소유 카드이므로 품절 표시 없음 (SOLD OUT 노출 불가)
 *
 * @param {Object} props
 * @param {Object} [props.card={}] - 카드 데이터 객체
 * @param {string} [props.card.makerNickname="알 수 없음"] - 제작자 닉네임
 * @param {string} [props.card.name="이름 없는 카드"] - 포토카드 이름
 * @param {string} [props.card.grade="COMMON"] - 카드 등급 (COMMON, RARE, SUPER_RARE, LEGENDARY 등)
 * @param {string} [props.card.genre="풍경"] - 카드 장르
 * @param {number} [props.card.price=0] - 가격
 * @param {number} [props.card.totalQuantity=0] - 총 발행 수량 (또는 본인 보유 수량)
 * @param {number} [props.card.lastQuantity=0] - 남은 수량
 * @param {string} [props.card.imgUrl] - 카드 실제 이미지 주소
 * @param {string} [props.card.description="포토카드 설명글"] - 이미지 alt 설명 텍스트
 * @param {"마켓 카드" | "나의 판매 카드" | "나의 카드"} [props.type="나의 판매 카드"] - 렌더링할 카드 타입 분기
 * @param {"판매" | "교환"} [props.state] - 좌측 상단 Chip 컴포넌트에 노출할 상태 ("판매", "교환" 외의 값은 칩 미노출)
 */
export default function Photocard({
  card = {},
  type = "나의 판매 카드",
  state,
}) {
  if (!ALLOWED_TYPES.includes(type)) return null;

  const {
    makerNickname = "알 수 없음",
    name = "이름 없는 카드",
    grade = "COMMON",
    genre = "풍경",
    price = 0,
    totalQuantity = 0,
    lastQuantity = 0,
    imgUrl,
    description = "포토카드 설명글",
  } = card;

  const soldOut =
    (lastQuantity === 0 && type === "마켓 카드") ||
    (totalQuantity === 0 && type === "나의 판매 카드");

  const showStateChip = ALLOWED_STATES.includes(state);

  const renderQuantitySection = () => {
    let label = "수량";
    let value = <span className="text-white">{totalQuantity}</span>;

    if (type === "마켓 카드") {
      label = "잔여";
      value = (
        <span className="text-white">
          <span>{lastQuantity}</span> /{" "}
          <span className="text-gray-300">{totalQuantity}</span>
        </span>
      );
    } else if (type === "나의 판매 카드") {
      label = "잔여";
      value = <span className="text-white">{totalQuantity}</span>;
    }

    return (
      <div className="flex justify-between items-center">
        <span className={clsx(TEXT_RESPONSIVE_STYLING, "text-gray-300")}>
          {label}
        </span>
        <span className="text-noto-10-regular tablet:text-noto-18-regular">
          {value}
        </span>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "bg-gray-500 border border-white/10 flex flex-col",
        CARD_RESPONSIVE_STYLING,
      )}
    >
      {/* 이미지 영역 */}
      <div
        className={clsx("relative overflow-hidden", IMAGE_RESPONSIVE_STYLING)}
      >
        {/* "판매" 또는 "교환" 상태일 때만 Chip 컴포넌트를 렌더링 */}
        {showStateChip && (
          <Chip
            type={state}
            className="absolute top-[5px] left-[5px] z-10 tablet:top-2.5 tablet:left-2.5 "
          />
        )}
        <Image
          alt={description}
          src={imgUrl || mook_img}
          fill
          className="object-cover z-0"
        />
        {soldOut && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
            <div className="relative w-[112px] h-[112px] tablet:w-[200px] tablet:h-[200px] pc:w-[230px] pc:h-[230px]">
              <Image alt="품절" src={soldout} fill className="object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* 카드 정보 및 구분선 */}
      <div className="flex flex-col gap-[5px]">
        <span className="text-noto-14-bold text-white truncate tablet:text-noto-22-bold">
          {name}
        </span>
        <div className="flex items-center justify-between border-b border-b-gray-400 pb-2.5">
          <div className="flex items-center">
            <Grade grade={grade} type="card" />
            <span
              className={clsx(
                "border-l border-l-gray-400 pl-[5px] ml-[5px] text-gray-300 tablet:pl-2.5 tablet:ml-2.5",
                TEXT_RESPONSIVE_STYLING,
              )}
            >
              {genre}
            </span>
          </div>
          <span
            className={clsx("text-white underline", TEXT_RESPONSIVE_STYLING)}
          >
            {makerNickname}
          </span>
        </div>
      </div>

      {/* 가격 영역 */}
      <div className="flex justify-between items-center mb-1">
        <span className={clsx(TEXT_RESPONSIVE_STYLING, "text-gray-300")}>
          가격
        </span>
        <span className="text-white text-noto-10-regular tablet:text-noto-18-regular">
          {price} P
        </span>
      </div>

      {/* 수량 / 잔여 동적 렌더링 */}
      {renderQuantitySection()}

      {/* 하단 푸터 로고 */}
      <div className="hidden tablet:flex justify-center mt-7.5 pc:mt-10">
        <Image alt="최애의 포토 로고" src={logo} width={100} height={18} />
      </div>
    </div>
  );
}
