"use client";

import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import { useModal } from "@/providers/ModalProvider";

export default function LoginRequiredModal() {
  const router = useRouter();
  const { closeModal } = useModal();

  function handleConfirm() {
    closeModal();
    router.push("/login");
  }

  return (
    <div className="flex w-[345px] flex-col items-center gap-[20px] px-[20px] pt-[60px] pb-[40px] text-center pc:w-[560px] pc:gap-[35px] pc:px-[40px] pc:pt-[80px] pc:pb-[60px]">
      <h2 className="text-noto-18-bold pc:text-noto-20-bold text-white">
        로그인이 필요합니다.
      </h2>

      <p className="text-noto-14-regular pc:text-noto-16-regular text-gray-300">
        로그인 하시겠습니까?
        <br />
        다양한 서비스를 편리하게 이용하실 수 있습니다.
      </p>

      <ButtonPrimary
        onClick={handleConfirm}
        className="text-noto-14-bold w-[120px] h-[55px] pc:h-[60px] pc:w-[170px]"
      >
        확인
      </ButtonPrimary>
    </div>
  );
}
