import type { PresetKey, TimeRange } from './types'

type Preset = {
  key: PresetKey
  label: string
  durationMs: number
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const PRESETS: readonly Preset[] = [
  { key: '5m', label: '5m', durationMs: 5 * MINUTE },
  { key: '20m', label: '20m', durationMs: 20 * MINUTE },
  { key: '1h', label: '1h', durationMs: HOUR },
  { key: '3h', label: '3h', durationMs: 3 * HOUR },
  { key: '6h', label: '6h', durationMs: 6 * HOUR },
  { key: '12h', label: '12h', durationMs: 12 * HOUR },
  { key: '1d', label: '1d', durationMs: DAY },
  { key: '2d', label: '2d', durationMs: 2 * DAY },
  { key: '7d', label: '7d', durationMs: 7 * DAY },
]

export function createPresetRange(
  key: PresetKey,
  now: Date = new Date(),
): TimeRange {
  const preset = PRESETS.find((p) => p.key === key)
  if (!preset) throw new Error(`Unknown preset: ${key}`)
  return {
    from: new Date(now.getTime() - preset.durationMs),
    to: now,
    preset: key,
  }
}
