import { tokenFetch } from "../utils/fetchClient";

export const pointService = {
  fetchDrawStatus: async () => {
    const data = await tokenFetch("/point-draws");
    return data;
  },

  claimRandomPoint: async () => {
    const data = await tokenFetch("/point-draws", { method: "POST" });
    return data;
  },
};
