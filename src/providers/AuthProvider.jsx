"use client";

import {
  getServerSideToken,
  loginAction,
  registerAction,
} from "@/lib/actions/auth";
import { authService } from "@/lib/services/authService";
import { userService } from "@/lib/services/userService";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  user: null,
  register: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth는 반드시 AuthProvider 안에서만 사용할 수 있습니다",
    );
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      setUser(null);
    }
  };

  const register = async (nickname, email, password, passwordConfirmation) => {
    if (password !== passwordConfirmation) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    const { userData, success, error } = await registerAction(
      nickname,
      email,
      password,
    );
    if (!success) {
      throw new Error(error || "회원가입 실패");
    }
    setUser(userData);
  };

  const login = async (email, password) => {
    const { userData, success, error } = await loginAction(email, password);
    if (!success) {
      throw new Error(error || "로그인 실패");
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const token = await getServerSideToken();
      if (token) {
        getUser();
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
