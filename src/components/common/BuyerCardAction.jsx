"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import PrimaryButton from "./ButtonPrimary";
import QuantityStepper from "./QuantityStepper";

const clampQuantity = (value, min, max) => {
  if (max <= 0) return 0;
  return Math.min(Math.max(value, min), max);
};

const BuyerCardAction = ({
  price = 0,
  minQuantity = 1,
  maxQuantity = 1,
  initialQuantity = 1,
  onPurchase,
  disabled = false,
  className = "",
}) => {
  const isSoldOut = maxQuantity <= 0;
  const safeMinQuantity = isSoldOut ? 0 : minQuantity;
  const safeMaxQuantity = Math.max(maxQuantity, 0);
  const safeInitialQuantity = clampQuantity(
    initialQuantity,
    safeMinQuantity,
    safeMaxQuantity,
  );

  const [quantity, setQuantity] = useState(safeInitialQuantity);

  useEffect(() => {
    setQuantity((prevQuantity) =>
      clampQuantity(prevQuantity, safeMinQuantity, safeMaxQuantity),
    );
  }, [safeMinQuantity, safeMaxQuantity]);

  const clampedQuantity = clampQuantity(
    quantity,
    safeMinQuantity,
    safeMaxQuantity,
  );

  const totalPrice = price * clampedQuantity;
  const isDisabled = disabled || isSoldOut;

  const handleQuantityChange = (nextQuantity) => {
    setQuantity(clampQuantity(nextQuantity, safeMinQuantity, safeMaxQuantity));
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
