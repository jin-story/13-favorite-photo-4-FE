"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Image from "next/image";

import closeIcon from "@/assets/icons/close.svg";
import refreshIcon from "@/assets/icons/exchange.svg";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Grade from "./Grade";

const filterOptions = {
  grade: {
    title: "등급",
    options: [
      { label: "COMMON", value: "COMMON" },
      { label: "RARE", value: "RARE" },
      { label: "SUPER RARE", value: "SUPER_RARE" }, //서로 다른 값 꼭 필요하지 않으면 값은 가
      { label: "LEGENDARY", value: "LEGENDARY" },
    ],
  },

  genre: {
    title: "장르",
    options: [
      { label: "앨범", value: "ALBUM" },
      { label: "특전", value: "SPECIAL" },
      { label: "팬싸", value: "FAN_SIGN" },
      { label: "시즌그리팅", value: "SEASON_GREETING" },
      { label: "팬미팅", value: "FAN_MEETING" },
      { label: "콘서트", value: "CONCERT" },
      { label: "MD", value: "MD" },
      { label: "콜라보", value: "COLLABORATION" },
      { label: "팬클럽", value: "FAN_CLUB" },
      { label: "기타", value: "ETC" },
    ],
  },

  availability: {
    title: "매진 여부",
    options: [
      { label: "판매 중", value: "SALE" },
      { label: "판매 완료", value: "SOLD_OUT" },
    ],
  },
};

export default function SheetFilter({
  open,
  onClose,
  categories = ["grade", "genre", "availability"],
  filter,
  setFilter,

  counts = {},

  totalCount = 0,

  onApply,
  onReset,
}) {
  const sheetRef = useRef(null);
  const [tab, setTab] = useState("grade");

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  const current = filterOptions[tab];

  // 토글 클릭 방식
  const toggleFilter = (category, value) => {
    setFilter((prev) => {
      const selected = prev[category];

      const exists = selected.includes(value);

      return {
        ...prev,
        [category]: exists
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      };
    });
  };

  //초기화
  const handleReset = () => {
    const emptyFilter = categories.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    setFilter(emptyFilter);
    onReset?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end tablet:hidden bg-black/60">
      <div
        ref={sheetRef}
        className="flex flex-col w-full h-[480px] bg-[#1b1b1b] rounded-t-[16px]"
      >
        {/* Header */}
        <div className="relative flex justify-center items-center h-[52px] gap-[10px] rounded-t-[20px]">
          <span className="text-gray-400 text-noto-16-regular">필터</span>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-[15px]"
            aria-label="닫기"
          >
            <Image src={closeIcon} alt="" className="w-[24px] brightness-35" />
          </button>
        </div>

        {/* Tab */}
        <div className="flex h-[52px] py-[0px] px-[24px] gap-[24px] border border-gray-500">
          {Object.entries(filterOptions)
            .filter(([key]) => categories.includes(key))
            .map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={clsx(
                  "flex-1 py-[16px] px-[16px] justify-center items-center text-noto-14-regular border-b",
                  tab === key
                    ? "border-white text-white"
                    : "border-transparent text-gray-400",
                )}
              >
                {value.title}
              </button>
            ))}
        </div>

        {/* List */}
        <div className="flex-1 max-h-[320px] overflow-y-auto text-gray-300 text-noto-14-regular scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {current.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleFilter(tab, option.value)}
              className={clsx(
                "flex justify-between items-center w-full px-[32px] py-[16px]",
                filter[tab].includes(option.value) &&
                  "bg-gray-500 text-gray-100",
              )}
            >
              {tab === "grade" ? (
                <Grade type="sheetfilter" grade={option.label} />
              ) : (
                <span>{option.label}</span>
              )}

              <span>{counts[option.value] ?? 0}개</span>
            </button>
          ))}
        </div>
        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between max-w-[345px] pl-[8px] gap-[10px] mx-auto pb-[40px]">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center max-h-[55px] py-[15px] px-[15px]"
          >
            <Image
              src={refreshIcon}
              alt="초기화"
              className="w-[24px] brightness-35"
            />
          </button>

          <ButtonPrimary
            variant="thick"
            className="flex items-center justify-center max-w-[272px] max-h-[55px] text-noto-16-bold shrink-0"
            onClick={() => onApply(filter)}
          >
            {totalCount}개 포토보기
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

// 사용법:
// {
//   const [openFilter, setOpenFilter] = useState(false);

//   const [filter, setFilter] = useState({
//     grade: [],
//     genre: [],
//     availability: [],
//   });

//   const counts = {
//     COMMON: 120,
//     RARE: 80,
//     SUPER_RARE: 32,
//     LEGENDARY: 5,

//     TRAVEL: 50,
//     LANDSCAPE: 30,
//     PERSON: 60,
//     OBJECT: 97,

//     SALE: 180,
//     SOLD_OUT: 57,
//   };

//   // 초기값
//   const totalAllCount = 0;

//   // 선택된 필터에 따른 동적 개수 계산
//   const getFilteredCount = () => {
//     const hasGrade = filter.grade.length > 0;
//     const hasGenre = filter.genre.length > 0;
//     const hasAvailability = filter.availability.length > 0;

//     // 아무 필터도 선택되지 않았다면 전체 개수 반환
//     if (!hasGrade && !hasGenre && !hasAvailability) {
//       return totalAllCount;
//     }

//     // 현재 선택된 항목들의 숫자를 합산
//     const selectedKeys = [
//       ...filter.grade,
//       ...filter.genre,
//       ...filter.availability,
//     ];
//     return selectedKeys.reduce((sum, key) => sum + (counts[key] ?? 0), 0);
//   };

//  {/* 리턴값 */}
//   return (
//     <>
//       {/* 필터 아이콘 */}
//       <button onClick={() => setOpenFilter(true)}>
//         <Image src={filterIcon} alt="필터" />
//       </button>

//       {/* SheetFilter */}
//       <SheetFilter
//         open={openFilter}
//         onClose={() => setOpenFilter(false)}
//         filter={filter}
//         setFilter={setFilter}
//         counts={counts}
//         totalCount={getFilteredCount()}
//         onApply={() => {
//           console.log(filter);
//           setOpenFilter(false);
//         }}
//         onReset={() => {
//           setFilter({
//             grade: [],
//             genre: [],
//             availability: [],
//           });
//         }}
//       />
//     </>
//   );
// }
