const TITLE_STYLES = {
  "title_button-L": { textClass: "text-baskin-62", buttonWidth: "w-[440px]" },
  "title_button-M": { textClass: "text-baskin-48", buttonWidth: "w-[342px]" },
  "title_line-L": { textClass: "text-baskin-62" },
  "title_line-M": { textClass: "text-baskin-48" },
  "title_line_modal-L": { textClass: "text-baskin-46" },
  "title_line_modal-M": { textClass: "text-baskin-40" },
  "card_detail-L": { textClass: "text-noto-40-bold" },
  "card_detail-M": { textClass: "text-noto-32-bold" },
  "card_detail-S": { textClass: "text-noto-24-bold" },
  "exchange_buyer-L": {
    textClass: "text-noto-40-bold",
    buttonWidth: "w-[440px]",
  },
  "exchange_buyer-M": {
    textClass: "text-noto-32-bold",
    buttonWidth: "w-[342px]",
  },
  "exchange_buyer-S": { textClass: "text-noto-24-bold" },
  "exchange_seller-L": {
    textClass: "text-noto-40-bold",
    buttonWidth: "w-[440px]",
  },
  "exchange_info_modal-L": { textClass: "text-noto-28-bold" },
  "exchange_info_modal-M": { textClass: "text-noto-22-bold" },
};

export default function Title({ type = "title_button", size = "L", text }) {
  const style = TITLE_STYLES[`${type}-${size}`];

  if (!style) {
    console.warn(
      `Title: 지원하지 않는 type/size 입니다. (type: ${type}, size: ${size})`,
    );
    return null;
  }

  const { textClass, buttonWidth } = style;

  return (
    <div className="flex w-full flex-col gap-5">
      {buttonWidth ? (
        <div className="flex w-full items-center justify-between">
          <p className={`${textClass} text-white`}>{text}</p>
          {/* 버튼 영역 */}
          <div className={`${buttonWidth} h-[60px]`} />
        </div>
      ) : (
        <p className={`${textClass} text-white`}>{text}</p>
      )}
      <div className="h-[2px] w-full bg-gray-100" />
    </div>
  );
}
