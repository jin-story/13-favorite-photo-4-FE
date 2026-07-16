import Gnb from "@/components/common/Gnb";
import React from "react";

export default function Home() {
  const isLoggedIn = true; // false로 바꾸면 로그아웃 상태
  const user = {
    nickname: "유디",
    point: 1540,
  };
  return (
    <div>
      <Gnb isLoggedIn={isLoggedIn} user={user} />
    </div>
  );
}
