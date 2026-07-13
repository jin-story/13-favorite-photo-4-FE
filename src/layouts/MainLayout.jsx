import React from "react";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header*/}
      <main className="flex-1 pt-[140px]">
        <div className="mx-auto w-full max-w-[1920px] px-[15px] tablet:px-5 pc:px-[220px]">
          {children}
        </div>
      </main>
      {/* Footer */}
    </div>
  );
}
