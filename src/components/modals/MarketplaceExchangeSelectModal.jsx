"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import Dropdown from "@/components/common/Dropdown";
import Grade from "@/components/common/Grade";
import SheetFilter from "@/components/common/SheetFilter";

import closeIcon from "@/assets/icons/close.svg";
import filterIcon from "@/assets/icons/filter.svg";
import searchIcon from "@/assets/icons/search.svg";
import cardCastle from "@/assets/images/card_castle.svg";
import cardImage from "@/assets/images/card_woman.svg";

const genreLabelByValue = {
  LANDSCAPE: "풍경",
  TRAVEL: "여행",
  PORTRAIT: "인물",
  OBJECT: "사물",
};

const mockExchangeCards = [
  {
    id: 1,
    name: "스페인 여행",
    grade: "RARE",
    genre: "LANDSCAPE",
    ownerNickname: "프로여행러",
    price: 4,
    quantity: 1,
    image: cardCastle,
  },
  {
    id: 2,
    name: "우리집 앞마당",
    grade: "COMMON",
    genre: "LANDSCAPE",
    ownerNickname: "미쓰손",
    price: 4,
    quantity: 1,
    image: cardImage,
  },
  {
    id: 3,
    name: "How Far I’ll Go",
    grade: "SUPER_RARE",
    genre: "LANDSCAPE",
    ownerNickname: "랍스타",
    price: 4,
    quantity: 1,
    image: cardImage,
  },
  {
    id: 4,
    name: "우리집 앞마당",
    grade: "COMMON",
    genre: "LANDSCAPE",
    ownerNickname: "미쓰손",
    price: 4,
    quantity: 1,
    image: cardImage,
  },
];

function ExchangeCard({ card, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      className="flex w-full flex-col border border-gray-500 bg-black p-3 text-left transition-colors hover:border-gray-300 tablet:p-6 pc:p-10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="object-cover"
          sizes="(min-width: 1200px) 360px, (min-width: 768px) 320px, 160px"
        />
      </div>

      <div className="mt-3 tablet:mt-5 pc:mt-8">
        <h3 className="truncate text-noto-16-bold text-white tablet:text-noto-24-bold">
          {card.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 tablet:mt-2">
          <Grade type="card" grade={card.grade} />
          <span className="h-3 w-px bg-gray-400 tablet:h-4" />
          <span className="text-noto-10-light text-gray-300 tablet:text-noto-16-light">
            {genreLabelByValue[card.genre]}
          </span>
          <span className="ml-auto truncate text-noto-10-regular text-white underline underline-offset-2 tablet:text-noto-16-regular">
            {card.ownerNickname}
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-400 pt-3 tablet:mt-5 tablet:pt-5 pc:mt-8 pc:pt-8">
        <div className="flex justify-between text-noto-12-regular tablet:text-noto-16-regular">
          <span className="text-gray-300">가격</span>
          <span className="text-white">{card.price} P</span>
        </div>
        <div className="mt-1 flex justify-between text-noto-12-regular tablet:text-noto-16-regular">
          <span className="text-gray-300">수량</span>
          <span className="text-white">{card.quantity}</span>
        </div>
      </div>

      <p className="mt-auto pt-8 text-center font-baskin-robbins text-2xl text-white tablet:pt-12 tablet:text-3xl">
        최애<span className="text-main">의</span>포토
      </p>
    </button>
  );
}

export default function MarketplaceExchangeSelectModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCards = useMemo(() => {
    return mockExchangeCards.filter((card) =>
      card.name.toLowerCase().includes(keyword.trim().toLowerCase()),
    );
  }, [keyword]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("exchangeCardId");

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "?", { scroll: false });
  };

  const openExchangeRequestModal = (card) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "marketplaceExchangeRequest");
    params.set("exchangeCardId", String(card.id));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 tablet:items-center">
      <section className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-gray-500 text-white tablet:max-h-[90dvh] tablet:w-[740px] pc:w-[1160px]">
        <div className="mx-auto mt-3 h-[6px] w-[50px] rounded-full bg-gray-300 tablet:hidden" />

        <button
          type="button"
          onClick={closeModal}
          aria-label="닫기"
          className="absolute right-5 top-5 z-10 tablet:right-8 tablet:top-8 pc:right-10 pc:top-10"
        >
          <Image
            src={closeIcon}
            alt=""
            width={24}
            height={24}
            className="opacity-80"
          />
        </button>

        <div className="overflow-y-auto px-5 pb-8 pt-12 tablet:px-10 tablet:pt-16 pc:px-[120px] pc:pt-[70px]">
          <p className="text-noto-16-bold text-gray-300 pc:text-noto-20-bold">
            마이갤러리
          </p>

          <h2 className="mt-5 border-b border-white pb-3 text-noto-32-bold tablet:mt-8 tablet:text-noto-40-bold pc:text-noto-46-bold">
            포토카드 교환하기
          </h2>

          <div className="mt-5 flex items-center gap-3 tablet:mt-6 tablet:gap-8">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="필터 열기"
              className="flex h-[50px] w-[50px] items-center justify-center border border-gray-200 tablet:hidden"
            >
              <Image src={filterIcon} alt="" width={22} height={22} />
            </button>

            <label className="flex h-[50px] min-w-0 flex-1 items-center border border-gray-200 px-4 tablet:max-w-[320px] pc:max-w-[320px]">
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="검색"
                className="w-full bg-transparent text-noto-14-regular text-white outline-none placeholder:text-gray-300"
              />
              <Image src={searchIcon} alt="" width={22} height={22} />
            </label>

            <div className="hidden tablet:block">
              <Dropdown type="grade" />
            </div>

            <div className="hidden tablet:block">
              <Dropdown type="genre" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 tablet:mt-10 tablet:gap-6 pc:grid-cols-2 pc:gap-10">
            {filteredCards.map((card) => (
              <ExchangeCard
                key={card.id}
                card={card}
                onSelect={openExchangeRequestModal}
              />
            ))}
          </div>
        </div>
      </section>

      <SheetFilter open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
