"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function GnbTitle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  let title = "";

  if (modal === "sell-card") {
    title = "나의 포토카드 판매하기";
  } else if (modal === "exchange-info") {
    title = "포토카드 교환하기";
  } else if (modal === "edit-card") {
    title = "수정하기";
  } else {
    const titleMap = {
      "/marketplace": "마켓플레이스",
      "/my-gallery": "마이갤러리",

      "/my-gallery/create": "포토카드 생성",
      "/my-gallery/success": "",
      "/my-gallery/error": "",

      "/my-sales": "나의 판매 포토카드",
      "/notifications": "알림",
    };
    title = titleMap[pathname] ?? "최애의포토";
  }

  return <h1 className="text-white text-baskin-20-regular">{title}</h1>;
}
