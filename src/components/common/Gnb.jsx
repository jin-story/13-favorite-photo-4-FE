"use client";

import Image from "next/image";
import clsx from "clsx";

import logo from "@/assets/images/logo.svg";
import menuIcon from "@/assets/icons/menu.svg";
import backIcon from "@/assets/icons/arrow_left.svg";
import alarmIcon from "@/assets/icons/alarm_default.svg";

export default function Gnb({
  isLoggedIn = false,
  user = {},
  mobileType = "main", // main | sub
  title = "",

  onMenuClick,
  onBackClick,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
}) {
  return (
    <>
      {/* ================= PC ================= */}
      <header
        className={clsx(
          "hidden pc:flex",
          "w-full h-[80px]",
          "items-center justify-between",
          "bg-black px-[220px] pt-[20px]",
        )}
      >
        <Image src={logo} alt="최애의 포토" className="w-[138.945px] h-auto" />

        {isLoggedIn ? (
          <div className="flex items-center gap-[30px]">
            <div className="flex items-center">
              <span className="text-noto-14-bold">
                {user.point?.toLocaleString()} P
              </span>
            </div>

            <Image src={alarmIcon} alt="" width={24} />

            <span className="text-baskin-18">{user.nickname}</span>

            <span className="text-gray-400 text-noto-14-regular">|</span>

            <button
              type="button"
              onClick={onLogoutClick}
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
              className="text-noto-14-regular"
            >
              로그인
            </button>

            <button
              type="button"
              onClick={onSignupClick}
              className="text-noto-14-regular"
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
          "px-[40px] pt-[25px] bg-black",
        )}
      >
        <Image src={logo} alt="최애의 포토" className="w-[111px] h-auto" />

        {isLoggedIn ? (
          <div className="flex items-center gap-[30px]">
            <div className="flex items-center">
              <span className="text-noto-14-bold">
                {user.point?.toLocaleString()} P
              </span>
            </div>

            <Image src={alarmIcon} alt="" width={19} />

            <span className="text-baskin-18">{user.nickname}</span>

            <span className="text-gray-300">|</span>

            <button
              type="button"
              onClick={onLogoutClick}
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
              className="text-noto-14-regular"
            >
              로그인
            </button>

            <button
              type="button"
              onClick={onSignupClick}
              className="text-noto-14-regular"
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
          "px-[20px] pt-[19px] bg-black",
        )}
      >
        {mobileType === "main" ? (
          <>
            {/* Left */}
            <button type="button" onClick={onMenuClick}>
              <Image src={menuIcon} alt="메뉴" width={22} height={22} />
            </button>

            {/* Center */}
            <Image src={logo} alt="최애의 포토" className="w-[83px] h-auto" />

            {/* Right */}
            {isLoggedIn ? (
              <button type="button">
                <Image src={alarmIcon} alt="" width={22} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="text-gray-200 text-noto-14-regular"
              >
                로그인
              </button>
            )}
          </>
        ) : (
          <>
            {/* Left */}
            <button type="button" onClick={onBackClick}>
              <Image src={backIcon} alt="뒤로가기" width={22} height={22} />
            </button>

            {/* Center */}
            <h1 className="text-baskin-20">{title}</h1>

            {/* Right */}
            <div className="w-[24px]" />
          </>
        )}
      </header>
    </>
  );
}
