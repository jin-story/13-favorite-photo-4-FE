import { checkAuth } from "@/lib/actions/auth";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children }) {
  const isAuthenticated = await checkAuth();

  if (isAuthenticated) {
    redirect("/market-posting", RedirectType.replace);
  }

  return (
    <main className="flex min-h-dvh  items-center justify-center px-[15px]">
      <div className="w-full max-w-[345px] tablet:max-w-[440px] pc:max-w-[520px]">
        {children}
      </div>
    </main>
  );
}
