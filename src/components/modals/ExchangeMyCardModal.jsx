"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Drawer } from "vaul";
import { useParams, useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import Filter from "../common/Filter";
import Dropdown from "../common/Dropdown";
import InputSearch from "../common/InputSearch";
import Photocard from "../common/Photocard";
import { userService } from "@/lib/services/userService";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import refreshIcon from "@/assets/icons/exchange.svg";
import close from "@/assets/icons/close.svg";

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

export default function ExchangeMyCardModal({ onClose }) {
  const router = useRouter();

  // 💡 폴더명이 [id]이므로 params.id로 가져와야 합니다!
  const params = useParams();
  const postingId = params?.id;

  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [filter, setFilter] = useState({
    grade: [],
    genre: [],
  });

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilter((prev) => ({
      ...prev,
      grade: selectedGrade ? [selectedGrade] : [],
      genre: selectedGenre ? [selectedGenre] : [],
    }));
  }, [selectedGrade, selectedGenre]);

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

  const cards = useMemo(() => {
    return data?.pages.flatMap((page) => page?.list || []) || [];
  }, [data]);

  const firstPageMeta = data?.pages?.[0];

  const userInventory = useMemo(() => {
    const targetSummary = firstPageMeta?.summary;

    const gradeCounts = targetSummary?.gradeCounts || {
      COMMON: 0,
      RARE: 0,
      SUPER_RARE: 0,
      LEGENDARY: 0,
    };

    const genreInventory = {};
    MOCK_GENRES.forEach((genreKey) => {
      genreInventory[genreKey] = 0;
    });

    cards.forEach((item) => {
      const genre = item?.photoCard?.genre;
      const quantity = item?.ownedQuantity || 1;

      if (genre) {
        if (genreInventory[genre] === undefined) {
          genreInventory[genre] = 0;
        }
        genreInventory[genre] += quantity;
      }
    });

    return {
      total: targetSummary?.totalQuantity || 0,
      ...gradeCounts,
      ...genreInventory,
      grade: gradeCounts,
      genre: genreInventory,
    };
  }, [firstPageMeta, cards]);

  const { ref, inView } = useInView();
  const isFiltered =
    searchKeyword.trim().length > 0 ||
    filter.grade.length > 0 ||
    filter.genre.length > 0;

  const handleResetAll = () => {
    setSearchKeyword("");
    setSelectedGrade("");
    setSelectedGenre("");
    setFilter({
      grade: [],
      genre: [],
    });
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모달 닫기 공통 처리
  const handleClose = () => {
    if (postingId) {
      router.push(`/market-posting/${postingId}/buyer`);
    }
    onClose?.();
  };

  // 카드 클릭 시 모달 닫고 cardId 전달
  const handleClick = (cardId) => {
    if (!postingId) return;
    onClose?.();
    router.push(
      `/market-posting/${postingId}/buyer?modal=exchange&cardId=${cardId}`,
    );
  };

  return (
    <Drawer.Root open={true} onOpenChange={(open) => !open && handleClose()}>
      <Drawer.Portal>
        {/* 백드롭 */}
        <Drawer.Overlay className="fixed inset-0 z-[9999] bg-black/80" />

        {/* 모달 내용 영역 */}
        <Drawer.Content className="fixed inset-x-0 bottom-0 top-[30px] tablet:top-10 z-[9999] flex flex-col bg-gray-500 text-white outline-none focus:outline-none focus-visible:outline-none pc:inset-auto pc:left-1/2 pc:top-1/2 pc:-translate-x-1/2 pc:-translate-y-1/2 pc:w-[1160px] pc:h-[85vh] overflow-hidden">
          <div className="relative flex flex-col h-full p-6 tablet:p-8 overflow-hidden">
            {/* PC 전용 닫기(X) 버튼 */}
            <button
              type="button"
              onClick={handleClose}
              className="hidden pc:flex absolute top-[30px] right-[30px] z-20 items-center justify-center w-8 h-8 text-gray-300 hover:text-white transition-colors"
              aria-label="모달 닫기"
            >
              <Image src={close} alt="닫기버튼" width={32} height={32} />
            </button>

            {/* 모바일/태블릿 드로어 상단 바 */}
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-400 pc:hidden flex-shrink-0" />

            {/* 모달 내부 컨테이너 */}
            <div className="flex flex-col h-full w-full max-w-[345px] tablet:max-w-[704px] mx-auto pc:max-w-[920px] overflow-hidden pt-[28px]">
              {/* 상단 고정 영역 (헤더 및 필터) */}
              <div className="flex-shrink-0">
                <section className="flex flex-col gap-[15px] mb-[30px] tablet:gap-10">
                  <span className="text-baskin-14 text-gray-300 h-[14px] tablet:text-baskin-16 pc:text-baskin-24">
                    마이갤러리
                  </span>
                  <div>
                    <h2 className="text-baskin-26 tablet:text-baskin-40 tablet:mb-5 pc:text-baskin-46 ">
                      포토카드 교환하기
                    </h2>
                    <div className="hidden tablet:block w-full h-[2px] bg-white" />
                  </div>
                </section>

                <div className="flex w-full justify-start items-center gap-7.5 pc:gap-[60px] mb-5 tablet:mb-10">
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
                      value={selectedGrade}
                      onChange={setSelectedGrade}
                    />
                    <Dropdown
                      type="genre"
                      value={selectedGenre}
                      onChange={setSelectedGenre}
                    />
                    {isFiltered && (
                      <button
                        type="button"
                        onClick={handleResetAll}
                        className="flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors animate-fade-in"
                        aria-label="필터 초기화"
                      >
                        <Image
                          src={refreshIcon}
                          alt="초기화"
                          width={20}
                          height={20}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 포토카드 리스트 영역 */}
              <div className="flex-1 overflow-y-auto pr-2 pb-10 [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:bg-[var(--gray-gray400,#5A5A5A)] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-track]:bg-transparent">
                <section className="grid grid-cols-2 pc:grid-cols-2 gap-[5px] tablet:gap-5">
                  {cards.length > 0
                    ? cards.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleClick(item.id)}
                          className="text-left w-full cursor-pointer"
                        >
                          <Photocard
                            card={{
                              ...item.photoCard,
                              makerNickname: item.photoCard?.creator?.nickname,
                              price: item.photoCard?.minPrice,
                              totalQuantity: item.ownedQuantity,
                              lastQuantity: item.ownedQuantity,
                            }}
                            type="나의 카드"
                          />
                        </button>
                      ))
                    : !isLoading && (
                        <div className="col-span-full py-20 text-center text-gray-400 text-noto-16-regular">
                          보유 중인 포토카드가 없습니다.
                        </div>
                      )}
                </section>

                <div ref={ref} className="h-10 w-full" />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}