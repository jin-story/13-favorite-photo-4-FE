import React from "react";

export default function Grade({ type = "card", grade = "COMMON" }) {
  if (type !== "card" && type !== "detail") return null;
  const upperGrade = grade.toUpperCase();
  const gradeStyles = {
    COMMON: "text-[#EFFF04]",
    RARE: "text-[#29C9F9]",
    "SUPER RARE": "text-[#A77EFF]",
    LEGENDARY: "text-[#FF2A6A]",
  };
  return (
    <>
      {type === "card" && (
        <span
          className={`text-noto-10-light ${gradeStyles[upperGrade]} text-center tablet:text-noto-16-light`}
        >
          {upperGrade}
        </span>
      )}
      {type === "detail" && (
        <span
          className={` ${gradeStyles[upperGrade]} text-noto-18-bold text-center tablet:text-noto-24-bold`}
        >
          {upperGrade}
        </span>
      )}
    </>
  );
}
