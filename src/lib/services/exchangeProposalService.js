import { tokenFetch } from "../utils/fetchClient";

// 1. 교환 제안 목록 조회
export const getExchangeProposals = async (marketPostingId) => {
  return tokenFetch(`/market-postings/${marketPostingId}/exchange-proposals`);
};

// 2. 교환 제안 생성 (POST)
export const createExchangeProposal = async (marketPostingId, body) => {
  return tokenFetch(`/market-postings/${marketPostingId}/exchange-proposals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

// 3. 교환 제안 승인 (PATCH status: "APPROVED")
export const approveExchangeProposal = async (proposalId) => {
  return tokenFetch(`/exchange-proposals/${proposalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "APPROVED",
    }),
  });
};

// 4. 교환 제안 거절 (PATCH status: "REJECTED")
export const rejectExchangeProposal = async (proposalId) => {
  return tokenFetch(`/exchange-proposals/${proposalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "REJECTED",
    }),
  });
};

// 5. 교환 제안 취소 (PATCH status: "CANCELED") - 추가 필요시 사용
export const cancelExchangeProposal = async (proposalId) => {
  return tokenFetch(`/exchange-proposals/${proposalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "CANCELED",
    }),
  });
};
