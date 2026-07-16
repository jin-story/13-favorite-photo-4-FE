"use client";

import Gnb from "@/components/common/Gnb";
import React from "react";

export default function Page() {
  const isLoggedIn = false; // false로 바꾸면 로그아웃 상태

  const user = {
    nickname: "유디",
    point: 1540,
  };

  return <Gnb isLoggedIn={isLoggedIn} user={user} />;
}
