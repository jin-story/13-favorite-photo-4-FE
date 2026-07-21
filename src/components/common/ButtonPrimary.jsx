"use client";

import clsx from "clsx";

const buttonStyle = {
  thick:
    "w-[345px] h-[75px] text-noto-18-bold \
     tablet:w-[342px] tablet:h-[75px] tablet:text-noto-18-bold \
     pc:w-[440px] pc:h-[80px] pc:text-noto-20-bold",

  thin: "w-[345px] h-[55px] text-noto-14-bold \
     tablet:w-[440px] tablet:h-[55px] tablet:text-noto-14-bold \
     pc:w-[520px] pc:h-[60px] pc:text-noto-14-bold",

  thinXS: "w-[150px] h-[40px] text-noto-12-bold",
};

export default function PrimaryButton({
  children,
  variant,
  disabled = false,
  type = "button",
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center",
        buttonStyle[variant],
        disabled ? "bg-gray-400 text-gray-300" : "bg-main text-black",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 사용법:
// <PrimaryButton variant="thick">포토카드 구매하기</PrimaryButton>
// <PrimaryButton variant="thin" disabled>포토카드 교환하기</PrimaryButton>
// <PrimaryButton variant="thinXS">승인</PrimaryButton>
