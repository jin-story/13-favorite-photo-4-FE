"use client";

import { updateAccessToken } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const completeGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = params.get("accessToken");

      if (!accessToken) {
        setErrorMessage("Google 로그인 정보를 받지 못했습니다.");
        return;
      }

      try {
        await updateAccessToken(accessToken);
        window.location.replace("/market-posting");
      } catch (error) {
        setErrorMessage(
          error?.message || "Google 로그인 처리 중 오류가 발생했습니다.",
        );
      }
    };

    completeGoogleLogin();
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-black px-[15px] text-white">
      {errorMessage ? (
        <div className="text-center">
          <p className="text-noto-16-bold">Google 로그인에 실패했습니다.</p>
          <p className="mt-3 text-noto-14-regular text-gray-300">
            {errorMessage}
          </p>
          <button
            type="button"
            className="mt-6 text-noto-14-bold text-main underline"
            onClick={() => router.replace("/login")}
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      ) : (
        <p className="text-noto-16-regular">Google 로그인 처리 중...</p>
      )}
    </main>
  );
}
