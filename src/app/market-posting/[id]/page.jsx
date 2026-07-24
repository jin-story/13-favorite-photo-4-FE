"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Gnb from "@/components/common/Gnb";
import PhotoCardInfo from "@/components/common/PhotoCardInfo";
import { useModal } from "@/providers/ModalProvider";
import cardImage from "@/assets/images/card_woman.svg";
import SellerCardAction from "@/components/common/SellerCardAction";
import Title from "@/components/common/Title";
import ExchangeCard from "@/components/common/ExchangeCard";

const mockIsLoggedIn = true;

const mockUser = {
  id: 10,
  nickname: "유디",
  point: 1540,
};

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

const exchangeCards = [
  {
    id: 1,
    makerNickname: "4팀 화이팅",
    name: "스페인 여행",
    grade: "COMMON",
    genre: "풍경",
    price: 4,
    // imgUrl:,
    description:
      "스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고 싶습니다!",
  },
  {
    id: 2,
    makerNickname: "코드잇 화이팅",
    name: "How Far I'll Go",
    grade: "SUPER RARE",
    genre: "풍경",
    price: 4,
    // imgUrl:,
    description: "여름 바다 풍경 사진과 교환 하실래요?",
  },
];

export default function SellingPhotocardDetails() {
  // const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [quantity, setQuantity] = useState(2);

  // 교환 제시 목록 API 연동
  // const [exchangeCards, setExchangeCards] = useState([]);
  // useEffect(() => {
  //   // API 호출
  //   setExchangeCards(response.data);
  // }, []);

  const requireLogin = () => {
    if (mockIsLoggedIn) return true;

    console.log("로그인이 필요한 액션입니다.");
    alert("로그인이 필요한 서비스입니다.");

    // 로그인 페이지 작업 완료 후 아래 코드로 연결 예정
    // router.push("/login");

    return false;
  };

  //수정 하기
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = () => {
    router.push(
      `${pathname}?modal=edit-card&id=${mockMarketPostingDetail.id}`,
      {
        scroll: false,
      },
    );
  };

  // 판매 내리기
  const handleSellClose = () => {
    openModal(
      <div
        className="flex flex-col justify-center items-center gap-[30px] w-[345px] h-[291px] border-gray-500 rounded-[2px] \
      tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[352px] pc: gap-[40px]"
      >
        <p className="text-noto-18-bold pc:text-noto-20-bold">
          포토카드 판매 내리기
        </p>

        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          정말로 판매를 중단하시겠습니까?
        </p>

        <button
          className="flex items-center justify-center w-[120px] h-[55px] mt-[10px] bg-main text-black text-noto-16-bold tablet:w-[140px] pc:w-[170px] pc:h-[60px] pc:mt-[20px] pc:text-noto-18-bold"
          onClick={() => {
            // 판매내리기 API
            closeModal();
          }}
        >
          판매 내리기
        </button>
      </div>,
    );
  };

  // 거절하기
  const handleReject = (card, cardId) => {
    openModal(
      <div
        className="flex flex-col justify-center items-center gap-[30px] w-[345px] h-[291px] rounded-[2px] \
      tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[352px] pc: gap-[40px]"
      >
        <p className="text-noto-18-bold pc:text-noto-20-bold">
          교환 제시를 거절
        </p>

        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          [{card.grade} | {card.name}] 카드와의 교환을 거절하시겠습니까?
        </p>

        <button
          className="flex bg-main text-noto-16-bold text-black items-center justify-center w-[120px] h-[55px] mt-[10px] \
          pc:w-[170px] pc:h-[60px] pc:mt-[20px] pc:text-noto-18-bold tablet:w-[140px]"
          onClick={() => {
            // reject api(cardId)

            closeModal();
          }}
        >
          거절하기
        </button>
      </div>,
    );
  };

  //승인하기
  const handleApprove = (card, cardId) => {
    openModal(
      <div
        className="flex flex-col justify-center items-center gap-[30px] w-[345px] h-[291px] rounded-[2px] \
      tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[352px] pc: gap-[40px]"
      >
        <p className="text-noto-18-bold pc:text-noto-20-bold">교환 제시 승인</p>

        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          [{card.grade} | {card.name}] 카드와의 교환을 승인하시겠습니까?
        </p>

        <button
          className="flex bg-main text-noto-16-bold text-black items-center justify-center w-[120px] h-[55px] mt-[10px] \
          pc:w-[170px] pc:w-[60px] pc:mt-[20px] pc:text-noto-18-bold tablet:w-[140px]"
          onClick={() => {
            // reject api(cardId)

            closeModal();
          }}
        >
          승인하기
        </button>
      </div>,
    );
  };

  return (
    <>
      <Gnb isLoggedIn={mockIsLoggedIn} user={mockUser} mobileType="sub" />

      <main className="bg-black text-white">
        <section className="mx-auto w-full max-w-[1480px] pb-[40px] pt-[80px] px-[15px] tablet:pb-[60px] tablet:pt-[110px] tablet:px-[20px] pc:pb-[180px] pc:pt-[140px] pc:px-[0px]">
          <p className="hidden text-gray-300 tablet:text-baskin-18 tablet:block pc:text-baskin-24 pc:block">
            마켓플레이스
          </p>
          <Title type="card_detail" text={mockMarketPostingDetail.name} />

          <div className="mt-7 grid gap-8 tablet:mt-10 tablet:grid-cols-2 tablet:gap-5 pc:grid-cols-[1fr_440px] pc:gap-[80px]">
            <div className="relative aspect-[345/258] w-full overflow-hidden bg-gray-500 tablet:aspect-[342/256] pc:aspect-[960/720]">
              <Image
                src={mockMarketPostingDetail.imageUrl}
                alt={mockMarketPostingDetail.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <aside className="w-full">
              <PhotoCardInfo
                grade={mockMarketPostingDetail.grade}
                genre={mockMarketPostingDetail.genre}
                ownerNickname={mockMarketPostingDetail.ownerNickname}
                description={mockMarketPostingDetail.description}
                price={mockMarketPostingDetail.price}
                remainingQuantity={mockMarketPostingDetail.remainingQuantity}
                totalQuantity={mockMarketPostingDetail.totalQuantity}
              />
              <SellerCardAction
                className="mt-6 pc:mt-8"
                exchangeGrade={mockMarketPostingDetail.exchange.grade}
                exchangeGenre={mockMarketPostingDetail.exchange.genre}
                exchangeDescription={
                  mockMarketPostingDetail.exchange.description
                }
                onEdit={handleEdit}
                onClose={handleSellClose}
              />
            </aside>
          </div>

          <section className="mt-[90px] tablet:mt-[120px] pc:mt-[140px]">
            <Title type="card_detail" text={"교환 제시 목록"} />

            <div className="flex mt-9 gap-[5px] tablet:gap-[20px] tablet:mb-[20px] pc:mb-[50px] pc:gap-[80px]">
              {exchangeCards.map((card) => (
                <ExchangeCard
                  key={card.id}
                  card={card}
                  onApprove={() => handleApprove(card, card.id)}
                  onReject={() => handleReject(card, card.id)}
                />
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
