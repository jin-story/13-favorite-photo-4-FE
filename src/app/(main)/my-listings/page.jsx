"use client";

import Dropdown from "@/components/common/Dropdown";
import Filter from "@/components/common/Filter";
import GradeMyCard from "@/components/common/GradeMyCard";
import InputSearch from "@/components/common/InputSearch";
import "swiper/css";

import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Photocard from "@/components/common/Photocard";
import { useAuth } from "@/providers/AuthProvider";
import Title from "@/components/common/Title";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import refreshIcon from "@/assets/icons/exchange.svg";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/services/userService";

const MOCK_GENRES = [
  "ALBUM",
  "SPECIAL",
  "FAN_SIGN",
  "SEASON_GREETING",
  "FAN_MEETING",
  "CONCERT",
  "MD",
  "COLLABORATION",
  "FAN_CLUB",
  "ETC",
];

export default function MyListings() {
  const route = useRouter();
  const { user } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [filter, setFilter] = useState({
    grade: [],
    genre: [],
    sale: [],
    availability: [],
  });

  // 판매글과 내가 제시한 교환 목록은 별도 API이므로 동시에 조회합니다.
  const { data: rawMarketPostings = [], isPending: isMarketPostingsPending } =
    useQuery({
      queryKey: ["myMarketPostings"],
      queryFn: () => userService.getMyMarketPostings(),
    });

  const { data: rawExchangeOffers = [], isPending: isExchangeOffersPending } =
    useQuery({
      queryKey: ["myExchangeOffers"],
      queryFn: () => userService.getMyExchangeOffers(),
    });

  const isPending = isMarketPostingsPending || isExchangeOffersPending;

  // 2. 백엔드 데이터를 Photocard 컴포넌트에 맞게 매핑
  const marketCards = useMemo(() => {
    return rawMarketPostings.map((posting) => {
      const photoCard = posting.userInventory?.photoCard || {};
      const isSoldOut =
        posting.status === "SOLD" || posting.remainingQuantity === 0;

      return {
        id: posting.id,
        name: photoCard.name,
        grade: photoCard.grade,
        genre: photoCard.genre,
        price: posting.price,
        totalQuantity: isSoldOut ? 0 : posting.remainingQuantity,
        remainingQuantity: posting.remainingQuantity,
        status: posting.status, // "ON_SALE" 또는 "SOLD"
        availability: isSoldOut ? "SOLD_OUT" : "SALE",
        makerNickname: photoCard.creator?.nickname,
        imageUrl: photoCard.imageUrl,
        description: "",
        listingType: "SALE",
        createdAt: posting.createdAt,
      };
    });
  }, [rawMarketPostings]);

  const exchangeCards = useMemo(() => {
    return rawExchangeOffers
      .filter((offer) => offer.status === "PENDING")
      .map((offer) => {
        const photoCard = offer.offeredInventory?.photoCard || {};

        return {
          id: `exchange-${offer.id}`,
          name: photoCard.name,
          grade: photoCard.grade,
          genre: photoCard.genre,
          price: photoCard.minPrice || 0,
          totalQuantity: 1,
          remainingQuantity: 1,
          status: "ON_SALE",
          availability: "SALE",
          makerNickname: photoCard.creator?.nickname,
          imageUrl: photoCard.imageUrl,
          description: offer.message || "",
          listingType: "EXCHANGE",
          createdAt: offer.createdAt,
        };
      });
  }, [rawExchangeOffers]);

  const listingCards = useMemo(
    () =>
      [...marketCards, ...exchangeCards].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [exchangeCards, marketCards],
  );

  // 3. 통계 및 요약 정보 계산
  const userInventory = useMemo(() => {
    const gradeCounts = listingCards.reduce((acc, card) => {
      if (card.grade) acc[card.grade] = (acc[card.grade] || 0) + 1;
      return acc;
    }, {});

    const genreCounts = listingCards.reduce((acc, card) => {
      if (card.genre) acc[card.genre] = (acc[card.genre] || 0) + 1;
      return acc;
    }, {});

    const saleTypeCounts = listingCards.reduce((acc, card) => {
      if (card.listingType) {
        acc[card.listingType] = (acc[card.listingType] || 0) + 1;
      }
      return acc;
    }, {});

    const availabilityCounts = listingCards.reduce((acc, card) => {
      if (card.availability) {
        acc[card.availability] = (acc[card.availability] || 0) + 1;
      }
      return acc;
    }, {});

    const genreInventory = MOCK_GENRES.reduce((acc, genreKey) => {
      acc[genreKey] = genreCounts[genreKey] || 0;
      return acc;
    }, {});

    return {
      total: listingCards.length,
      ...genreCounts,
      ...genreInventory,
      COMMON: gradeCounts["COMMON"] || 0,
      RARE: gradeCounts["RARE"] || 0,
      SUPER_RARE: gradeCounts["SUPER_RARE"] || 0,
      LEGENDARY: gradeCounts["LEGENDARY"] || 0,
      grade: {
        COMMON: gradeCounts["COMMON"] || 0,
        RARE: gradeCounts["RARE"] || 0,
        SUPER_RARE: gradeCounts["SUPER_RARE"] || 0,
        LEGENDARY: gradeCounts["LEGENDARY"] || 0,
      },
      genre: genreInventory,
      sale: saleTypeCounts,
      availability: availabilityCounts,
    };
  }, [listingCards]);

  const handleResetAll = () => {
    setSearchKeyword("");
    setFilter({
      grade: [],
      genre: [],
      sale: [],
      availability: [],
    });
  };

  // 4. 필터링 로직 적용
  const filteredCards = useMemo(() => {
    return listingCards.filter((card) => {
      if (debouncedKeyword.trim()) {
        const keyword = debouncedKeyword.toLowerCase();
        const matchesSearch =
          card.name?.toLowerCase().includes(keyword) ||
          card.makerNickname?.toLowerCase().includes(keyword);
        if (!matchesSearch) return false;
      }

      if (filter.grade.length > 0 && !filter.grade.includes(card.grade)) {
        return false;
      }

      if (filter.genre.length > 0 && !filter.genre.includes(card.genre)) {
        return false;
      }

      if (
        filter.sale.length > 0 &&
        !filter.sale.includes(card.listingType)
      ) {
        return false;
      }

      if (
        filter.availability.length > 0 &&
        !filter.availability.includes(card.availability)
      ) {
        return false;
      }

      return true;
    });
  }, [debouncedKeyword, filter, listingCards]);

  const isFiltered =
    searchKeyword.trim().length > 0 ||
    filter.grade.length > 0 ||
    filter.genre.length > 0 ||
    filter.sale.length > 0 ||
    filter.availability.length > 0;

  return (
    <main className="mb-20 max-w-[345px] flex flex-col w-full gap-[15px] tablet:max-w-[704px] pt-5 tablet:pt-10 tablet:gap-10 pc:max-w-[1480px] pc:pt-[60px] mx-auto">
      <Title
        className="hidden tablet:block"
        type="title_line"
        text="나의 판매 및 교환 포토카드"
      />
      {/* 상단 요약 및 컨트롤 영역 */}
      <section className="flex flex-col gap-[15px] tablet:gap-5">
        {/* 등급별 통계 슬라이더 영역 */}
        <div className="flex flex-col gap-[15px] tablet:gap-5 border-b pb-[15px] border-b-gray-400 tablet:pb-10">
          <div className="flex gap-[5px] items-end">
            <h2 className="text-noto-14-bold tablet:text-noto-20-bold pc:text-noto-24-bold">
              {user?.nickname}님이 판매 및 교환 중인 포토카드
            </h2>
            <span className="text-noto-12-regular text-gray-300 tablet:text-noto-18-regular pc:text-noto-20-regular">
              ({userInventory.total}장)
            </span>
          </div>
          <div className="mx-[-15px] tablet:mx-[-20px] pl-[15px] tablet:px-5 overflow-hidden">
            <Swiper slidesPerView="auto" freeMode={true} className="w-full">
              {Object.entries(userInventory.grade).map(([key, count]) => (
                <SwiperSlide
                  key={key}
                  className="w-auto! mr-[10px] pc:mr-[20px]"
                >
                  <GradeMyCard grade={key} count={count} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {/* 필터 및 검색 바 영역 */}
        <div className="flex w-full justify-start items-center gap-7.5 pc:gap-[60px]">
          <div className="flex gap-2.5 w-full tablet:w-fit">
            <Filter
              categories={["grade", "genre", "sale", "availability"]}
              counts={userInventory}
              totalAllCount={listingCards.length}
              filter={filter}
              setFilter={setFilter}
              totalCount={filteredCards.length}
              onApply={(finalFilter) => setFilter(finalFilter)}
            />
            <InputSearch
              className="w-full tablet:w-[200px] pc:w-[320px]"
              onChange={setSearchKeyword}
              value={searchKeyword}
            />
          </div>
          <div className="hidden items-center gap-[25px] tablet:flex pc:gap-[45px]">
            <Dropdown
              type="grade"
              value={filter.grade[0] || ""}
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  grade: value ? [value] : [],
                }))
              }
            />
            <Dropdown
              type="genre"
              value={filter.genre[0] || ""}
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  genre: value ? [value] : [],
                }))
              }
            />
            <Dropdown
              type="sale"
              value={filter.sale[0] || ""}
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  sale: value ? [value] : [],
                }))
              }
            />
            <Dropdown
              type="availability"
              value={filter.availability[0] || ""}
              onChange={(value) =>
                setFilter((prev) => ({
                  ...prev,
                  availability: value ? [value] : [],
                }))
              }
            />
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors animate-fade-in"
                aria-label="필터 초기화"
              >
                <Image src={refreshIcon} alt="초기화" width={20} height={20} />
              </button>
            )}
          </div>
        </div>
      </section>
      {/* 카드 목록 그리드 영역 */}
      <section className="grid grid-cols-2 pc:grid-cols-3 gap-[5px] place-items-center tablet:pt-5 tablet:gap-5 pc:gap-20">
        {filteredCards.length > 0
          ? filteredCards.map((cardData) => (
              <Photocard
                key={cardData.id}
                card={cardData}
                type="나의 판매 카드"
                state={cardData.listingType === "EXCHANGE" ? "교환" : "판매"}
              />
            ))
          : !isPending && (
              <div className="col-span-full py-20 text-center text-gray-400 text-noto-16-regular">
                등록된 판매 또는 교환 포토카드가 없습니다.
              </div>
            )}
      </section>
    </main>
  );
}
