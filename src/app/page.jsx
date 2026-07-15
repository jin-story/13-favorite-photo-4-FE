"use client";

import { useState } from "react";
import Pagination from "@/components/common/Pagination";

export default function Home() {
  const [page, setPage] = useState(1);

  return (
    <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
  );
}
