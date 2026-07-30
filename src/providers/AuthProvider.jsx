"use client";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import {
  getServerSideToken,
  loginAction,
  registerAction,
} from "@/lib/actions/auth";
import { authService } from "@/lib/services/authService";
import { userService } from "@/lib/services/userService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  user: null,
  register: () => {},
  refreshUser: () => {},
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
  const [notification, setNotification] = useState([]);

  const getUser = async () => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      setUser(null);
    }
  };

  const getNotification = async () => {
    try {
      const userData = await userService.getNotification();
      setNotification(userData);
    } catch (error) {
      console.error("알림 불러오기에 실패했습니다.", error);
      setNotification([]);
    }
  };

  const handleSseNotification = useCallback((newNotification) => {
    setNotification((currentNotifications) => [
      newNotification,
      ...currentNotifications,
    ]);
  }, []);

  useNotificationStream({
    enabled: Boolean(user),
    onNotification: handleSseNotification,
  });

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
      setNotification([]);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const token = await getServerSideToken();
      if (token) {
        getUser();
        getNotification();
      } else {
        setUser(null);
        setNotification([]);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        notification,
        login,
        logout,
        register,
        refreshUser: getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
