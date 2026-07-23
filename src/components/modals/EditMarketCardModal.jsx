"use client";

import Image from "next/image";
import Title from "@/components/common/Title";
import cardImage from "@/assets/images/card_woman.svg";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MyCardDetailSaleForm from "../common/MyCardDetailSaleForm";
import InputDropdown from "../common/InputDropdown";
import InputTextbox from "../common/InputTextbox";
import PrimaryButton from "../common/ButtonPrimary";
import ButtonSecondary from "../common/ButtonSecondary";
import Gnb from "../common/Gnb";

const mockMarketPostingDetail = {
  id: 1,
  photoCardId: 101,
  sellerId: 20,
  name: "우리집 앞마당",
  imageUrl: cardImage,
  grade: "LEGENDARY",
  genre: "풍경",
  ownerNickname: "미쓰손",
  description:
    "우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다.",
  price: 4,
  remainingQuantity: 2,
  totalQuantity: 5,
  exchange: {
    grade: "RARE",
    genre: "풍경",
    description:
      "푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.",
  },
};

const GRADE_OPTIONS = [
  { label: "COMMON", value: "COMMON" },
  { label: "RARE", value: "RARE" },
  { label: "SUPER_RARE", value: "SUPER_RARE" },
  { label: "LEGENDARY", value: "LEGENDARY" },
];
const GENRE_OPTIONS = [
  { label: "풍경", value: "풍경" },
  { label: "인물", value: "인물" },
  { label: "동물", value: "동물" },
  { label: "사물", value: "사물" },
];

export default function EditMarketCardModal({ onClose }) {
  const searchParams = useSearchParams();

  const [selectedGrade, setSelectedGrade] = useState(
    mockMarketPostingDetail.exchange.grade,
  );
  const [selectedGenre, setSelectedGenre] = useState(
    mockMarketPostingDetail.exchange.genre,
  );
  const [description, setDescription] = useState(
    mockMarketPostingDetail.exchange.description,
  );

  //수량 변경
  const [quantity, setQuantity] = useState(
    mockMarketPostingDetail.remainingQuantity,
  );
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  //가격 변경
  const [price, setPrice] = useState(mockMarketPostingDetail.price);
  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  // 수정 제출 처리
  const handleSubmit = () => {
    const editPayload = {
      id: id || mockMarketPostingDetail.id,
      quantity,
      price,
      exchangeGrade: selectedGrade,
      exchangeGenre: selectedGenre,
      description,
    };

    console.log("수정 요청 데이터:", editPayload);
    alert("수정이 완료되었습니다.");
    if (onClose) onClose();
  };

  const id = searchParams.get("id");
  //API 연동
  //   useEffect(() => {
  //     getMarketCard(id);
  //   }, [id]);

  return (
    <>
      <div className="max-w-[1160px] max-h-[90vh] overflow-y-auto rounded-[2px] border-gray-500 bg-black px-5 py-8 text-white tablet:px-10 tablet:bg-gray-500 pc:px-[120px] pc:py-[60px]">
        <div className="hidden tablet:flex pc:hidden justify-center mb-4">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
        </div>
        <section className="mx-auto w-full">
          <p className="hidden text-gray-300 tablet:text-baskin-18 tablet:block pc:text-baskin-24 pc:block">
            수정하기
          </p>
          <Title
            type="card_detail"
            text={mockMarketPostingDetail.name}
            className="top-0 pc:mt-[40px] tablet:mt-[40px]"
          />
          <div className="mt-6 grid grid-cols-1 tablet:grid-cols-2 tablet:gap-6 pc:grid-cols-[1fr_440px] pc:gap-[80px]">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-gray-800 tablet:aspect-[342/256] pc:aspect-[960/720]">
              <Image
                src={mockMarketPostingDetail.imageUrl}
                alt={mockMarketPostingDetail.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <aside className="w-full">
              <MyCardDetailSaleForm
                grade={mockMarketPostingDetail.grade}
                genre={mockMarketPostingDetail.genre}
                ownerNickname={mockMarketPostingDetail.ownerNickname}
                quantity={quantity}
                minQuantity={1}
                maxQuantity={mockMarketPostingDetail.remainingQuantity}
                price={price}
                onQuantityChange={handleQuantityChange}
                onPriceChange={handlePriceChange}
                className="bg-blakc tablet:bg-gray-500"
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
                onChange={(val) => setSelectedGrade(val)}
              />
              <InputDropdown
                label="장르"
                placeholder="장르를 선택해 주세요"
                options={GENRE_OPTIONS}
                value={selectedGenre}
                onChange={(val) => setSelectedGenre(val)}
              />
            </div>

            <InputTextbox
              label="교환 희망 설명"
              placeholder="설명을 입력해 주세요"
              value={description}
              onChange={(text) => setDescription(text)}
              className="mt-[49.5px] max-w-[345px] tablet:max-w-[919px] tablet:mt-[35px] pc:max-w-[1080px] pc:mt-[34px]"
            />
            {/* 모바일용 버튼 */}
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
                onClick={handleSubmit}
              >
                수정하기
              </PrimaryButton>
            </div>

            {/* 태블릿 전용 버튼 */}
            <div className="hidden tablet:flex pc:hidden gap-[20px] mt-8 w-full">
              <ButtonSecondary
                className="flex-1 border border-gray-100 text-white text-noto-16-regular rounded-[2px]"
                onClick={onClose}
              >
                취소하기
              </ButtonSecondary>
              <PrimaryButton
                className="flex-1 text-noto-16-bold rounded-[2px]"
                onClick={handleSubmit}
              >
                수정하기
              </PrimaryButton>
            </div>

            {/* PC 전용 버튼*/}
            <div className="hidden pc:flex gap-[40px] mt-[61px] justify-end">
              <ButtonSecondary
                variant="thin"
                className="border border-gray-100 rounded-xs"
                onClick={onClose}
              >
                취소하기
              </ButtonSecondary>
              <PrimaryButton
                variant="thin"
                className="rounded-xs"
                onClick={handleSubmit}
              >
                수정하기
              </PrimaryButton>
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
