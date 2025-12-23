export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export const formatPriceWithUnit = (price: number): string => {
  return `${formatPrice(price)} تومان`;
};
