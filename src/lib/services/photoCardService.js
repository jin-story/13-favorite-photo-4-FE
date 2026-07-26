import { tokenFetch } from "../utils/fetchClient";

export const photoCardService = {
  // 포토카드 생성 요청
  createPhotoCard: async (formData) => {
    const data = await tokenFetch("/photo-cards", {
      method: "POST",
      headers: {
        // FormData를 사용할 때는 브라우저가 boundary를 자동으로 설정해야 하므로 Content-Type을 지워줍니다.
        "Content-Type": undefined,
      },
      body: formData,
    });
    return data;
  },
};
