export function formatMs(value: number): string {
  return Math.round(value).toLocaleString()
}

export function formatPercent(value: number, fractionDigits = 2): string {
  return (value * 100).toFixed(fractionDigits)
}

export function formatCount(value: number): string {
  return Math.round(value).toLocaleString()
}
