"use client";

import React, { useEffect, useRef, useState } from "react";
import alarm_default from "@/assets/icons/alarm_default.svg";
import alarm_active from "@/assets/icons/alarm_active.svg";
import Image from "next/image";
import NotificationMessage from "./NotificationMessage";
import { useInfiniteQuery } from "@tanstack/react-query";

// 💡 1. 가상의 API 호출 함수 (실제 API fetch로 대체)
const fetchNotifications = async ({ pageParam = 1 }) => {

  const LIMIT = 5;

  // 가상의 전체 데이터베이스 데이터 (테스트용으로 15개 준비)
  const TOTAL_MOCK_DATA = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    message: `알림 메시지 #${index + 1}: 새로운 이벤트가 발생했습니다.`,
    isRead: index > 2, 
    createdAt: new Date(Date.now() - index * 2 * 3600 * 1000).toISOString(), 
  }));

  const start = (pageParam - 1) * LIMIT;
  const end = start + LIMIT;
  const items = TOTAL_MOCK_DATA.slice(start, end);

  // 1초 딜레이를 주어 실제 네트워크 통신 느낌을 냅니다.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    items,
    nextPage: end < TOTAL_MOCK_DATA.length ? pageParam + 1 : undefined,
  };
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // 💡 2. React Query의 useInfiniteQuery 훅 세팅
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: fetchNotifications,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: isOpen, // 드롭다운이 열렸을 때만 데이터를 가져오기 시작함 (최적화)
    });

  // 💡 3. 바깥 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💡 4. 스크롤 끝 감지 핸들러
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // 오차 범위 5px 적용하여 바닥 근처에 닿았을 때 작동
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;

    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 모든 페이지의 데이터를 단일 배열로 플랫하게 합치기
  const notifications = data?.pages.flatMap((page) => page.items) || [];

  // 읽지 않은 알림이 하나라도 있는지 확인
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 알림 아이콘 버튼 */}
      <button
        className="relative cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {hasUnread ? (
          <Image alt="알림 있음" src={alarm_active} width={19} height={19} />
        ) : (
          <Image alt="알림 없음" src={alarm_default} width={19} height={19} />
        )}
      </button>

      {/* 📂 알림 드롭다운 창 */}
      {isOpen && (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute right-0 mt-2 w-[300px] max-h-[535px] z-50 overflow-x-hidden overflow-y-auto 
            [&::-webkit-scrollbar]:w-[4px] 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/15 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
        >
          {/* 로딩 중 UI */}
          {isLoading && (
            <div className="p-5 text-center text-noto-12-regular text-gray-300">
              알림 불러오는 중...
            </div>
          )}

          {/* 데이터가 비어있을 때 */}
          {!isLoading && notifications.length === 0 && (
            <div className="p-5 text-center text-noto-12-regular text-gray-300">
              새로운 알림이 없습니다
            </div>
          )}

          {/* 알림 리스트 렌더링 */}
          {notifications.map((notification) => (
            <NotificationMessage
              key={notification.id}
              message={notification.message}
              time={notification.createdAt}
              state={notification.isRead}
            />
          ))}

          {/* 추가 데이터를 가져오는 중일 때 하단 로딩 스피너 표시 */}
          {isFetchingNextPage && (
            <div className="p-3 text-center text-noto-12-light text-gray-400 bg-white/5 border-t border-gray-400">
              더 불러오는 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
