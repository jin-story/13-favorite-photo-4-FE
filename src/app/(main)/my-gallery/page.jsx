import Dropdown from "@/components/common/Dropdown";
import GradeMyCard from "@/components/common/GradeMyCard";
import InputSearch from "@/components/common/InputSearch";
import SheetFilter from "@/components/common/SheetFilter";
import filter from "@/assets/icons/filter.svg";
import Image from "next/image";
import React from "react";

export default function MyGallery() {
  const mockUser = {
    nickname: "유디",
  };
  const userIndentory = {
    total: 40,
    grade: {
      common: 20,
      rare: 8,
      super_rare: 3,
      legendary: 2,
    },
  };
  return (
    <div className="w-[343px]">
      <div>
        <h2>{mockUser.nickname}님이 보유한 포토카드</h2>
        <span>({userIndentory.total}장)</span>
      </div>
      {/* <div className="flex gap-1.5">
        {Object.entries(userIndentory.grade).map(([key, count]) => (
          <GradeMyCard grade={key} count={count} key={key} />
        ))}
      </div> */}
      <div className="flex">
        <div className="flex gap-2.5 w-full">
          <button className="">
            <Image alt="필터" src={filter} width={20} height={20} />
          </button>
          <InputSearch className="w-full tablet:w-[200px] pc:w-[320px]" />
        </div>

        <div className="hidden items-start gap-[35px] tablet:flex pc:gap-[45px]">
          <Dropdown type="grade" />
          <Dropdown type="genre" />
        </div>
      </div>
    </div>
  );
}
