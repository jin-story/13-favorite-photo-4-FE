"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import ic_filter from "@/assets/icons/filter.svg";
import SheetFilter from "./SheetFilter";

const ALL_CATEGORIES = ["grade", "genre", "availability"];

export default function Filter({
  categories = ALL_CATEGORIES, // 기본값: 전체 사용
  counts = {},
  totalAllCount = 0,
  filter,
  setFilter,
  totalCount,
  onApply,
}) {
  const [openFilter, setOpenFilter] = useState(false);

  // categories에 맞춰 초기 filter 객체를 동적으로 생성
  const initialFilter = useMemo(
    () =>
      categories.reduce((acc, key) => {
        acc[key] = [];
        return acc;
      }, {}),
    [categories],
  );

  const [filterState, setFilterState] = useState(initialFilter);

  const getFilteredCount = () => {
    const selectedKeys = categories.flatMap((key) => filterState[key] ?? []);

    if (selectedKeys.length === 0) {
      return totalAllCount;
    }

    return selectedKeys.reduce((sum, key) => sum + (counts[key] ?? 0), 0);
  };

  return (
    <>
      <button
        className="relative flex justify-center items-center border tablet:hidden rounded-xs min-w-[45px] min-h-[45px]"
        onClick={() => setOpenFilter(true)}
        aria-label="필터 열기"
      >
        <Image alt="필터" src={ic_filter} width={20} height={20} />
      </button>

      <SheetFilter
        categories={categories}
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        totalCount={totalCount}
        onApply={(finalFilter) => {
          onApply?.(finalFilter);
          setOpenFilter(false);
        }}
        onReset={() => {
          setFilter({
            grade: [],
            genre: [],
          });
        }}
      />
    </>
  );
}
