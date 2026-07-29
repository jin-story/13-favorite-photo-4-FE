import ButtonPrimary from "@/components/common/ButtonPrimary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marketService } from "@/lib/services/marketService";

export default function CancelExchangeOfferModal({
  offerId,
  cardGrade,
  cardName,
  onClose,
}) {
  const queryClient = useQueryClient();
  const cancelExchangeMutation = useMutation({
    mutationFn: () => marketService.cancelExchangeProposal(offerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myExchangeOffers"] });
      onClose();
    },
  });

  const { isPending, error } = cancelExchangeMutation;

  return (
    <section className="flex h-[291px] w-[345px] flex-col items-center justify-center text-center text-white tablet:w-[400px] pc:h-[375px] pc:w-[560px]">
      <h2 className="text-noto-18-bold pc:text-noto-20-bold">교환 제시 취소</h2>
      <div className="mt-[30px] pc:mt-10 pc:text-center pc:flex  pc:gap-1">
        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          [{cardGrade} | {cardName}]
        </p>
        <p className="text-noto-14-regular text-gray-300 pc:text-noto-16-regular">
          교환 제시를 취소하시겠습니까?
        </p>
      </div>

      <ButtonPrimary
        className="mt-10 pc:mt-[60px] w-[120px] h-[55px] text-noto-16-bold tablet:w-[140px] tablet:h-[55px] pc:w-[170px] pc:h-[60px] rounded-xs" 
        onClick={() => cancelExchangeMutation.mutate()}
        disabled={isPending}
      >
        {isPending ? "취소 중..." : "취소하기"}
      </ButtonPrimary>
    </section>
  );
}
