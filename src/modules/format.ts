// Подписи полей по теме: 100000 → «100 Гбит/с», 980000 → «980 000 ₽»
export const formatBandwidth = (mbps: number): string =>
  mbps >= 1000 ? `${mbps / 1000} Гбит/с` : `${mbps} Мбит/с`;

export const formatCost = (rub: number): string =>
  `${rub.toLocaleString("ru-RU")} ₽`;
