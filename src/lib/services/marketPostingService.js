import { defaultFetch, tokenFetch } from "../utils/fetchClient";

const availabilityToSoldOut = {
  SALE: "false",
  SOLD_OUT: "true",
};

const sortToQuery = {
  LOW_PRICE: "price_asc",
  HIGH_PRICE: "price_desc",
  LATEST: "recent",
};

export const marketPostingService = {
  fetchMarketPostings: async ({
    cursor,
    limit = 10,
    keyword,
    grade,
    genre,
    availability,
    sort,
  } = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });

    if (cursor) params.set("cursor", cursor);
    if (keyword) params.set("keyword", keyword);
    if (grade?.[0]) params.set("grade", grade[0]);
    if (genre?.[0]) params.set("genre", genre[0]);
    if (availability?.[0]) {
      params.set("soldOut", availabilityToSoldOut[availability[0]]);
    }
    params.set("sort", sort ? sortToQuery[sort] : "recent");

    const response = await defaultFetch(
      `/market-postings?${params.toString()}`,
      { cache: "no-store" },
    );
    return response.json();
  },

  // 판매글 등록
  createMarketPosting: async (payload) => {
    const data = await tokenFetch("/market-postings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  },
};

// 판매글 상세 조회
export const getMarketPosting = async (marketPostingId) => {
  return tokenFetch(`/market-postings/${marketPostingId}`);
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
