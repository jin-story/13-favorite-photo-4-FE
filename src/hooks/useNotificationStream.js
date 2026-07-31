"use client";

import { useEffect } from "react";

const SUBSCRIBE_URL = "/api/notifications/subscribe";

export function useNotificationStream({ enabled, onNotification }) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const eventSource = new EventSource(SUBSCRIBE_URL);

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      onNotification(notification);
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, onNotification]);
}
