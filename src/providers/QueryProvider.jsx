"use client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => {
    const queryCache = new QueryCache({
      onError: (error, query) => {
        alert(
          `오류 발생: ${query.meta?.name || "데이터 요청"} - ${error.message}`,
        );
      },
    });
    const mutationCache = new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        alert(
          `오류 발생: ${mutation.meta?.name || "요청 처리"} - ${error.message}`,
        );
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
