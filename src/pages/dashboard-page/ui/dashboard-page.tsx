import { useState } from 'react'
import {
  TimeRangePicker,
  createPresetRange,
  type TimeRange,
} from '@/features/time-range-picker'
import { TopologyPanel } from '@/widgets/topology-panel'
import { MetricPanel } from '@/widgets/metric-panel'

export function DashboardPage() {
  const [range, setRange] = useState<TimeRange>(() => createPresetRange('5m'))

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 flex">
        <TimeRangePicker
          value={range}
          onChange={setRange}
          className="shadow-lg"
        />
      </div>
      <TopologyPanel range={range} />
      <MetricPanel />
    </div>
  )
}
