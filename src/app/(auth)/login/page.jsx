import React from "react";
import AuthForm from "../_components/AuthForm";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import Link from "next/link";


export default function Login() {
  return (
    <main className="w-full flex flex-col items-center gap-20">
      <div className="relative w-[189px] h-[35px] tablet:w-[331px] tablet:h-15">
        <Image alt="" src={logo} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-11 tablet:gap-[50px] pc:gap-11 items-center">
        <AuthForm />
        <div className="flex gap-[9px] text-noto-14-regular pc: text-noto-16-regular">
          <span>최애의 포토가 처음이신가요?</span>
          <Link
            href="/register"
            className="underline underline-offset-3 text-main cursor-pointer"
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </main>
  );
}
