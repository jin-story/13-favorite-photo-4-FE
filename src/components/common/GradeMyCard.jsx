import clsx from "clsx";

const gradeStyle = {
  COMMON: "border-main text-main",
  RARE: "border-blue text-blue",
  SUPER_RARE: "border-purple text-purple",
  LEGENDARY: "border-pink text-pink",
};

const sizeStyle = {
  L: "h-[40px] text-noto-16-light px-[20px] py-[8px]",
  M: "h-[32px] text-noto-14-light px-[10px] py-[6px]",
  S: "h-[30px] text-noto-12-light px-[10px] py-[6px]",
};

export default function GradeMyCard({ grade, count = 0, size }) {
  // 백엔드에서 어떤 형태가 와도 동일하게 변환
  const upperGrade = grade.toUpperCase().replace(/\s+/g, "_");

  return (
    <div
      className={clsx(
        "inline-flex items-center border bg-black gap-[10px]",
        gradeStyle[upperGrade],
        sizeStyle[size],
      )}
    >
      <span>{upperGrade.replace(/_/g, " ")}</span>
      <span>{count}장</span>
    </div>
  );
}
// 사용법: <GradeMyCard grade="COMMON" count={20} size="L" />
