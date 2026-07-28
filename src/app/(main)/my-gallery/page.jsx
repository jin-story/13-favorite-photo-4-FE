"use client";

import Dropdown from "@/components/common/Dropdown";
import Filter from "@/components/common/Filter";
import GradeMyCard from "@/components/common/GradeMyCard";
import InputSearch from "@/components/common/InputSearch";
import "swiper/css";

import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Photocard from "@/components/common/Photocard";
import PrimaryButton from "@/components/common/ButtonPrimary";
import { useAuth } from "@/providers/AuthProvider";
import Title from "@/components/common/Title";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import refreshIcon from "@/assets/icons/exchange.svg";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "@/lib/services/userService";
import { useInView } from "react-intersection-observer";

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

export default function MyGallery() {
  const route = useRouter();
  const { user } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [filter, setFilter] = useState({
    grade: [],
    genre: [],
  });

  // 무한 스크롤 목록 쿼리 (검색 및 필터 적용)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["myInventories", debouncedKeyword, filter.grade, filter.genre],
      queryFn: ({ pageParam }) =>
        userService.getMyInventories({
          pageParam,
          keyword: debouncedKeyword || "",
          grade: filter.grade?.[0] || "",
          genre: filter.genre?.[0] || "",
          includeMeta: true,
          limit: 12,
        }),
      getNextPageParam: (lastPage) =>
        lastPage?.hasNextPage ? lastPage.nextCursor : undefined,
      initialPageParam: null,
    });

  // 페이지별로 나뉜 데이터를 하나의 배열로 합침
  const cards = useMemo(() => {
    return data?.pages.flatMap((page) => page?.list || []) || [];
  }, [data]);

  // 첫 번째 페이지의 응답
  const firstPageMeta = data?.pages?.[0];

  const handleResetAll = () => {
    setSearchKeyword("");
    setFilter({
      grade: [],
      genre: [],
    });
  };

  const isFiltered =
    searchKeyword.trim().length > 0 ||
    filter.grade.length > 0 ||
    filter.genre.length > 0;

  const userInventory = useMemo(() => {
    const targetSummary = firstPageMeta?.summary;

    const gradeCounts = targetSummary?.gradeCounts || {
      COMMON: 0,
      RARE: 0,
      SUPER_RARE: 0,
      LEGENDARY: 0,
    };

    // 1. MOCK_GENRES뿐만 아니라 현재 로드된 카드에 존재하는 장르까지 동적으로 초기화
    const genreInventory = {};

    // MOCK_GENRES 기본 0으로 세팅
    MOCK_GENRES.forEach((genreKey) => {
      genreInventory[genreKey] = 0;
    });

    // 2. 현재 로드된 cards 배열을 돌며 장르별 소유 수량(ownedQuantity) 누적
    cards.forEach((item) => {
      const genre = item?.photoCard?.genre;
      const quantity = item?.ownedQuantity || 1;

      if (genre) {
        // 혹시 MOCK_GENRES에 없는 장르가 있더라도 동적으로 추가해줌
        if (genreInventory[genre] === undefined) {
          genreInventory[genre] = 0;
        }
        genreInventory[genre] += quantity;
      }
    });

    return {
      total: targetSummary?.totalQuantity || 0,
      ...gradeCounts,
      ...genreInventory, // 장르 키들도 최상단에 바로 펼쳐서 제공
      grade: gradeCounts,
      genre: genreInventory,
    };
  }, [firstPageMeta, cards]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className="mb-20 max-w-[345px] flex flex-col w-full gap-[15px] tablet:max-w-[704px] pt-5 tablet:pt-10 tablet:gap-10 pc:max-w-[1480px] pc:pt-[60px] mx-auto">
      <Title
        className="hidden tablet:block"
        buttonText="포토카드 생성하기"
        text="마이갤러리"
        onButtonClick={() => {
          route.push("/my-gallery/create");
        }}
      />
      {/* 상단 요약 및 컨트롤 영역 */}
      <section className="flex flex-col gap-[15px] tablet:gap-5">
        {/* 등급별 통계 슬라이더 영역 */}
        <div className="flex flex-col gap-[15px] tablet:gap-5 border-b pb-[15px] border-b-gray-400 tablet:pb-10">
          <div className="flex gap-[5px] items-end">
            <h2 className="text-noto-14-bold tablet:text-noto-20-bold pc:text-noto-24-bold">
              {user?.nickname}님이 보유한 포토카드
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
              categories={["grade", "genre"]}
              counts={userInventory}
              totalAllCount={userInventory.total}
              filter={filter}
              setFilter={setFilter}
              totalCount={cards.length}
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
        {cards.length > 0
          ? cards.map((item) => (
              <Photocard
                key={item.id}
                card={{
                  ...item.photoCard,
                  makerNickname: item.photoCard?.creator?.nickname,
                  price: item.photoCard?.minPrice,
                  totalQuantity: item.ownedQuantity,
                  lastQuantity: item.ownedQuantity,
                }}
                type="나의 카드"
              />
            ))
          : !isLoading && (
              <div className="col-span-full py-20 text-center text-gray-400 text-noto-16-regular">
                검색 결과가 없습니다.
              </div>
            )}
      </section>
      {/* 무한 스크롤 감지용 요소 */}
      <div ref={ref} className="h-10 w-full flex items-center justify-center">
        {isFetchingNextPage && (
          <span className="text-gray-400 text-noto-14-regular">로딩 중...</span>
        )}
      </div>
      {/* 모바일 고정 버튼 */}
      <PrimaryButton
        className="fixed bottom-10 left-0 right-0 mx-auto tablet:hidden"
        variant="thin"
        onClick={() => route.push("/my-gallery/create")}
      >
        포토카드 생성하기
      </PrimaryButton>
    </main>
  );
}
