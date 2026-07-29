import pointImage from "@/assets/images/point.svg";
import Image from "next/image";
import RandomPoint from "./RandomPoint";

export default function PointResult({ time, point }) {
  return (
    <div className="mb-[93px]">
      <RandomPoint time={time}>
        <Image
          className="px-[58px]"
          src={pointImage}
          width={340}
          height={324}
          alt="포인트 획득"
        />
        <p className="pc:text-[32px] table:text-[28px] text-2xl gap">
          <span className="text-main ">{point}P </span>
          획득!
        </p>
      </RandomPoint>
    </div>
  );
}
