import { Activity, AlertCircle, AlertTriangle, Timer } from 'lucide-react'
import { useTopology, useTopologySelection } from '@/entities/topology'
import {
  MetricCard,
  formatCount,
  formatMs,
  formatPercent,
  useServerMetric,
} from '@/entities/server-metric'
import type { TimeRange } from '@/features/time-range-picker'
import { toEpochMs } from '@/shared/lib'

export interface MetricPanelProps {
  range: TimeRange
}

export function MetricPanel({ range }: MetricPanelProps) {
  const startTime = toEpochMs(range.from)
  const endTime = toEpochMs(range.to)
  const selectedAgentId = useTopologySelection((s) => s.selectedAgentId)

  const { data: topology } = useTopology({ startTime, endTime })
  const agentName =
    topology?.nodes.find((n) => n.agentId === selectedAgentId)?.agentName ?? selectedAgentId

  const {
    data: metric,
    isPending,
    isError,
    error,
  } = useServerMetric({ startTime, endTime, agentId: selectedAgentId })

  return (
    <section className="mx-auto w-full max-w-[1240px] space-y-3">
      <h2 className="px-1 text-sm font-semibold tracking-wide text-foreground">{agentName}</h2>

      {isPending && (
        <div className="flex h-[112px] items-center justify-center text-sm text-muted-foreground">
          Loading metrics…
        </div>
      )}

      {isError && (
        <div className="flex h-[112px] items-center justify-center text-sm text-destructive">
          Failed to load metrics: {error.message}
        </div>
      )}

      {metric && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Count" value={formatCount(metric.totalCount)} icon={Activity} />
          <MetricCard
            label="Error Count"
            value={formatCount(metric.errorCount)}
            icon={AlertTriangle}
            tone={metric.errorCount > 0 ? 'destructive' : 'default'}
          />
          <MetricCard
            label="Error Rate"
            value={formatPercent(metric.errorRate)}
            unit="%"
            icon={AlertCircle}
            tone="destructive"
          />
          <MetricCard label="P99" value={formatMs(metric.p99)} unit="ms" icon={Timer} />
          <MetricCard label="P95" value={formatMs(metric.p95)} unit="ms" icon={Timer} />
          <MetricCard label="P90" value={formatMs(metric.p90)} unit="ms" icon={Timer} />
        </div>
      )}
    </section>
  )
}
