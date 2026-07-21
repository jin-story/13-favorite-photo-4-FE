"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BuyerCardAction from "@/components/common/BuyerCardAction";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import ButtonSecondary from "@/components/common/ButtonSecondary";
import Gnb from "@/components/common/Gnb";
import Grade from "@/components/common/Grade";
import PhotoCardInfo from "@/components/common/PhotoCardInfo";
import MarketplacePurchaseModal from "@/components/modals/MarketplacePurchaseModal";
import MarketplaceExchangeCancelModal from "@/components/modals/MarketplaceExchangeCancelModal";
import { useModal } from "@/providers/ModalProvider";
import cardCastle from "@/assets/images/card_castle.svg";
import cardImage from "@/assets/images/card_woman.svg";

const mockIsLoggedIn = true;
const mockPurchaseShouldSucceed = true;

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

const mockMyExchangeOffers = [
  {
    id: 401,
    offeredPhotoCardId: 301,
    name: "스페인 여행",
    imageUrl: cardCastle,
    grade: "COMMON",
    genre: "풍경",
    ownerNickname: "유디",
    price: 4,
    quantity: 1,
    description:
      "스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고 싶습니다!",
  },
];

function MyExchangeOfferCard({ offer, onCancel }) {
  return (
    <article className="w-[170px] border border-white/10 bg-gray-500 p-2.5 text-white tablet:w-[302px] tablet:p-5 pc:w-[342px]">
      <div className="relative aspect-[150/112] w-full overflow-hidden bg-gray-400 tablet:aspect-[262/197] pc:aspect-[302/227]">
        <Image
          src={offer.imageUrl}
          alt={offer.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-2.5 truncate text-noto-14-bold tablet:mt-5 tablet:text-noto-22-bold">
        {offer.name}
      </h3>

      <div className="mt-[5px] flex items-center justify-between border-b border-gray-400 pb-2.5">
        <div className="flex min-w-0 items-center">
          <Grade type="card" grade={offer.grade} />
          <span className="mx-[5px] h-3 w-px bg-gray-400 tablet:mx-2.5 tablet:h-4" />
          <span className="text-noto-10-regular text-gray-300 tablet:text-noto-16-regular">
            {offer.genre}
          </span>
          <span className="mx-[5px] hidden h-3 w-px bg-gray-400 tablet:mx-2.5 tablet:block tablet:h-4" />
          <span className="hidden text-noto-10-regular tablet:block tablet:text-noto-16-regular">
            <span className="text-white">{offer.price} P</span>
            <span className="text-gray-300"> 에 구매</span>
          </span>
        </div>

        <span className="truncate text-noto-10-regular text-white underline underline-offset-2 tablet:text-noto-16-regular">
          {offer.ownerNickname}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 min-h-[32px] text-noto-10-regular leading-4 text-white tablet:mt-5 tablet:min-h-[46px] tablet:text-noto-16-regular tablet:leading-[23px]">
        {offer.description}
      </p>

      <ButtonSecondary
        variant="thin"
        className="mt-5 h-[40px]! w-full! border border-gray-200 bg-transparent! text-noto-12-bold tablet:mt-7 tablet:h-[55px]! tablet:text-noto-14-bold"
        onClick={() => onCancel(offer)}
      >
        취소하기
      </ButtonSecondary>
    </article>
  );
}

export default function MarketplacePostingDetailPage() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [quantity, setQuantity] = useState(2);

  const hasMyExchangeOffers = mockIsLoggedIn && mockMyExchangeOffers.length > 0;

  const requireLogin = () => {
    if (mockIsLoggedIn) return true;

    console.log("로그인이 필요한 액션입니다.");
    alert("로그인이 필요한 서비스입니다.");

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

    const resultPath = mockPurchaseShouldSucceed ? "success" : "failure";
    router.push(
      `/marketplace/${mockMarketPostingDetail.id}/purchase-result/${resultPath}`,
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

    router.push("?modal=marketplaceExchangeSelect", { scroll: false });
  };

  const handleCancelExchangeOffer = (offer) => {
    openModal(
      <MarketplaceExchangeCancelModal
        offer={offer}
        onClose={closeModal}
        onConfirm={() => {
          console.log("교환 제시 취소 요청 목업 데이터:", {
            exchangeOfferId: offer.id,
            marketPostingId: mockMarketPostingDetail.id,
          });

          closeModal();
          alert("교환 제시가 취소되었습니다.");
        }}
      />,
    );
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

      <main className="-mx-[15px] bg-black px-[15px] text-white tablet:-mx-5 tablet:px-5 pc:-mx-[220px] pc:px-[220px]">
        <section className="mx-auto w-full max-w-[1480px] pb-[140px] pt-10 tablet:pb-[170px] tablet:pt-[50px] pc:pb-[180px] pc:pt-[80px]">
          <p className="hidden text-noto-18-bold text-gray-300 tablet:block pc:text-noto-20-bold">
            마켓플레이스
          </p>

          <h1 className="mt-0 text-noto-24-bold tablet:mt-[38px] tablet:text-noto-32-bold pc:mt-[58px] pc:text-noto-40-bold">
            {mockMarketPostingDetail.name}
          </h1>

          <div className="mt-4 border-t border-gray-100 tablet:mt-5 pc:mt-6" />

          <div className="mt-7 grid gap-8 tablet:mt-10 tablet:grid-cols-[minmax(0,1fr)_342px] tablet:gap-5 min-[1440px]:grid-cols-[minmax(0,1fr)_440px] min-[1440px]:gap-[80px] pc:mt-[70px] pc:grid-cols-[minmax(0,960px)_440px] pc:gap-[80px]">
            <div className="relative aspect-[345/258] w-full overflow-hidden bg-gray-500 tablet:aspect-[342/256] min-[1440px]:aspect-[960/720] pc:aspect-[960/720]">
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
                className="mt-6 [&>button]:mt-[72px]! tablet:[&>button]:mt-[82px]! min-[1440px]:[&>button]:mt-[108px]! pc:mt-8 pc:[&>button]:mt-[108px]!"
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
                className="hidden w-[342px]! tablet:flex min-[1440px]:w-[440px]! pc:w-[440px]!"
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

          {hasMyExchangeOffers && (
            <section className="mt-[90px] tablet:mt-[120px] pc:mt-[140px]">
              <h2 className="text-noto-24-bold tablet:text-noto-32-bold pc:text-noto-40-bold">
                내가 제시한 교환 목록
              </h2>

              <div className="mt-4 border-t border-gray-100 tablet:mt-5 pc:mt-6" />

              <div className="mt-8 grid grid-cols-2 gap-3 tablet:mt-10 tablet:grid-cols-2 tablet:gap-5 pc:mt-[70px] pc:grid-cols-3 pc:gap-10">
                {mockMyExchangeOffers.map((offer) => (
                  <MyExchangeOfferCard
                    key={offer.id}
                    offer={offer}
                    onCancel={handleCancelExchangeOffer}
                  />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  );
}
