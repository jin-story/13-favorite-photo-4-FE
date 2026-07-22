"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

import ButtonPrimary from "@/components/common/ButtonPrimary";
import Dropdown from "@/components/common/Dropdown";
import Grade from "@/components/common/Grade";
import SheetFilter from "@/components/common/SheetFilter";
import closeIcon from "@/assets/icons/close.svg";
import filterIcon from "@/assets/icons/filter.svg";
import searchIcon from "@/assets/icons/search.svg";
import cardCastle from "@/assets/images/card_castle.svg";
import cardImage from "@/assets/images/card_woman.svg";

const GENRE_LABEL_BY_VALUE = {
  TRAVEL: "여행",
  LANDSCAPE: "풍경",
  PERSON: "인물",
  OBJECT: "사물",
};

const mockMyCards = [
  {
    id: 301,
    name: "스페인 여행",
    imageUrl: cardCastle,
    grade: "RARE",
    genre: "풍경",
    ownerNickname: "프로여행러",
    price: 4,
    quantity: 1,
  },
  {
    id: 302,
    name: "우리집 앞마당",
    imageUrl: cardImage,
    grade: "COMMON",
    genre: "풍경",
    ownerNickname: "미쏘손",
    price: 4,
    quantity: 1,
  },
  {
    id: 303,
    name: "How Far I’ll Go",
    imageUrl: cardCastle,
    grade: "SUPER_RARE",
    genre: "여행",
    ownerNickname: "랍스타",
    price: 4,
    quantity: 2,
  },
  {
    id: 304,
    name: "우리집 앞마당",
    imageUrl: cardImage,
    grade: "COMMON",
    genre: "풍경",
    ownerNickname: "미쏘손",
    price: 4,
    quantity: 1,
  },
];

const INITIAL_SHEET_FILTER = {
  grade: [],
  genre: [],
  availability: [],
};

function ExchangeCard({ card, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(card)}
      className={clsx(
        "w-full border bg-gray-500 p-2.5 text-left text-white tablet:p-5",
        isSelected ? "border-main" : "border-white/10",
      )}
    >
      <div className="relative aspect-[150/112] w-full overflow-hidden bg-gray-400 tablet:aspect-[302/227]">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-2.5 truncate text-noto-14-bold tablet:mt-5 tablet:text-noto-22-bold">
        {card.name}
      </h3>

      <div className="mt-[5px] flex items-center justify-between border-b border-gray-400 pb-2.5">
        <div className="flex min-w-0 items-center">
          <Grade type="card" grade={card.grade} />
          <span className="mx-[5px] h-3 w-px bg-gray-400 tablet:mx-2.5 tablet:h-4" />
          <span className="text-noto-10-regular text-gray-300 tablet:text-noto-16-regular">
            {card.genre}
          </span>
        </div>

        <span className="truncate text-noto-10-regular text-white underline underline-offset-2 tablet:text-noto-16-regular">
          {card.ownerNickname}
        </span>
      </div>

      <dl className="mt-3 space-y-1 text-noto-10-regular tablet:mt-5 tablet:space-y-2 tablet:text-noto-16-regular">
        <div className="flex justify-between">
          <dt className="text-gray-300">가격</dt>
          <dd className="text-white">{card.price} P</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-300">수량</dt>
          <dd className="text-white">{card.quantity}</dd>
        </div>
      </dl>

      <p className="mt-8 text-center font-baskin-robbins text-[20px] text-white tablet:mt-12 tablet:text-[24px]">
        최애<span className="text-main">의</span>포토
      </p>
    </button>
  );
}

export default function MarketplaceExchangeSelectModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFilter, setSheetFilter] = useState(INITIAL_SHEET_FILTER);
  const [selectedCard, setSelectedCard] = useState(null);

  const filteredCards = useMemo(() => {
    return mockMyCards.filter((card) => {
      const matchesKeyword = card.name
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const matchesGrade =
        !gradeFilter && sheetFilter.grade.length === 0
          ? true
          : gradeFilter
            ? card.grade === gradeFilter
            : sheetFilter.grade.includes(card.grade);

      const selectedGenreLabels = sheetFilter.genre.map(
        (value) => GENRE_LABEL_BY_VALUE[value],
      );

      const matchesGenre =
        !genreFilter && sheetFilter.genre.length === 0
          ? true
          : genreFilter
            ? card.genre === GENRE_LABEL_BY_VALUE[genreFilter]
            : selectedGenreLabels.includes(card.genre);

      return matchesKeyword && matchesGrade && matchesGenre;
    });
  }, [keyword, gradeFilter, genreFilter, sheetFilter]);

  const counts = useMemo(() => {
    return mockMyCards.reduce((acc, card) => {
      acc[card.grade] = (acc[card.grade] ?? 0) + 1;

      const genreValue = Object.entries(GENRE_LABEL_BY_VALUE).find(
        ([, label]) => label === card.genre,
      )?.[0];

      if (genreValue) {
        acc[genreValue] = (acc[genreValue] ?? 0) + 1;
      }

      acc.SALE = mockMyCards.length;
      acc.SOLD_OUT = 0;

      return acc;
    }, {});
  }, []);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("exchangeCardId");

    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : ".";
    const query = params.toString();

    router.replace(query ? `${currentPath}?${query}` : currentPath, {
      scroll: false,
    });
  };

  const openExchangeRequestModal = (card) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "marketplaceExchangeRequest");
    params.set("exchangeCardId", String(card.id));

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSelectCard = (card) => {
    setSelectedCard(card);
    openExchangeRequestModal(card);
  };

  const handleNext = () => {
    if (!selectedCard) return;

    openExchangeRequestModal(selectedCard);
  };

  return (
    <section className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-gray-500 text-white tablet:h-[780px] tablet:w-[680px] tablet:px-[50px] tablet:py-[50px] pc:h-[920px] pc:w-[1180px] pc:px-[120px] pc:py-[70px]">
      <button
        type="button"
        onClick={closeModal}
        className="absolute right-5 top-5 z-10 tablet:right-[30px] tablet:top-[30px]"
        aria-label="닫기"
      >
        <Image
          src={closeIcon}
          alt=""
          className="h-6 w-6 brightness-75 pc:h-8 pc:w-8"
        />
      </button>

      <p className="mt-12 px-5 text-noto-14-bold text-gray-300 tablet:mt-0 tablet:px-0 tablet:text-noto-18-bold">
        마이갤러리
      </p>

      <h2 className="mt-5 px-5 text-noto-28-bold tablet:px-0 tablet:text-noto-40-bold pc:text-noto-46-bold">
        포토카드 교환하기
      </h2>

      <div className="mx-5 mt-4 h-[2px] bg-gray-100 tablet:mx-0 tablet:mt-5" />

      <div className="mt-5 flex items-center gap-3 px-5 tablet:px-0">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-[55px] w-[55px] shrink-0 items-center justify-center border border-gray-200 tablet:hidden"
          aria-label="필터 열기"
        >
          <Image src={filterIcon} alt="" className="h-6 w-6" />
        </button>

        <label className="flex h-[55px] w-full items-center border border-gray-200 px-5 tablet:w-[330px]">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색"
            className="w-full bg-transparent text-noto-14-regular text-white outline-none placeholder:text-gray-300"
          />
          <Image src={searchIcon} alt="" className="h-6 w-6" />
        </label>

        <div className="hidden items-center gap-10 tablet:flex">
          <Dropdown
            type="grade"
            value={gradeFilter}
            onChange={setGradeFilter}
          />

          <Dropdown
            type="genre"
            value={genreFilter}
            onChange={setGenreFilter}
          />
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-5 pb-8 tablet:mt-10 tablet:px-0 pc:mt-12">
        {filteredCards.length === 0 ? (
          <p className="py-20 text-center text-noto-16-regular text-gray-300">
            조건에 맞는 포토카드가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 tablet:gap-5 pc:grid-cols-2 pc:gap-10">
            {filteredCards.map((card) => (
              <ExchangeCard
                key={card.id}
                card={card}
                isSelected={selectedCard?.id === card.id}
                onClick={handleSelectCard}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 px-5 pb-6 tablet:hidden">
        <ButtonPrimary
          variant="thick"
          className={clsx("w-full!", !selectedCard && "opacity-40")}
          onClick={handleNext}
        >
          다음
        </ButtonPrimary>
      </div>

      <SheetFilter
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filter={sheetFilter}
        setFilter={setSheetFilter}
        counts={counts}
        totalCount={filteredCards.length}
        onApply={() => setSheetOpen(false)}
        onReset={() => {
          setGradeFilter("");
          setGenreFilter("");
        }}
      />
    </section>
  );
}
