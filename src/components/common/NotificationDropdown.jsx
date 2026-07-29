"use client";

import alarm_active from "@/assets/icons/alarm_active.svg";
import alarm_default from "@/assets/icons/alarm_default.svg";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import NotificationMessage from "./NotificationMessage";

/**
 * @component NotificationDropdown
 * @description 알림 목록을 보여주고, Intersection Observer 기반으로 무한 스크롤을 지원하는 순수 UI 드롭다운 컴포넌트입니다.
 */
export default function NotificationDropdown({
  notifications = [],
  hasNextPage = false,
  isFetchingNextPage = false,
  isPending = false,
  isError = false,
  onFetchNextPage = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const observerRef = useRef(null);

  // 바깥 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sentinelRef = useCallback(
    (node) => {
      if (isPending || isFetchingNextPage || isError || !hasNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onFetchNextPage();
          }
        },
        {
          root: document.querySelector(".dropdown-scroll-container"),
          rootMargin: "50px",
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [isPending, isFetchingNextPage, isError, hasNextPage, onFetchNextPage],
  );

  useEffect(() => {
    if (!isOpen && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [isOpen]);

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 알림 아이콘 버튼 */}
      <button
        className="relative cursor-pointer p-2 hover:opacity-80 transition-opacity"
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
          className="dropdown-scroll-container absolute right-0 mt-1 top-[25px] w-[300px] max-h-[535px] z-50 overflow-x-hidden overflow-y-auto 
            bg-zinc-900 border border-gray-400 rounded shadow-lg
            [&::-webkit-scrollbar]:w-[4px] 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/15 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
        >
          {/* 1. 첫 로딩 상태 */}
          {isPending && (
            <div className="p-5 text-center text-noto-12-regular text-gray-300">
              알림 불러오는 중...
            </div>
          )}

          {/* 2. 에러 상태 */}
          {!isPending && isError && (
            <div className="p-5 text-center flex flex-col items-center justify-center gap-2">
              <span className="text-noto-12-regular text-red-400">
                알림을 불러오지 못했습니다.
              </span>
            </div>
          )}

          {/* 3. 정상 완료되었으나 데이터가 비어 있는 상태 */}
          {!isPending && !isError && notifications.length === 0 && (
            <div className="p-5 text-center text-noto-12-regular text-gray-300">
              새로운 알림이 없습니다
            </div>
          )}

          {/* 4. 알림 리스트 */}
          {!isPending &&
            !isError &&
            notifications.map((notification) => (
              <NotificationMessage
                key={notification.id}
                message={notification.message}
                time={notification.createdAt}
                state={notification.isRead}
              />
            ))}

          {/* 5. 추가 페이지 데이터 로드 중 스피너 표시 */}
          {!isError && isFetchingNextPage && (
            <div className="p-3 text-center text-noto-12-light text-gray-400 bg-white/5 border-t border-gray-400">
              더 불러오는 중...
            </div>
          )}

          {/* 6. 무한 스크롤 감지용 Sentinel (다음 페이지가 있을 때만 렌더링) */}
          {!isPending && !isError && hasNextPage && !isFetchingNextPage && (
            <div ref={sentinelRef} className="h-1 w-full" />
          )}
        </div>
      )}
    </div>
  );
}
