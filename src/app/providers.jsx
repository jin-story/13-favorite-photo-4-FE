"use client";

import { ModalProvider } from "@/providers/ModalProvider";
import { RandomPointProvider } from "@/providers/RandomPointProvider";
import QueryProvider from "@/providers/QueryProvider";

export function Providers({ children }) {
  return (
    <QueryProvider>
      <ModalProvider>
        <RandomPointProvider>{children}</RandomPointProvider>
      </ModalProvider>
    </QueryProvider>
  );
}
