"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Grade from "@/components/common/Grade";
import InputSearch from "@/components/common/InputSearch";
import closeIcon from "@/assets/icons/close.svg";
import cardCastle from "@/assets/images/card_castle.svg";
import cardWoman from "@/assets/images/card_woman.svg";
import cardTree from "@/assets/images/card_tree.svg";

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
    imageUrl: cardWoman,
    grade: "COMMON",
    genre: "풍경",
    ownerNickname: "미쏘손",
    price: 4,
    quantity: 1,
  },
  {
    id: 303,
    name: "How Far I’ll Go",
    imageUrl: cardTree,
    grade: "SUPER_RARE",
    genre: "풍경",
    ownerNickname: "랍스타",
    price: 4,
    quantity: 2,
  },
  {
    id: 304,
    name: "우리집 앞마당",
    imageUrl: cardWoman,
    grade: "COMMON",
    genre: "풍경",
    ownerNickname: "미쏘손",
    price: 4,
    quantity: 1,
  },
];

function ExchangeSelectCard({ card, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card.id)}
      className={clsx(
        "flex flex-col border bg-gray-500 text-left",
        "w-full p-2.5 tablet:p-5 pc:p-10",
        isSelected ? "border-main" : "border-white/10",
      )}
    >
      <div className="relative aspect-[150/112] w-full overflow-hidden bg-gray-400 tablet:aspect-[302/227] pc:aspect-[360/270]">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
        />
      </div>

      <strong className="mt-2.5 truncate text-noto-14-bold text-white tablet:mt-5 tablet:text-noto-22-bold">
        {card.name}
      </strong>

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

      <dl className="mt-3 flex flex-col gap-1 text-noto-10-regular tablet:mt-5 tablet:text-noto-16-regular">
        <div className="flex justify-between">
          <dt className="text-gray-300">가격</dt>
          <dd className="text-white">{card.price} P</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-300">수량</dt>
          <dd className="text-white">{card.quantity}</dd>
        </div>
      </dl>

      <div className="mt-5 hidden justify-center tablet:flex pc:mt-10">
        <span className="text-baskin-24 text-white">
          최애<span className="text-main">의</span>포토
        </span>
      </div>
    </button>
  );
}

export default function MarketplaceExchangeSelectModal({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCardId, setSelectedCardId] = useState(mockMyCards[0]?.id);
  const [keyword, setKeyword] = useState("");

  const filteredCards = mockMyCards.filter((card) =>
    card.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  const handleNext = () => {
    if (!selectedCardId) return;

    const params = new URLSearchParams(searchParams);
    params.set("modal", "marketplaceExchangeRequest");
    params.set("exchangeCardId", String(selectedCardId));

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="relative flex max-h-[86dvh] w-[345px] flex-col bg-gray-500 px-5 py-8 text-white tablet:w-[720px] tablet:px-10 tablet:py-12 pc:w-[1130px] pc:px-[90px] pc:py-[70px]">
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center pc:right-8 pc:top-8"
      >
        <Image src={closeIcon} alt="" width={28} height={28} />
      </button>

      <p className="text-noto-16-bold text-gray-300 pc:text-noto-20-bold">
        마이갤러리
      </p>

      <h2 className="mt-7 text-noto-32-bold text-white tablet:text-noto-40-bold pc:mt-10">
        포토카드 교환하기
      </h2>

      <div className="mt-4 border-t border-gray-100 tablet:mt-5" />

      <div className="mt-5 flex items-center gap-3 tablet:gap-10">
        <InputSearch
          value={keyword}
          onChange={setKeyword}
          placeholder="검색"
          className="max-w-[240px] tablet:max-w-[342px]"
        />

        {/* 필터/드롭다운 컴포넌트 PR 머지 후 등급/장르 필터로 교체 예정 */}
        <span className="hidden text-noto-16-bold text-white tablet:block">
          등급
        </span>

        <span className="hidden text-noto-16-bold text-white tablet:block">
          장르
        </span>
      </div>

      <div className="mt-7 grid max-h-[54dvh] grid-cols-2 gap-3 overflow-y-auto pr-1 tablet:mt-10 tablet:grid-cols-2 tablet:gap-5 pc:gap-10">
        {filteredCards.map((card) => (
          <ExchangeSelectCard
            key={card.id}
            card={card}
            isSelected={card.id === selectedCardId}
            onSelect={setSelectedCardId}
          />
        ))}
      </div>

      <ButtonPrimary
        variant="thin"
        disabled={!selectedCardId}
        className="mt-8 w-full! pc:hidden"
        onClick={handleNext}
      >
        다음
      </ButtonPrimary>
    </section>
  );
}
