import clsx from "clsx";

const formatRelativeTime = (timeInput) => {
  if (!timeInput) return "";

  const now = new Date();
  const past = new Date(timeInput);

  if (isNaN(past.getTime())) return "";
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 3600) {
    return "방금 전";
  }

  const diffInHours = Math.floor(diffInSeconds / 3600);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // 1. 1시간 ~ 23시간 이내 -> "X시간 전"
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  // 2. 24시간 이후 ~ 6일 이내 -> "X일 전"
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  // 3. 7일 ~ 27일 이내 (4주 미만) -> "X주 전" (1주일 전 ~ 3주 전)
  if (diffInDays < 28) {
    return `${diffInWeeks}주 전`;
  }

  // 4. 28일 이후 (4주 이상) ~ 11개월 이내 -> "X개월 전" (1개월 전 ~ 11개월 전)
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  // 5. 12개월 이상 -> "X년 전"
  return `${diffInYears}년 전`;
};

/**
 * @component NotificationMessage
 * @description 알림 메시지와 경과 시간을 조건에 맞춰 보여주는 컴포넌트입니다.
 *
 * @param {Object} props
 * @param {string} [props.message="기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다"] - 알림 메시지 내용
 * @param {string | number | Date} props.time - 알림이 발생한 시간 (ISO 포맷 또는 타임스탬프)
 * @param {boolean} [props.state=false] - 알림 읽음 상태 여부
 */
export default function NotificationMessage({
  message = "기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다",
  time = "2026-06-14 20:53:24",
  state = true,
}) {
  const relativeTime = formatRelativeTime(time);
  return (
    <div
      className={clsx(
        "w-full h-[87px] flex flex-col p-5 border-b border-b-gray-400 gap-2.5 tablet:w-[300px] tablet:h-[107px]",
        state ? "" : "bg-white/5",
      )}
    >
      <p
        className={clsx(
          "text-noto-14-regular",
          state ? "text-gray-300" : "text-white",
        )}
      >
        {message}
      </p>
      <p className="text-noto-12-light text-gray-300">{relativeTime}</p>
    </div>
  );
}
