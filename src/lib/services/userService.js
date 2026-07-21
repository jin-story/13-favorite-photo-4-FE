import { tokenFetch } from "../utils/fetchClient";

export const userService = {
  // 사용자 정보 요청
  getMe: async () => {
    const data = await tokenFetch("/users/me");
    return data;
  },
};
