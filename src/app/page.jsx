"use client";

import Image from "next/image";
import React from "react";
import smNumber_1 from "@/assets/images/smNumber=1.png";
import smNumber_2 from "@/assets/images/smNumber=2.png";
import smNumber_3 from "@/assets/images/smNumber=3.png";
import smNumber_4 from "@/assets/images/smNumber=4.png";
import mdNumber_1 from "@/assets/images/mdNumber=1.png";
import mdNumber_2 from "@/assets/images/mdNumber=2.png";
import mdNumber_3 from "@/assets/images/mdNumber=3.png";
import mdNumber_4 from "@/assets/images/mdNumber=4.png";
import lgNumber_1 from "@/assets/images/lgNumber=1.png";
import lgNumber_2 from "@/assets/images/lgNumber=2.png";
import lgNumber_3 from "@/assets/images/lgNumber=3.png";
import lgNumber_4 from "@/assets/images/lgNumber=4.png";
import landing_bg from "@/assets/images/landing_bg.png";
import logo from "@/assets/images/logo.svg";
import PrimaryButton from "@/components/common/ButtonPrimary";
import { useModal } from "@/providers/ModalProvider";
export default function Home() {
  return (
    <main className="flex flex-col items-center mt-[93px] min-w-[375px]">
      <section className="w-full flex flex-col items-center justify-center gap-6  h-[412px] tablet:h-[722px] pc:h-[1088px]">
        <div className="w-full flex flex-col items-center text-noto-20-bold gap-6 pt-[49px] tablet:text-noto-40-bold tablet:gap-[38px]">
          <Image alt="로고" src={logo} width={140} height={25} />
          <div className="flex flex-col items-center">
            <span>구하기 어려웠던</span>
            <div>
              <span className="text-main">나의 최애</span>
              <span>가 여기에!</span>
            </div>
          </div>
          <PrimaryButton className="rounded-[2px] w-[150px] h-10 text-noto-12-bold tablet:w-[226px] tablet:h-[55px] tablet:text-noto-16-bold">
            최애 찾으러 가기
          </PrimaryButton>
        </div>
        <div className="relative w-full flex justify-center ">
          <Image
            alt="마켓플레이스 이미지"
            src={lgNumber_1}
            width={1900}
            height={800}
            className="w-full object-cover h-auto"
          />
        </div>
        <div className="absolute ">
          <Image
            src={landing_bg}
            alt="배경 이미지"
            fill
            className="object-cover"
          />
        </div>
      </section>
      <section></section>
      <section></section>
      <section></section>
      <section></section>
    </main>
  );
}
