export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
export const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
