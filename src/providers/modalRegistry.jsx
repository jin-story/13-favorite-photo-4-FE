/*
 * 새 URL 기반 모달을 추가하려면:
 * 1. 모달 컴포넌트를 만들고 (src/components/modals/)
 * 2. 아래 표에 "이름: 컴포넌트" 한 줄을 추가하면 됩니다.
 * 3. 이제 ?modal=이름 으로 어디서든 열 수 있습니다.
 */
import MarketplaceExchangeSelectModal from "@/components/modals/MarketplaceExchangeSelectModal";
import MarketplaceExchangeRequestModal from "@/components/modals/MarketplaceExchangeRequestModal";

export const MODAL_COMPONENTS = {
  marketplaceExchangeSelect: MarketplaceExchangeSelectModal,
  marketplaceExchangeRequest: MarketplaceExchangeRequestModal,
};
