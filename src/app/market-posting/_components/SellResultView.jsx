"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Gnb from "@/components/common/Gnb";
import ButtonSecondary from "@/components/common/ButtonSecondary";
import closeIcon from "@/assets/icons/close.svg";

const statusConfig = {
  success: {
    label: "성공",
    labelClassName: "text-main",
    message: (grade, cardName, quantity) =>
      `[${grade} | ${cardName}] ${quantity}장 판매 등록에 성공했습니다!`,
    buttonText: "나의 판매 포토카드에서 확인하기",
  },
  fail: {
    label: "실패",
    labelClassName: "text-gray-300",
    message: (grade, cardName, quantity) =>
      `[${grade} | ${cardName}] ${quantity}장 판매 등록에 실패했습니다.`,
    buttonText: "마켓플레이스로 돌아가기",
  },
};

export default function SellResultView({ status, grade, cardName, quantity }) {
  const router = useRouter();
  const config = statusConfig[status];

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <Gnb
        mobileType="sub"
        onBackClick={() => router.push("/market-posting")}
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-[20px] px-[15px] text-center tablet:gap-[25px] pc:gap-[30px]">
        <p className="relative [font-family:var(--font-baskin-robbins)] text-[30px] font-bold tracking-[-0.03em] text-white tablet:text-[36px] pc:text-[46px]">
          <button
            type="button"
            onClick={() => router.push("/market-posting")}
            aria-label="닫기"
            className="absolute bottom-full left-full mb-[40px] ml-[115px] hidden size-9 tablet:block pc:mb-[104px] pc:ml-[301px]"
          >
            <Image src={closeIcon} alt="" className="size-full" />
          </button>

          판매 등록{" "}
          <span className={config.labelClassName}>{config.label}</span>
        </p>

        <p className="text-noto-16-bold pc:text-noto-20-bold text-white">
          {config.message(grade, cardName, quantity)}
        </p>

        <ButtonSecondary
          variant="thinXS"
          onClick={() => router.push("/market-posting")}
          className="w-full h-[55px] tablet:w-auto tablet:px-[30px] tablet:text-noto-16-bold pc:h-[60px] pc:w-[440px] pc:text-noto-18-bold"
        >
          {config.buttonText}
        </ButtonSecondary>
      </div>
    </div>
  );
}
