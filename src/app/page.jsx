import PrimaryButton from "@/components/common/ButtonPrimary";
import React from "react";

export default function Home() {
  return (
    <div>
      Home
      <PrimaryButton variant="thick" size="L">
        포토카드 구매하기
      </PrimaryButton>
      <PrimaryButton variant="thin" size="L">
        포토카드 교환하기
      </PrimaryButton>
      <PrimaryButton variant="thin" size="L" disabled>
        포토카드 교환하기
      </PrimaryButton>
    </div>
  );
}
