export const getAlarmMessageText = (alarm) => {
  if (!alarm) return "";
  const { type, buyerNickname, cardGrade, cardName, quantity } = alarm;

  switch (type) {
    case "BUY":
      return `${buyerNickname}님이 [${cardGrade} | ${cardName}]을 ${quantity}장 구매했습니다.`;
    case "EXCHANGE":
      return `${buyerNickname}님이 [${cardGrade} | ${cardName}]의 포토카드 교환을 제안했습니다.`;
    case "SOLD_OUT":
      return `[${cardGrade} | ${cardName}]이 품절되었습니다.`;
    default:
      return "새로운 알림이 도착했습니다.";
  }
};
