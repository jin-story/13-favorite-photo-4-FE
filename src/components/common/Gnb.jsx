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

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import alarmIcon from "@/assets/icons/alarm_default.svg";
import backIcon from "@/assets/icons/arrow_left.svg";
import menuIcon from "@/assets/icons/menu.svg";
import logo from "@/assets/images/logo.svg";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Profile from "./Profile";

function ProfileMenu({ user, textClassName }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 바깥 영역 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(textClassName, "cursor-pointer")}
      >
        {user.nickname}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[20px] mt-1 z-50">
          <Profile
            nickname={user.nickname}
            point={user.points}
            className="h-auto"
          />
        </div>
      )}
    </div>
  );
}

export default function Gnb({
  mobileType = "main", // main | sub
  title = "",
  onMenuClick,
  onBackClick,
}) {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const onLoginClick = () => {
    router.push("/login");
  };

  const onSignupClick = () => {
    router.push("/register");
  };

  const openSidebar = () => {
    onMenuClick?.();
    if (isLoggedIn) setIsSidebarOpen(true);
  };

  useEffect(() => {
    if (!isSidebarOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsSidebarOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* ================= PC ================= */}
      <header
        className={clsx(
          "hidden pc:flex",
          "w-full h-[80px] max-w-[1920px]",
          "items-center justify-between",
          "bg-black px-[220px]",
          "fixed top-0 z-1000",
          "inset-0",
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
                {user.points?.toLocaleString()} P
              </span>
            </div>

            <Image src={alarmIcon} alt="" width={24} />

            <ProfileMenu
              user={user}
              textClassName="text-gray-200 text-baskin-18"
            />

            <span className="text-gray-400 text-noto-14-regular">|</span>

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
                {user.points?.toLocaleString()} P
              </span>
            </div>

            <Image src={alarmIcon} alt="" width={19} />

            <ProfileMenu
              user={user}
              textClassName="text-gray-200 text-baskin-18"
            />

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
              onClick={openSidebar}
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

      {/* ================= Mobile 사이드바 (프로필) ================= */}
      {isLoggedIn && isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/80 tablet:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsSidebarOpen(false);
          }}
        >
          <Profile
            nickname={user.nickname}
            point={user.points}
            onLogout={() => {
              setIsSidebarOpen(false);
              logout();
            }}
            className="h-dvh"
          />
        </div>
      )}
    </>
  );
}
