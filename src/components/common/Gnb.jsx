/* 사용법:
(백엔드 연동이전 껍데기 값)
  const isLoggedIn = true; // false로 바꾸면 로그아웃 상태
  const user = {
    nickname: "유디",
    point: 1540,
  };

  return (
    <Gnb
      isLoggedIn={isLoggedIn}
      user={user}
    />
  );

  (구현 필요 {}, {()=>})
  onMenuClick,
  onBackClick,
*/

"use client";

import Image from "next/image";
import clsx from "clsx";

import logo from "@/assets/images/logo.svg";
import menuIcon from "@/assets/icons/menu.svg";
import backIcon from "@/assets/icons/arrow_left.svg";
import alarmIcon from "@/assets/icons/alarm_default.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function Gnb({
  mobileType = "main", // main | sub
  title = "",
  onMenuClick,
  onBackClick,
}) {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const onLoginClick = () => {
    router.push("/login");
  };

  const onSignupClick = () => {
    router.push("/register");
  };
  return (
    <>
      {/* ================= PC ================= */}
      <header
        className={clsx(
          "hidden pc:flex",
          "w-full h-[80px] max-w-[1920px]",
          "items-center justify-between",
          "bg-black px-[220px]",
          "fixed top-0 z-50",
        )}
      >
        <Link href="/market-posting">
          <Image
            src={logo}
            alt="최애의 포토"
            className="w-[138.945px] h-auto cursor-pointer"
          />
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-[30px]">
            <div className="flex items-center">
              <span className="text-gray-200 text-noto-14-bold">
                {user.point?.toLocaleString()} P
              </span>
            </div>

            <Image src={alarmIcon} alt="" width={24} />

            <span className="text-gray-200 text-baskin-18">
              {user.nickname}
            </span>

            <span className="text-gray-400 text-noto-14-regular">|</span>

            <button
              type="button"
              onClick={logout}
              className="text-gray-400 text-noto-14-regular"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-[30px]">
            <button
              type="button"
              onClick={onLoginClick}
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              로그인
            </button>

            <button
              type="button"
              onClick={onSignupClick}
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              회원가입
            </button>
          </div>
        )}
      </header>

      {/* ================= Tablet ================= */}
      <header
        className={clsx(
          "hidden tablet:flex pc:hidden",
          "w-full h-[70px]",
          "items-center justify-between",
          "px-[40px] bg-black",
          "fixed top-0 z-50",
        )}
      >
        <Link href="/market-posting">
          <Image
            src={logo}
            alt="최애의 포토"
            className="w-[111px] h-auto cursor-pointer"
          />
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-[30px]">
            <div className="flex items-center">
              <span className="text-gray-200 text-noto-14-bold">
                {user.point?.toLocaleString()} P
              </span>
            </div>

            <Image src={alarmIcon} alt="" width={19} />

            <span className="text-gray-200 text-baskin-18">
              {user.nickname}
            </span>

            <span className="text-gray-300">|</span>

            <button
              type="button"
              onClick={logout}
              className="text-gray-400 text-noto-14-regular cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-[30px]">
            <button
              type="button"
              onClick={onLoginClick}
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              로그인
            </button>

            <button
              type="button"
              onClick={onSignupClick}
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              회원가입
            </button>
          </div>
        )}
      </header>

      {/* ================= Mobile ================= */}
      <header
        className={clsx(
          "flex tablet:hidden",
          "w-full h-[60px]",
          "items-center justify-between",
          "px-[20px] bg-black",
          "fixed top-0 z-50",
        )}
      >
        {mobileType === "main" ? (
          <>
            {/* Left */}
            <button
              type="button"
              onClick={onMenuClick}
              className="cursor-pointer"
            >
              <Image src={menuIcon} alt="메뉴" width={22} height={22} />
            </button>

            {/* Center */}
            <Link href="/market-posting">
              <Image
                src={logo}
                alt="최애의 포토"
                className="w-[83px] h-auto cursor-pointer"
              />
            </Link>

            {/* Right */}
            {isLoggedIn ? (
              <button type="button" className="cursor-pointer">
                <Image src={alarmIcon} alt="" width={22} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="text-gray-200 text-noto-14-regular cursor-pointer"
              >
                로그인
              </button>
            )}
          </>
        ) : (
          <>
            {/* Left */}
            <button
              type="button"
              onClick={onBackClick}
              className="cursor-pointer"
            >
              <Image src={backIcon} alt="뒤로가기" width={22} height={22} />
            </button>

            {/* Center */}
            <h1 className=" text-white text-baskin-20">{title}</h1>

            {/* Right */}
            <div className="w-[24px]" />
          </>
        )}
      </header>
    </>
  );
}
