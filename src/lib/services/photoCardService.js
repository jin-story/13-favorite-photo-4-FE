import { tokenFetch } from "../utils/fetchClient";

export const photoCardService = {
  // 포토카드 생성 요청
  createPhotoCard: async (formData) => {
    const data = await tokenFetch("/photo-cards", {
      method: "POST",
      headers: {
        "Content-Type": undefined,
      },
      body: formData,
    });
    return data;
  },
};
