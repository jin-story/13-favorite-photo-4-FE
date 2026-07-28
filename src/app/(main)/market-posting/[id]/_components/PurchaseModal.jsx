"use client";

import PrimaryButton from "@/components/common/ButtonPrimary";
import { marketService } from "@/lib/services/marketService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import React from "react";

export default function PurchaseModal({
  id,
  grade,
  cardName,
  quantity,
  postingDetail,
  onClose,
}) {
  const router = useRouter();
  const purchaseMutation = useMutation({
    mutationFn: () => marketService.purchasePosting(id, quantity),
    onSuccess: () => {
      // 모달 닫기
      if (onClose) onClose();

      // 성공 페이지로 이동할 쿼리 파라미터 설정
      const resultParams = new URLSearchParams({
        grade: grade || "",
        cardName: cardName || "",
        quantity: String(quantity),
      });

      router.push(
        `/market-posting/${id}/buyer/purchase-success?${resultParams.toString()}`,
      );
    },
    onError: (error) => {
      if (onClose) onClose();

      const resultParams = new URLSearchParams({
        grade: grade || "",
        cardName: cardName || "",
        quantity: String(quantity),
        error: error?.message || "구매 실패", // 👈 실패 시 error 파라미터 추가
      });

      router.push(
        `/market-posting/${id}/buyer/purchase-error?${resultParams.toString()}`,
      );
    },
  });

  const handleClick = () => {
    purchaseMutation.mutate();
  };

  return (
    <div className="w-[345px] h-[291px] flex flex-col justify-center items-center gap-7.5 tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[375px] pc:gap-10">
      <h2 className="text-noto-18-bold pc:text-noto-20-bold">포토카드 구매</h2>
      <p className="text-noto-12-bold pc:text-noto-14-bold">
        [{grade} | {cardName}]
      </p>
      <p className="text-noto-12-bold pc:text-noto-14-bold">
        {quantity}장을 구매하시겠습니까?
      </p>
      <PrimaryButton variant="thinXS" onClick={handleClick}>
        구매하기
      </PrimaryButton>
    </div>
  );
}
