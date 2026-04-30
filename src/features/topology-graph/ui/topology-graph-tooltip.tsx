import type { EdgeData, NodeData } from '@/entities/topology'
import { cn } from '@/shared/lib'

interface BaseProps {
  x: number
  y: number
}

function ErrorRateRow({ errorRate }: { errorRate: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'inline-block size-2 rounded-full',
          errorRate > 0 ? 'bg-destructive' : 'bg-success',
        )}
      />
      <span className="text-muted-foreground">에러율</span>
      <span className="ml-auto font-mono">{(errorRate * 100).toFixed(2)}%</span>
    </div>
  )
}

export function NodeTooltip({ node, x, y }: BaseProps & { node: NodeData }) {
  return (
    <TooltipShell x={x} y={y}>
      <div className="font-medium text-popover-foreground">{node.agentName}</div>
      <div className="text-[11px] text-muted-foreground">{node.agentType}</div>
      <div className="mt-1 border-t border-border pt-1">
        <ErrorRateRow errorRate={node.errorRate} />
      </div>
    </TooltipShell>
  )
}

export function EdgeTooltip({
  edge,
  fromName,
  toName,
  x,
  y,
}: BaseProps & { edge: EdgeData; fromName: string; toName: string }) {
  return (
    <TooltipShell x={x} y={y}>
      <div className="text-popover-foreground">
        <span className="font-medium">{fromName}</span>
        <span className="mx-1.5 text-muted-foreground">→</span>
        <span className="font-medium">{toName}</span>
      </div>
      <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 border-t border-border pt-1 text-[11px]">
        <span className="text-muted-foreground">TPS</span>
        <span className="font-mono">{edge.tps.toLocaleString('en-US')}</span>
        <span className="text-muted-foreground">평균 지연</span>
        <span className="font-mono">{edge.avgLatency.toFixed(1)}ms</span>
      </div>
      <div className="mt-1 border-t border-border pt-1 text-[11px]">
        <ErrorRateRow errorRate={edge.errorRate} />
      </div>
    </TooltipShell>
  )
}

function TooltipShell({ x, y, children }: BaseProps & { children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[180px] rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg"
      style={{ left: x, top: y, transform: 'translate(12px, 12px)' }}
    >
      {children}
    </div>
  )
}
