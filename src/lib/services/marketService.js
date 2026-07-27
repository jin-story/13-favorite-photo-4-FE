import { tokenFetch } from "@/lib/utils/fetchClient"; // 혹은 기존에 쓰시는 fetch 유틸

export const marketService = {
  // 1. 판매글 상세 조회 API 호출
  getPostingDetail: async (marketPostingId) => {
    const response = await tokenFetch(`/market-postings/${marketPostingId}`, {
      method: "GET",
    });
    return response;
  },

  purchasePosting: async (marketPostingId, quantity) => {
    const response = await tokenFetch(
      `/market-postings/${marketPostingId}/transactions`,
      {
        method: "POST",
        body: JSON.stringify({ quantity }),
      },
    );
    return response;
  },
};
