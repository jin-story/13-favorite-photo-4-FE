import { defaultFetch, tokenFetch } from "../utils/fetchClient";

// 판매글 목록 조회
export const getMarketPostings = async (params = "") => {
  return defaultFetch(`/market-postings${params}`).then((res) => res.json());
};

// 판매글 상세 조회
export const getMarketPosting = async (marketPostingId) => {
  return tokenFetch(`/market-postings/${marketPostingId}`);
};

// 판매글 등록
export const createMarketPosting = async (body) => {
  return tokenFetch("/market-postings", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

// 판매글 수정
export const updateMarketPosting = async (marketPostingId, body) => {
  return tokenFetch(`/market-postings/${marketPostingId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

// 판매글 삭제(판매 내리기)
export const deleteMarketPosting = async (marketPostingId) => {
  return tokenFetch(`/market-postings/${marketPostingId}`, {
    method: "DELETE",
  });
};
