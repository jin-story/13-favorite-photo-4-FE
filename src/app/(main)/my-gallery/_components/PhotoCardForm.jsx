"use client";

import PrimaryButton from "@/components/common/ButtonPrimary";
import InputDropdown from "@/components/common/InputDropdown";
import InputTextbox from "@/components/common/InputTextbox";
import InputTextfield from "@/components/common/InputTextfield";
import InputUpload from "@/components/common/InputUpload";
import { photoCardService } from "@/lib/services/photoCardService";
import { useModal } from "@/providers/ModalProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const gradeOptions = [
  { label: "COMMON", value: "COMMON" },
  { label: "RARE", value: "RARE" },
  { label: "SUPER RARE", value: "SUPER_RARE" }, //서로 다른 값 꼭 필요하지 않으면 값은 가
  { label: "LEGENDARY", value: "LEGENDARY" },
];

const genreOptions = [
  { label: "앨범", value: "ALBUM" },
  { label: "특전", value: "SPECIAL" },
  { label: "팬싸", value: "FAN_SIGN" },
  { label: "시즌그리팅", value: "SEASON_GREETING" },
  { label: "팬미팅", value: "FAN_MEETING" },
  { label: "콘서트", value: "CONCERT" },
  { label: "MD", value: "MD" },
  { label: "콜라보", value: "COLLABORATION" },
  { label: "팬클럽", value: "FAN_CLUB" },
  { label: "기타", value: "ETC" },
];

export default function PhotoCardForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});

  const {} = useModal();

  const isFormValid =
    Boolean(name.trim()) &&
    Boolean(grade) &&
    Boolean(genre) &&
    Boolean(price) &&
    Boolean(stock) &&
    Boolean(image) &&
    Boolean(description.trim());

  const { mutate: createPhotoCard, isPending } = useMutation({
    mutationFn: (formData) => photoCardService.createPhotoCard(formData),
    onSuccess: (data) => {
      const queryParams = new URLSearchParams({
        name: data.name,
        grade: data.grade,
      }).toString();
      router.push(`/my-gallery/success?${queryParams}`);
    },
    onError: (error) => {
      console.log("모달 작업 실패", error);

      let errorMessage = "포토카드 생성 중 오류가 발생했습니다.";
      let errorCode = "UNKNOWN_ERROR";

      try {
        const errorData = JSON.parse(error.message);
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code || errorCode;
      } catch {
        errorMessage = error.message || errorMessage;
      }

      if (
        errorCode === "PHOTO_CARD_IMAGE_REQUIRED" ||
        errorCode === "INVALID_IMAGE_TYPE" ||
        errorCode === "IMAGE_FILE_TOO_LARGE"
      ) {
        setErrors((prev) => ({ ...prev, image: errorMessage }));
        return;
      }

      
      const queryParams = new URLSearchParams({
        name: name,
        grade: grade,
        error: errorMessage,
      }).toString();

      router.push(`/my-gallery/error?${queryParams}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!image) newErrors.image = "포토카드 이미지를 업로드해 주세요.";
    if (!name) newErrors.name = "포토카드 이름을 입력해 주세요.";
    if (!grade) newErrors.grade = "등급을 선택해 주세요.";
    if (!genre) newErrors.genre = "장르를 선택해 주세요.";
    if (!price) newErrors.price = "가격을 입력해 주세요.";
    if (!stock) newErrors.stock = "총 발행량을 입력해 주세요.";
    if (Number(stock) > 10 || Number(stock) < 1)
      newErrors.stock = "총 발행량은 1장 이상 10장 이하로 선택 가능합니다.";
    if (!description) newErrors.description = "카드 설명을 입력해 주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("grade", grade);
    formData.append("genre", genre);
    formData.append("minPrice", Number(price)); // 👈 백엔드 minPrice와 일치
    formData.append("totalQuantity", Number(stock)); // 👈 백엔드 totalQuantity와 일치
    formData.append("description", description);

    createPhotoCard(formData);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[34px] w-[345px] tablet:gap-[64px] tablet:w-[440px] pc:w-[520px] pc:gap-[65px]"
    >
      <InputTextfield
        label="포토카드 이름"
        placeholder="포토카드 이름을 입력해 주세요"
        value={name}
        onChange={(val) => {
          setName(val);
          setErrors((prev) => ({ ...prev, name: "" }));
        }}
        errorMessage={errors.name}
      />
      <InputDropdown
        label="등급"
        placeholder="등급을 선택해 주세요"
        options={gradeOptions}
        value={grade}
        onChange={(val) => {
          setGrade(val);
          setErrors((prev) => ({ ...prev, grade: "" }));
        }}
        errorMessage={errors.grade}
      />
      <InputDropdown
        label="장르"
        placeholder="장르를 선택해 주세요"
        options={genreOptions}
        value={genre}
        onChange={(val) => {
          setGenre(val);
          setErrors((prev) => ({ ...prev, genre: "" }));
        }}
        errorMessage={errors.genre}
      />
      <InputTextfield
        label="가격"
        placeholder="가격을 입력해 주세요"
        type="number"
        value={price}
        onChange={(val) => {
          setPrice(val);
          setErrors((prev) => ({ ...prev, price: "" }));
        }}
        errorMessage={errors.price}
      />
      <InputTextfield
        label="총 발행량"
        placeholder="총 발행량을 입력해 주세요"
        type="number"
        value={stock}
        onChange={(val) => {
          setStock(val);
          setErrors((prev) => ({ ...prev, stock: "" }));
        }}
        errorMessage={errors.stock}
      />
      <InputUpload
        label="사진 업로드"
        value={image}
        onChange={(file) => {
          setImage(file);
          setErrors((prev) => ({ ...prev, image: "" }));
        }}
      />
      {errors.image && (
        <p className="text-noto-16-light text-red -mt-5">{errors.image}</p>
      )}

      <InputTextbox
        label="포토카드 설명"
        placeholder="카드 설명을 입력해 주세요"
        value={description}
        onChange={(val) => {
          setDescription(val);
          setErrors((prev) => ({ ...prev, description: "" }));
        }}
        errorMessage={errors.description}
      />
      <PrimaryButton
        type="submit"
        disabled={!isFormValid}
        className="mt-[10px] w-full text-noto-16-bold h-[55px] tablet:mt-0"
      >
        생성하기
      </PrimaryButton>
    </form>
  );
}
