"use client";

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
      className={`flex h-[45px] flex-col items-center justify-between rounded-[2px] border border-[#DDDDDD] bg-[#0F0F0F] px-3 py-2.5 ${className}`}
    >
      <div className="flex w-[120px] flex-1 items-center justify-between">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || isMin}
          aria-label="수량 감소"
          className="flex items-center justify-center text-xl leading-none text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          -
        </button>

        <span className="flex items-center justify-center text-lg font-medium leading-none text-white">
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || isMax}
          aria-label="수량 증가"
          className="flex items-center justify-center text-xl leading-none text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityStepper;
