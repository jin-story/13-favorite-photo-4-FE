"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import Image from "next/image";
import { useModal } from "@/providers/ModalProvider";
import Title from "@/components/common/Title";
import InputSearch from "@/components/common/InputSearch";
import Dropdown from "@/components/common/Dropdown";
// import SheetFilter from "@/components/common/SheetFilter";
import ButtonPrimary from "@/components/common/ButtonPrimary";
import Photocard from "@/components/common/Photocard";
import filterIcon from "@/assets/icons/filter.svg";
import Gnb from "@/components/common/Gnb";
import LoginRequiredModal from "./_components/LoginRequiredModal";
import SellModal from "./_components/SellModal";

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
  const { openModal } = useModal();
  const [isPc, setIsPc] = useState(false);
  const [isSellDrawerOpen, setIsSellDrawerOpen] = useState(false);
  const isLoggedIn = true; // 임시

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

  return (
    <div className="bg-black">
      <Gnb />

      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-[20px] px-[15px] pt-[80px] pb-[90px] tablet:px-5 tablet:pt-[110px] tablet:pb-[40px] pc:px-[220px] pc:pt-[140px] pc:pb-[60px]">
        <Title
          type="title_button"
          text="마켓플레이스"
          buttonText="나의 포토카드 판매하기"
          onButtonClick={handleSellClick}
        />

        <div className="flex flex-col gap-[15px] tablet:flex-row tablet:items-center tablet:justify-between">
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

        {/* <SheetFilter
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          filter={sheetFilter}
          setFilter={setSheetFilter}
          totalCount={sampleCards.length}
          onApply={() => setIsSheetOpen(false)}
        /> */}

        <div className="flex flex-wrap gap-[5px] tablet:gap-5 pc:gap-[80px]">
          {sampleCards.map((card) => (
            <Photocard key={card.id} card={card} type="마켓 카드" />
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-black px-[15px] py-[15px] tablet:hidden">
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
