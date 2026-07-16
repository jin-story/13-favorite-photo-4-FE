"use client";

import { useId } from "react";
import Image from "next/image";
import clsx from "clsx";
import closeIcon from "@/assets/icons/close.svg";

export default function InputUpload({
  label,
  value = null,
  onChange,
  placeholder = "사진 업로드",
  buttonText = "파일 선택",
  accept = "image/*",
  className = "",
  ...props
}) {
  const inputId = useId();

  return (
    <div
      className={clsx(
        "flex w-full flex-col items-start gap-[10px] tablet:max-w-[440px] pc:max-w-[520px]",
        className,
      )}
    >
      <p className="text-noto-16-bold text-white pc:text-noto-20-bold">
        {label}
      </p>
      <div className="flex w-full items-center gap-[10px]">
        <div className="flex h-[55px] flex-1 items-center rounded-[2px] border border-gray-200 bg-black px-5 pc:h-[60px]">
          {value ? (
            <div className="flex w-full items-center justify-between">
              <span className="text-noto-14-regular pc:text-noto-16-regular text-white">
                {value.name}
              </span>
              <button
                type="button"
                onClick={() => onChange?.(null)}
                aria-label="선택한 파일 제거"
                className="size-[24px] shrink-0"
              >
                <Image src={closeIcon} alt="" className="size-full" />
              </button>
            </div>
          ) : (
            <span className="text-noto-14-light pc:text-noto-16-light text-gray-200">
              {placeholder}
            </span>
          )}
        </div>
        <input
          id={inputId}
          type="file"
          accept={accept}
          onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={inputId}
          className="text-noto-14-regular pc:text-noto-16-regular flex h-[55px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-main px-7 text-main pc:h-[60px]"
        >
          {buttonText}
        </label>
      </div>
    </div>
  );
}
