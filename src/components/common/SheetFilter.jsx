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
      { label: "SUPER RARE", value: "SUPER_RARE" },
      { label: "LEGENDARY", value: "LEGENDARY" },
    ],
  },

  genre: {
    title: "장르",
    options: [
      { label: "여행", value: "TRAVEL" },
      { label: "풍경", value: "LANDSCAPE" },
      { label: "인물", value: "PERSON" },
      { label: "사물", value: "OBJECT" },
    ],
  },

  sale: {
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
    const handleClick = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const current = filterOptions[tab];

  return (
    <div className="fixed inset-0 z-50 flex items-end tablet:hidden">
      <div
        ref={sheetRef}
        className="w-full h-[480px] bg-[#1b1b1b] rounded-t-[16px]"
      >
        {/* Header */}
        <div className="relative flex justify-center items-center h-[52px] gap-[10px] rounded-t-[20px]">
          <span className="text-gray-400 text-noto-16-regular">필터</span>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-[15px]"
          >
            <Image src={closeIcon} alt="" className="w-[24px] brightness-35" />
          </button>
        </div>

        {/* Tab */}
        <div className="flex h-[52px] py-[0px] px-[24px] gap-[24px] border border-gray-500">
          {Object.entries(filterOptions).map(([key, value]) => (
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
        <div className="flex-1 overflow-y-auto text-gray-300 text-noto-14-regular">
          {current.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  [tab]: option.value,
                }))
              }
              className={clsx(
                "flex justify-between items-center w-full px-[32px] py-[16px]",
                filter[tab] === option.value && "bg-gray-500 text-gray-100",
              )}
            >
              {tab === "grade" ? (
                <Grade type="sheetfilter" grade={option.value} />
              ) : (
                <span>{option.label}</span>
              )}

              <span>{counts[option.value] ?? 0}개</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between max-w-[345px] pl-[8px] gap-[10px] mx-auto mb-[40px]">
          <button
            type="button"
            onClick={() => {
              onReset?.();
            }}
            className="flex-1 justify-center items-center h-[55px] py-[15px] px-[15px]"
          >
            <Image
              src={refreshIcon}
              alt="초기화"
              className="w-[24px] brightness-35"
            />
          </button>

          <ButtonPrimary
            variant="thick"
            className="border-t items-center justify-center max-w-[272px] max-h-[55px] text-noto-16-bold"
            onClick={onApply}
          >
            {totalCount}개 포토보기
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
