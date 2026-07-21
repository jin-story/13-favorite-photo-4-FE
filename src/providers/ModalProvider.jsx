"use client";

import { createContext, useContext, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Modal from "@/components/common/Modal";
import { MODAL_COMPONENTS } from "./modalRegistry";

// Modal Context 생성
const ModalContext = createContext(null);

function UrlModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 modal 파라미터를 읽고, 레지스트리에서 해당 컴포넌트를 찾습니다.
  // ?modal=cart → MODAL_COMPONENTS.cart → CartModal
  const modalName = searchParams.get("modal");
  const ModalComponent = modalName ? MODAL_COMPONENTS[modalName] : null;

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    // params.delete("파라미터에 추가된 부분"); 추가해서 사용
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <Modal isOpen={Boolean(ModalComponent)} onClose={closeModal}>
      {ModalComponent && <ModalComponent onClose={closeModal} />}
    </Modal>
  );
}

export function ModalProvider({ children }) {
  // 모달 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 모달에 표시할 컨텐츠 (React Element)
  const [modalContent, setModalContent] = useState(null);

  // 닫기 버튼 노출 여부 등 모달 옵션 (예: 강제로 버튼 클릭 응답을 받아야 하는 예외 케이스)
  const [modalOptions, setModalOptions] = useState({});

  const openModal = (content, options = {}) => {
    setModalContent(content);
    setModalOptions(options);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  // Context에 전달할 값
  const contextValue = {
    isOpen,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* 방식 1: 상태 기반 모달 — openModal(JSX 내용)으로 엽니다 */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        // openModal(content, { showCloseButton: false })로 호출한 경우에만 X 버튼을 숨김
        showCloseButton={modalOptions.showCloseButton ?? true}
      >
        {modalContent}
      </Modal>

      {/* 방식 2: URL 기반 모달 — <Link href="?modal=이름">으로 엽니다 */}
      <Suspense fallback={null}>
        <UrlModal />
      </Suspense>
    </ModalContext.Provider>
  );
}

/**
 * useModal Hook
 *
 * 모달을 열고 닫는 함수에 접근할 수 있는 커스텀 훅입니다.
 * 아래 사용예제 참고해서 사용하세요.
 *
 * @example
 * function MyComponent() {
 *   const { openModal, closeModal } = useModal();
 *
 *   const handleClick = () => {
 *     openModal(
 *       <div>
 *         <h2>제목</h2>
 *         <p>내용</p>
 *         <button onClick={closeModal}>닫기</button>
 *       </div>
 *     );
 *   };
 *
 *   return <button onClick={handleClick}>모달 열기</button>;
 * }
 */
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal은 ModalProvider 안에서 사용해야 합니다.");
  }

  return context;
}
