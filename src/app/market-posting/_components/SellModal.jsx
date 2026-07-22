"use client";

import { useState } from "react";
import Image from "next/image";
import InputSearch from "@/components/common/InputSearch";
import Dropdown from "@/components/common/Dropdown";
// import SheetFilter from "@/components/common/SheetFilter"; <- 오류 이슈로 임시 주석처리
import Photocard from "@/components/common/Photocard";
import Title from "@/components/common/Title";
import filterIcon from "@/assets/icons/filter.svg";
import SellCardForm from "./SellCardForm";

// 목업 데이터
const myCards = [
  {
    id: 1,
    name: "스페인 여행",
    grade: "RARE",
    genre: "여행",
    price: 4,
    totalQuantity: 1,
    makerNickname: "프로여행러",
    description: "스페인 여행 포토카드",
    imgUrl: "",
  },
  {
    id: 2,
    name: "우리집 앞마당",
    grade: "COMMON",
    genre: "풍경",
    price: 4,
    totalQuantity: 1,
    makerNickname: "미쓰손",
    description: "우리집 앞마당 포토카드",
    imgUrl: "",
  },
  {
    id: 3,
    name: "How Far I'll Go",
    grade: "SUPER_RARE",
    genre: "풍경",
    price: 4,
    totalQuantity: 1,
    makerNickname: "랍스타",
    description: "How Far I'll Go 포토카드",
    imgUrl: "",
  },
];

export default function SellModal() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState();
  const [genre, setGenre] = useState();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetFilter, setSheetFilter] = useState({
    grade: [],
    genre: [],
    availability: [],
  });
  const [selectedCard, setSelectedCard] = useState(null);

  if (selectedCard) {
    return (
      <SellCardForm
        card={selectedCard}
        onCancel={() => setSelectedCard(null)}
      />
    );
  }

  return (
    <div className="flex w-screen flex-col gap-[20px] px-[15px] pt-[35px] pb-[30px] tablet:gap-[25px] tablet:px-[20px] tablet:pt-[50px] tablet:pb-[40px] pc:w-[1180px] pc:gap-[30px] pc:px-[120px] pc:pt-[60px] pc:pb-[60px]">
      <div className="mx-auto h-[6px] w-[48px] rounded-full bg-gray-400 pc:hidden" />

      <p className="text-baskin-18 pc:text-baskin-24 text-gray-300">
        마이갤러리
      </p>

      <Title type="title_line_modal" text="나의 포토카드 판매하기" />

      <div className="flex items-center gap-[15px] tablet:gap-[20px] pc:gap-[30px]">
        <button
          type="button"
          aria-label="필터"
          onClick={() => setIsSheetOpen(true)}
          className="flex h-[45px] w-[45px] shrink-0 items-center justify-center border border-gray-200 tablet:hidden"
        >
          <Image src={filterIcon} alt="" className="h-[20px] w-[20px]" />
        </button>

        <InputSearch
          value={search}
          onChange={setSearch}
          className="w-full tablet:w-[200px] pc:w-[320px]"
        />

        <div className="hidden items-start gap-[35px] tablet:flex pc:gap-[45px]">
          <Dropdown type="grade" value={grade} onChange={setGrade} />
          <Dropdown type="genre" value={genre} onChange={setGenre} />
        </div>
      </div>

      {/* <SheetFilter
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        filter={sheetFilter}
        setFilter={setSheetFilter}
        totalCount={myCards.length}
        onApply={() => setIsSheetOpen(false)}
      /> */}

      <div className="flex max-h-[60vh] flex-wrap gap-[5px] overflow-y-auto tablet:gap-[20px] pc:gap-[40px] [scrollbar-color:#5a5a5a_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
        {myCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelectedCard(card)}
            className="text-left"
          >
            <Photocard card={card} type="나의 카드" />
          </button>
        ))}
      </div>
    </div>
  );
}
