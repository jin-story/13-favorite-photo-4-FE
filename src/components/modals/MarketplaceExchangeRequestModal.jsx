"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import ButtonSecondary from "@/components/common/ButtonSecondary";
import Grade from "@/components/common/Grade";
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
];

function SelectedExchangeCard({ card }) {
  return (
    <article className="w-full border border-white/10 bg-gray-500 p-5 pc:w-[440px] pc:p-10">
      <div className="relative aspect-[302/227] w-full overflow-hidden bg-gray-400 pc:aspect-[360/270]">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-5 text-noto-22-bold text-white">{card.name}</h3>

      <div className="mt-[5px] flex items-center justify-between border-b border-gray-400 pb-2.5">
        <div className="flex items-center">
          <Grade type="card" grade={card.grade} />
          <span className="mx-2.5 h-4 w-px bg-gray-400" />
          <span className="text-noto-16-regular text-gray-300">
            {card.genre}
          </span>
        </div>

        <span className="text-noto-16-regular text-white underline underline-offset-2">
          {card.ownerNickname}
        </span>
      </div>

      <dl className="mt-5 flex flex-col gap-2 text-noto-16-regular">
        <div className="flex justify-between">
          <dt className="text-gray-300">가격</dt>
          <dd className="text-white">{card.price} P</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-300">수량</dt>
          <dd className="text-white">{card.quantity}</dd>
        </div>
      </dl>

      <div className="mt-10 flex justify-center">
        <span className="text-baskin-24 text-white">
          최애<span className="text-main">의</span>포토
        </span>
      </div>
    </article>
  );
}

export default function MarketplaceExchangeRequestModal({ onClose }) {
  const searchParams = useSearchParams();
  const [description, setDescription] = useState("");

  const exchangeCardId = Number(searchParams.get("exchangeCardId"));
  const selectedCard =
    mockMyCards.find((card) => card.id === exchangeCardId) ?? mockMyCards[0];

  const handleSubmit = () => {
    const exchangePayload = {
      offeredPhotoCardId: selectedCard.id,
      offeredPhotoCardName: selectedCard.name,
      description,
    };

    console.log("교환 제시 요청 목업 데이터:", exchangePayload);

    onClose?.();

    alert(
      "교환 제시 요청이 완료되었습니다. 이후 성공/실패 페이지로 연결 예정입니다.",
    );
  };

  return (
    <section className="relative flex max-h-[86dvh] w-[345px] flex-col overflow-y-auto bg-gray-500 px-5 py-8 text-white tablet:w-[720px] tablet:px-10 tablet:py-12 pc:w-[1130px] pc:px-[90px] pc:py-[70px]">
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center pc:right-8 pc:top-8"
      >
        <Image src={closeIcon} alt="" width={28} height={28} />
      </button>

      <p className="text-noto-16-bold text-gray-300 pc:text-noto-20-bold">
        포토카드 교환하기
      </p>

      <h2 className="mt-7 text-noto-32-bold text-white tablet:text-noto-40-bold pc:mt-10">
        {selectedCard.name}
      </h2>

      <div className="mt-4 border-t border-gray-100 tablet:mt-5" />

      <div className="mt-8 grid gap-8 tablet:mt-10 pc:grid-cols-[440px_1fr] pc:gap-10">
        <SelectedExchangeCard card={selectedCard} />

        <div className="flex flex-col">
          <label
            htmlFor="exchange-description"
            className="text-noto-16-bold text-white pc:text-noto-20-bold"
          >
            교환 제시 내용
          </label>

          <textarea
            id="exchange-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="내용을 입력해 주세요"
            maxLength={200}
            className="mt-3 h-[140px] w-full resize-none border border-gray-200 bg-black px-5 py-4 text-noto-14-regular text-white outline-none placeholder:text-gray-300 pc:h-[160px] pc:text-noto-16-regular"
          />

          <div className="mt-8 grid grid-cols-2 gap-3 tablet:gap-5 pc:mt-10">
            <ButtonSecondary
              variant="thin"
              className="w-full! border border-gray-200 bg-transparent!"
              onClick={onClose}
            >
              취소하기
            </ButtonSecondary>

            <ButtonPrimary
              variant="thin"
              className="w-full!"
              onClick={handleSubmit}
            >
              교환하기
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </section>
  );
}
