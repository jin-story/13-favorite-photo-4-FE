/* 사용법:
  1. 기본 메인 GNB (PC/Tablet/Mobile 반응형)
     모바일 mobileType은 현재 경로/모달(?modal=)이 gnbSubState의 규칙과 일치하면
     자동으로 "sub"가 되고, 벗어나면 자동으로 "main"으로 돌아갑니다.
  <Gnb />

  2. 모바일 서브 헤더 강제 지정 (자동판별 규칙에 없는 경로 등, 기본 뒤로가기 router.back() 자동 동작)
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { getGnbSubState } from "./gnbSubState";
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

function MobileMainHeader({
  isLoggedIn,
  openSidebar,
  isNotificationOpen,
  setIsNotificationOpen,
}) {
  return (
    <>
      {/* Left */}
      <button type="button" onClick={openSidebar} className="cursor-pointer">
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
          aria-label="알림보기"
          aria-expanded={isNotificationOpen}
          onClick={() => setIsNotificationOpen((prev) => !prev)}
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
  );
}

function MobileSubHeader({ onBackClick, titleOverride }) {
  return (
    <>
      {/* Left */}
      <button type="button" onClick={onBackClick} className="cursor-pointer">
        <Image src={backIcon} alt="뒤로가기" width={22} height={22} />
      </button>

      {/* Center */}
      {titleOverride !== undefined ? (
        <h1 className="text-white text-baskin-20-regular">{titleOverride}</h1>
      ) : (
        <GnbTitle />
      )}

      {/* Right */}
      <div className="w-[24px]" />
    </>
  );
}

// Suspense fallback 전용: GnbTitle(useSearchParams)을 렌더링하면 fallback 안에서 또
// suspend가 발생할 수 있어, 정적인 텍스트만 보여주는 안전한 버전을 별도로 둡니다.
function MobileSubHeaderFallback({ onBackClick, title = "최애의포토" }) {
  return (
    <>
      <button type="button" onClick={onBackClick} className="cursor-pointer">
        <Image src={backIcon} alt="뒤로가기" width={22} height={22} />
      </button>
      <h1 className="text-white text-baskin-20-regular">{title}</h1>
      <div className="w-[24px]" />
    </>
  );
}

// 경로(pathname)/모달(?modal=) 상태를 읽어 mobileType을 자동으로 판별합니다.
// GnbTitle이 사용하는 것과 동일한 gnbSubState 규칙을 기준으로 삼기 때문에,
// 저 페이지를 벗어나거나 모달이 닫히면(경로/쿼리 변경) 자동으로 main으로 돌아갑니다.
// mobileTypeOverride가 주어지면 (예: 동적 라우트처럼 규칙에 없는 페이지) 그 값을 우선합니다.
// forceSubTitle이 주어지면 (예: 모바일 전체화면 알림) 경로/모달 판정을 무시하고 그 타이틀로 sub 헤더를 강제합니다.
function MobileHeaderResolver({
  mobileTypeOverride,
  forceSubTitle,
  onBackClick,
  isLoggedIn,
  openSidebar,
  isNotificationOpen,
  setIsNotificationOpen,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  if (forceSubTitle !== undefined) {
    return <MobileSubHeader onBackClick={onBackClick} titleOverride={forceSubTitle} />;
  }

  const { isSub } = getGnbSubState(pathname, modal);
  const resolvedType = mobileTypeOverride ?? (isSub ? "sub" : "main");

  if (resolvedType === "sub") {
    return <MobileSubHeader onBackClick={onBackClick} />;
  }

  return (
    <MobileMainHeader
      isLoggedIn={isLoggedIn}
      openSidebar={openSidebar}
      isNotificationOpen={isNotificationOpen}
      setIsNotificationOpen={setIsNotificationOpen}
    />
  );
}

export default function Gnb({
  mobileType, // 지정하지 않으면 경로/모달 상태에 따라 자동으로 main | sub 판별
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
          "w-full h-[80px]",
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
          "fixed top-0 z-1000",
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
          "fixed top-0 z-1000",
        )}
      >
        <Suspense
          fallback={
            isNotificationOpen ? (
              <MobileSubHeaderFallback
                title="알림"
                onBackClick={() => setIsNotificationOpen(false)}
              />
            ) : mobileType === "sub" ? (
              <MobileSubHeaderFallback onBackClick={handleBackClick} />
            ) : (
              <MobileMainHeader
                isLoggedIn={isLoggedIn}
                openSidebar={openSidebar}
                isNotificationOpen={isNotificationOpen}
                setIsNotificationOpen={setIsNotificationOpen}
              />
            )
          }
        >
          <MobileHeaderResolver
            mobileTypeOverride={mobileType}
            forceSubTitle={isNotificationOpen ? "알림" : undefined}
            onBackClick={
              isNotificationOpen
                ? () => setIsNotificationOpen(false)
                : handleBackClick
            }
            isLoggedIn={isLoggedIn}
            openSidebar={openSidebar}
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
          />
        </Suspense>
      </header>

      {/* ================= Mobile 사이드바 (프로필) ================= */}
      {isLoggedIn && isSidebarOpen && (
        <div
          className="fixed inset-0 z-[1000] flex bg-black/80 tablet:hidden"
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

      {/* ================= Mobile 알림 (전체 화면) =================
          헤더는 위의 고정 Mobile Gnb가 "알림" sub 타입으로 자동 전환되어 보여주므로,
          여기서는 그 높이(60px)만큼 여백을 두고 목록만 렌더링합니다. */}
      {isLoggedIn && isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black pt-[60px] tablet:hidden">
          <div className="flex-1 overflow-y-auto">
            <MobileNotification notifications={notification ?? []} />
          </div>
        </div>
      )}
    </>
  );
}
