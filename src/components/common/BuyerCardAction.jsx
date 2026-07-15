"use client";

import { useState } from "react";
import clsx from "clsx";
import PrimaryButton from "./ButtonPrimary";
import QuantityStepper from "./QuantityStepper";

const BuyerCardAction = ({
  price = 0,
  minQuantity = 1,
  maxQuantity = 1,
  initialQuantity = 1,
  onPurchase,
  disabled = false,
  className = "",
}) => {
  const safeInitialQuantity = Math.min(
    Math.max(initialQuantity, minQuantity),
    maxQuantity,
  );

  const [quantity, setQuantity] = useState(safeInitialQuantity);

  const totalPrice = price * quantity;
  const isSoldOut = maxQuantity <= 0;
  const isDisabled = disabled || isSoldOut;

  const handlePurchase = () => {
    if (isDisabled) return;
    onPurchase?.(quantity);
  };

  return (
    <section className={clsx("w-full bg-[#0F0F0F] text-white", className)}>
      <div className="flex items-center justify-between">
        <span className="text-noto-14-regular text-white pc:text-noto-16-regular">
          구매수량
        </span>

        <QuantityStepper
          value={quantity}
          min={minQuantity}
          max={maxQuantity}
          onChange={setQuantity}
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
            ({quantity}장)
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
