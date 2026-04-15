export const formatNetWorth = (value: string): string => {
  const negative = value.startsWith("-");
  const stripped = negative ? value.slice(1) : value;
  const [integerPart, decimalPart] = stripped.split(",");
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const prefix = negative ? "-" : "";
  if (decimalPart === undefined) return `€ ${prefix}${formatted}`;
  return `€ ${prefix}${formatted},${decimalPart}`;
};
