"use client";

import Image from "next/image";
import Title from "@/components/common/Title";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import MyCardDetailSaleForm from "../common/MyCardDetailSaleForm";
import InputDropdown from "../common/InputDropdown";
import InputTextbox from "../common/InputTextbox";
import PrimaryButton from "../common/ButtonPrimary";
import ButtonSecondary from "../common/ButtonSecondary";

import {
  getMarketPosting,
  updateMarketPosting,
} from "@/lib/services/marketPostingService";

const GRADE_OPTIONS = [
  { label: "COMMON", value: "COMMON" },
  { label: "RARE", value: "RARE" },
  { label: "SUPER_RARE", value: "SUPER_RARE" },
  { label: "LEGENDARY", value: "LEGENDARY" },
];

const GENRE_OPTIONS = [
  { label: "앨범", value: "ALBUM" },
  { label: "특전", value: "SPECIAL" },
  { label: "팬싸", value: "FAN_SIGN" },
  { label: "시즌그리팅", value: "SEASON_GREETING" },
  { label: "팬미팅", value: "FAN_MEETING" },
  { label: "콘서트", value: "CONCERT" },
  { label: "MD", value: "MD" },
  { label: "콜라보", value: "COLLABORATION" },
  { label: "팬클럽", value: "FAN_CLUB" },
  { label: "기타", value: "ETC" },
];

export default function EditMarketCardModal({ onClose }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [marketPosting, setMarketPosting] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const [exchangeDescription, setExchangeDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getMarketPosting(id);

        setMarketPosting(data);

        setQuantity(data.remainingQuantity);
        setPrice(data.price);

        setSelectedGrade(data.exchangeGrade);
        setSelectedGenre(data.exchangeGenre);
        setExchangeDescription(data.exchangeDescription);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!marketPosting) return null;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      const body = {
        quantity,
        price,
        title: marketPosting.title,
        description: marketPosting.description,
        exchangeGrade: selectedGrade,
        exchangeGenre: selectedGenre,
        exchangeDescription,
      };
      setIsSubmitting(true);
      await updateMarketPosting(id, body);

      alert("수정이 완료되었습니다.");

      if (onClose) onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1160px] max-h-[90vh] overflow-y-auto rounded-[2px] border-gray-500 bg-black px-5 py-8 text-white tablet:px-10 tablet:bg-gray-500 pc:px-[120px] pc:py-[60px]">
      <div className="hidden tablet:flex pc:hidden justify-center mb-4">
        <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
      </div>

      <section className="mx-auto w-full">
        <p className="hidden text-gray-300 tablet:text-baskin-18 tablet:block pc:text-baskin-24">
          수정하기
        </p>

        <Title
          type="card_detail"
          text={marketPosting.photoCard.name}
          className="top-0 pc:mt-[40px] tablet:mt-[40px]"
        />

        <div className="mt-6 grid grid-cols-1 tablet:grid-cols-2 tablet:gap-6 pc:grid-cols-[1fr_440px] pc:gap-[80px]">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-gray-800 tablet:aspect-[342/256] pc:aspect-[960/720]">
            <Image
              src={marketPosting.photoCard.imageUrl}
              alt={marketPosting.photoCard.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <aside className="w-full">
            <MyCardDetailSaleForm
              grade={marketPosting.photoCard.grade}
              genre={marketPosting.photoCard.genre}
              ownerNickname={marketPosting.seller.nickname}
              quantity={quantity}
              minQuantity={1}
              maxQuantity={marketPosting.remainingQuantity}
              price={price}
              onQuantityChange={setQuantity}
              onPriceChange={setPrice}
            />
          </aside>
        </div>

        <section className="mt-[90px] tablet:mt-[120px] pc:mt-[140px]">
          <Title type="exchange_info_modal" text="교환 희망 정보" />

          <div className="mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-2 pc:flex pc:gap-[40px]">
            <InputDropdown
              label="등급"
              placeholder="등급을 선택해 주세요"
              options={GRADE_OPTIONS}
              value={selectedGrade}
              onChange={setSelectedGrade}
            />

            <InputDropdown
              label="장르"
              placeholder="장르를 선택해 주세요"
              options={GENRE_OPTIONS}
              value={selectedGenre}
              onChange={setSelectedGenre}
            />
          </div>

          <InputTextbox
            label="교환 희망 설명"
            placeholder="설명을 입력해 주세요"
            value={exchangeDescription}
            onChange={setExchangeDescription}
            className="mt-[49.5px] max-w-[345px] tablet:max-w-[919px] tablet:mt-[35px] pc:max-w-[1080px] pc:mt-[34px]"
          />

          <div className="mt-6 flex gap-[15px] tablet:hidden">
            <ButtonSecondary
              variant="thinXS"
              className="flex-1"
              onClick={onClose}
            >
              취소하기
            </ButtonSecondary>

            <PrimaryButton
              variant="thinXS"
              className="flex-1"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              수정하기
            </PrimaryButton>
          </div>

          <div className="hidden tablet:flex pc:hidden gap-[20px] mt-8 w-full">
            <ButtonSecondary className="flex-1" onClick={onClose}>
              취소하기
            </ButtonSecondary>

            <PrimaryButton
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              수정하기
            </PrimaryButton>
          </div>

          <div className="hidden pc:flex gap-[40px] mt-[61px] justify-end">
            <ButtonSecondary variant="thin" onClick={onClose}>
              취소하기
            </ButtonSecondary>

            <PrimaryButton
              variant="thin"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              수정하기
            </PrimaryButton>
          </div>
        </section>
      </section>
    </div>
  );
}
