"use client";

import Image from "next/image";
import { Drawer } from "vaul";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import close from "@/assets/icons/close.svg";
import Gnb from "../common/Gnb";
import Title from "@/components/common/Title";
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
    <Drawer.Root open={true} onOpenChange={(open) => !open && onClose?.()}>
      <Drawer.Portal>
        {/* 백드롭 */}
        <Drawer.Overlay className="fixed inset-0 z-[9999] bg-black/80" />

        {/* 드로어 컨텐츠 영역 */}
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[9999] flex flex-col bg-gray-500 text-white outline-none focus:outline-none focus-visible:outline-none h-full tablet:h-[95vh] tablet:rounded-t-[20px] pc:inset-auto pc:left-1/2 pc:top-1/2 pc:-translate-x-1/2 pc:-translate-y-1/2 pc:w-[1160px] pc:h-[85vh] pc:rounded-[0px] overflow-hidden">
          {/* 상단 고정 영역 */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="hidden pc:flex absolute top-[30px] right-[30px] z-20 items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              aria-label="모달 닫기"
            >
              <Image src={close} alt="닫기버튼" width={32} height={32} />
            </button>

            <section className="tablet:hidden">
              <Gnb mobileType="sub" />
            </section>

            <div className="hidden tablet:block mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-400 pc:hidden" />
          </div>

          {/* 스크롤 영역 */}
          <div className="flex-1 mt-[70px] tablet:mt-[30px] pc:mt-[60px] overflow-y-auto px-4 tablet:px-8 pb-12 [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:bg-[var(--gray-gray400,#5A5A5A)] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="mx-auto w-full">
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

                <aside className="w-full mt-5 tablet:mt-0">
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

                <div className="mt-6 grid grid-cols-1 gap-4  tablet:flex tablet:gap-[40px] tablet:justify-center">
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
                  className="mt-[49.5px] mx-auto tablet:max-w-[919px] tablet:mt-[35px] pc:max-w-[1080px] pc:mt-[34px]"
                />

                <div className="mt-6 flex gap-[15px] tablet:hidden">
                  <ButtonSecondary
                    variant="thinXS"
                    className="flex-1 border"
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

                <div className="hidden tablet:flex pc:hidden gap-[20px] mt-8 w-full text-noto-16-bold mx-auto tablet:max-w-[919px] ">
                  <ButtonSecondary className="h-[55px] w-full border" onClick={onClose}>
                    취소하기
                  </ButtonSecondary>

                  <PrimaryButton
                    className="h-[55px] w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    수정하기
                  </PrimaryButton>
                </div>

                <div className="hidden pc:flex gap-[40px] mt-[61px] justify-end">
                  <ButtonSecondary variant="thin" onClick={onClose} className="border">
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
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
