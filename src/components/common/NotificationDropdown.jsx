"use client";

import React, { useEffect, useRef, useState } from "react";
import alarm_default from "@/assets/icons/alarm_default.svg";
import alarm_active from "@/assets/icons/alarm_active.svg";
import Image from "next/image";
import NotificationMessage from "./NotificationMessage";

/**
 * @component NotificationDropdown
 * @description 알림 목록을 보여주고, 무한 스크롤을 지원하는 순수 UI 드롭다운 컴포넌트입니다.
 * 모든 상태 관리와 API 호출 로직은 부모 컴포넌트로부터 전달받습니다.
 */
export default function NotificationDropdown({
  notifications = [],
  hasNextPage = false,
  isFetchingNextPage = false,
  isPending = false,
  onFetchNextPage = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      onFetchNextPage();
    }
  };

  // 읽지 않은 알림이 하나라도 있는지 확인
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
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute right-0 mt-2 w-[300px] max-h-[535px] z-50 overflow-x-hidden overflow-y-auto 
            [&::-webkit-scrollbar]:w-[4px] 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/15 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
        >
          {/* 첫 로딩 상태 */}
          {isPending && (
            <div className="p-5 text-center text-noto-12-regular text-gray-300">
              알림 불러오는 중...
            </div>
          )}

          {/* 데이터 빈 상태 */}
          {!isPending && notifications.length === 0 && (
            <div className="p-5 text-center text-noto-12-regular text-gray-300">
              새로운 알림이 없습니다
            </div>
          )}

          {/* 알림 리스트 */}
          {notifications.map((notification) => (
            <NotificationMessage
              key={notification.id}
              message={notification.message}
              time={notification.createdAt}
              state={notification.isRead}
            />
          ))}

          {/* 추가 페이지 데이터 로딩 상태 */}
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
