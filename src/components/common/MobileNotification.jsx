"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef } from "react";
import AlarmMessage from "./NotificationMessage";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "TRANSACTION_COMPLETED",
    message: "김민수님이 [SUPER_RARE | 우주 전사]를 1장 구매했습니다.",
    isRead: false,
    createdAt: "2026-07-16T12:00:00.000Z",
  },
  {
    id: 2,
    type: "EXCHANGE_PROPOSAL_RECEIVED",
    message:
      "이지혜님이 [LEGENDARY | 심해의 고래] 포토카드 교환을 제안했습니다.",
    isRead: false,
    createdAt: "2026-07-16T11:30:00.000Z",
  },
  {
    id: 3,
    type: "MARKET_POSTING_SOLD_OUT",
    message: "[COMMON | 서울의 밤] 카드가 품절되었습니다.",
    isRead: true,
    createdAt: "2026-07-16T10:00:00.000Z",
  },
  {
    id: 4,
    type: "EXCHANGE_PROPOSAL_APPROVED",
    message: "보내신 [RARE | 단풍나무] 교환 제안이 수락되었습니다!",
    isRead: true,
    createdAt: "2026-07-15T18:20:00.000Z",
  },
  {
    id: 5,
    type: "EXCHANGE_PROPOSAL_REJECTED",
    message: "보내신 [COMMON | 길고양이] 교환 제안이 거절되었습니다.",
    isRead: true,
    createdAt: "2026-07-15T15:10:00.000Z",
  },
  // 💡 아래는 스크롤 페이징 테스트를 위해 추가한 임시 데이터들입니다.
  {
    id: 6,
    type: "TRANSACTION_COMPLETED",
    message: "박철수님이 카드를 구매했습니다.",
    isRead: true,
    createdAt: "2026-07-15T14:00:00.000Z",
  },
  {
    id: 7,
    type: "MARKET_POSTING_SOLD",
    message: "올리신 판매글의 상품이 판매되었습니다.",
    isRead: true,
    createdAt: "2026-07-15T13:00:00.000Z",
  },
  {
    id: 8,
    type: "EXCHANGE_PROPOSAL_RECEIVED",
    message: "새로운 교환 제안이 있습니다.",
    isRead: true,
    createdAt: "2026-07-15T12:00:00.000Z",
  },
  {
    id: 9,
    type: "TRANSACTION_COMPLETED",
    message: "거래가 안전하게 완료되었습니다.",
    isRead: true,
    createdAt: "2026-07-15T11:00:00.000Z",
  },
  {
    id: 10,
    type: "MARKET_POSTING_SOLD_OUT",
    message: "상품이 매진되었습니다.",
    isRead: true,
    createdAt: "2026-07-15T10:00:00.000Z",
  },
  {
    id: 11,
    type: "TRANSACTION_COMPLETED",
    message: "[페이징 테스트] 2페이지 첫 알림입니다.",
    isRead: true,
    createdAt: "2026-07-14T09:00:00.000Z",
  },
  {
    id: 12,
    type: "TRANSACTION_COMPLETED",
    message: "[페이징 테스트] 2페이지 두 번째 알림입니다.",
    isRead: true,
    createdAt: "2026-07-14T08:00:00.000Z",
  },
];

const fetchMobileAlarms = async ({ pageParam = 1 }) => {
  /* 
    ========================================================================
    [추후 변경 가이드]
    백엔드 API가 완성되면, 아래 목데이터 처리 영역(await new Promise ~ return)을 주석 처리하고
    아래의 진짜 fetch 코드를 활성화하시면 됩니다!

    const res = await fetch(`/api/alarms?page=${pageParam}&limit=5`);
    if (!res.ok) throw new Error("알림 로드 실패");
    return res.json();
    ========================================================================
  */

  // 0.5초 딜레이를 주어 실제 서버와 통신하는 느낌(로딩 애니메이션 확인용)을 냅니다.
  await new Promise((resolve) => setTimeout(resolve, 500));

  const limit = 5; // 한 페이지당 보여줄 개수
  const startIndex = (pageParam - 1) * limit;
  const endIndex = startIndex + limit;

  // 전체 데이터 중 현재 페이지 영역만 자르기
  const paginatedData = MOCK_NOTIFICATIONS.slice(startIndex, endIndex);
  const hasNext = endIndex < MOCK_NOTIFICATIONS.length;

  return {
    data: paginatedData,
    nextPage: hasNext ? pageParam + 1 : null,
  };
};

export default function MobileNotification() {
  const observerRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["mobileAlarms"],
      queryFn: fetchMobileAlarms,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });
  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "100px",
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const allNotifications = data?.pages.flatMap((page) => page.data) || [];

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="animate-pulse text-sm">알림 불러오는 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        <p className="text-sm">알림을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }
  return (
    <div className="w-full bg-gray-500">
      {allNotifications.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-sm">
          도착한 알림이 없습니다.
        </div>
      ) : (
        allNotifications.map((alarm, index) => {
          const isLast = allNotifications.length === index + 1;
          if (isLast) {
            return (
              <div key={alarm.id} ref={lastElementRef}>
                <AlarmMessage
                  message={alarm.message}
                  time={alarm.createdAt}
                  state={alarm.isRead}
                />
              </div>
            );
          }
          return (
            <AlarmMessage
              key={alarm.id}
              message={alarm.message}
              time={alarm.createdAt}
              state={alarm.isRead}
            />
          );
        })
      )}
    </div>
  );
}
