import { tokenFetch } from "../utils/fetchClient";

export const userService = {
  // 사용자 정보 요청
  getMe: async () => {
    const data = await tokenFetch("/users/me");
    return data;
  },
  //마이갤러리
  getMyInventories: async ({
    pageParam = null,
    keyword = "",
    grade = "",
    genre = "",
  }) => {
    const params = new URLSearchParams();
    params.append("includeMeta", "true");
    if (pageParam) params.append("cursor", pageParam);
    if (keyword) params.append("keyword", keyword);
    if (grade) params.append("grade", grade);
    if (genre) params.append("genre", genre);

    const data = await tokenFetch(`/users/me/inventories?${params.toString()}`);
    return data;
  },
  //나의 판매 포토카드
  getMyMarketPostings: async () => {
    const data = await tokenFetch("/users/me/market-postings");
    return data;
  },
  // 내가 제시한 교환 목록 조회 API
  getMyExchangeOffers: async () => {
    const response = await tokenFetch("/users/me/exchange-proposals", {
      method: "GET",
    });
    return response;
  },
  getNotification: async () => {
    const data = await tokenFetch("/users/me/notifications");
    return data;
  },
};
