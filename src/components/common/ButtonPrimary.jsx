import clsx from "clsx";

const buttonStyle = {
  thick: {
    L: "w-[440px] h-[80px] text-noto-20-bold",
    M: "w-[342px] h-[75px] text-noto-18-bold",
    S: "w-[345px] h-[75px] text-noto-18-bold",
  },
  thin: {
    L: "w-[520px] h-[60px] text-noto-14-bold",
    M: "w-[440px] h-[55px] text-noto-14-bold",
    S: "w-[345px] h-[55px] text-noto-14-bold",
    XS: "w-[150px] h-[40px] text-noto-12-bold",
  },
};

export default function PrimaryButton({
  children,
  variant = "thick",
  size = "M",
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
        buttonStyle[variant][size],
        disabled
          ? "bg-gray-400 text-gray-300 cursor-not-allowed"
          : "bg-main text-black hover:brightness-95",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// 사용법:
// <PrimaryButton variant="thick" size="L">포토카드 구매하기</PrimaryButton>
// <PrimaryButton variant="thin" size="L">포토카드 교환하기</PrimaryButton>
// <PrimaryButton variant="thin" size="L" disabled>포토카드 교환하기</PrimaryButton>
