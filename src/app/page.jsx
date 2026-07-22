"use client";

import Image from "next/image";
import landing_top from "@/assets/images/landing_top.png";
import landing_bg from "@/assets/images/landing_bg.png";
import lgNumber_2 from "@/assets/images/lgNumber_2.svg";
import smNumber_2 from "@/assets/images/smNumber_2.svg";
import mdNumber_2 from "@/assets/images/mdNumber_2.svg";
import lgNumber_3 from "@/assets/images/lgNumber_3.svg";
import smNumber_3 from "@/assets/images/smNumber_3.svg";
import mdNumber_3 from "@/assets/images/mdNumber_3.svg";
import lgNumber_4 from "@/assets/images/lgNumber_4.svg";
import smNumber_4 from "@/assets/images/smNumber_4.svg";
import mdNumber_4 from "@/assets/images/mdNumber_4.svg";
import landing_bottom from "@/assets/images/landing_bottom.png";
import logo from "@/assets/images/logo.svg";

import PrimaryButton from "@/components/common/ButtonPrimary";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleMovePage = () => {
    router.push("/market-posting");
  };
  return (
    <main className="flex flex-col items-center gap-[67px] mt-[93px] min-w-[375px] max-w-[1920px] m-auto">
      <section className="w-full flex flex-col items-center justify-center gap-6  ">
        <div className="relative rounded-2xl overflow-hidden w-full flex flex-col items-center justify-center text-noto-20-bold gap-6 h-[412px] tablet:h-[722px] pc:h-[1200px] pt-[49px] tablet:text-noto-40-bold tablet:gap-[38px]">
          <div className="absolute inset-0  h-[412px] tablet:h-[722px] pc:h-[1200px]">
            <Image
              src={landing_bg}
              alt="배경 이미지"
              fill
              className="object-fill -z-10 px-4 tablet:px-[33px] pc:px-[61px] "
            />
          </div>
          <Image
            alt="로고"
            src={logo}
            width={140}
            height={25}
            className="hidden tablet:block"
          />
          <div className="flex flex-col items-center">
            <span>구하기 어려웠던</span>
            <div>
              <span className="text-main">나의 최애</span>
              <span>가 여기에!</span>
            </div>
          </div>
          <PrimaryButton
            onClick={handleMovePage}
            className="z-10 cursor-pointer rounded-[2px] w-[150px] h-10 text-noto-12-bold tablet:w-[226px] tablet:h-[55px] tablet:text-noto-16-bold"
          >
            최애 찾으러 가기
          </PrimaryButton>

          <div className="relative w-full flex justify-center h-[200px] tablet:h-[352px] pc:h-[800px]">
            <Image
              alt="마켓플레이스 이미지"
              src={landing_top}
              width={1900}
              height={800}
              className="object-contain"
            />
          </div>
        </div>
      </section>
      <section className="relative w-full">
        <Image
          src={lgNumber_2}
          alt=""
          width={1900}
          height={800}
          className="object-contain hidden pc:block"
        />
        <Image
          src={smNumber_2}
          alt=""
          width={1900}
          height={800}
          className="object-contain  tablet:hidden"
        />
        <Image
          src={mdNumber_2}
          alt=""
          width={1900}
          height={800}
          className="object-contain hidden tablet:block pc:hidden"
        />
      </section>
      <section className="relative w-full">
        <Image
          src={lgNumber_3}
          alt=""
          width={1900}
          height={800}
          className="object-contain hidden pc:block"
        />
        <Image
          src={smNumber_3}
          alt=""
          width={1900}
          height={800}
          className="object-contain  tablet:hidden"
        />
        <Image
          src={mdNumber_3}
          alt=""
          width={1900}
          height={800}
          className="object-contain hidden tablet:block pc:hidden"
        />
      </section>

      <section className="relative w-full">
        <Image
          src={lgNumber_4}
          alt=""
          width={1900}
          height={800}
          className="object-contain hidden pc:block"
        />
        <Image
          src={smNumber_4}
          alt=""
          width={1900}
          height={800}
          className="object-contain  tablet:hidden"
        />
        <Image
          src={mdNumber_4}
          alt=""
          width={1900}
          height={800}
          className="object-contain hidden tablet:block pc:hidden"
        />
      </section>
      <section className="h-[421px] tablet:h-[620px] pc:h-[597px] flex flex-col justify-center items-center gap-[23px] tablet:gap-[27px]">
        <div className="relative h-[153px] w-[130px] tablet:h-[179px]  tablet:w-[152px]">
          <Image
            src={landing_bottom}
            alt="포토카드"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-noto-20-bold tablet:text-noto-28-bold">
          나의 최애를 지금 찾아보세요!
        </span>
        <PrimaryButton
          onClick={handleMovePage}
          className="cursor-pointer rounded-[2px] w-[150px] h-10 text-noto-12-bold tablet:w-[226px] tablet:h-[55px] tablet:text-noto-16-bold"
        >
          최애 찾으러 가기
        </PrimaryButton>
      </section>
    </main>
  );
}
