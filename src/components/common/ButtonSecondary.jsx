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

export default function ButtonSecondary({
  children,
  variant,
  type = "button",
  className,
  ...props
}) {
  const safeVariant = buttonStyle[variant] ? variant : "thick";
  return (
    <button
      type={type}
      className={clsx(
        "flex items-center justify-center bg-black text-white",
        buttonStyle[safeVariant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 사용법:
// <ButtonSecondary variant="thick">판매 내리기</ButtonSecondary>
// <ButtonSecondary variant="thin">포토카드 교환하기</ButtonSecondary>
// <ButtonSecondary variant="thinXS">거절</ButtonSecondary>
