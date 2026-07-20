import Image from "next/image";
import React from "react";
import Grade from "./Grade";
import ButtonSecondary from "./ButtonSecondary";
import PrimaryButton from "./ButtonPrimary";
import clsx from "clsx";
import mock_img from "@/assets/images/card_castle.svg";

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

export default function ExchangeCard({ card = {}, onApprove, onReject }) {
  const {
    makerNickname = "알 수 없음",
    name = "이름 없는 카드",
    grade = "COMMON",
    genre = "풍경",
    price = 0,
    imgUrl,
    description = "포토카드 설명글",
  } = card;
  return (
    <div
      className={clsx(
        CARD_RESPONSIVE_STYLING,
        "flex flex-col border border-white/10",
      )}
    >
      <div className={clsx(IMAGE_RESPONSIVE_STYLING, "relative")}>
        <Image
          alt={name}
          src={imgUrl || mock_img}
          fill
          sizes="(min-width: 1920px) 360px, (min-width: 744px) 302px, 150px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-[5px]">
        <span className="text-noto-14-bold">{name}</span>
        <div
          className={clsx(
            TEXT_RESPONSIVE_STYLING,
            "flex flex-col pc:flex-row pb-2.5 border-b border-b-gray-400",
          )}
        >
          <div className="flex items-center ">
            <Grade grade={grade} type="card" />
            <span className="border-l border-l-gray-400 pl-[5px] ml-[5px] text-gray-300 tablet:pl-2.5 tablet:ml-2.5">
              {genre}
            </span>
            <div className="pl-2.5 ml-2.5 border-l border-l-gray-400 hidden pc:flex pc:gap-[60px]">
              <div className="">
                <span>{price} P</span>
                <span className="text-gray-300"> 에 구매</span>
              </div>
              <span className="underline underline-offset-2">
                {makerNickname}
              </span>
            </div>
          </div>
          <div className="flex justify-between pc:hidden">
            <div>
              <span>{price} P</span>
              <span className="text-gray-300"> 에 구매</span>
            </div>
            <span className="underline underline-offset-2">
              {makerNickname}
            </span>
          </div>
        </div>
      </div>
      <p
        className={clsx(
          TEXT_RESPONSIVE_STYLING,
          "line-clamp-2 break-all h-7",
          "tablet:h-[46px]",
        )}
      >
        {description}
      </p>
      <div className="flex gap-[5px] tablet:gap-5">
        <ButtonSecondary
          variant="thinXS"
          className="w-[72.5px]! border border-gray-100 rounded-xs tablet:hidden "
          onClick={onReject}
        >
          거절하기
        </ButtonSecondary>
        <PrimaryButton
          variant="thinXS"
          className="w-[72.5px]! rounded-xs tablet:hidden"
          onClick={onApprove}
        >
          승인하기
        </PrimaryButton>
        <ButtonSecondary
          variant="thin"
          className="hidden border border-gray-100 rounded-xs tablet:text-noto-16-regular tablet:flex!"
          onClick={onReject}
        >
          거절하기
        </ButtonSecondary>
        <PrimaryButton
          variant="thin"
          className="hidden rounded-xs tablet:text-noto-16-regular tablet:flex!"
          onClick={onApprove}
        >
          승인하기
        </PrimaryButton>
      </div>
    </div>
  );
}
