import clsx from "clsx";

const gradeStyle = {
  COMMON: "border-main text-main",
  RARE: "border-blue text-blue",
  SUPER_RARE: "border-purple text-purple",
  LEGENDARY: "border-pink text-pink",
};

const sizeStyle = {
  L: "h-[40px] text-[16px] px-[20px] py-[8px]",
  M: "h-[32px] text-[14px] px-[10px] py-[6px]",
  S: "h-[30px] text-[12px] px-[10px] py-[6px]",
};

export default function GradeMyCard({ grade, count = 0, size }) {
  // 백엔드에서 어떤 형태가 와도 동일하게 변환
  const upperGrade = grade.toUpperCase().replace(/\s+/g, "_");

  return (
    <div
      className={clsx(
        "inline-flex items-center border font-medium bg-black gap-[10px]",
        gradeStyle[upperGrade],
        sizeStyle[size],
      )}
    >
      <span>{grade}</span>
      <span>{count}장</span>
    </div>
  );
}
// 사용법: <GradeMyCard grade="COMMON" count={20} size="L" />
