// Gnb / GnbTitle가 공유하는 "서브 헤더" 판정 규칙입니다.
// 여기 등록된 modal 또는 pathname 상태일 때 모바일 Gnb는 자동으로 sub 타입(뒤로가기 + 타이틀)이 되고,
// 해당 페이지를 벗어나거나 모달이 닫히면(=modal 파라미터/경로가 더 이상 일치하지 않으면) 자동으로 main으로 돌아갑니다.

export const GNB_SUB_MODAL_TITLES = {
  "sell-card": "나의 포토카드 판매하기",
  "exchange-info": "포토카드 교환하기",
  exchange: "포토카드 교환하기",
  "edit-card": "수정하기",
};

export const GNB_SUB_PATH_TITLES = {
  "/my-gallery": "마이갤러리",

  "/my-gallery/create": "포토카드 생성",
  "/my-gallery/success": "",
  "/my-gallery/error": "",

  "/my-listings": "나의 판매 포토카드",
  "/notifications": "알림",
  "/market-posting/sell-success": "",
  "/market-posting/sell-fail": "",
};

// 정확히 이 경로가 아니라, 이 접두사로 시작하는 하위 경로 전체에 적용되는 규칙입니다.
// 예: "/market-posting/"로 시작 → "/market-posting/123", "/market-posting/123/buyer" 등은 모두 매칭되지만,
// "/market-posting" 자기 자신(목록 페이지)은 접두사에 슬래시가 포함돼 있어 매칭되지 않습니다.
export const GNB_SUB_PATH_PREFIX_TITLES = [
  { prefix: "/market-posting/", title: "마켓플레이스" },
];

// [id]처럼 동적 세그먼트가 껴 있어 정확 일치로는 잡을 수 없는 경로들입니다.
// 끝부분(suffix)만 고정돼 있으므로 이걸로 매칭하고, prefix 규칙보다 먼저 검사해서 덮어씁니다.
export const GNB_SUB_PATH_SUFFIX_TITLES = [
  { suffix: "/buyer/purchase-error", title: "" },
  { suffix: "/buyer/purchase-success", title: "" },
  { suffix: "/buyer/exchange-error", title: "" },
  { suffix: "/buyer/exchange-success", title: "" },
];

const DEFAULT_TITLE = "최애의포토";

// 우선순위: modal > 정확 일치 > suffix 일치 > prefix 일치
export function getGnbSubState(pathname, modal) {
  if (modal && GNB_SUB_MODAL_TITLES[modal] !== undefined) {
    return { isSub: true, title: GNB_SUB_MODAL_TITLES[modal] };
  }

  if (pathname in GNB_SUB_PATH_TITLES) {
    return { isSub: true, title: GNB_SUB_PATH_TITLES[pathname] };
  }

  const suffixMatch = GNB_SUB_PATH_SUFFIX_TITLES.find(({ suffix }) =>
    pathname.endsWith(suffix),
  );
  if (suffixMatch) {
    return { isSub: true, title: suffixMatch.title };
  }

  const prefixMatch = GNB_SUB_PATH_PREFIX_TITLES.find(({ prefix }) =>
    pathname.startsWith(prefix),
  );
  if (prefixMatch) {
    return { isSub: true, title: prefixMatch.title };
  }

  return { isSub: false, title: DEFAULT_TITLE };
}
