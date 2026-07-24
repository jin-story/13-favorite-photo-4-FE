/* 사용법:
(백엔드 연동이전 껍데기 값)
  const isLoggedIn = true; // false로 바꾸면 로그아웃 상태
  const user = {
    nickname: "유디",
    points: 1540,
  };

  return (
    <Gnb
      isLoggedIn={isLoggedIn}
      user={user}
    />

    <Gnb mobileType="sub" />

    <Gnb
  mobileType="sub"
  onBackClick={() => router.push("/marketplace")}
/>
  );

*/

"use client";

import Image from "next/image";
import clsx from "clsx";

import logo from "@/assets/images/logo.svg";
import menuIcon from "@/assets/icons/menu.svg";
import backIcon from "@/assets/icons/back.svg";
import alarmIcon from "@/assets/icons/alarm_default.svg";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Profile from "./Profile";
import { useEffect, useRef, useState } from "react";

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
  onMenuClick,
  onBackClick,
}) {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const modal = useSearchParams().get("modal");

  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    router.back();
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

  let title = "";

  if (modal === "sell-card") {
    title = "나의 포토카드 판매하기";
  } else if (modal === "exchange-info") {
    title = "포토카드 교환하기";
  } else if (modal === "edit-card") {
    title = "수정하기";
  } else {
    const titleMap = {
      "/marketplace": "마켓플레이스",
      "/my-gallery": "마이갤러리",
      "/my-gallery/create": "포토카드 생성",
      "/my-sales": "나의 판매 포토카드",
      "/notifications": "알림",
    };
    title = titleMap[pathname] ?? "최애의포토";
  }

  return (
    <>
      {/* ================= PC ================= */}
      <header
        className={clsx(
          "hidden pc:flex",
          "w-full h-[80px] max-w-[1920px]",
          "items-center justify-between",
          "bg-black px-[220px]",
          "fixed top-0 z-20",
          "inset-0 mx-auto",
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
              className="text-gray-400 text-noto-14-regular"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-[30px]">
            <Link
              href="/login"
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              로그인
            </Link>

            <Link
              href="/register"
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              회원가입
            </Link>
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
          "fixed top-0 z-20",
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
            <Link
              href="/login"
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              로그인
            </Link>

            <Link
              href="/register"
              className="text-gray-200 text-noto-14-regular cursor-pointer"
            >
              회원가입
            </Link>
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
          "fixed top-0 z-20",
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
              <Link
                href="/login"
                className="text-gray-200 text-noto-14-regular cursor-pointer"
              >
                로그인
              </Link>
            )}
          </>
        ) : (
          <>
            {/* Left */}
            <button
              type="button"
              onClick={handleBackClick}
              className="cursor-pointer"
            >
              <Image src={backIcon} alt="뒤로가기" width={22} height={22} />
            </button>

            {/* Center */}
            <h1 className=" text-white text-baskin-20-regular">{title}</h1>

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
