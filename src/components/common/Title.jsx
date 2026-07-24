import clsx from "clsx";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

const TITLE_CONFIG = {
  title_button: {
    textClass: "text-baskin-48-regular pc:text-baskin-62-regular",
    button: "primary",
  },
  title_line: {
    textClass: "text-baskin-48 pc:text-baskin-62",
    button: null,
  },
  title_line_modal: {
    textClass: "text-baskin-40 pc:text-baskin-46",
    button: null,
  },
  card_detail: {
    textClass:
      "text-noto-24-bold tablet:text-noto-32-bold pc:text-noto-40-bold",
    button: null,
  },
  exchange_buyer: {
    textClass:
      "text-noto-24-bold tablet:text-noto-32-bold pc:text-noto-40-bold",
    button: "primary",
  },
  exchange_seller: {
    textClass: "text-noto-40-bold",
    button: "secondary",
  },
  exchange_info_modal: {
    textClass: "text-noto-22-bold pc:text-noto-28-bold",
    button: null,
  },
};

export default function Title({
  type = "title_button",
  text,
  buttonText,
  onButtonClick,
  className = "",
}) {
  const config = TITLE_CONFIG[type];

  if (!config) {
    console.warn(`Title: 지원하지 않는 type입니다. (type: ${type})`);
    return null;
  }

  const { textClass, button } = config;

  return (
    <div className={clsx("flex w-full flex-col gap-5", className)}>
      {button ? (
        <div className="flex w-full flex-col tablet:flex-row tablet:items-center tablet:justify-between">
          <p className={clsx(textClass, "text-white")}>{text}</p>
          <div className="hidden tablet:block">
            {button === "primary" ? (
              <ButtonPrimary
                className="w-[342px] h-15 text-noto-16-bold pc:w-[440px] pc:text-noto-18-bold"
                onClick={onButtonClick}
              >
                {buttonText}
              </ButtonPrimary>
            ) : (
              <ButtonSecondary variant="thick" onClick={onButtonClick}>
                {buttonText}
              </ButtonSecondary>
            )}
          </div>
        </div>
      ) : (
        <p className={clsx(textClass, "text-white")}>{text}</p>
      )}
      <div className="h-[2px] w-full bg-gray-100 mt-5" />
    </div>
  );
}
