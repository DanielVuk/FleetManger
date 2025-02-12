export const formatCurrency = (amount, currencyCode = "EUR") => {
  return amount?.toLocaleString("de-DE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  });
};
