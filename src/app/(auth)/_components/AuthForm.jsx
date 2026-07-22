"use client";

import PrimaryButton from "@/components/common/ButtonPrimary";
import InputEmail from "@/components/common/InputEmail";
import InputPassword from "@/components/common/InputPassword";
import InputTextfield from "@/components/common/InputTextfield";
import ic_google from "@/assets/icons/ic_google.svg";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/providers/ModalProvider";

export default function AuthForm({ type }) {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const { login, register } = useAuth();
  const registerForm = type === "register";

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const isFormFilled = registerForm
    ? Boolean(email && nickname && password && passwordConfirmation)
    : Boolean(email && password);

  const handleOpenModal = (errorMessage) => {
    openModal(
      <div className="w-[345px] h-[291px] flex flex-col justify-center items-center gap-7.5 tablet:w-[400px] tablet:h-[291px] pc:w-[560px] pc:h-[375px] pc:gap-10">
        <h2 className="text-noto-18-bold pc:text-noto-20-bold">
          {registerForm ? "회원가입 실패" : "로그인 실패"}
        </h2>
        <p className="text-noto-12-bold pc:text-noto-14-bold">{errorMessage}</p>
        <PrimaryButton variant="thinXS" onClick={closeModal}>
          확인
        </PrimaryButton>
      </div>,
    );
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "이메일을 입력해 주세요.";
    if (!emailRegex.test(value)) return "올바른 이메일 형식으로 입력해 주세요.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setNicknameError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setGeneralError("");

    let isValid = true;

    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      isValid = false;
    }
    if (registerForm && !nickname) {
      setNicknameError("닉네임을 입력해 주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("비밀번호는 8자 이상 입력해 주세요.");
      isValid = false;
    }
    if (registerForm && password !== passwordConfirmation) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      if (registerForm) {
        await register(nickname, email, password, passwordConfirmation);
        router.push("/market-posting");
      } else {
        await login(email, password);
        router.push("/market-posting");
      }
    } catch (err) {
      const errorMessage = err.message || "요청에 실패했습니다.";
      setGeneralError(errorMessage);

      handleOpenModal(errorMessage);
    }
  };
  return (
    <form
      className="flex flex-col gap-[32px] w-full"
      onSubmit={handleSubmit}
      noValidate
    >
      <InputEmail
        label="이메일"
        placeholder="이메일을 입력해 주세요"
        value={email}
        onChange={setEmail}
        errorMessage={emailError}
      />
      {registerForm && (
        <InputTextfield
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
          onChange={setNickname}
          errorMessage={nicknameError}
        />
      )}

      <InputPassword
        label="비밀번호"
        placeholder="8자 이상 입력해 주세요"
        value={password}
        onChange={setPassword}
        errorMessage={passwordError}
      />
      {registerForm && (
        <InputPassword
          label="비밀번호 확인"
          placeholder="비밀번호를 한번 더 입력해 주세요"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          errorMessage={passwordConfirmError}
        />
      )}

      <div className="flex flex-col gap-4">
        <PrimaryButton
          type="submit"
          variant="thin"
          className="cursor-pointer"
          disabled={!isFormFilled}
        >
          {registerForm ? "가입하기" : "로그인"}
        </PrimaryButton>
        <button
          type="button"
          className="cursor-pointer flex gap-3 bg-white text-noto-16-regular text-black w-[345px] h-[55px] items-center justify-center rounded-[2px] tablet:w-[441px] pc:w-[520px] pc:h-15 pc:text-noto-18-regular"
        >
          <Image
            alt="구글로 로그인하기"
            src={ic_google}
            width={22}
            height={22}
          />
          Google로 시작하기
        </button>
      </div>
    </form>
  );
}
