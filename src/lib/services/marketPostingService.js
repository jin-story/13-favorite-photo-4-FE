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
    (grade || []).forEach((value) => params.append("grade", value));
    (genre || []).forEach((value) => params.append("genre", value));
    (availability || []).forEach((value) =>
      params.append("soldOut", availabilityToSoldOut[value]),
    );
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
