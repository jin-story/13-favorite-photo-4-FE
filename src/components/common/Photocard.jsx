import React from "react";
import Grade from "./Grade";
import mook_img from "@/assets/images/card_woman.svg";
import Image from "next/image";

export default function Photocard() {
  const mookSellCard = {
    makerNickname: "미쓰손",
    name: "우리집 앞마당",
    grade: "COMMON",
    genre: "풍경",
    price: 5,
    totalQuntity: 5,
    lastQuntity: 2,
    img: { mook_img },
  };
  return (
    <div>
      <Image alt="" src={mook_img} width={150} height={110} />
      <span>{mookSellCard.name}</span>
      <div>
        <div>
          <Grade grade={mookSellCard.grade} type="card" />
          <span>{mookSellCard.genre}</span>
        </div>
        <span>{mookSellCard.makerNickname}</span>
      </div>
      <div>
        <span>가격</span>
        <span>{mookSellCard.price} P</span>
      </div>
      <div>
        <span>잔여</span>
        <span>
          <span>{mookSellCard.lastQuntity}</span> /
          <span> {mookSellCard.totalQuntity}</span>
        </span>
      </div>
    </div>
  );
}
