"use client";

import RandomPointModalContent from "@/components/modals/RandomPointModalContent";
import { useModal } from "@/providers/ModalProvider";

export default function Page() {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    openModal(<RandomPointModalContent />);
  };

  return (
    <button
      type="button"
      onClick={handleOpenModal}
      className="text-noto-14-bold text-white underline"
    >
      테스트: 랜덤포인트 모달 열기
    </button>
  );
}
