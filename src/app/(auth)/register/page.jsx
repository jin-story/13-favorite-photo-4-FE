import Image from "next/image";
import React from "react";
import AuthForm from "../_components/AuthForm";
import Link from "next/link";
import logo from "@/assets/images/logo.svg";

export default function Register() {
  return (
    <main className="w-full flex flex-col items-center gap-20 max-w-[345px] tablet:max-w-[440px] pc:max-w-[520px]">
      <div className="relative w-[189px] h-[35px] tablet:w-[331px] tablet:h-15">
        <Image alt="" src={logo} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-11 tablet:gap-[50px] pc:gap-11 items-center">
        <AuthForm type="register" />
        <div className="flex gap-[9px] text-noto-14-regular pc:text-noto-16-regular">
          <span>이미 최애의 포토 회원이신가요?</span>
          <Link
            href="/login"
            className="underline underline-offset-3 text-main cursor-pointer"
          >
            로그인하기
          </Link>
        </div>
      </div>
    </main>
  );
}
