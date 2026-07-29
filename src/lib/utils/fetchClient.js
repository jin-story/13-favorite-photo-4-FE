import { getServerSideToken, updateAccessToken } from "../actions/auth";

/**
 * 기본 fetch 클라이언트 - 인증이 필요 없는 일반 요청용
 */
export const defaultFetch = async (url, options = {}) => {
  const baseURL = process.env.BACKEND_ORIGIN;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "force-cache",
  };

  const mergedHeaders = {
    ...defaultOptions.headers,
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete mergedHeaders["Content-Type"];
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: mergedHeaders,
  };

  const response = await fetch(`${baseURL}${url}`, mergedOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `요청 실패 (status: ${response.status})`,
    );
  }

  return response;
};

/**
 * 토큰 인증 fetch 클라이언트
 */
export const tokenFetch = async (url, options = {}) => {
  const token = await getServerSideToken("accessToken");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    cache: "no-store",
  };

  const mergedHeaders = {
    ...defaultOptions.headers,
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete mergedHeaders["Content-Type"];
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: mergedHeaders,
  };

  let response = await fetch(url, mergedOptions);

  const REFRESH_PATH = "/auth/refresh-token";

  if (response.status === 401 && url !== REFRESH_PATH) {
    let refreshResponse;
    try {
      refreshResponse = await fetch(REFRESH_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const { accessToken: newAccessToken } = await refreshResponse.json();
        mergedOptions.headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(`${baseURL}${url}`, mergedOptions);
        await updateAccessToken(newAccessToken);
      }
    } catch (error) {
      const errorData = await refreshResponse.json();
      throw new Error(JSON.stringify(errorData));
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `요청 실패 (status: ${response.status})`,
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return { status: response.status, ok: response.ok };
};
