"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const getErrorMessage = (error) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error ?? "알 수 없는 오류가 발생했습니다.");
};

const displayError = (title, error) => {
  const message = getErrorMessage(error);

  // 🚧 [나중에 변경할 부분]
  alert(`오류 발생: ${title} - ${message}`);
};

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => {
    const queryCache = new QueryCache({
      onError: (error, query) => {
        if (query.state.data !== undefined) return;

        displayError(query.meta?.name || "데이터 요청", error);
      },
    });

    const mutationCache = new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        displayError(mutation.meta?.name || "요청 처리", error);
      },
    });

    return new QueryClient({
      queryCache,
      mutationCache,
      defaultOptions: {
        queries: {
          staleTime: 10 * 1000,
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
