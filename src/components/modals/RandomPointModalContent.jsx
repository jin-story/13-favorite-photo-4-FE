"use client";

import boxBlue from "@/assets/images/box_blue.svg";
import boxPurple from "@/assets/images/box_purple.svg";
import boxRed from "@/assets/images/box_red.svg";
import PrimaryButton from "@/components/common/ButtonPrimary";
import PointResult from "@/components/common/PointResult";
import RandomPoint from "@/components/common/RandomPoint";
import { useCountdown } from "@/hooks/useCountdown";
import { pointService } from "@/lib/services/pointService";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const boxes = [
  { src: boxBlue, alt: "box1" },
  { src: boxPurple, alt: "box2" },
  { src: boxRed, alt: "box3" },
];

export default function RandomPointModalContent({ onClaimed }) {
  const [targetAt, setTargetAt] = useState(null);
  const time = useCountdown(targetAt);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [selectedBox, setSelectedBox] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [claimedPoint, setClaimedPoint] = useState(0);

  useEffect(() => {
    pointService
      .fetchDrawStatus()
      .then(({ nextAvailableAt }) => {
        if (nextAvailableAt) setTargetAt(new Date(nextAvailableAt).getTime());
      })
      .catch((error) => {
        console.error("포인트 뽑기 상태 조회 실패:", error);
      })
      .finally(() => setIsStatusLoading(false));
  }, []);

  const handleOpenBox = async () => {
    if (selectedBox === null || isOpening) return;

    setIsOpening(true);

    try {
      const [{ point, nextAvailableAt }] = await Promise.all([
        pointService.claimRandomPoint(),
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);

      setClaimedPoint(point);
      setTargetAt(new Date(nextAvailableAt).getTime());
      setShowResult(true);
      onClaimed?.(nextAvailableAt);
    } catch (error) {
      alert(error.message);
      setIsOpening(false);
      setSelectedBox(null);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-[345px] tablet:w-[455px]"
          >
            <PointResult time={time} point={claimedPoint} />
          </motion.div>
        ) : (
          <motion.div
            key="select"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center pc:w-[1034px] tablet:w-[600px] w-[345px]"
          >
            <RandomPoint time={time}>
              <>
                1시간마다 돌아오는 기회!
                <br />
                랜덤 상자 뽑기를 통해 포인트를 획득하세요!
              </>
            </RandomPoint>

            <figure className="flex gap-[15px] mt-[60px] mb-[60px] mx-[15px] tablet:gap-[25px] tablet:mx-9 pc:gap-[60px] pc:mt-[94px] pc:mb-[80px] pc:mx-[100px]">
              {boxes.map(({ src, alt }, index) => (
                <motion.button
                  key={alt}
                  type="button"
                  disabled={isOpening || isStatusLoading}
                  onClick={() => setSelectedBox(index)}
                  animate={{
                    opacity:
                      selectedBox !== null && selectedBox !== index ? 0.3 : 1,

                    scale: selectedBox === index ? (isOpening ? 1.5 : 1.15) : 1,

                    y: selectedBox === index && isOpening ? [0, -20, 0] : 0,

                    rotate:
                      selectedBox === index && isOpening
                        ? [0, -8, 8, -8, 8, 0]
                        : 0,
                  }}
                  transition={{
                    type: "tween",
                  }}
                  whileHover={{
                    scale: selectedBox === null ? 1.05 : undefined,
                  }}
                >
                  <Image
                    src={src}
                    width={246}
                    height={190}
                    alt={alt}
                    className={clsx(
                      "w-[97.9px] h-[75.9px] tablet:w-[150px] tablet:h-[132px] pc:w-[246px] pc:h-[191px]",
                      selectedBox !== null &&
                        selectedBox !== index &&
                        "grayscale",
                    )}
                  />
                </motion.button>
              ))}
            </figure>

            <AnimatePresence>
              {selectedBox !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <PrimaryButton
                    variant="thin"
                    className="pc:w-[520px]! tablet:w-[440px]! w-[300px]! pc:mb-[80px] tablet:mb-[58px] mb-[45px] rounded-b-xs"
                    onClick={handleOpenBox}
                    disabled={isOpening || isStatusLoading}
                  >
                    선택완료
                  </PrimaryButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
