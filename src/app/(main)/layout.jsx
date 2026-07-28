import Gnb from "@/components/common/Gnb";
import { checkAuthWithRefresh } from "@/lib/actions/auth";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

export default async function Layout({ children }) {
  const isAuthenticated = await checkAuthWithRefresh();

  // if (!isAuthenticated) {
  //   redirect("/login", RedirectType.replace);
  // }
  return (
    <div className="flex min-h-dvh flex-col">
      <Gnb />
      <main className="flex-1 pt-[60px] tablet:pt-[70px] pc:pt-[80px]">
        <div className="mx-auto w-full max-w-[1920px] px-[15px] tablet:px-5 pc:px-[220px]">
          {children}
        </div>
      </main>
      {/* Footer */}
    </div>
  );
}
