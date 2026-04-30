import { mockTopology } from '@/entities/topology'
import { TopologyGraph } from '@/features/topology-graph'

export function TopologyPanel() {
  return (
    <section className="relative mx-auto h-[62vh] min-h-[460px] max-h-[760px] w-full max-w-[1240px] overflow-hidden rounded-lg border border-border/60 bg-card/60 p-4 sm:p-6">
      <TopologyGraph data={mockTopology} />
    </section>
  )
}
