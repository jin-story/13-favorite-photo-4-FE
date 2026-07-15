"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import arrowLeftIcon from "@/assets/icons/arrow_left.svg";
import arrowRightIcon from "@/assets/icons/arrow_right.svg";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile : 744px 미만
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 744);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    onPageChange(page);

    // 나중에 필요하면 추가
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPages = () => {
    // 페이지가 적으면 전부 출력
    if (totalPages <= (isMobile ? 5 : 7)) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // ---------------- Mobile ----------------
    if (isMobile) {
      if (currentPage <= 2) {
        return [1, 2, "...", totalPages - 1, totalPages];
      }

      if (currentPage >= totalPages - 1) {
        return [1, 2, "...", totalPages - 1, totalPages];
      }

      return [1, "...", currentPage, "...", totalPages];
    }

    // ---------------- PC / Tablet ----------------

    // 1
    if (currentPage === 1) {
      return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 2
    if (currentPage === 2) {
      return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 3
    if (currentPage === 3) {
      return [1, 2, 3, 4, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 마지막
    if (currentPage === totalPages) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 마지막 -1
    if (currentPage === totalPages - 1) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // 마지막 -2
    if (currentPage === totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // 가운데
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPages();

  return (
    <nav aria-label="페이지 탐색" className="flex items-center gap-[20px]">
      {/* 이전 */}
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={clsx(
          "flex h-[36px] w-[36px] items-center justify-center",
          currentPage === 1 && "cursor-not-allowed opacity-40",
        )}
      >
        <Image src={arrowLeftIcon} alt="" />
      </button>

      {/* 페이지 */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="pc:text-noto-16-regular tablet:text-noto-14-regular text-noto-12-regular"
          >
            ...
          </span>
        ) : (
          <button
            key={`${page}-${index}`}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => handlePageChange(page)}
            className={clsx(
              "flex items-center justify-center border",
              "pc:text-noto-16-regular pc:w-[50px] pc:h-[50px]  \
              tablet:text-noto-14-regular tablet:w-[45px] tablet:h-[45px]\
              text-noto-12-regular w-[40px] h-[40px]",
              page === currentPage ? "border-gray-200" : "border-transparent",
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* 다음 */}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={clsx(
          "flex h-[24px] w-[24px] items-center justify-center",
          currentPage === totalPages && "cursor-not-allowed opacity-40",
        )}
      >
        <Image src={arrowRightIcon} alt="" />
      </button>
    </nav>
  );
}

/* 사용법: 
const [page, setPage] = useState(1);

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

*/
