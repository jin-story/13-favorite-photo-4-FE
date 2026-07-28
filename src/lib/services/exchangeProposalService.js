import { tokenFetch } from "../utils/fetchClient";

// 교환 제안 목록 조회
export const getExchangeProposals = async (marketPostingId) => {
  return tokenFetch(`/market-postings/${marketPostingId}/exchange-proposals`);
};

// 교환 제안
export const createExchangeProposal = async (marketPostingId, body) => {
  return tokenFetch(`/market-postings/${marketPostingId}/exchange-proposals`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

// 교환 승인
export const approveExchangeProposal = async (proposalId) => {
  return tokenFetch(`/exchange-proposals/${proposalId}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "APPROVED",
    }),
  });
};

// 교환 거절
export const rejectExchangeProposal = async (proposalId) => {
  return tokenFetch(`/exchange-proposals/${proposalId}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: "REJECTED",
    }),
  });
};
