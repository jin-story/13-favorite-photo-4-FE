import { clearServerSideTokens } from "../actions/auth";
import { defaultFetch } from "../utils/fetchClient";

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

  // 로그아웃
  logout: () => clearServerSideTokens(),
};
