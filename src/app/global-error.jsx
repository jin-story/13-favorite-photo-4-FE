"use client";

import Image from "next/image";
import localFont from "next/font/local";

import logo from "@/assets/images/logo.svg";
import PrimaryButton from "@/components/common/ButtonPrimary";

import "./globals.css";

const notoSansKR = localFont({
  src: [
    {
      path: "../assets/fonts/NotoSansKR-Light.ttf",
      weight: "300",
    },
    {
      path: "../assets/fonts/NotoSansKR-Regular.ttf",
      weight: "400",
    },
    {
      path: "../assets/fonts/NotoSansKR-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-noto-sans-kr",
});

const baskinRobbins = localFont({
  src: "../assets/fonts/BaskinRobbinsBold.otf",
  weight: "700",
  variable: "--font-baskin-robbins",
});

export default function GlobalError({ reset }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${baskinRobbins.variable}`}
    >
      <body className="bg-black text-white">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center tablet:px-5">
          <Image
            src={logo}
            alt="최애의 포토"
            width={331}
            height={60}
            preload
            className="h-auto w-48 tablet:w-83"
          />

          <h1 className="mt-20 text-baskin-24">
            일시적인 오류가 발생했습니다.
          </h1>

          <p className="mt-3 text-noto-16-regular text-gray-300">
            잠시 후 다시 시도해 주세요.
          </p>

          <div className="mt-8">
            <PrimaryButton
              className="mb-11 cursor-pointer tablet:mb-15 pc:mb-20"
              variant="thin"
              onClick={() => reset()}
            >
              다시 시도하기
            </PrimaryButton>
          </div>
        </main>
      </body>
    </html>
  );
}
