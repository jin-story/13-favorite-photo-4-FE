"use client";

import { useEffect } from "react";

const SUBSCRIBE_URL = "/api/notifications/subscribe";

export function useNotificationStream({ enabled, onNotification }) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const eventSource = new EventSource(SUBSCRIBE_URL);

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        console.error("SSE 알림 데이터 파싱 실패:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 알림 연결 오류:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, onNotification]);
}
