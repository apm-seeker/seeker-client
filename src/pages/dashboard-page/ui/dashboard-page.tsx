import { useState } from 'react'
import {
  TimeRangePicker,
  createPresetRange,
  type TimeRange,
} from '@/features/time-range-picker'

export function DashboardPage() {
  const [range, setRange] = useState<TimeRange>(() => createPresetRange('5m'))

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex">
        <TimeRangePicker
          value={range}
          onChange={setRange}
          className="shadow-lg shadow-black/40"
        />
      </div>
    </div>
  )
}
