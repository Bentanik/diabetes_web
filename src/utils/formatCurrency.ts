export const formatCurrency = (
  amount: number,
  locale: string = "vi-VN",
  currency: string = "VND"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};
