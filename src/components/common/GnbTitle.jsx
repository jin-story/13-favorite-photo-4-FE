"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { getGnbSubState } from "../../lib/utils/gnbSubState";

export default function GnbTitle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  const { title } = getGnbSubState(pathname, modal);

  return <h1 className="text-white text-baskin-20-regular">{title}</h1>;
}
