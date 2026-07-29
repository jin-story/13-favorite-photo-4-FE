import React from "react";
import PhotoCardForm from "../_components/PhotoCardForm";
import Title from "@/components/common/Title";

export default function CreatePhotoCardPage() {
  return (
    <div className="flex flex-col gap-20 justify-center items-center mt-10 mb-15 tablet:px-5 pc:px-[220px] pc:mb-[180px]">
      <Title
        type="title_line"
        text="포토카드 생성"
        className="tablet:max-w-[704px] pc:max-w-[1480px]"
      />
      <PhotoCardForm />
    </div>
  );
}
