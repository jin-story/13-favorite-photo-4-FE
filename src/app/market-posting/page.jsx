"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/providers/ModalProvider";
import { marketPostingService } from "@/lib/services/marketPostingService";
import { useDebounce } from "@/hooks/useDebounce";
import Title from "@/components/common/Title";
import InputSearch from "@/components/common/InputSearch";
import Dropdown from "@/components/common/Dropdown";
import SheetFilter from "@/components/common/SheetFilter";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Photocard from "@/components/common/Photocard";
import filterIcon from "@/assets/icons/filter.svg";
import refreshIcon from "@/assets/icons/exchange.svg";
import Gnb from "@/components/common/Gnb";
import LoginRequiredModal from "./_components/LoginRequiredModal";
import SellModal from "./_components/SellModal";

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState([]);
  const [genre, setGenre] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [sort, setSort] = useState();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetFilter, setSheetFilter] = useState({
    grade: [],
    genre: [],
    availability: [],
  });
  const { openModal } = useModal();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [isPc, setIsPc] = useState(false);
  const [isSellDrawerOpen, setIsSellDrawerOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "market-postings",
      debouncedSearch,
      grade,
      genre,
      availability,
      sort,
    ],
    queryFn: ({ pageParam }) =>
      marketPostingService.fetchMarketPostings({
        cursor: pageParam,
        keyword: debouncedSearch,
        grade,
        genre,
        availability,
        sort,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    meta: { name: "마켓플레이스 목록" },
  });

  const { data: allData } = useQuery({
    queryKey: ["market-postings-all", debouncedSearch],
    queryFn: () =>
      marketPostingService.fetchMarketPostings({
        keyword: debouncedSearch,
        limit: 100,
      }),
    meta: { name: "마켓플레이스 전체 목록" },
  });

  const { ref: sentinelRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const cards =
    data?.pages.flatMap((page) =>
      page.list.map((posting) => ({
        ...posting.photoCard,
        id: posting.id,
        makerNickname: posting.seller?.nickname,
        sellerId: posting.sellerId,
        price: posting.price,
        totalQuantity: posting.quantity,
        lastQuantity: posting.remainingQuantity,
        imageUrl: posting.photoCard?.imageUrl,
        description: posting.description || posting.photoCard?.description,
      })),
    ) || [];

  const allCards =
    allData?.list.map((posting) => ({
      grade: posting.photoCard?.grade,
      genre: posting.photoCard?.genre,
      availability: posting.remainingQuantity === 0 ? "SOLD_OUT" : "SALE",
    })) || [];

  const previewCards = allCards.filter((card) => {
    if (sheetFilter.grade.length > 0 && !sheetFilter.grade.includes(card.grade)) {
      return false;
    }
    if (sheetFilter.genre.length > 0 && !sheetFilter.genre.includes(card.genre)) {
      return false;
    }
    if (
      sheetFilter.availability.length > 0 &&
      !sheetFilter.availability.includes(card.availability)
    ) {
      return false;
    }
    return true;
  });

  const previewCounts = allCards.reduce((acc, card) => {
    acc[card.grade] = (acc[card.grade] || 0) + 1;
    acc[card.genre] = (acc[card.genre] || 0) + 1;
    acc[card.availability] = (acc[card.availability] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth >= 1920);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSellClick() {
    if (!isLoggedIn) {
      openModal(<LoginRequiredModal />);
      return;
    }

    if (isPc) {
      openModal(<SellModal />);
    } else {
      setIsSellDrawerOpen(true);
    }
  }

  const isFiltered =
    debouncedSearch.trim().length > 0 ||
    grade.length > 0 ||
    genre.length > 0 ||
    availability.length > 0;

  const handleResetAll = () => {
    setSearch("");
    setGrade([]);
    setGenre([]);
    setAvailability([]);
  };

  function handleCardClick(card) {
    if (!isLoggedIn) {
      openModal(<LoginRequiredModal />);
      return;
    }

    const isSeller = String(user.id) === String(card.sellerId);
    router.push(
      isSeller
        ? `/market-posting/${card.id}`
        : `/market-posting/${card.id}/buyer`,
    );
  }

  return (
    <div className="bg-black">
      <Gnb />

      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-[20px] px-[15px] pt-[80px] pb-[90px] tablet:px-5 tablet:pt-[110px] tablet:pb-[40px] pc:px-[220px] pc:pt-[140px] pc:pb-[60px]">
        <div className="hidden tablet:block">
          <Title
            type="title_button"
            text="마켓플레이스"
            buttonText="나의 포토카드 판매하기"
            onButtonClick={handleSellClick}
          />
        </div>

        <div className="flex flex-col gap-[15px] tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-[15px] tablet:gap-[20px] pc:gap-[30px]">
            <InputSearch
              value={search}
              onChange={setSearch}
              className="w-full tablet:w-[200px] pc:w-[320px]"
            />

            <div className="hidden items-start gap-[35px] tablet:flex tablet:gap-[20px] pc:gap-[45px]">
              <Dropdown
                type="grade"
                value={grade[0]}
                onChange={(value) => setGrade(value ? [value] : [])}
              />
              <Dropdown
                type="genre"
                value={genre[0]}
                onChange={(value) => setGenre(value ? [value] : [])}
              />
              <Dropdown
                type="availability"
                value={availability[0]}
                onChange={(value) => setAvailability(value ? [value] : [])}
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
          singleSelectCategories={["grade", "genre", "availability"]}
          counts={previewCounts}
          totalCount={previewCards.length}
          onApply={(appliedFilter) => {
            setGrade(appliedFilter.grade);
            setGenre(appliedFilter.genre);
            setAvailability(appliedFilter.availability);
            setIsSheetOpen(false);
          }}
        />

        {isPending && (
          <p className="text-noto-16 py-[60px] text-center text-gray-300">
            불러오는 중...
          </p>
        )}

        {isError && (
          <p className="text-noto-16 py-[60px] text-center text-gray-300">
            목록을 불러오지 못했습니다.
          </p>
        )}

        {!isPending && !isError && cards.length === 0 && (
          <p className="text-noto-16 py-[60px] text-center text-gray-300">
            등록된 판매글이 없습니다.
          </p>
        )}

        {!isPending && !isError && cards.length > 0 && (
          <div className="mx-auto grid max-w-[345px] grid-cols-2 place-items-center gap-[5px] tablet:max-w-[704px] tablet:gap-5 pc:max-w-[1480px] pc:grid-cols-3 pc:gap-20">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card)}
                className="text-left"
              >
                <Photocard card={card} type="마켓 카드" />
              </button>
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-[1px]" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-[15px] py-[15px] tablet:hidden">
        <ButtonPrimary variant="thin" onClick={handleSellClick}>
          나의 포토카드 판매하기
        </ButtonPrimary>
      </div>

      <Drawer.Root open={isSellDrawerOpen} onOpenChange={setIsSellDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-100 bg-black/80" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-100 max-h-[90dvh] overflow-hidden rounded-t-[16px] bg-gray-500 outline-none">
            <Drawer.Title className="sr-only">
              나의 포토카드 판매하기
            </Drawer.Title>
            <SellModal />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
