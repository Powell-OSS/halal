export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function priceLevelLabel(level: number): string {
  return "$".repeat(Math.min(Math.max(level, 1), 4));
}
