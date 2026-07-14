import clsx from "clsx";
import Grade from "./Grade";

const PhotoCardInfo = ({
  grade = "COMMON",
  genre = "",
  ownerNickname = "",
  description = "",
  price = 0,
  remainingQuantity = 0,
  totalQuantity = 0,
  className = "",
}) => {
  return (
    <section className={clsx("w-full bg-[#0F0F0F] text-white", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Grade type="detail" grade={grade} />

          {genre && (
            <>
              <span className="h-5 w-px bg-[#5A5A5A]" aria-hidden="true" />
              <span className="truncate text-lg font-bold text-[#A4A4A4]">
                {genre}
              </span>
            </>
          )}
        </div>

        {ownerNickname && (
          <span className="shrink-0 text-lg font-bold underline underline-offset-4">
            {ownerNickname}
          </span>
        )}
      </div>

      <div className="mt-4 border-t border-[#3A3A3A] pt-5">
        <p className="min-h-[52px] whitespace-pre-line text-base leading-7 text-[#EDEDED]">
          {description}
        </p>
      </div>

      <div className="mt-5 border-y border-[#3A3A3A] py-5">
        <dl className="space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-base font-normal text-[#A4A4A4]">가격</dt>
            <dd className="text-xl font-bold text-white">{price} P</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-base font-normal text-[#A4A4A4]">잔여</dt>
            <dd className="text-xl font-bold text-white">
              {remainingQuantity}
              <span className="px-1 text-[#A4A4A4]">/</span>
              <span className="text-[#A4A4A4]">{totalQuantity}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default PhotoCardInfo;
