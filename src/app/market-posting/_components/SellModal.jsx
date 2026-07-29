"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import InputSearch from "@/components/common/InputSearch";
import Dropdown from "@/components/common/Dropdown";
import SheetFilter from "@/components/common/SheetFilter";
import Photocard from "@/components/common/Photocard";
import Title from "@/components/common/Title";
import filterIcon from "@/assets/icons/filter.svg";
import { userService } from "@/lib/services/userService";
import { useDebounce } from "@/hooks/useDebounce";
import SellCardForm from "./SellCardForm";

export default function SellModal() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState([]);
  const [genre, setGenre] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetFilter, setSheetFilter] = useState({
    grade: [],
    genre: [],
    availability: [],
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-inventories", debouncedSearch, grade, genre],
    queryFn: () =>
      userService.getMyInventories({
        keyword: debouncedSearch,
        grade,
        genre,
      }),
    meta: { name: "내 포토카드 목록" },
  });

  const { data: allData } = useQuery({
    queryKey: ["my-inventories-all", debouncedSearch],
    queryFn: () =>
      userService.getMyInventories({
        keyword: debouncedSearch,
        limit: 100,
      }),
    meta: { name: "내 포토카드 전체 목록" },
  });

  const cards =
    data?.list.map((item) => ({
      ...item.photoCard,
      id: item.id,
      makerNickname: item.photoCard?.creator?.nickname,
      price: item.photoCard?.minPrice,
      totalQuantity: item.ownedQuantity,
      lastQuantity: item.ownedQuantity,
      imgUrl: item.photoCard?.imageUrl,
    })) || [];

  const allCards =
    allData?.list.map((item) => ({
      grade: item.photoCard?.grade,
      genre: item.photoCard?.genre,
    })) || [];

  const previewCards = allCards.filter((card) => {
    if (sheetFilter.grade.length > 0 && !sheetFilter.grade.includes(card.grade)) {
      return false;
    }
    if (sheetFilter.genre.length > 0 && !sheetFilter.genre.includes(card.genre)) {
      return false;
    }
    return true;
  });

  const previewCounts = allCards.reduce((acc, card) => {
    acc[card.grade] = (acc[card.grade] || 0) + 1;
    acc[card.genre] = (acc[card.genre] || 0) + 1;
    return acc;
  }, {});

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
          <Dropdown
            type="grade"
            value={grade[0]}
            onChange={(value) => setGrade(value ? [value] : [])}
          />
          <Dropdown
            type="genre"
            value={genre[0]}
            onChange={(value) => setGenre(value ? [value] : [])}
          />
        </div>
      </div>

      <SheetFilter
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        filter={sheetFilter}
        setFilter={setSheetFilter}
        categories={["grade", "genre"]}
        singleSelectCategories={["grade", "genre"]}
        totalCount={previewCards.length}
        counts={previewCounts}
        onApply={(appliedFilter) => {
          setGrade(appliedFilter.grade);
          setGenre(appliedFilter.genre);
          setIsSheetOpen(false);
        }}
      />

      {isPending && (
        <p className="text-noto-16 py-[60px] text-center text-gray-300">
          불러오는 중...
        </p>
      )}

      {isError && (
        <p className="text-noto-16 py-[60px] text-center text-gray-300">
          목록을 불러오지 못했습니다.
        </p>
      )}

      {!isPending && !isError && cards.length === 0 && (
        <p className="text-noto-16 py-[60px] text-center text-gray-300">
          보유한 포토카드가 없습니다.
        </p>
      )}

      {!isPending && !isError && cards.length > 0 && (
        <div className="flex max-h-[60vh] flex-wrap gap-[5px] overflow-y-auto tablet:gap-[20px] pc:gap-[40px] [scrollbar-color:#5a5a5a_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
          {cards.map((card) => (
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
      )}
    </div>
  );
}
