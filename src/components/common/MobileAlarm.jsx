'use client'

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
{
  /* 예시 fetch 코드 */
}
const fetchMobileAlarms = async ({ pageParam = 1 }) => {
  const res = await fetch(`/api/alarms?page=${pageParam}&limit=10`);
  if (!res.ok) throw new Error("알림 로드 실패");
  return res.json();
};

export default function MobileAlarm() {
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
  return <div className="w-full ">

  </div>;
}
