"use client";

import React, { useCallback, useRef } from "react";
import AlarmMessage from "./NotificationMessage";

/**
 * @component MobileNotification
 * @description 모바일 환경에서 알림 전체 목록을 보여주고, 무한 스크롤을 지원하는 순수 UI 컴포넌트입니다.
 * 비즈니스 로직(React Query, API 호출, 관찰자 바인딩 등)은 부모 컴포넌트가 담당합니다.
 */
export default function MobileNotification({
  notifications = [],
  hasNextPage = false,
  isFetchingNextPage = false,
  isPending = false,
  isError = false,
  onFetchNextPage = () => {},
}) {
  const observerRef = useRef(null);


  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage || isPending) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            onFetchNextPage();
          }
        },
        {
          rootMargin: "100px", 
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, isPending, hasNextPage, onFetchNextPage]
  );


  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="animate-pulse text-sm">알림 불러오는 중...</p>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        <p className="text-sm">알림을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-500">
      {notifications.length === 0 ? (

        <div className="text-center text-gray-200 py-20 text-sm">
          도착한 알림이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col">
          {notifications.map((alarm, index) => {
            const isLast = notifications.length === index + 1;

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
          })}

          {/* 추가 페이지 데이터를 불러오는 동안 하단 로딩바 표시 */}
          {isFetchingNextPage && (
            <div className="p-4 text-center text-xs text-gray-300 bg-white/5 animate-pulse">
              더 불러오는 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
}