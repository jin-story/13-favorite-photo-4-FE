"use client";

import ButtonSecondary from "@/components/common/ButtonSecondary";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Result() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const grade = searchParams.get("grade");
  const errorMessage = searchParams.get("error");

  return (
    <div>
      <span>{!errorMessage ? "포토카드 생성 성공" : "포토카드 생성 실패"}</span>
      <div>
        <span>
          [{grade} | {name}]
        </span>
        <span>
          {!errorMessage
            ? "포토카드 생성에 성공했습니다"
            : "포토카드 생성에 실패했습니다."}
        </span>
      </div>
      <ButtonSecondary className="h-[55px] border border-gray-100 text-noto-16-regular">
        마이갤러리로 돌아가기
      </ButtonSecondary>
    </div>
  );
}
