"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useModal } from "@/providers/ModalProvider";
import { marketPostingService } from "@/lib/services/marketPostingService";
import Title from "@/components/common/Title";
import InputDropdown from "@/components/common/InputDropdown";
import InputTextbox from "@/components/common/InputTextbox";
import ButtonSecondary from "@/components/common/ButtonSecondary";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import MyCardDetailSaleForm from "@/components/common/MyCardDetailSaleForm";
import mookImg from "@/assets/images/card_woman.svg";

const gradeOptions = [
  { value: "COMMON", label: "COMMON" },
  { value: "RARE", label: "RARE" },
  { value: "SUPER_RARE", label: "SUPER RARE" },
  { value: "LEGENDARY", label: "LEGENDARY" },
];

const genreOptions = [
  { value: "ALBUM", label: "앨범" },
  { value: "SPECIAL", label: "특전" },
  { value: "FAN_SIGN", label: "팬싸" },
  { value: "SEASON_GREETING", label: "시즌그리팅" },
  { value: "FAN_MEETING", label: "팬미팅" },
  { value: "CONCERT", label: "콘서트" },
  { value: "MD", label: "MD" },
  { value: "COLLABORATION", label: "콜라보" },
  { value: "FAN_CLUB", label: "팬클럽" },
  { value: "ETC", label: "기타" },
];

export default function SellCardForm({ card, onCancel }) {
  const router = useRouter();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [grade, setGrade] = useState();
  const [genre, setGenre] = useState();
  const [description, setDescription] = useState("");

  const { mutate: createMarketPosting, isPending } = useMutation({
    mutationFn: (payload) => marketPostingService.createMarketPosting(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["market-postings"] });
      closeModal();
      const resultParams = new URLSearchParams({
        grade: data.photoCard.grade,
        cardName: data.photoCard.name,
        quantity: String(data.quantity),
      }).toString();
      router.replace(`/market-posting/sell-success?${resultParams}`);
    },
    onError: () => {
      closeModal();
      const resultParams = new URLSearchParams({
        grade: card.grade,
        cardName: card.name,
        quantity: String(quantity),
      }).toString();
      router.replace(`/market-posting/sell-fail?${resultParams}`);
    },
    meta: { name: "판매 등록" },
  });

  function handleSubmit() {
    if (isPending) return;

    const priceValue = Number(price);
    if (!priceValue || priceValue <= 0) {
      alert("장당 가격을 입력해 주세요.");
      return;
    }
    if (!grade && !genre) {
      alert("등급과 장르를 선택해 주세요.");
      return;
    }
    if (!grade) {
      alert("등급을 선택해 주세요.");
      return;
    }
    if (!genre) {
      alert("장르를 선택해 주세요.");
      return;
    }

    createMarketPosting({
      userInventoryId: card.id,
      quantity,
      price: priceValue,
      exchangeGrade: grade,
      exchangeGenre: genre,
      exchangeDescription: description,
    });
  }

  return (
    <div className="flex max-h-[calc(100dvh-80px)] w-screen flex-col gap-[20px] overflow-y-auto px-[15px] pt-[35px] pb-[30px] tablet:gap-[25px] tablet:px-[20px] tablet:pt-[50px] tablet:pb-[40px] pc:w-[1160px] pc:gap-[30px] pc:px-[120px] pc:pt-[60px] pc:pb-[60px] [scrollbar-color:#5a5a5a_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="mx-auto h-[6px] w-[48px] rounded-full bg-gray-400 pc:hidden" />

      <p className="text-baskin-18 pc:text-baskin-24 text-gray-300">
        나의 포토카드 판매하기
      </p>

      <Title type="card_detail" text={card.name} />

      <div className="flex flex-col gap-[20px] tablet:flex-row tablet:gap-[20px] pc:gap-[40px]">
        <div className="relative h-[259px] w-full overflow-hidden rounded-[2px] tablet:h-[256px] tablet:w-[342px] tablet:shrink-0 pc:h-[330px] pc:w-[440px]">
          <Image
            alt={card.description || card.name}
            src={card.imgUrl || mookImg}
            fill
            className="object-cover"
          />
        </div>

        <MyCardDetailSaleForm
          grade={card.grade}
          genre={card.genre}
          ownerNickname={card.makerNickname}
          quantity={quantity}
          minQuantity={1}
          maxQuantity={card.totalQuantity}
          price={price}
          onQuantityChange={setQuantity}
          onPriceChange={setPrice}
          className="w-full"
        />
      </div>

      <Title type="exchange_info_modal" text="교환 희망 정보" />

      <div className="flex flex-col gap-[20px] tablet:flex-row">
        <InputDropdown
          label="등급"
          options={gradeOptions}
          value={grade}
          onChange={setGrade}
          placeholder="등급을 선택해 주세요"
          className="w-full tablet:max-w-none"
        />
        <InputDropdown
          label="장르"
          options={genreOptions}
          value={genre}
          onChange={setGenre}
          placeholder="장르를 선택해 주세요"
          className="w-full tablet:max-w-none"
        />
      </div>

      <InputTextbox
        label="교환 희망 설명"
        value={description}
        onChange={setDescription}
        placeholder="교환 희망 설명을 입력해 주세요"
        className="tablet:max-w-none pc:max-w-none"
      />

      <div className="flex flex-row gap-[15px] tablet:gap-[20px]">
        <ButtonSecondary
          onClick={onCancel}
          className="w-full! h-[55px]! pc:h-[60px]!"
        >
          취소하기
        </ButtonSecondary>
        <ButtonPrimary
          onClick={handleSubmit}
          disabled={isPending}
          className="h-[55px] w-full pc:h-[60px]"
        >
          {isPending ? "등록 중..." : "판매하기"}
        </ButtonPrimary>
      </div>
    </div>
  );
}
