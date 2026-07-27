"use client";

import Dropdown from "@/components/common/Dropdown";
import Filter from "@/components/common/Filter";
import GradeMyCard from "@/components/common/GradeMyCard";
import InputSearch from "@/components/common/InputSearch";
import "swiper/css";

import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Photocard from "@/components/common/Photocard";
import PrimaryButton from "@/components/common/ButtonPrimary";
import { useAuth } from "@/providers/AuthProvider";
import Title from "@/components/common/Title";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import refreshIcon from "@/assets/icons/exchange.svg";
import { useRouter } from "next/navigation";

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

const mockMyCards = Array.from({ length: 30 }, (_, index) => ({
  makerNickname: `제작자${index + 1}`,
  name: `포토카드 이름 ${index + 1}`,
  grade: ["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"][index % 4],
  genre: MOCK_GENRES[index % MOCK_GENRES.length], // 새로운 장르 목록에서 순환하도록 적용
  price: (index + 1) * 100,
  totalQuantity: (index % 5) + 1,
  lastQuantity: (index % 5) + 1,
  imgUrl: null,
  description: `포토카드 설명글 ${index + 1}`,
}));

export default function MyGallery() {
  const route = useRouter();
  const { user } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [filter, setFilter] = useState({
    grade: [],
    genre: [],
  });

  const userInventory = useMemo(() => {
    const gradeCounts = mockMyCards.reduce((acc, card) => {
      acc[card.grade] = (acc[card.grade] || 0) + 1;
      return acc;
    }, {});

    const genreCounts = mockMyCards.reduce((acc, card) => {
      acc[card.genre] = (acc[card.genre] || 0) + 1;
      return acc;
    }, {});

    const genreInventory = MOCK_GENRES.reduce((acc, genreKey) => {
      acc[genreKey] = genreCounts[genreKey] || 0;
      return acc;
    }, {});

    return {
      total: mockMyCards.length,
      ...genreCounts,
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
      genre: genreInventory, // 3. 동적으로 생성된 새로운 장르 인벤토리 적용
    };
  }, []);

  const handleResetAll = () => {
    setSearchKeyword("");
    setFilter({
      grade: [],
      genre: [],
    });
  };

  const filteredCards = useMemo(() => {
    return mockMyCards.filter((card) => {
      // 검색어 필터
      if (debouncedKeyword.trim()) {
        const keyword = debouncedKeyword.toLowerCase();
        const matchesSearch =
          card.name.toLowerCase().includes(keyword) ||
          card.makerNickname.toLowerCase().includes(keyword);
        if (!matchesSearch) return false;
      }

      // 등급 필터 (배열에 값이 있으면 포함되는지 확인)
      if (filter.grade.length > 0 && !filter.grade.includes(card.grade)) {
        return false;
      }

      // 장르 필터 (배열에 값이 있으면 포함되는지 확인)
      if (filter.genre.length > 0 && !filter.genre.includes(card.genre)) {
        return false;
      }

      return true;
    });
  }, [debouncedKeyword, filter]);

  const isFiltered =
    searchKeyword.trim().length > 0 ||
    filter.grade.length > 0 ||
    filter.genre.length > 0;

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
              totalAllCount={mockMyCards.length}
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
        {filteredCards.length > 0 ? (
          filteredCards.map((cardData, index) => (
            <Photocard key={index} card={cardData} type="나의 카드" />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400 text-noto-16-regular">
            검색 결과가 없습니다.
          </div>
        )}
      </section>
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
