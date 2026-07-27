import logo from "@/assets/images/logo.svg";
import PrimaryButton from "@/components/common/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-7">
      <Image src={logo} alt="최애의 포토" className="w-[300px] h-auto" />
      <h1 className="text-baskin-62 text-main">404</h1>
      <p className="text-baskin-24">
        페이지를 찾을 수 없어요
        <br /> 요청하신 페이지가 존재하지 않거나 이동되었습니다
      </p>
      <Link href="/" className="cursor-pointer">
        <PrimaryButton className="rounded-xl  w-65 h-12 tablet:w-65 tablet:h-13 pc:w-65 pc:h-14 text-baskin-24 cursor-pointer">
          홈으로 이동
        </PrimaryButton>
      </Link>
    </div>
  );
}
