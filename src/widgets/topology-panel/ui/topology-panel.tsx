import { useTopology } from '@/entities/topology'
import { TopologyGraph } from '@/features/topology-graph'
import type { TimeRange } from '@/features/time-range-picker'
import { toEpochMs } from '@/shared/lib'

export interface TopologyPanelProps {
  range: TimeRange
}

export function TopologyPanel({ range }: TopologyPanelProps) {
  const { data, isPending, isError, error } = useTopology({
    startTime: toEpochMs(range.from),
    endTime: toEpochMs(range.to),
  })

  return (
    <section className="relative mx-auto h-[48vh] min-h-[320px] max-h-[560px] w-full max-w-[1240px] overflow-hidden rounded-lg border border-border/60 bg-card/60 p-4 sm:p-6">
      {isPending && (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          Loading topology…
        </div>
      )}
      {isError && (
        <div className="flex h-full w-full items-center justify-center text-sm text-destructive">
          Failed to load topology: {error.message}
        </div>
      )}
      {data && <TopologyGraph data={data} />}
    </section>
  )
}
