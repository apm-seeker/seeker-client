import { Activity, AlertCircle, AlertTriangle, Timer } from 'lucide-react'
import { mockTopology, USER_AGENT_ID, useTopologySelection } from '@/entities/topology'
import {
  MetricCard,
  formatCount,
  formatMs,
  formatPercent,
  mockMetricsByAgent,
} from '@/entities/server-metric'

export function MetricPanel() {
  const selectedAgentId = useTopologySelection((s) => s.selectedAgentId)
  const agent = mockTopology.nodes.find((n) => n.agentId === selectedAgentId)
  const metric = mockMetricsByAgent[selectedAgentId] ?? mockMetricsByAgent[USER_AGENT_ID]

  const errorCountTone = metric.errorCount > 0 ? 'destructive' : 'default'

  return (
    <section className="mx-auto w-full max-w-[1240px] space-y-3">
      <h2 className="px-1 text-sm font-semibold tracking-wide text-foreground">
        {agent?.agentName ?? 'USER'}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="Total Count"
          value={formatCount(metric.totalCount)}
          icon={Activity}
        />
        <MetricCard
          label="Error Count"
          value={formatCount(metric.errorCount)}
          icon={AlertTriangle}
          tone={errorCountTone}
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
    </section>
  )
}
