export type PresetKey =
  | '5m'
  | '20m'
  | '1h'
  | '3h'
  | '6h'
  | '12h'
  | '1d'
  | '2d'
  | '7d'

export type TimeRange = {
  from: Date
  to: Date
  preset?: PresetKey
}
