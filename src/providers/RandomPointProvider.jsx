"use client";

import RandomPointModalContent from "@/components/modals/RandomPointModalContent";
import { useModal } from "@/providers/ModalProvider";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const RandomPointContext = createContext(null);

/**
 * 랜덤포인트 모달을 "버튼 클릭"이 아니라 서버가 내려주는 nextAvailableAt 시각에
 * 맞춰 전역으로 자동 오픈시키는 스케줄러.
 *
 * TODO(API 준비되면):
 * 1. 마운트 시 GET으로 현재 상태 조회 → scheduleNext(data.nextAvailableAt)
 * 2. 박스 클로 claim 시 응답의 nextAvailableAt으로 다시 scheduleNext 호출
 *    (RandomPointModalContent의 onClaimed 콜백을 통해 전달됨)
 */
export function RandomPointProvider({ children }) {
  const { openModal } = useModal();
  const timeoutRef = useRef(null);
  const nextAvailableAtRef = useRef(null);

  const openRandomPointModal = useCallback(() => {
    nextAvailableAtRef.current = null;
    openModal(<RandomPointModalContent onClaimed={scheduleNext} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

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
    // TODO: 백엔드 API 연동 시 초기 상태 fetch로 교체
    // fetchRandomPointStatus().then(({ nextAvailableAt }) => scheduleNext(nextAvailableAt));

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (!nextAvailableAtRef.current) return;

      // 탭이 백그라운드에 있는 동안 setTimeout이 스로틀링되어
      // 정확한 시각에 못 열렸을 경우를 보정
      if (Date.now() >= new Date(nextAvailableAtRef.current).getTime()) {
        openRandomPointModal();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timeoutRef.current);
    };
  }, [openRandomPointModal]);

  return (
    <RandomPointContext.Provider value={{ scheduleNext }}>
      {children}
    </RandomPointContext.Provider>
  );
}

export function useRandomPoint() {
  const context = useContext(RandomPointContext);

  if (!context) {
    throw new Error(
      "useRandomPoint은 RandomPointProvider 안에서 사용해야 합니다.",
    );
  }

  return context;
}
