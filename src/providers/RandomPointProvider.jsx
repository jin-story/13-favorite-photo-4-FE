"use client";

import RandomPointModalContent from "@/components/modals/RandomPointModalContent";
import { pointService } from "@/lib/services/pointService";
import { useModal } from "@/providers/ModalProvider";
import { useCallback, useEffect, useRef } from "react";

/**
 * 랜덤포인트 모달을 "버튼 클릭"이 아니라 서버가 내려주는 nextAvailableAt 시각에
 * 맞춰 전역으로 자동 오픈시키는 스케줄러.
 *
 * 마운트 시 GET /point-draws로 현재 상태를 조회해 스케줄링하고,
 * 박스 claim 이후에는 RandomPointModalContent의 onClaimed 콜백을 통해
 * 응답의 nextAvailableAt으로 다시 scheduleNext가 호출된다.
 */
export function RandomPointProvider({ children }) {
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
  }, [openRandomPointModal, scheduleNext]);

  return children;
}
