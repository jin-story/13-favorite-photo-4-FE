"use client";

import { ModalProvider } from "@/providers/ModalProvider";
import QueryProvider from "@/providers/QueryProvider";

export function Providers({ children }) {
  return (
    <QueryProvider>
      <ModalProvider>{children}</ModalProvider>;
    </QueryProvider>
  );
}
