"use client";

import { useId, useState } from "react";

export default function InputTextfield({
  label,
  value = "",
  onChange,
  onKeyDown,
  placeholder,
  errorMessage,
  maxLength,
  className = "",
}) {
  const inputId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
    onKeyDown?.(e);
  };

  return (
    <div
      className={`flex w-full max-w-[345px] flex-col items-start gap-[10px] tablet:max-w-[440px] pc:max-w-[520px] ${className}`}
    >
      <label
        htmlFor={inputId}
        className="text-noto-16-bold text-white pc:text-noto-20-bold"
      >
        {label}
      </label>
      <div
        className={`flex h-[55px] w-full items-center rounded-[2px] border px-5 py-[18px] pc:h-[60px] ${
          hasError
            ? "border-red bg-gray-500"
            : isFocused
              ? "border-gray-200 bg-gray-500"
              : "border-gray-200 bg-black"
        }`}
      >
        <input
          id={inputId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          className="text-noto-14-regular placeholder:text-noto-14-light w-full bg-transparent text-white outline-none pc:text-noto-16-regular pc:placeholder:text-noto-16-light"
        />
      </div>
      {hasError && (
        <p className="text-noto-16-light text-red">{errorMessage}</p>
      )}
    </div>
  );
}
