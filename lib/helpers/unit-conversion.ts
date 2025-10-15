export function litersToMl(liters: number): number {
  return Math.round(liters * 1000);
}

export function mlToLiters(ml: number): number {
  return ml / 1000;
}

/**
 * Normalize a quantity to liters from an input that may be in liters or ml.
 * @param value numeric value provided by user
 * @param unit "L" or "ML"
 */
export function normalizeToLiters(value: number, unit: "L" | "ML"): number {
  return unit === "L" ? value : mlToLiters(value);
}

/**
 * Price = quantity_in_liters * price_per_liter
 */
export function computePrice(
  quantityLiters: number,
  pricePerLiter: number
): number {
  return +(quantityLiters * pricePerLiter).toFixed(2);
}
