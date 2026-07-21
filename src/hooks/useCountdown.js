"use client";

import { useEffect, useState } from "react";

/**
 * @description targetAt(타임스탬프)까지 남은 시간을 매초 "MM분 SS초" 형태로 반환
 */
export function useCountdown(targetAt) {
  const [remaining, setRemaining] = useState(() => targetAt - Date.now());

  useEffect(() => {
    if (!targetAt) return;

    const id = setInterval(() => {
      setRemaining(targetAt - Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [targetAt]);

  const sec = Math.max(0, Math.floor(remaining / 1000));
  const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
  const seconds = String(sec % 60).padStart(2, "0");

  return `${minutes}분 ${seconds}초`;
}
