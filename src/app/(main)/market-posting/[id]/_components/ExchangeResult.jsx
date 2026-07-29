"use client";

import ButtonSecondary from "@/components/common/ButtonSecondary";
import Gnb from "@/components/common/Gnb";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import close from "@/assets/icons/close.svg";

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardName = searchParams.get("cardName");
  const grade = searchParams.get("grade");
  const quantity = searchParams.get("quantity");
  const errorMessage = searchParams.get("error");

  const handleClick = () => {
    if (errorMessage) {
      router.replace("/market-posting");
    } else {
      router.replace("/my-listings");
    }
  };

  return (
    <div className="relative flex flex-col gap-[50px] justify-center items-center pc:gap-[60px]">
      <button type="button" onClick={handleClick}>
        <Image
          alt="닫기"
          src={close}
          width={33}
          height={33}
          className="hidden tablet:block absolute right-[-127px] top-[-63px] pc:right-[-195px] pc:top-[-96px]"
        />
      </button>
      <div className="flex flex-col gap-[30px] items-center pc:gap-10">
        <span className="text-baskin-30-regular text-baskin-36-regular">
          교환 제시
          {!errorMessage ? (
            <span className="text-main"> 성공</span>
          ) : (
            <span className="text-gray-300"> 실패</span>
          )}
        </span>
        <div className="flex flex-col text-noto-16-bold items-center tablet:flex-row gap-1 pc:text-noto-20-bold">
          <span>
            {!errorMessage
              ? "포토카드 교환 제시에 성공했습니다!"
              : "포토카드 교환 제시에 실패했습니다"}
          </span>
        </div>
      </div>
      <ButtonSecondary
        onClick={handleClick}
        className="h-[55px] border border-gray-100 text-noto-16-regular px-[30px] pc:text-noto-18-regular pc:h-[60px] pc:w-[440px]"
      >
        {!errorMessage
          ? "나의 판매 포토카드에서 확인하기"
          : "마켓플레이스로 돌아가기"}
      </ButtonSecondary>
    </div>
  );
}
