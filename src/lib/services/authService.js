import { clearServerSideTokens } from "../actions/auth";
import { defaultFetch, tokenFetch } from "../utils/fetchClient";

export const authService = {
  // 쿠키 인증을 사용하는 로그인
  login: async (email, password) => {
    const response = await defaultFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, encryptedPassword: password }),
      cache: "no-store",
    });
    const data = await response.json();
    const setCookieHeader = response.headers.get("set-cookie");

    return {
      user: data.user,
      accessToken: data.accessToken,
      setCookieHeader,
    };
  },

  // 회원가입
  register: async (nickname, email, password) => {
    const response = await defaultFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ nickname, email, encryptedPassword: password }),
      cache: "no-store",
    });

    const data = await response.json();
    const setCookieHeader = response.headers.get("set-cookie");

    return {
      user: data.user,
      accessToken: data.accessToken,
      setCookieHeader,
    };
  },

  // 로그아웃 - 백엔드에 저장된 refreshToken도 함께 무효화한다.
  // 백엔드 호출이 실패해도(이미 만료된 토큰 등) 프론트 쿠키는 항상 정리해서
  // 사용자가 로컬에서는 확실히 로그아웃되도록 한다.
  logout: async () => {
    try {
      await tokenFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("백엔드 로그아웃 요청 실패:", error);
    } finally {
      await clearServerSideTokens();
    }
  },
};
