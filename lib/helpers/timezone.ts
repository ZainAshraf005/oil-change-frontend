export const DEFAULT_TZ = "Asia/Karachi"

// Format date/time in PK timezone with Intl API
export function formatInTZ(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
  locale = "en-PK",
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    timeZone: DEFAULT_TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...opts,
  }).format(d)
}
