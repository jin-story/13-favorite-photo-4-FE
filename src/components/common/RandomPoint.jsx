/**
 * @description 1시간마다 돌아오는 랜덤 포인트 타이머 UI 컴포넌트
 *
 * [💡 실무 사용법 가이드]
 * 1. 복잡한 타이머 계산(setInterval)은 본 컴포넌트 내부에서 하지 마세요.
 * 2. 상위(부모) 컴포넌트에서 1초마다 계산된 시간 문자열('MM분 SS초')을 `time` 프롭으로 쏴줍니다.
 * 3. 부모 컴포넌트에서 값이 매초 업데이트될 때마다 이 컴포넌트는 자동으로 리렌더링됩니다.
 *
 * @example
 * // 부모 컴포넌트에서의 호출 예시:
 * <RandomPoint time={timeLeft} />
 */

export default function RandomPoint({ time = "59분 59초", children }) {
  return (
    <div className="flex flex-col items-center gap-7.5 pc:gap-10 pc:mt-[80px] tablet:mt-[60px] mt-[60px]">
      <div className="font-baskin-robbins text-3xl tablet:text-4xl pc:text-baskin-46">
        <span className="text-white">랜덤</span>
        <span className="text-main">포인트</span>
      </div>
      <div className="flex flex-col items-center text-noto-16-bold text-white pc:text-noto-20-bold text-center">
        {children}
      </div>
      <div className="flex flex-col items-center gap-[5px] text-noto-14-regular pc:flex-row pc:gap-2.5">
        <p className="text-gray-300">다음 기회까지 남은 시간</p>
        <p className="text-main">{time}</p>
      </div>
    </div>
  );
}
