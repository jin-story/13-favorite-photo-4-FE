"use client";

import React, { useState } from "react";
import { Drawer } from "vaul";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import close from "@/assets/icons/close.svg";
import Gnb from "../common/Gnb";
import Photocard from "../common/Photocard";
import TabletPhotoCard from "../common/TabletPhotoCard";
import InputTextbox from "../common/InputTextbox";
import ButtonSecondary from "../common/ButtonSecondary";
import PrimaryButton from "../common/ButtonPrimary";
import { marketService } from "@/lib/services/marketService";
import { userService } from "@/lib/services/userService";

export default function ExchangeBuyerModal({ onClose }) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const postingId = params?.id;
  const cardId = searchParams.get("cardId"); // 선택한 내 카드 ID (userInventoryId)

  // 1. 교환 제안 내용 상태 관리
  const [content, setContent] = useState("");

  // 2. 실제 보유 포토카드 목록 조회 API 연동
  const { data: myCardsData } = useQuery({
    queryKey: ["myInventories"],
    queryFn: async () => {
      const response = await userService.getMyInventories({});
      return response?.list || [];
    },
  });

  // 3. 목록에서 URL의 cardId와 일치하는 카드 단건 추출
  const selectedCard = myCardsData?.find(
    (card) =>
      String(
        card.id || card.userInventoryId || card.inventoryId || card.photoCardId,
      ) === String(cardId),
  );

  // 💡 4. 데이터 매핑 (로딩 중이거나 없을 때 에러 방지용 안전한 빈 객체 구조 적용)
  const normalizedCard = selectedCard
    ? {
        ...selectedCard.photoCard,
        ...selectedCard,
        id: selectedCard.id || selectedCard.userInventoryId,
        name:
          selectedCard.photoCard?.name || selectedCard.name || "포토카드 이름",
        imageUrl:
          selectedCard.photoCard?.imageUrl || selectedCard.imageUrl || "",
        grade: selectedCard.photoCard?.grade || selectedCard.grade || "COMMON",
        genre: selectedCard.photoCard?.genre || selectedCard.genre || "기타",
        makerNickname:
          selectedCard.photoCard?.creator?.nickname ||
          selectedCard.photoCard?.maker?.nickname ||
          selectedCard.makerNickname ||
          "알 수 없음",
        price:
          selectedCard.photoCard?.minPrice ||
          selectedCard.photoCard?.price ||
          selectedCard.price ||
          0,
        totalQuantity:
          selectedCard.ownedQuantity || selectedCard.totalQuantity || 1,
      }
    : {
        name: "로딩 중...",
        makerNickname: "알 수 없음",
        grade: "COMMON",
        genre: "기타",
        price: 0,
        totalQuantity: 1,
      };

  // 5. 교환 제안 API 뮤테이션 (성공 시 success, 실패 시 에러 메시지를 담아 error 페이지로 라우팅)
  const exchangeMutation = useMutation({
    mutationFn: (payload) => marketService.requestExchange(postingId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myExchangeOffers"] });
      router.push(`/market-posting/${postingId}/buyer/exchange-success`);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "교환 제안에 실패했습니다.";
      router.push(
        `/market-posting/${postingId}/buyer/exchange-error?error=${encodeURIComponent(
          errorMessage,
        )}`,
      );
    },
  });

  // 교환하기 버튼 클릭 핸들러
  const handleExchangeSubmit = () => {
    const rawId =
      cardId ||
      selectedCard?.id ||
      selectedCard?.userInventoryId ||
      selectedCard?.inventoryId;

    const targetInventoryId = Number(rawId);

    if (!targetInventoryId || isNaN(targetInventoryId)) {
      alert("교환할 올바른 포토카드를 선택해 주세요.");
      return;
    }

    exchangeMutation.mutate({
      offeredInventoryId: targetInventoryId,
      message: content,
    });
  };

  const handleClose = () => {
    if (postingId) {
      router.push(`/market-posting/${postingId}/buyer`);
    }
    onClose?.();
  };

  return (
    <Drawer.Root open={true} onOpenChange={(open) => !open && handleClose()}>
      <Drawer.Portal>
        {/* 백드롭 */}
        <Drawer.Overlay className="fixed inset-0 z-[9999] bg-black/80" />

        {/* 드로어 컨텐츠 영역 */}
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col bg-gray-500 text-white outline-none focus:outline-none focus-visible:outline-none h-full tablet:h-[60vh] tablet:rounded-t-[20px] pc:inset-auto pc:left-1/2 pc:top-1/2 pc:-translate-x-1/2 pc:-translate-y-1/2 pc:w-[1160px] pc:h-[85vh] pc:rounded-[0px] overflow-hidden">
          {/* 상단 고정 영역 */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="hidden pc:flex absolute top-[30px] right-[30px] z-20 items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              aria-label="모달 닫기"
            >
              <Image src={close} alt="닫기버튼" width={32} height={32} />
            </button>

            <section className="tablet:hidden">
              <Gnb mobileType="sub" />
            </section>

            <div className="hidden tablet:block mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-400 pc:hidden" />
          </div>

          {/* 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto px-4 tablet:px-8 pb-12 [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:bg-[var(--gray-gray400,#5A5A5A)] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="flex flex-col w-full max-w-[345px] tablet:max-w-[704px] mx-auto pc:max-w-[920px]">
              {/* 타이틀 영역 */}
              <span className="mt-[30px] pc:mt-[60px] hidden tablet:block text-baskin-16 pc:text-baskin-24 text-gray-300">
                포토카드 교환하기
              </span>
              <section className="mt-6 tablet:mt-10 flex flex-col gap-2.5">
                <span className="text-baskin-24 text-baskin-40">
                  {normalizedCard?.name}
                </span>
                <div className="w-full h-[2px] bg-white" />
              </section>

              {/* 태블릿 이상에서 가로 정렬 */}
              <section className="flex flex-col tablet:flex-row tablet:items-start tablet:gap-5 pc:gap-10 mb-10">
                {/* 카드 영역 */}
                <div className="mt-[26px] tablet:mt-10">
                  <div className="tablet:hidden">
                    <TabletPhotoCard type="나의 카드" card={normalizedCard} />
                  </div>
                  <div className="hidden tablet:block">
                    <Photocard type="나의 카드" card={normalizedCard} />
                  </div>
                </div>

                {/* 입력 및 버튼 영역 */}
                <div className="w-full flex flex-col">
                  <div className="mt-[120px] tablet:mt-10">
                    <InputTextbox
                      label="교환 제시 내용"
                      placeholder="내용을 입력해 주세요"
                      value={content}
                      onChange={(value) => setContent(value)}
                    />
                  </div>

                  <div className="mt-11 tablet:mt-[60px] flex gap-[15px] pc:gap-5">
                    <ButtonSecondary
                      onClick={handleClose}
                      className="rounded-xs w-[165px] h-[55px] border text-noto-16-regular pc:w-[210px] pc:h-[60px] pc:text-noto-18-regular"
                    >
                      취소하기
                    </ButtonSecondary>
                    <PrimaryButton
                      onClick={handleExchangeSubmit}
                      disabled={exchangeMutation.isPending}
                      className="rounded-xs w-[165px] h-[55px] text-noto-16-regular pc:w-[210px] pc:h-[60px] pc:text-noto-18-regular"
                    >
                      {exchangeMutation.isPending ? "신청 중..." : "교환하기"}
                    </PrimaryButton>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
