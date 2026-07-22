"use client";

import AuthProvider from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import QueryProvider from "@/providers/QueryProvider";
import { RandomPointProvider } from "@/providers/RandomPointProvider";

export function Providers({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          <RandomPointProvider>{children}</RandomPointProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
