"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useModal } from "@/providers/ModalProvider";
import { useAuth } from "@/providers/AuthProvider";
import Title from "@/components/common/Title";
import InputSearch from "@/components/common/InputSearch";
import Dropdown from "@/components/common/Dropdown";
import SheetFilter from "@/components/common/SheetFilter";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Photocard from "@/components/common/Photocard";
import filterIcon from "@/assets/icons/filter.svg";

// const pageSize = 15;
// const apiUrl = "http://localhost:3001";

// const genreLabels = {
//   TRAVEL: "여행",
//   LANDSCAPE: "풍경",
//   PERSON: "인물",
//   OBJECT: "사물",
// };

// 목업 데이터
const sampleCards = [
  {
    id: 1,
    name: "스페인 여행",
    grade: "RARE",
    genre: "여행",
    price: 3000,
    totalQuantity: 3,
    lastQuantity: 3,
    makerNickname: "유디",
    description: "3장 일괄 판매합니다.",
    imgUrl: "",
  },
  {
    id: 2,
    name: "우리집 앞마당",
    grade: "COMMON",
    genre: "풍경",
    price: 1500,
    totalQuantity: 2,
    lastQuantity: 0,
    makerNickname: "미쓰손",
    description: "품절된 판매글입니다.",
    imgUrl: "",
  },
];

// GET /api/marketplaces
// async function fetchCards(page) {
//   const response = await fetch(
//     `${apiUrl}/api/marketplaces?page=${page}&limit=${pageSize}`,
//   );
//   const data = await response.json();
//
//   const cards = data.items.map((item) => ({
//     id: item.id,
//     name: item.photoCard.name,
//     grade: item.photoCard.grade,
//     genre: genreLabels[item.photoCard.genre] ?? item.photoCard.genre,
//     price: item.price,
//     totalQuantity: item.quantity,
//     lastQuantity: item.quantity,
//     makerNickname: item.seller.nickname,
//     description: item.description,
//     imgUrl: item.photoCard.imageUrl,
//   }));
//
//   return { cards, total: data.pagination.total };
// }

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState();
  const [genre, setGenre] = useState();
  const [availability, setAvailability] = useState();
  const [sort, setSort] = useState();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetFilter, setSheetFilter] = useState({
    grade: [],
    genre: [],
    availability: [],
  });
  const [cards, setCards] = useState(sampleCards);
  // const [page, setPage] = useState(1);
  const [total, setTotal] = useState(sampleCards.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const { openModal, closeModal } = useModal();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  function handleSellClick() {
    if (!isLoggedIn) {
      openModal(
        <div className="flex w-[345px] flex-col items-center gap-[20px] px-[20px] pt-[60px] pb-[40px] text-center pc:w-[560px] pc:gap-[35px] pc:px-[40px] pc:pt-[80px] pc:pb-[60px]">
          <h2 className="text-noto-18-bold pc:text-noto-20-bold text-white">
            로그인이 필요합니다.
          </h2>

          <p className="text-noto-14-regular pc:text-noto-16-regular text-gray-300">
            로그인 하시겠습니까?
            <br />
            다양한 서비스를 편리하게 이용하실 수 있습니다.
          </p>

          <ButtonPrimary
            variant="thin"
            onClick={closeModal}
            className="w-[120px] pc:w-[170px]"
          >
            확인
          </ButtonPrimary>
        </div>,
      );
      return;
    }

    // 나의 포토카드 판매하기 선택 모달
    openModal(
      <div>
        <p>미구현</p>
      </div>,
    );
  }

  // 첫 페이지 로드
  // useEffect(() => {
  //   async function loadFirstPage() {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const { cards: firstCards, total: totalCount } = await fetchCards(1);
  //       setCards(firstCards);
  //       setTotal(totalCount);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //
  //   loadFirstPage();
  // }, []);

  // 스크롤 다음 페이지 로드
  // useEffect(() => {
  //   const target = sentinelRef.current;
  //   if (!target) return;
  //
  //   const options = {
  //     root: null,
  //     rootMargin: "0px",
  //     threshold: 0,
  //   };
  //
  //   const observer = new IntersectionObserver((entries) => {
  //     const entry = entries[0];
  //     if (!entry.isIntersecting) return;
  //
  //     async function loadNextPage() {
  //       const nextPage = page + 1;
  //       const { cards: nextCards } = await fetchCards(nextPage);
  //
  //       if (nextCards.length < 1) {
  //         observer.unobserve(entry.target);
  //         return;
  //       }
  //
  //       setCards((prev) => [...prev, ...nextCards]);
  //       setPage((prev) => prev + 1);
  //     }
  //
  //     loadNextPage();
  //   }, options);
  //
  //   observer.observe(target);
  //
  //   return () => observer.disconnect();
  // }, [page]);

  if (loading) return <div className="bg-black text-white">로딩중...</div>;
  if (error)
    return (
      <div className="bg-black text-white">데이터를 불러오지 못했습니다.</div>
    );

  return (
    <div className="flex flex-col gap-[20px] bg-black pt-[20px] tablet:pt-[40px] pc:pt-[60px] pb-[90px] tablet:pb-[40px] pc:pb-[60px]">
      <Title
        type="title_button"
        text="마켓플레이스"
        buttonText="나의 포토카드 판매하기"
        onButtonClick={handleSellClick}
      />

      <div className="relative z-30 flex flex-col gap-[15px] tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex items-center gap-[15px] tablet:gap-[20px] pc:gap-[30px]">
          <InputSearch
            value={search}
            onChange={setSearch}
            className="w-full tablet:w-[200px] pc:w-[320px]"
          />

          <div className="hidden items-start gap-[35px] tablet:flex pc:gap-[45px]">
            <Dropdown type="grade" value={grade} onChange={setGrade} />
            <Dropdown type="genre" value={genre} onChange={setGenre} />
            <Dropdown
              type="availability"
              value={availability}
              onChange={setAvailability}
            />
          </div>
        </div>

        <div className="flex items-center justify-between tablet:justify-end tablet:gap-[20px]">
          <div className="tablet:hidden">
            <button
              type="button"
              aria-label="필터"
              onClick={() => setIsSheetOpen(true)}
              className="flex h-[35px] w-[35px] items-center justify-center border border-gray-200"
            >
              <Image src={filterIcon} alt="" className="h-[20px] w-[20px]" />
            </button>
          </div>

          <Dropdown type="sort" value={sort} onChange={setSort} />
        </div>
      </div>

      <SheetFilter
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        filter={sheetFilter}
        setFilter={setSheetFilter}
        totalCount={total}
        onApply={() => setIsSheetOpen(false)}
      />

      <div className="flex flex-wrap gap-[5px] tablet:gap-5 pc:gap-[80px]">
        {cards.map((card) => (
          <Photocard key={card.id} card={card} type="마켓 카드" />
        ))}
      </div>

      <div ref={sentinelRef} className="h-px w-full" />

      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-black px-[15px] py-[15px] tablet:hidden">
        <ButtonPrimary variant="thin" onClick={handleSellClick}>
          나의 포토카드 판매하기
        </ButtonPrimary>
      </div>
    </div>
  );
}
