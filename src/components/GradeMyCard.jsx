import clsx from "clsx";

const gradeStyle = {
  COMMON: "border-[#EFFF04] text-[#EFFF04]",
  RARE: "border-[#29C9F9] text-[#29C9F9]",
  SUPER_RARE: "border-[#A77EFF] text-[#A77EFF]",
  LEGENDARY: "border-[#FF2A6A] text-[#FF2A6A]",
};

const sizeStyle = {
  L: "h-[40px] text-[16px] px-[20px] py-[8px] gap-[10px]",
  M: "h-[32px] text-[14px] px-[10px] py-[6px] gap-[10px]",
  S: "h-[30px] text-[12px] px-[10px] py-[6px] gap-[10px]",
};

export default function GradeMyCard({ grade, count = 0, size }) {
  return (
    <div
      className={clsx(
        "inline-flex items-center border font-medium bg-[#0F0F0F]",
        gradeStyle[grade],
        sizeStyle[size],
      )}
    >
      <span>{grade?.replaceAll("_", " ")}</span>
      <span>{count}장</span>
    </div>
  );
}
// 사용법: <GradeMyCard grade="COMMON" count={20} size="L" />
