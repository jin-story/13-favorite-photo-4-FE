"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import arrowDownIcon from "@/assets/icons/arrow_down.svg";
import clsx from "clsx";

const dropdownOptions = {
  grade: {
    placeholder: "등급",
    options: [
      { label: "COMMON", value: "COMMON" },
      { label: "RARE", value: "RARE" },
      { label: "SUPER RARE", value: "SUPER_RARE" },
      { label: "LEGENDARY", value: "LEGENDARY" },
    ],
  },

  sale: {
    placeholder: "판매 방법",
    options: [
      { label: "판매", value: "SALE" },
      { label: "교환", value: "EXCHANGE" },
    ],
  },

  sort: {
    placeholder: "낮은 가격순",
    options: [
      { label: "낮은 가격순", value: "LOW_PRICE" },
      { label: "높은 가격순", value: "HIGH_PRICE" },
      { label: "최신순", value: "LATEST" },
    ],
  },
};

// css 정리
const dropdownStyle = {
  grade: {
    button: "flex pc:min-h-[24px] min-h-[22px] items-start gap-[10px]",
    menu: "flex flex-col absolute min-w-[134px] z-10 items-start mt-[18px] border border-gray-200 bg-black",
    item: "flex items-start min-w-[134px] py-[15px] px-[20px] text-left inline hover:bg-gray-500",
  },

  sale: {
    button: "flex pc:min-h-[24px] min-h-[22px] items-start gap-[10px]",
    menu: "flex flex-col absolute z-10 items-start mt-[18px] border border-gray-200 bg-black",
    item: "flex items-start w-full py-[15px] px-[20px] text-left inline hover:bg-gray-500",
  },

  sort: {
    button:
      "pc:min-w-[180px] pc:min-h-[50px] \
      tablet:min-w-[140px] tablet:min-h-[45px] \
      flex min-w-[130px] min-h-[35px] justify-center gap-[10px] items-start border border-gray-200 py-[10px] px-[15px] bg-black",
    menu: "flex flex-col absolute z-10 mt-[5px] w-full border border-gray-200 bg-black",
    item: "flex w-full items-center px-[20px] py-[15px] hover:bg-gray-500",
  },
};

export default function Dropdown({ type, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { placeholder, options } = dropdownOptions[type];
  const style = dropdownStyle[type];

  const selected =
    options.find((option) => option.value === value)?.label ?? placeholder;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          style.button,
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span className="pc:text-noto-16-regular tablet:text-noto-14-regular text-noto-12-regular whitespace-nowrap">
          {selected}
        </span>
        <div className="flex w-[24px] h-[24px] items-center justify-center">
          <Image
            src={arrowDownIcon}
            alt=""
            className={clsx("transition-transform", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {isOpen && (
        <ul className={style.menu}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={style.item}
              >
                <span className="pc:text-noto-16-regular tablet:text-noto-14-regular text-noto-12-regular whitespace-nowrap">
                  {option.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*  사용법 :
const [grade, setGrade] = useState("");
<Dropdown
  type="grade"
  value={grade}
  onChange={(value) => setGrade(value)} // onChange={setGrade}
  />

const [sale, setSale] = useState("");
<Dropdown
  type="sale"
  value={sale}
  onChange={setSale}
/>

const [sort, setSort] = useState("");
<Dropdown
  type="sort"
  value={sort}
  onChange={setSort}
/>

*/
