"use client";

import { useEffect, useId } from "react";
import clsx from "clsx";
import Grade from "./Grade";
import QuantityStepper from "./QuantityStepper";

const toSafeNumber = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const toSafeInteger = (value, fallback = 0) => {
  const numberValue = toSafeNumber(value, fallback);
  return Math.floor(numberValue);
};

const normalizeQuantityBounds = (minQuantity, maxQuantity) => {
  const normalizedMaxQuantity = Math.max(0, toSafeInteger(maxQuantity, 0));
  const normalizedMinQuantity = Math.min(
    Math.max(0, toSafeInteger(minQuantity, 1)),
    normalizedMaxQuantity,
  );

  return {
    min: normalizedMinQuantity,
    max: normalizedMaxQuantity,
  };
};

const clampQuantity = (value, min, max) => {
  if (max <= 0) return 0;

  const safeValue = toSafeInteger(value, min);
  return Math.min(Math.max(safeValue, min), max);
};

const MyCardDetailSaleForm = ({
  grade = "COMMON",
  genre = "",
  ownerNickname = "",
  quantity = 1,
  minQuantity = 1,
  maxQuantity = 1,
  price = "",
  onQuantityChange,
  onPriceChange,
  disabled = false,
  className = "",
}) => {
  const priceInputId = useId();

  const { min: safeMinQuantity, max: safeMaxQuantity } =
    normalizeQuantityBounds(minQuantity, maxQuantity);

  const clampedQuantity = clampQuantity(
    quantity,
    safeMinQuantity,
    safeMaxQuantity,
  );

  const isDisabled = disabled || safeMaxQuantity <= 0;

  useEffect(() => {
    if (quantity !== clampedQuantity) {
      onQuantityChange?.(clampedQuantity);
    }
  }, [quantity, clampedQuantity, onQuantityChange]);

  const handleQuantityChange = (nextQuantity) => {
    const nextClampedQuantity = clampQuantity(
      nextQuantity,
      safeMinQuantity,
      safeMaxQuantity,
    );

    onQuantityChange?.(nextClampedQuantity);
  };

  const handlePriceChange = (event) => {
    const nextValue = event.target.value.replace(/[^0-9]/g, "");
    onPriceChange?.(nextValue);
  };

  return (
    <section className={clsx("w-full bg-[#0F0F0F] text-white", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Grade type="detail" grade={grade} />

          {genre && (
            <>
              <span className="h-5 w-px bg-[#5A5A5A]" aria-hidden="true" />
              <span className="truncate text-noto-18-bold text-[#A4A4A4] pc:text-noto-24-bold">
                {genre}
              </span>
            </>
          )}
        </div>

        {ownerNickname && (
          <span className="min-w-0 max-w-[35%] truncate text-noto-18-bold text-white underline underline-offset-4 pc:text-noto-24-bold">
            {ownerNickname}
          </span>
        )}
      </div>

      <div className="mt-6 border-t border-[#3A3A3A] pt-6 pc:mt-8 pc:pt-8">
        <div className="grid grid-cols-[120px_1fr] items-center gap-x-3 gap-y-4 pc:grid-cols-[150px_1fr] pc:gap-y-5">
          <span className="text-noto-18-regular text-white pc:text-noto-20-regular">
            총 판매 수량
          </span>

          <div className="flex items-center justify-end gap-3">
            <div className="w-[130px] pc:w-[180px]">
              <QuantityStepper
                value={clampedQuantity}
                min={safeMinQuantity}
                max={safeMaxQuantity}
                onChange={handleQuantityChange}
                disabled={isDisabled}
                className="w-full!"
              />
            </div>

            <div className="flex min-w-[40px] flex-col items-start pc:min-w-[48px]">
              <span className="text-noto-16-bold text-white pc:text-noto-18-bold">
                / {safeMaxQuantity}
              </span>
              <span className="mt-0.5 whitespace-nowrap text-noto-10-regular text-gray-300 pc:text-noto-12-regular">
                최대 {safeMaxQuantity}장
              </span>
            </div>
          </div>

          <label
            htmlFor={priceInputId}
            className="text-noto-18-regular text-white pc:text-noto-20-regular"
          >
            장당 가격
          </label>

          <div className="flex justify-end">
            <div className="flex h-[40px] w-[183px] items-center rounded-[2px] border border-gray-200 bg-[#0F0F0F] px-4 pc:h-[45px] pc:w-[231px]">
              <input
                id={priceInputId}
                type="text"
                inputMode="numeric"
                value={price}
                onChange={handlePriceChange}
                placeholder="숫자만 입력"
                disabled={isDisabled}
                className="w-full bg-transparent text-noto-14-regular text-white outline-none placeholder:text-gray-300 disabled:cursor-not-allowed disabled:text-gray-300 pc:text-noto-16-regular"
              />

              <span className="ml-3 text-noto-16-bold text-white pc:text-noto-18-bold">
                P
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyCardDetailSaleForm;
