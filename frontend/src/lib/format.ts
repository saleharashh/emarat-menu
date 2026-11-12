export function formatToman(price: number): string {
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("fa-IR");
}
