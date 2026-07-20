"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/authService";

// 서버 사이드 전용 함수
export async function getServerSideToken(type = "accessToken") {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(type);
  return tokenCookie ? tokenCookie.value : null;
}

export async function setServerSideTokens(accessToken, refreshToken) {
  const cookieStore = await cookies();

  // 토큰 디코딩 및 만료 시간 계산
  const accessTokenData = jwtDecode(accessToken);
  const refreshTokenData = jwtDecode(refreshToken);

  const accessTokenExpiresIn = Math.max(
    0,
    accessTokenData.exp - Math.floor(Date.now() / 1000),
  );
  const refreshTokenExpiresIn = Math.max(
    0,
    refreshTokenData.exp - Math.floor(Date.now() / 1000),
  );

  // 쿠키 설정
  cookieStore.set("accessToken", accessToken, {
    path: "/",
    maxAge: accessTokenExpiresIn,
    sameSite: "strict",
    // secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  cookieStore.set("refreshToken", refreshToken, {
    path: "/",
    maxAge: refreshTokenExpiresIn,
    sameSite: "strict",
    // secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}

export async function updateAccessToken(accessToken) {
  const cookieStore = await cookies();

  // 토큰 디코딩 및 만료 시간 계산
  const accessTokenData = jwtDecode(accessToken);
  const accessTokenExpiresIn = Math.max(
    0,
    accessTokenData.exp - Math.floor(Date.now() / 1000),
  );

  // 액세스 토큰만 갱신
  cookieStore.set("accessToken", accessToken, {
    path: "/",
    maxAge: accessTokenExpiresIn,
    sameSite: "strict",
    // secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}

export async function clearServerSideTokens() {
  const cookieStore = await cookies();

  // 액세스 토큰 및 리프레시 토큰 삭제
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return { success: true };
}

export async function loginAction(email, password) {
  try {
    const { user, accessToken, setCookieHeader } = await authService.login(
      email,
      password,
    );

    const match = setCookieHeader?.match(/refreshToken=([^;]+)/);
    const refreshToken = match ? match[1] : null;

    if (!accessToken) {
      return {
        success: false,
        error: "서버로부터 인증 토큰을 받지 못했습니다.",
      };
    }
    await setServerSideTokens(accessToken, refreshToken);

    return { success: true, userData: user };
  } catch (error) {
    console.error("로그인 액션 오류:", error);
    return {
      success: false,
      error: error?.message || "로그인 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

export async function registerAction(nickname, email, password) {
  try {
    const { user, accessToken, setCookieHeader } = await authService.register(
      nickname,
      email,
      password,
    );

    const match = setCookieHeader?.match(/refreshToken=([^;]+)/);
    const refreshToken = match ? match[1] : null;

    if (!accessToken || !refreshToken) {
      return { success: false, error: "서버로부터 토큰을 받지 못했습니다." };
    }

    await setServerSideTokens(accessToken, refreshToken);
    return { success: true, userData: user };
  } catch (error) {
    console.error("회원가입 액션 오류:", error);
    return {
      success: false,
      error: error?.message || "회원가입 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 인증 상태를 확인합니다 (토큰 검사만, 갱신은 하지 않음)
 */
export async function checkAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return !!accessToken;
}

/**
 * 인증 상태를 확인합니다 (accessToken 또는 refreshToken 중 하나라도 있으면 통과)
 */
export async function checkAuthWithRefresh() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  return !!(accessToken || refreshToken);
}

/**
 * @deprecated 차후 미들웨어 혹은 전용 서비스 레이어로 이관을 권장합니다.
 * 인증 상태를 확인하고 필요시 토큰을 갱신합니다
 */
export async function checkAndRefreshAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) return true;
  if (!refreshToken) return false;

  try {
    const { accessToken: newAccessToken } =
      await authService.refresh(refreshToken);
    await updateAccessToken(newAccessToken);
    return true;
  } catch (error) {
    console.error("토큰 갱신 중 오류:", error);
    await clearServerSideTokens();
    return false;
  }
}
