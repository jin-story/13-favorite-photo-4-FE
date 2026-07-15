"use client";

import { useId, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import eyeHiddenIcon from "@/assets/icons/eye_hidden.svg";
import eyeVisibleIcon from "@/assets/icons/eye_visible.svg";

export default function InputPassword({
  label,
  value = "",
  onChange,
  onKeyDown,
  placeholder,
  errorMessage,
  maxLength,
  className = "",
  disabled = false,
}) {
  const inputId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasError = Boolean(errorMessage);
  const errorId = `${inputId}-error`;

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
        className={clsx(
          "text-noto-16-regular pc:text-noto-18-regular",
          disabled && "text-gray-400",
          !disabled && "text-white",
        )}
      >
        {label}
      </label>
      <div
        className={clsx(
          "flex h-[55px] w-full items-center gap-[20px] rounded-[2px] border px-5 py-[18px] pc:h-[60px]",
          disabled && "border-gray-400 bg-black",
          !disabled && hasError && "border-red bg-gray-500",
          !disabled && !hasError && isFocused && "border-gray-200 bg-gray-500",
          !disabled && !hasError && !isFocused && "border-gray-200 bg-black",
        )}
      >
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={clsx(
            "text-noto-14-regular placeholder:text-noto-14-light min-w-0 flex-1 bg-transparent outline-none pc:text-noto-16-regular pc:placeholder:text-noto-16-light",
            disabled && "text-gray-400 placeholder:text-gray-400",
            !disabled && "text-white placeholder:text-gray-200",
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          disabled={disabled}
          aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
          className={clsx(
            "size-[22px] shrink-0 pc:size-[24px]",
            disabled && "opacity-40",
          )}
        >
          <Image
            src={isVisible ? eyeVisibleIcon : eyeHiddenIcon}
            alt=""
            className="size-full"
          />
        </button>
      </div>
      {hasError && (
        <p id={errorId} className="text-noto-16-light text-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
