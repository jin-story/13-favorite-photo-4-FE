"use client";

import RandomPointModalContent from "@/components/modals/RandomPointModalContent";
import { pointService } from "@/lib/services/pointService";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/providers/ModalProvider";
import { useCallback, useEffect, useRef } from "react";

export function RandomPointProvider({ children }) {
  const { user } = useAuth();
  const { openModal } = useModal();
  const openModalRef = useRef(openModal);
  const timeoutRef = useRef(null);
  const nextAvailableAtRef = useRef(null);
  const scheduleNextRef = useRef(null);

  useEffect(() => {
    openModalRef.current = openModal;
  }, [openModal]);

  const openRandomPointModal = useCallback(() => {
    nextAvailableAtRef.current = null;
    openModalRef.current(
      <RandomPointModalContent
        onClaimed={(nextAvailableAt) =>
          scheduleNextRef.current(nextAvailableAt)
        }
      />,
    );
  }, []);

  const scheduleNext = useCallback(
    (nextAvailableAt) => {
      clearTimeout(timeoutRef.current);
      nextAvailableAtRef.current = nextAvailableAt ?? null;

      if (!nextAvailableAt) return;

      const delay = new Date(nextAvailableAt).getTime() - Date.now();

      if (delay <= 0) {
        openRandomPointModal();
        return;
      }

      timeoutRef.current = setTimeout(openRandomPointModal, delay);
    },
    [openRandomPointModal],
  );

  useEffect(() => {
    scheduleNextRef.current = scheduleNext;
  }, [scheduleNext]);

  useEffect(() => {
    if (!user) return;

    pointService
      .fetchDrawStatus()
      .then(({ canDraw, nextAvailableAt }) => {
        if (canDraw) {
          openRandomPointModal();
        } else {
          scheduleNext(nextAvailableAt);
        }
      })
      .catch((error) => {
        console.error("포인트 뽑기 상태 조회 실패:", error);
      });

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (!nextAvailableAtRef.current) return;

      if (Date.now() >= new Date(nextAvailableAtRef.current).getTime()) {
        openRandomPointModal();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timeoutRef.current);
    };
  }, [user, openRandomPointModal, scheduleNext]);

  return children;
}
