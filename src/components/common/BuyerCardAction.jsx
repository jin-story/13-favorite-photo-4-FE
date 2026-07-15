"use client";

import { useEffect } from "react";
import clsx from "clsx";
import PrimaryButton from "./ButtonPrimary";
import QuantityStepper from "./QuantityStepper";

const toSafeNumber = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const normalizeQuantityBounds = (minQuantity, maxQuantity) => {
  const normalizedMaxQuantity = Math.max(0, toSafeNumber(maxQuantity, 0));
  const normalizedMinQuantity = Math.min(
    Math.max(0, toSafeNumber(minQuantity, 0)),
    normalizedMaxQuantity,
  );

  return {
    min: normalizedMinQuantity,
    max: normalizedMaxQuantity,
  };
};

const clampQuantity = (value, min, max) => {
  if (max <= 0) return 0;

  const safeValue = toSafeNumber(value, min);
  return Math.min(Math.max(safeValue, min), max);
};

const BuyerCardAction = ({
  price = 0,
  quantity = 1,
  minQuantity = 1,
  maxQuantity = 1,
  onQuantityChange,
  onPurchase,
  disabled = false,
  className = "",
}) => {
  const safePrice = Math.max(0, toSafeNumber(price, 0));

  const { min: safeMinQuantity, max: safeMaxQuantity } =
    normalizeQuantityBounds(minQuantity, maxQuantity);

  const isSoldOut = safeMaxQuantity <= 0;
  const clampedQuantity = clampQuantity(
    quantity,
    safeMinQuantity,
    safeMaxQuantity,
  );

  useEffect(() => {
    if (quantity !== clampedQuantity) {
      onQuantityChange?.(clampedQuantity);
    }
  }, [quantity, clampedQuantity, onQuantityChange]);

  const totalPrice = safePrice * clampedQuantity;
  const isDisabled = disabled || isSoldOut;

  const handleQuantityChange = (nextQuantity) => {
    const nextClampedQuantity = clampQuantity(
      nextQuantity,
      safeMinQuantity,
      safeMaxQuantity,
    );

    onQuantityChange?.(nextClampedQuantity);
  };

  const handlePurchase = () => {
    if (isDisabled) return;
    onPurchase?.(clampedQuantity);
  };

  return (
    <section className={clsx("w-full bg-[#0F0F0F] text-white", className)}>
      <div className="flex items-center justify-between">
        <span className="text-noto-14-regular text-white pc:text-noto-16-regular">
          구매수량
        </span>

        <QuantityStepper
          value={clampedQuantity}
          min={safeMinQuantity}
          max={safeMaxQuantity}
          onChange={handleQuantityChange}
          disabled={isDisabled}
        />
      </div>

      <div className="mt-4 flex items-center justify-between pc:mt-5">
        <span className="text-noto-14-regular text-white pc:text-noto-16-regular">
          총 가격
        </span>

        <div className="flex items-center gap-1">
          <span className="text-noto-18-bold text-white pc:text-noto-20-bold">
            {totalPrice} P
          </span>
          <span className="text-noto-12-regular text-gray-300 pc:text-noto-14-regular">
            ({clampedQuantity}장)
          </span>
        </div>
      </div>

      <PrimaryButton
        variant="thin"
        onClick={handlePurchase}
        disabled={isDisabled}
        className="mt-8 pc:mt-10"
      >
        포토카드 구매하기
      </PrimaryButton>
    </section>
  );
};

export default BuyerCardAction;
