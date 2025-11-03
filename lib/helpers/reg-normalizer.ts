/**
 * Normalizes a vehicle registration string to a consistent format.
 * - Uppercases letters
 * - Removes spaces and hyphens
 * - Keeps alphanumeric only
 */
export function normalizeReg(raw: string): string {
  return (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "")
}

/**
 * Formats normalized reg to ABC-1234 if pattern matches.
 * If not matched, returns the normalized reg as-is.
 */
export function formatRegPretty(normalized: string): string {
  // Try common patterns like ABC123 or ABC1234
  const m = normalized.match(/^([A-Z]{2,3})(\d{3,4})$/)
  if (m) return `${m[1]}-${m[2]}`
  return normalized
}

/**
 * Normal flow: formatReg(normalizeReg(input))
 */
export function formatReg(raw: string): string {
  return formatRegPretty(normalizeReg(raw))
}
