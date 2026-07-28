import { tokenFetch } from "../utils/fetchClient";

export const userService = {
  // 사용자 정보 요청
  getMe: async () => {
    const data = await tokenFetch("/users/me");
    return data;
  },

  // 내 보유 포토카드 목록 조회
  getMyInventories: async ({ keyword, grade, genre, cursor, limit = 50 } = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });

    if (keyword) params.set("keyword", keyword);
    if (grade) params.set("grade", grade);
    if (genre) params.set("genre", genre);
    if (cursor) params.set("cursor", String(cursor));

    const data = await tokenFetch(`/users/me/inventories?${params.toString()}`);
    return data;
  },
};
