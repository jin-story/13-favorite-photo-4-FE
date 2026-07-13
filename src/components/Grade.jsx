import React from "react";

export default function Grade({ type = "card", grade = "COMMON" }) {
  const upperGrade = grade.toUpperCase();
  const gradeStyles = {
    COMMON: "text-[#EFFF04]",
    RARE: "text-[#29C9F9]",
    "SUPER RARE": "text-[#A77EFF]",
    REGENDARY: "text-[#FF2A6A]",
  };
  return (
    <>
      {type === "card" && (
        <span
          className={`text-[10px] font-light ${gradeStyles[upperGrade]} text-center`}
        >
          {upperGrade}
        </span>
      )}
      {type === "detail" && (
        <span
          className={` ${gradeStyles[upperGrade]} text-lg font-bold text-center`}
        >
          {upperGrade}
        </span>
      )}
    </>
  );
}
