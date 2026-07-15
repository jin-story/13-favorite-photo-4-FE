"use client";

import clsx from "clsx";
import exchangeIcon from "@/assets/icons/exchange.svg";
import PrimaryButton from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import Grade from "./Grade";

const SellerCardAction = ({
  exchangeGrade = "COMMON",
  exchangeGenre = "",
  exchangeDescription = "",
  onEdit,
  onClose,
  disabled = false,
  className = "",
}) => {
  const handleEdit = () => {
    if (disabled) return;
    onEdit?.();
  };

  const handleClose = () => {
    if (disabled) return;
    onClose?.();
  };

  return (
    <section
      className={clsx(
        "w-[345px] bg-[#0F0F0F] text-white tablet:w-[342px] pc:w-[440px]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white pb-3 pc:gap-3 pc:pb-4">
        <img
          src={exchangeIcon.src}
          alt=""
          className="h-6 w-6 pc:h-7 pc:w-7"
          aria-hidden="true"
        />

        <h2 className="text-noto-22-bold text-white pc:text-noto-24-bold">
          교환 희망 정보
        </h2>
      </div>

      <div className="mt-8 flex items-center gap-3 pc:mt-10">
        <Grade type="detail" grade={exchangeGrade} />

        {exchangeGenre && (
          <>
            <span className="h-5 w-px bg-[#5A5A5A]" aria-hidden="true" />
            <span className="truncate text-noto-18-bold text-[#A4A4A4] pc:text-noto-20-bold">
              {exchangeGenre}
            </span>
          </>
        )}
      </div>

      <div className="mt-5 border-t border-[#3A3A3A] pt-5 pc:mt-6 pc:pt-6">
        <p className="min-h-[84px] whitespace-pre-line text-noto-16-regular leading-7 text-[#EDEDED] pc:text-noto-18-regular pc:leading-8">
          {exchangeDescription}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 pc:mt-[60px]">
        <PrimaryButton
          variant="thin"
          onClick={handleEdit}
          disabled={disabled}
          className="!w-full"
        >
          수정하기
        </PrimaryButton>

        <ButtonSecondary
          variant="thin"
          onClick={handleClose}
          disabled={disabled}
          className={clsx(
            "!w-full border border-gray-200",
            disabled && "cursor-not-allowed text-gray-300",
          )}
        >
          판매 내리기
        </ButtonSecondary>
      </div>
    </section>
  );
};

export default SellerCardAction;
