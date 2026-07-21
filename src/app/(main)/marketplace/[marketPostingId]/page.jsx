"use client";

import Image from "next/image";
import { useState } from "react";
// import { useRouter } from "next/navigation"; // 로그인 페이지 연결 시 사용 예정
import BuyerCardAction from "@/components/common/BuyerCardAction";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Gnb from "@/components/common/Gnb";
import Grade from "@/components/common/Grade";
import PhotoCardInfo from "@/components/common/PhotoCardInfo";
import MarketplacePurchaseModal from "@/components/modals/MarketplacePurchaseModal";
import { useModal } from "@/providers/ModalProvider";
import cardImage from "@/assets/images/card_woman.svg";

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
  ownerNickname: "미쏘손",
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

export default function MarketplaceBuyerDetailPage() {
  // const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [quantity, setQuantity] = useState(2);

  const requireLogin = () => {
    if (mockIsLoggedIn) return true;

    console.log("로그인이 필요한 액션입니다.");
    alert("로그인이 필요한 서비스입니다.");

    // 로그인 페이지 작업 완료 후 아래 코드로 연결 예정
    // router.push("/login");

    return false;
  };

  const handleConfirmPurchase = (purchaseQuantity) => {
    const purchasePayload = {
      marketPostingId: mockMarketPostingDetail.id,
      buyerId: mockUser.id,
      sellerId: mockMarketPostingDetail.sellerId,
      photoCardId: mockMarketPostingDetail.photoCardId,
      quantity: purchaseQuantity,
      transactionPrice: mockMarketPostingDetail.price * purchaseQuantity,
    };

    console.log("구매 요청 목업 데이터:", purchasePayload);

    closeModal();

    alert(
      "구매 요청이 완료되었습니다. 이후 성공/실패 페이지로 연결 예정입니다.",
    );
  };

  const handlePurchase = (purchaseQuantity) => {
    if (!requireLogin()) return;

    openModal(
      <MarketplacePurchaseModal
        cardName={mockMarketPostingDetail.name}
        grade={mockMarketPostingDetail.grade}
        quantity={purchaseQuantity}
        onClose={closeModal}
        onConfirm={() => handleConfirmPurchase(purchaseQuantity)}
      />,
    );
  };

  const handleExchange = () => {
    if (!requireLogin()) return;

    console.log("포토카드 교환하기 클릭:", {
      marketPostingId: mockMarketPostingDetail.id,
    });

    alert("포토카드 교환하기 클릭");
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <Gnb
          isLoggedIn={mockIsLoggedIn}
          user={mockUser}
          mobileType="sub"
          title="마켓플레이스"
          onBackClick={() => window.history.back()}
          onLoginClick={() => console.log("로그인 클릭")}
          onSignupClick={() => console.log("회원가입 클릭")}
          onLogoutClick={() => console.log("로그아웃 클릭")}
        />
      </div>

      <main className="bg-black text-white">
        <section className="mx-auto w-full max-w-[1480px] pb-[140px] pt-10 tablet:pb-[170px] tablet:pt-[50px] pc:pb-[180px] pc:pt-[80px]">
          <p className="hidden text-noto-18-bold text-gray-300 tablet:block pc:text-noto-20-bold">
            마켓플레이스
          </p>

          <h1 className="mt-0 text-noto-24-bold tablet:mt-[38px] tablet:text-noto-32-bold pc:mt-[58px] pc:text-noto-40-bold">
            {mockMarketPostingDetail.name}
          </h1>

          <div className="mt-4 border-t border-gray-100 tablet:mt-5 pc:mt-6" />

          <div className="mt-7 grid gap-8 tablet:mt-10 tablet:grid-cols-[minmax(0,342px)_minmax(0,342px)] tablet:gap-5 pc:mt-[70px] pc:grid-cols-[minmax(0,960px)_440px] pc:gap-[80px]">
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

              <BuyerCardAction
                className="mt-6 pc:mt-8"
                price={mockMarketPostingDetail.price}
                quantity={quantity}
                minQuantity={1}
                maxQuantity={mockMarketPostingDetail.remainingQuantity}
                onQuantityChange={setQuantity}
                onPurchase={handlePurchase}
              />
            </aside>
          </div>

          <section className="mt-[90px] tablet:mt-[120px] pc:mt-[140px]">
            <div className="flex items-end justify-between gap-5">
              <h2 className="text-noto-24-bold tablet:text-noto-32-bold pc:text-noto-40-bold">
                교환 희망 정보
              </h2>

              <ButtonPrimary
                variant="thin"
                className="hidden w-[342px]! tablet:flex pc:w-[440px]!"
                onClick={handleExchange}
              >
                포토카드 교환하기
              </ButtonPrimary>
            </div>

            <div className="mt-4 border-t border-gray-100 tablet:mt-5 pc:mt-6" />

            <div className="mt-9 tablet:mt-10 pc:mt-[70px]">
              <p className="whitespace-pre-line text-noto-16-bold leading-7 text-white pc:text-noto-18-bold pc:leading-8">
                {mockMarketPostingDetail.exchange.description}
              </p>

              <div className="mt-5 flex items-center gap-3 tablet:mt-6 pc:mt-7">
                <Grade
                  type="detail"
                  grade={mockMarketPostingDetail.exchange.grade}
                />
                <span className="h-5 w-px bg-gray-400" aria-hidden="true" />
                <span className="text-noto-16-bold text-gray-300 tablet:text-noto-18-bold pc:text-noto-20-bold">
                  {mockMarketPostingDetail.exchange.genre}
                </span>
              </div>

              <ButtonPrimary
                variant="thin"
                className="mt-10 w-full! tablet:hidden"
                onClick={handleExchange}
              >
                포토카드 교환하기
              </ButtonPrimary>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
