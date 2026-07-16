"use client";

import { useId, useState } from "react";
import clsx from "clsx";

export default function InputTextbox({
  label,
  value = "",
  onChange,
  onKeyDown,
  placeholder,
  className = "",
}) {
  const inputId = useId();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={clsx(
        "flex w-full flex-col items-start gap-[10px] tablet:max-w-[440px] pc:max-w-[520px]",
        className,
      )}
    >
      <label
        htmlFor={inputId}
        className="text-noto-16-bold text-white pc:text-noto-20-bold"
      >
        {label}
      </label>
      <div
        className={clsx(
          "h-[140px] w-full rounded-[2px] border border-gray-200 px-5 py-3 pc:h-[180px] pc:py-[18px]",
          isFocused && "bg-gray-500",
          !isFocused && "bg-black",
        )}
      >
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="text-noto-14-regular placeholder:text-noto-14-light h-full w-full resize-none bg-transparent text-white outline-none placeholder:text-gray-200 pc:text-noto-16-regular pc:placeholder:text-noto-16-light"
        />
      </div>
    </div>
  );
}
