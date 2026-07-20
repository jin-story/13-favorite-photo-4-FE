"use client";

export default function Modal({ isOpen, onClose, children }) {
  // 모달이 닫힌 상태면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // 클릭된 요소가 backdrop 자체일 때만 모달 닫기
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center w-full h-dvh bg-black/80"
      onClick={handleBackdropClick}
    >
      <div className="w-fit h-fit bg-gray-500">{children}</div>
    </div>
  );
}
