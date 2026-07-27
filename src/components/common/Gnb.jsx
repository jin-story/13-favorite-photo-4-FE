/* 사용법:
  1. 기본 메인 GNB (PC/Tablet/Mobile 반응형)
  <Gnb />

  2. 모바일 서브 헤더 (기본 뒤로가기 router.back() 자동 동작)
  <Gnb mobileType="sub" />

  3. 모바일 서브 헤더 (커스텀 뒤로가기 로직 필요 시)
  <Gnb
    mobileType="sub"
    onBackClick={() => router.push("/marketplace")}
  />
*/

"use client";

import clsx from "clsx";
import Image from "next/image";

import alarmIcon from "@/assets/icons/alarm_default.svg";
import backIcon from "@/assets/icons/back.svg";
import menuIcon from "@/assets/icons/menu.svg";
import logo from "@/assets/images/logo.svg";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import GnbTitle from "./GnbTitle";
import MobileNotification from "./MobileNotification";
import NotificationDropdown from "./NotificationDropdown";
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
  onBackClick,
}) {
  const { user, notification, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    router.back();
  };

  const openSidebar = () => {
    if (isLoggedIn) setIsSidebarOpen(true);
  };

  useEffect(() => {
    if (!isSidebarOpen && !isNotificationOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
        setIsNotificationOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen, isNotificationOpen]);

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

            <NotificationDropdown notifications={notification} />

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

            <NotificationDropdown notifications={notification} />

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
              <button
                type="button"
                onClick={() => setIsNotificationOpen(true)}
                className="cursor-pointer"
              >
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
            <Suspense
              fallback={
                <h1 className="text-white text-baskin-20-regular">
                  최애의포토
                </h1>
              }
            >
              <GnbTitle />
            </Suspense>

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

      {/* ================= Mobile 알림 (전체 화면) ================= */}
      {isLoggedIn && isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black tablet:hidden">
          <header className="flex h-[60px] w-full shrink-0 items-center justify-between px-[20px] bg-black">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(false)}
              className="cursor-pointer"
            >
              <Image src={backIcon} alt="뒤로가기" width={22} height={22} />
            </button>

            <h1 className="text-white text-baskin-20-regular">알림</h1>

            <div className="w-[22px]" />
          </header>

          <div className="flex-1 overflow-y-auto">
            <MobileNotification notifications={notification ?? []} />
          </div>
        </div>
      )}
    </>
  );
}
