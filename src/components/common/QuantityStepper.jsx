"use client";

import clsx from "clsx";

const QuantityStepper = ({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  className = "",
}) => {
  const isMin = value <= min;
  const isMax = value >= max;

  const handleDecrease = () => {
    if (disabled || isMin) return;
    onChange?.(Math.max(value - 1, min));
  };

  const handleIncrease = () => {
    if (disabled || isMax) return;
    onChange?.(Math.min(value + 1, max));
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-between rounded-[2px] border border-[#DDDDDD]",
        "h-[40px] px-2.5 py-2",
        "pc:h-[45px] pc:px-3 pc:py-2.5",
        className,
      )}
    >
      <div
        className={clsx(
          "flex flex-1 items-center justify-between",
          "w-[110px]",
          "pc:w-[120px]",
        )}
      >
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || isMin}
          aria-label="수량 감소"
          className={clsx(
            "flex items-center justify-center leading-none text-white",
            "text-base pc:text-xl",
            "disabled:cursor-not-allowed disabled:opacity-30",
          )}
        >
          -
        </button>

        <span
          aria-live="polite"
          className={clsx(
            "flex items-center justify-center font-medium leading-none text-white",
            "text-base pc:text-lg",
          )}
        >
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || isMax}
          aria-label="수량 증가"
          className={clsx(
            "flex items-center justify-center leading-none text-white",
            "text-base pc:text-xl",
            "disabled:cursor-not-allowed disabled:opacity-30",
          )}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityStepper;
