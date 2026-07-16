"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import arrowDownIcon from "@/assets/icons/arrow_down.svg";

export default function InputDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((option) => option.value === value)?.label;

  return (
    <div
      className={clsx(
        "relative flex w-full flex-col items-start gap-[10px] tablet:max-w-[440px] pc:max-w-[520px]",
        className,
      )}
    >
      <p className="text-noto-16-bold text-white pc:text-noto-20-bold">
        {label}
      </p>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex h-[55px] w-full items-center justify-between rounded-[2px] border border-gray-200 bg-black px-5 pc:h-[60px]"
        {...props}
      >
        <span
          className={clsx(
            selected
              ? "text-noto-14-regular pc:text-noto-16-regular text-white"
              : "text-noto-14-light pc:text-noto-16-light text-gray-200",
          )}
        >
          {selected ?? placeholder}
        </span>
        <Image
          src={arrowDownIcon}
          alt=""
          className={clsx(
            "size-[24px] transition-transform pc:size-[28px]",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full z-10 mt-[10px] w-full rounded-[2px] border border-gray-200 bg-black p-5">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className="text-noto-16-regular w-full py-[10px] text-left text-white hover:bg-gray-500"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
