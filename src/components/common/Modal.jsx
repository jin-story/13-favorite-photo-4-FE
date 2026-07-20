"use client";

export default function Modal({ isOpen, onClose, children }) {
  // 모달이 닫힌 상태면 아무것도 렌더링하지 않음
  useEffect(() => {
    if (!isOpen) return;

    // 1. 화면 스크롤 차단
    document.body.style.overflow = "hidden";

    // 2. ESC 키 감지 이벤트 핸들러
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    // 3. 모달이 닫히거나 언마운트될 때 원래 상태로 복구 (클린업)
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 모달이 닫힌 상태면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // 클릭된 요소가 backdrop 자체일 때만 모달 닫기
    if (e.target === e.currentTarget) {
      onClose?.();
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
