

## 📦 전역 모달 시스템 사용 가이드

우리 프로젝트의 모달은 사용 목적에 따라 두 가지 방식으로 구현할 수 있습니다. 상황에 맞는 적절한 방식을 선택하여 사용해 주세요.

---

### 1️⃣ 방식 1: 상태(State) 기반 모달 사용법 (일반 확인창 / 폼 입력용)

컴포넌트 내부에 별도의 오픈 상태(`useState`)를 만들지 않고, `useModal` 훅의 `openModal` 함수에 띄우고 싶은 UI(JSX)를 통째로 넘겨서 실행합니다.

#### 💻 사용 예시

```jsx
"use client";

import { useModal } from "@/providers/ModalProvider";

export default function CardDeleteButton() {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    // openModal 안에 원하는 컴포넌트나 HTML 구조를 주입합니다.
    openModal(
      <div className="p-6 text-center text-white flex flex-col gap-5">
        <h3 className="text-xl font-bold">포토카드를 삭제하시겠습니까?</h3>
        <p className="text-gray-300">삭제된 카드는 복구할 수 없습니다.</p>
        
        <div className="flex justify-center gap-3">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-600 rounded">
            취소
          </button>
          <button onClick={() => { /* 삭제 로직 */ closeModal(); }} className="px-4 py-2 bg-red-600 rounded">
            삭제하기
          </button>
        </div>
      </div>
    );
  };

  return <button onClick={handleOpenModal}>카드 삭제</button>;
}

```

---

### 2️⃣ 방식 2: URL 쿼리 기반 모달 사용법 (공유 가능한 모달 / 상세 페이지용)

새로고침을 해도 모달 상태가 유지되거나, 링크를 복사해서 타인에게 공유했을 때 모달이 열린 채로 진입해야 하는 경우 사용합니다.

#### 🛠️ 사전 준비 (파일 생성 및 Registry 등록)

1. `src/components/modals/` 폴더 내부에 작업할 모달 파일을 생성합니다.
* 예시: `src/components/modals/CartModal.jsx` 생성


2. 생성한 모달을 `src/providers/modalRegistry.jsx` 파일에 가져와 쿼리 키 이름과 매핑해 줍니다.

```jsx
// src/providers/modalRegistry.jsx
import CartModal from "@/components/modals/CartModal"; // 💡 1번에서 생성한 파일 임포트

export const MODAL_COMPONENTS = {
  cart: CartModal, // 💡 URL에 ?modal=cart 가 들어오면 CartModal을 렌더링함
};

```

#### 💻 사용 예시

`Link` 태그의 쿼리 스트링만으로 별도의 이벤트 핸들러 없이 모달을 쉽게 제어할 수 있습니다. 함수 내부에서 열어야 할 때는 `router.push('?modal=cart', { scroll: false })`를 활용하세요.

```jsx
import Link from "next/link";

export default function ProductCard() {
  return (
    <div className="border p-4">
      <h4>최애 포토카드 상품</h4>
      {/* 💡 링크 클릭 시 자동으로 URL 주소가 변경되면서 레지스트리에 등록된 모달이 뜹니다. */}
      <Link className="text-blue-500 underline" href="?modal=cart" scroll={false}>
        장바구니 담기 (모달 열기)
      </Link>
    </div>
  );
}

```

#### 🚪 모달 내부에서 "닫기" 처리

URL 기반 모달은 `ModalProvider`가 내부 컴포넌트에 `onClose` 함수를 Props로 알아서 주입해 줍니다. 모달 내부에서 닫기 버튼을 만들 때 이 Props를 꺼내서 바인딩해 주면 됩니다.

```jsx
// src/components/modals/CartModal.jsx
export default function CartModal({ onClose }) {
  return (
    <div className="p-5 text-white">
      <p>장바구니에 상품이 성공적으로 담겼습니다.</p>
      {/* 💡 주입받은 onClose를 호출하면 URL 파라미터가 정리되면서 모달이 닫힙니다. */}
      <button onClick={onClose} className="mt-4 text-sm underline">
        닫기
      </button>
    </div>
  );
}

```


