"use client";

import Image from "next/image";
import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import BuyerCardAction from "@/components/common/BuyerCardAction";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Grade from "@/components/common/Grade";
import PhotoCardInfo from "@/components/common/PhotoCardInfo";
import Title from "@/components/common/Title";
import { useAuth } from "@/providers/AuthProvider";
import { marketService } from "@/lib/services/marketService";
import { userService } from "@/lib/services/userService";
import MyExchangeOfferCard from "../_components/BuyerExchangeCard";
import CancelExchangeOfferModal from "../_components/CancelExchangeOfferModal";
import { useModal } from "@/providers/ModalProvider";
import PurchaseModal from "../_components/PurchaseModal";

const GENRE_MAP = {
  ALBUM: "앨범",
  SPECIAL: "특전",
  FAN_SIGN: "팬싸",
  SEASON_GREETING: "시즌그리팅",
  FAN_MEETING: "팬미팅",
  CONCERT: "콘서트",
  MD: "MD",
  COLLABORATION: "콜라보",
  FAN_CLUB: "팬클럽",
  ETC: "기타",
};
const getKorGenre = (genreKey) => {
  if (!genreKey) return "";
  return GENRE_MAP[genreKey] || genreKey;
};

export default function MarketplacePostingDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { openModal, closeModal } = useModal();

  const owner = user?.id === id;
  if (owner) {
    router.push("/market-posting"); //임시 코드 추후 판매자 페이지로 이동
  }

  const currentUser = user;
  const isLoggedIn = Boolean(currentUser);

  // 1️⃣ 판매글 상세 정보 조회 API 연동
  const {
    data: postingDetail,
    isPending: isPostingLoading,
    error: postingError,
  } = useQuery({
    queryKey: ["marketPostingDetail", id],
    queryFn: () => marketService.getPostingDetail(id),
    enabled: Boolean(id),
  });

  // 2️⃣ 내가 제시한 교환 목록 조회 API 연동
  const { data: allMyExchangeOffers = [], isPending: isOffersLoading } =
    useQuery({
      queryKey: ["myExchangeOffers"],
      queryFn: () => userService.getMyExchangeOffers(),
      enabled: isLoggedIn,
    });

  const myExchangeOffers = useMemo(() => {
    if (!Array.isArray(allMyExchangeOffers)) return [];

    return allMyExchangeOffers
      .filter((offer) => offer.status === "PENDING")
      .map((offer) => {
        const photoCard = offer.offeredInventory?.photoCard || {};

        return {
          id: offer.id,
          name: photoCard.name || "이름 없는 포토카드",
          imageUrl:
            photoCard.imageUrl || photoCard.image_url || offer.imageUrl || null,
          grade: photoCard.grade || "COMMON",
          genre: getKorGenre(photoCard.genre),
          price: photoCard.minPrice || 0,
          ownerNickname: photoCard.creator?.nickname || "알 수 없음",
          description: offer.message || "교환 제시 내용이 없습니다.",
          status: offer.status,
        };
      });
  }, [allMyExchangeOffers]);

  const hasMyExchangeOffers = isLoggedIn && myExchangeOffers.length > 0;

  const requireLogin = () => {
    if (isLoggedIn) return true;
    router.push("/login");
    return false;
  };

  const handlePurchase = (purchaseQuantity) => {
    if (!requireLogin()) return;
    if (!postingDetail) return;
    openModal(
      <PurchaseModal
        id={postingDetail.id}
        grade={postingDetail.photoCard?.grade}
        cardName={postingDetail.photoCard?.name}
        quantity={purchaseQuantity}
        postingDetail={postingDetail}
        onClose={closeModal}
      />,
    );
  };

  const handleExchange = () => {
    router.push("?modal=myCard");
  };

  const handleCancelExchangeOffer = (offer) => {
    openModal(
      <CancelExchangeOfferModal
        offerId={offer.id}
        cardGrade={offer.grade}
        cardName={offer.name}
        onClose={closeModal}
      />,
    );
  };

  if (isPostingLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black text-white">
        로딩 중...
      </div>
    );
  }

  if (postingError || !postingDetail) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black text-white">
        존재하지 않거나 불러올 수 없는 판매글입니다.
      </div>
    );
  }

  const cardName = postingDetail.photoCard?.name;
  const cardImageUrl = postingDetail.photoCard?.imageUrl;
  const cardGrade = postingDetail.photoCard?.grade;
  const cardGenre = getKorGenre(postingDetail.photoCard?.genre);
  const sellerNickname = postingDetail.seller?.nickname;
  const exchangeGenre = getKorGenre(postingDetail.exchangeGenre);
  return (
    <main className="-mx-[15px] min-h-dvh bg-black px-[15px] text-white tablet:-mx-5 tablet:px-5 pc:-mx-[220px] pc:px-[220px]">
      <section className="mx-auto w-full max-w-[1480px] pb-[140px] pt-10 tablet:pb-[170px] tablet:pt-[50px] pc:pb-[180px] pc:pt-[80px]">
        <p className="hidden text-noto-18-bold text-gray-300 tablet:block pc:text-noto-20-bold">
          마켓플레이스
        </p>

        <Title
          type="card_detail"
          text={cardName}
          className="mt-0 tablet:mt-[38px] pc:mt-[58px]"
        />

        <div className="mt-7 grid gap-8 tablet:mt-10 tablet:grid-cols-[minmax(0,1fr)_342px] tablet:gap-5 min-[1440px]:grid-cols-[minmax(0,1fr)_440px] min-[1440px]:gap-[80px] pc:mt-[70px] pc:grid-cols-[minmax(0,960px)_440px] pc:gap-[80px]">
          <div className="relative aspect-[345/258] w-full overflow-hidden bg-gray-500 tablet:aspect-[342/256] min-[1440px]:aspect-[960/720] pc:aspect-[960/720]">
            {cardImageUrl && (
              <Image
                src={cardImageUrl}
                alt={cardName || "포토카드 이미지"}
                fill
                priority
                className="object-cover"
              />
            )}
          </div>

          <aside className="w-full">
            <PhotoCardInfo
              grade={cardGrade}
              genre={cardGenre}
              ownerNickname={sellerNickname}
              description={postingDetail.description}
              price={postingDetail.price}
              remainingQuantity={postingDetail.remainingQuantity}
              totalQuantity={postingDetail.quantity}
            />

            <BuyerCardAction
              className="mt-6 [&>button]:mt-[72px]! tablet:[&>button]:mt-[82px]! min-[1440px]:[&>button]:mt-[108px]! pc:mt-8 pc:[&>button]:mt-[108px]!"
              price={postingDetail.price}
              quantity={quantity}
              minQuantity={1}
              maxQuantity={postingDetail.remainingQuantity}
              onQuantityChange={setQuantity}
              onPurchase={handlePurchase}
            />
          </aside>
        </div>

        <section className="mt-[90px] tablet:mt-[120px] pc:mt-[140px]">
          <div className="relative">
            <Title type="card_detail" text="교환 희망 정보" />

            <ButtonPrimary
              variant="thin"
              className="absolute right-0 top-[-10px] hidden w-[342px]! tablet:flex min-[1440px]:w-[440px]! pc:top-0 pc:w-[440px]!"
              onClick={handleExchange}
            >
              포토카드 교환하기
            </ButtonPrimary>
          </div>

          <div className="mt-9 tablet:mt-10 pc:mt-[70px]">
            <p className="whitespace-pre-line text-noto-16-bold leading-7 text-white pc:text-noto-18-bold pc:leading-8">
              {postingDetail.exchangeDescription ||
                "교환 희망 설명이 없습니다."}
            </p>

            <div className="mt-5 flex items-center gap-3 tablet:mt-6 pc:mt-7">
              {postingDetail.exchangeGrade && (
                <Grade type="detail" grade={postingDetail.exchangeGrade} />
              )}
              {postingDetail.exchangeGrade && postingDetail.exchangeGenre && (
                <span className="h-5 w-px bg-gray-400" aria-hidden="true" />
              )}
              {postingDetail.exchangeGenre && (
                <span className="text-noto-16-bold text-gray-300 tablet:text-noto-18-bold pc:text-noto-20-bold">
                  {postingDetail.exchangeGenre}
                </span>
              )}
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

        {isLoggedIn && (isOffersLoading || hasMyExchangeOffers) && (
          <section className="mt-[90px] tablet:mt-[120px] pc:mt-[140px]">
            <Title type="card_detail" text="내가 제시한 교환 목록" />

            {isOffersLoading ? (
              <p className="mt-8 text-noto-16-regular text-gray-300 tablet:mt-10">
                교환 제시 목록을 불러오는 중입니다.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-2 justify-items-center gap-[5px] tablet:mt-10 tablet:gap-5 pc:mt-[70px] pc:grid-cols-3 pc:gap-20">
                {myExchangeOffers.map((offer) => (
                  <MyExchangeOfferCard
                    key={offer.id}
                    offer={offer}
                    onCancel={handleCancelExchangeOffer}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
