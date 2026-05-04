/** Convert a Date to UTC epoch milliseconds — the format all backend time fields expect. */
export function toEpochMs(date: Date): number {
  return date.getTime()
}
