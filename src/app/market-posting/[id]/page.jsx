"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import Gnb from "@/components/common/Gnb";
import PhotoCardInfo from "@/components/common/PhotoCardInfo";
import { useModal } from "@/providers/ModalProvider";
import SellerCardAction from "@/components/common/SellerCardAction";
import Title from "@/components/common/Title";
import ExchangeCard from "@/components/common/ExchangeCard";
import {
  getMarketPosting,
  deleteMarketPosting,
} from "@/lib/services/marketPostingService";

import {
  getExchangeProposals,
  approveExchangeProposal,
  rejectExchangeProposal,
} from "@/lib/services/exchangeProposalService";

export default function SellingPhotocardDetails() {
  const { id } = useParams();
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();

  const [marketPosting, setMarketPosting] = useState(null);
  const [exchangeCards, setExchangeCards] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMarketPosting = useCallback(async () => {
    try {
      const data = await getMarketPosting(id);
      setMarketPosting(data);
    } catch (error) {
      console.error("판매글 조회 실패:", error);
    }
  }, [id]);

  const fetchExchangeCards = useCallback(async () => {
    try {
      const data = await getExchangeProposals(id);

      const cards = data
        .filter((proposal) => proposal.status === "PENDING")
        .map((proposal) => ({
          id: proposal.id,
          makerNickname: proposal.offeredInventory.photoCard.creator.nickname,
          name: proposal.offeredInventory.photoCard.name,
          grade: proposal.offeredInventory.photoCard.grade,
          genre: proposal.offeredInventory.photoCard.genre,
          price: proposal.offeredInventory.photoCard.minPrice,
          imgUrl: proposal.offeredInventory.photoCard.imageUrl,
          description: proposal.message,
          status: proposal.status,
        }));

      setExchangeCards(cards);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  //판매글 먼저 조회
  useEffect(() => {
    if (id) {
      fetchMarketPosting();
      fetchExchangeCards();
    }
  }, [id, fetchMarketPosting, fetchExchangeCards]);

  if (!marketPosting) return <div>로딩</div>;

  //수정 하기
  const handleEdit = () => {
    router.push(`${pathname}?modal=edit-card&id=${marketPosting.id}`, {
      scroll: false,
    });
  };

  // 판매 내리기
  const handleSellClose = () => {
    openModal(
      <div className="flex flex-col justify-center items-center gap-[30px] w-[345px] h-[291px] border-gray-500 rounded-[2px]      tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[352px] pc: gap-[40px]">
        <p className="text-noto-18-bold pc:text-noto-20-bold">
          포토카드 판매 내리기
        </p>

        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          정말로 판매를 중단하시겠습니까?
        </p>

        <button
          disabled={isSubmitting}
          className="flex items-center justify-center w-[120px] h-[55px] mt-[10px] bg-main text-black text-noto-16-bold tablet:w-[140px] pc:w-[170px] pc:h-[60px] pc:mt-[20px] pc:text-noto-18-bold"
          onClick={async () => {
            try {
              await deleteMarketPosting(id);

              closeModal();

              router.push("/my-sale");
            } catch (e) {
              console.error(e);
            } finally {
              setIsSubmitting(false);
            }
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
      <div className="flex flex-col justify-center items-center gap-[30px] w-[345px] h-[291px] rounded-[2px] tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[352px] pc: gap-[40px]">
        <p className="text-noto-18-bold pc:text-noto-20-bold">
          교환 제시를 거절
        </p>

        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          [{card.grade} | {card.name}] 카드와의 교환을 거절하시겠습니까?
        </p>

        <button
          disabled={isSubmitting}
          className="flex bg-main text-noto-16-bold text-black items-center justify-center w-[120px] h-[55px] mt-[10px] pc:w-[170px] pc:h-[60px] pc:mt-[20px] pc:text-noto-18-bold tablet:w-[140px]"
          onClick={async () => {
            try {
              await rejectExchangeProposal(cardId);

              closeModal();

              await fetchExchangeCards();
            } catch (e) {
              console.error(e);
            } finally {
              setIsSubmitting(false);
            }
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
      <div className="flex flex-col justify-center items-center gap-[30px] w-[345px] h-[291px] rounded-[2px]    tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[352px] pc: gap-[40px]">
        <p className="text-noto-18-bold pc:text-noto-20-bold">교환 제시 승인</p>

        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          [{card.grade} | {card.name}] 카드와의 교환을 승인하시겠습니까?
        </p>

        <button
          disabled={isSubmitting}
          className="flex bg-main text-noto-16-bold text-black items-center justify-center w-[120px] h-[55px] mt-[10px] pc:w-[170px] pc:h-[60px] pc:mt-[20px] pc:text-noto-18-bold tablet:w-[140px]"
          onClick={async () => {
            try {
              await approveExchangeProposal(cardId);

              closeModal();

              await fetchExchangeCards();
            } catch (e) {
              console.error(e);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          승인하기
        </button>
      </div>,
    );
  };

  return (
    <>
      <Gnb mobileType="sub" />
      {marketPosting.isSeller ? (
        <main className="bg-black text-white">
          <section className="mx-auto w-full max-w-[1480px] pb-[40px] pt-[80px] px-[15px] tablet:pb-[60px] tablet:pt-[110px] tablet:px-[20px] pc:pb-[180px] pc:pt-[140px] pc:px-[0px]">
            <p className="hidden text-gray-300 tablet:text-baskin-18 tablet:block pc:text-baskin-24 pc:block">
              마켓플레이스
            </p>
            <Title type="card_detail" text={marketPosting.photoCard.name} />

            <div className="mt-7 grid gap-8 tablet:mt-10 tablet:grid-cols-2 tablet:gap-5 pc:grid-cols-[1fr_440px] pc:gap-[80px]">
              <div className="relative aspect-[345/258] w-full overflow-hidden bg-gray-500 tablet:aspect-[342/256] pc:aspect-[960/720]">
                <Image
                  src={marketPosting.photoCard.imageUrl}
                  alt={marketPosting.photoCard.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <aside className="w-full">
                <PhotoCardInfo
                  grade={marketPosting.photoCard.grade}
                  genre={marketPosting.photoCard.genre}
                  description={marketPosting.photoCard.description}
                  price={marketPosting.price}
                  remainingQuantity={marketPosting.remainingQuantity}
                  totalQuantity={marketPosting.photoCard.totalQuantity}
                  ownerNickname={marketPosting.seller.nickname}
                />
                <SellerCardAction
                  className="mt-6 pc:mt-8"
                  exchangeGrade={marketPosting.exchangeGrade}
                  exchangeGenre={marketPosting.exchangeGenre}
                  exchangeDescription={marketPosting.exchangeDescription}
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
      ) : (
        <div className="flex h-screen items-center justify-center bg-black text-2xl text-white">
          본인의 게시글이 아닙니다.
        </div>
      )}
    </>
  );
}
