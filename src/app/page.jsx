"use client";

import { useState } from "react";
import Image from "next/image";

import SheetFilter from "@/components/common/SheetFilter";
import filterIcon from "@/assets/icons/filter.svg";

export default function Home() {
  const [openFilter, setOpenFilter] = useState(false);

  const [filter, setFilter] = useState({
    grade: "",
    genre: "",
    sale: "",
  });

  const counts = {
    COMMON: 120,
    RARE: 80,
    SUPER_RARE: 32,
    LEGENDARY: 5,

    TRAVEL: 50,
    LANDSCAPE: 30,
    PERSON: 60,
    OBJECT: 97,

    SALE: 180,
    SOLD_OUT: 57,
  };

  return (
    <>
      {/* 필터 아이콘 */}
      <button onClick={() => setOpenFilter(true)}>
        <Image src={filterIcon} alt="필터" />
      </button>

      {/* SheetFilter */}
      <SheetFilter
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        totalCount={237}
        onApply={() => {
          console.log(filter);
          setOpenFilter(false);
        }}
        onReset={() => {
          setFilter({
            grade: "",
            genre: "",
            sale: "",
          });
        }}
      />
    </>
  );
}
