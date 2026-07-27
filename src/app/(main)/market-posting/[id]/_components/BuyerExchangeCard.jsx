import ButtonSecondary from "@/components/common/ButtonSecondary";
import Grade from "@/components/common/Grade";
import Image from "next/image";
import React from "react";

export default function MyExchangeOfferCard({ offer, onCancel }) {
  return (
    <article className="w-[170px] border border-white/10 bg-gray-500 p-2.5 text-white tablet:w-[302px] tablet:p-5 pc:w-[342px]">
      <div className="relative aspect-[150/112] w-full overflow-hidden bg-gray-400 tablet:aspect-[262/197] pc:aspect-[302/227]">
        <Image
          src={offer.imageUrl}
          alt={offer.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="mt-2.5 truncate text-noto-14-bold tablet:mt-5 tablet:text-noto-22-bold">
        {offer.name}
      </h3>

      <div className="mt-[5px] flex items-center justify-between border-b border-gray-400 pb-2.5">
        <div className="flex min-w-0 items-center">
          <Grade type="card" grade={offer.grade} />
          <span className="mx-[5px] h-3 w-px bg-gray-400 tablet:mx-2.5 tablet:h-4" />
          <span className="text-noto-10-regular text-gray-300 tablet:text-noto-16-regular">
            {offer.genre}
          </span>
          <span className="mx-[5px] hidden h-3 w-px bg-gray-400 tablet:mx-2.5 tablet:block tablet:h-4" />
          <span className="hidden text-noto-10-regular tablet:block tablet:text-noto-16-regular">
            <span className="text-white">{offer.price} P</span>
            <span className="text-gray-300"> 에 구매</span>
          </span>
        </div>

        <span className="truncate text-noto-10-regular text-white underline underline-offset-2 tablet:text-noto-16-regular">
          {offer.ownerNickname}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 min-h-[32px] text-noto-10-regular leading-4 text-white tablet:mt-5 tablet:min-h-[46px] tablet:text-noto-16-regular tablet:leading-[23px]">
        {offer.description}
      </p>

      <ButtonSecondary
        variant="thin"
        className="mt-5 h-[40px]! w-full! border border-gray-200 bg-transparent! text-noto-12-bold tablet:mt-7 tablet:h-[55px]! tablet:text-noto-14-bold"
        onClick={() => onCancel(offer)}
      >
        취소하기
      </ButtonSecondary>
    </article>
  );
}
