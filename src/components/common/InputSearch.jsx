"use client";

import Image from "next/image";
import clsx from "clsx";
import searchIcon from "@/assets/icons/search.svg";

export default function InputSearch({
  value = "",
  onChange,
  onSearch,
  onKeyDown,
  placeholder = "검색",
  className = "",
}) {
  if (!onChange) {
    console.warn("onChange는 필수 props 입니다.");
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) onSearch?.(value);
    onKeyDown?.(e);
  };

  return (
    <div
      className={clsx(
        "flex h-[45px] w-full items-center justify-between rounded-[2px] border border-gray-200 bg-black px-5 tablet:w-[200px] pc:h-[50px] pc:w-[320px]",
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className="text-noto-14-regular placeholder:text-noto-14-light min-w-0 flex-1 bg-transparent text-white outline-none pc:text-noto-16-regular pc:placeholder:text-noto-16-light"
      />
      <Image
        src={searchIcon}
        alt=""
        className="size-[22px] shrink-0 pc:size-[24px]"
      />
    </div>
  );
}
