"use client";

import Image from "next/image";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import closeIcon from "@/assets/icons/close.svg";

export default function MarketplaceExchangeCancelModal({
  offer,
  onClose,
  onConfirm,
}) {
  return (
    <section className="relative flex h-[291px] w-[345px] flex-col items-center bg-gray-500 px-5 pt-[50px] text-white tablet:h-[320px] tablet:w-[440px] tablet:px-10 tablet:pt-[58px] pc:h-[352px] pc:w-[560px] pc:px-[70px] pc:pt-[72px]">
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center pc:right-8 pc:top-8 pc:h-10 pc:w-10"
      >
        <Image
          src={closeIcon}
          alt=""
          width={32}
          height={32}
          className="h-6 w-6 pc:h-8 pc:w-8"
        />
      </button>

      <h2 className="text-center text-noto-18-bold pc:text-noto-28-bold">
        교환 제시 취소
      </h2>

      <p className="mt-7 text-center text-noto-14-regular leading-6 text-gray-300 tablet:mt-8 pc:mt-10 pc:text-noto-16-regular pc:leading-7">
        <span className="block pc:inline">
          [{offer.grade} | {offer.name}]
        </span>
        <span className="block pc:inline">
          <span className="hidden pc:inline"> </span>
          교환 제시를 취소하시겠습니까?
        </span>
      </p>

      <ButtonPrimary
        variant="thin"
        className="mt-8 w-[170px]! tablet:mt-9 pc:mt-12 pc:h-[60px]! pc:w-[260px]!"
        onClick={onConfirm}
      >
        취소하기
      </ButtonPrimary>
    </section>
  );
}
