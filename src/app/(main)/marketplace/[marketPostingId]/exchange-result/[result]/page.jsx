"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ButtonSecondary from "@/components/common/ButtonSecondary";
import Gnb from "@/components/common/Gnb";
import closeIcon from "@/assets/icons/close.svg";

const mockUser = {
  nickname: "유디",
  point: 1540,
};

const RESULT_CONTENT = {
  success: {
    titlePrefix: "교환 제시",
    titleText: "성공",
    titleTextClassName: "text-main",
    message: "포토카드 교환 제시에 성공했습니다!",
    buttonLabel: "나의 판매 포토카드에서 확인하기",
  },
  failure: {
    titlePrefix: "교환 제시",
    titleText: "실패",
    titleTextClassName: "text-gray-300",
    message: "포토카드 교환 제시에 실패했습니다.",
    buttonLabel: "마켓플레이스로 돌아가기",
  },
};

export default function MarketplaceExchangeResultPage() {
  const router = useRouter();
  const params = useParams();

  const marketPostingId = params.marketPostingId;
  const resultType = params.result;
  const result = RESULT_CONTENT[resultType] ?? RESULT_CONTENT.failure;

  const handleClose = () => {
    router.push(`/marketplace/${marketPostingId}`);
  };

  const handleButtonClick = () => {
    if (resultType === "success") {
      router.push("/my-sales");
      return;
    }

    // TODO: 마켓플레이스 공통 페이지가 생성되면 "/marketplace"로 변경 예정
    router.push(`/marketplace/${marketPostingId}`);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50">
        <Gnb
          isLoggedIn
          user={mockUser}
          mobileType="sub"
          onBackClick={handleClose}
          onLogoutClick={() => console.log("로그아웃 클릭")}
        />
      </div>

      <main className="-mx-[15px] min-h-dvh bg-black px-[15px] text-white tablet:-mx-5 tablet:px-5 pc:-mx-[220px] pc:px-[220px]">
        <section className="mx-auto flex min-h-dvh w-full max-w-[1480px] items-center justify-center pb-[90px] pt-[70px] tablet:pb-[120px] tablet:pt-[90px] pc:pb-[140px] pc:pt-[120px]">
          <div className="relative flex w-full max-w-[345px] flex-col items-center tablet:max-w-[440px] pc:max-w-[520px]">
            <button
              type="button"
              aria-label="결과 화면 닫기"
              onClick={handleClose}
              className="absolute -top-[104px] right-0 hidden h-10 w-10 items-center justify-center tablet:flex pc:-top-[120px]"
            >
              <Image
                src={closeIcon}
                alt=""
                width={32}
                height={32}
                className="h-7 w-7 pc:h-8 pc:w-8"
              />
            </button>

            <h1 className="text-center text-noto-32-bold tablet:text-noto-40-bold">
              <span>{result.titlePrefix} </span>
              <span className={result.titleTextClassName}>
                {result.titleText}
              </span>
            </h1>

            <p className="mt-8 text-center text-noto-16-bold leading-6 text-white tablet:mt-9 tablet:text-noto-18-bold tablet:leading-7 pc:mt-10">
              {result.message}
            </p>

            <ButtonSecondary
              variant="thin"
              className="mt-[55px] h-[55px]! w-[270px]! border border-gray-200 bg-transparent! text-white tablet:mt-[60px] tablet:w-[270px]! pc:mt-[64px] pc:h-[60px]! pc:w-[440px]!"
              onClick={handleButtonClick}
            >
              {result.buttonLabel}
            </ButtonSecondary>
          </div>
        </section>
      </main>
    </>
  );
}
