import GradeMyCard from "@/components/GradeMyCard";
import React from "react";

export default function Home() {
  return (
    <div>
      Home
      <GradeMyCard grade="COMMON" count={20} size="L" />
    </div>
  );
}
