import { useId } from 'react'
import type { EdgeData } from '../model/types'
import { cn } from '@/shared/lib'
import { NODE_SIZE } from './topology-node'

export interface TopologyEdgeProps {
  edge: EdgeData
  fromX: number
  fromY: number
  toX: number
  toY: number
  /** Stroke width in user-space units; bigger = relatively higher TPS share. */
  strokeWidth?: number
  hovered?: boolean
  onPointerEnter?: (e: React.PointerEvent<SVGGElement>) => void
  onPointerLeave?: (e: React.PointerEvent<SVGGElement>) => void
}

const NODE_PADDING = NODE_SIZE / 2 + 4

function trim(fromX: number, fromY: number, toX: number, toY: number, padding: number) {
  const dx = toX - fromX
  const dy = toY - fromY
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  return {
    x1: fromX + ux * padding,
    y1: fromY + uy * padding,
    x2: toX - ux * padding,
    y2: toY - uy * padding,
  }
}

interface ArrowSize {
  length: number
  width: number
}

/**
 * Build a single closed polygon for the entire edge (shaft + arrow head) so
 * line and arrow render as one shape with no visible seam.
 */
function buildEdgePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness: number,
  arrow: ArrowSize,
): string {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len === 0) return ''
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux
  const half = thickness / 2

  // Reserve a min body length so the arrow has a visible shaft before the
  // head. If the segment is too short, scale the head proportionally.
  const minBody = Math.max(thickness * 2, 4)
  const headLen = Math.max(0, Math.min(arrow.length, len - minBody))
  const headScale = arrow.length > 0 ? headLen / arrow.length : 0
  const halfHead = headLen > 0 ? Math.max((arrow.width / 2) * headScale, half) : half
  const baseX = x2 - ux * headLen
  const baseY = y2 - uy * headLen

  return [
    `M ${x1 + px * half} ${y1 + py * half}`,
    `L ${baseX + px * half} ${baseY + py * half}`,
    `L ${baseX + px * halfHead} ${baseY + py * halfHead}`,
    `L ${x2} ${y2}`,
    `L ${baseX - px * halfHead} ${baseY - py * halfHead}`,
    `L ${baseX - px * half} ${baseY - py * half}`,
    `L ${x1 - px * half} ${y1 - py * half}`,
    'Z',
  ].join(' ')
}

const tpsFormatter = new Intl.NumberFormat('en-US')

export function TopologyEdge({
  edge,
  fromX,
  fromY,
  toX,
  toY,
  strokeWidth: strokeWidthProp,
  hovered,
  onPointerEnter,
  onPointerLeave,
}: TopologyEdgeProps) {
  const errorRate = Math.max(0, Math.min(1, edge.errorRate))
  const okT = 1 - errorRate
  const { x1, y1, x2, y2 } = trim(fromX, fromY, toX, toY, NODE_PADDING)

  const baseStroke = strokeWidthProp ?? 1.5
  const thickness = hovered ? baseStroke + 1 : baseStroke
  const arrow: ArrowSize = {
    length: Math.min(Math.max(thickness * 3, 12), 18),
    width: Math.min(Math.max(thickness * 2, 8), 14),
  }

  const path = buildEdgePath(x1, y1, x2, y2, thickness, arrow)
  const gradId = `topology-edge-grad-${useId().replace(/[:]/g, '_')}`

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const labelLift = Math.max(10, baseStroke / 2 + 8)
  const labelDrop = Math.max(16, baseStroke / 2 + 14)

  return (
    <g
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="cursor-pointer"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="hsl(var(--success))" />
          <stop offset={okT} stopColor="hsl(var(--success))" />
          <stop offset={okT} stopColor="hsl(var(--destructive))" />
          <stop offset={1} stopColor="hsl(var(--destructive))" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill={`url(#${gradId})`}
        className={cn(hovered && 'opacity-95')}
      />
      {/* invisible hit area for easier hover */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="transparent"
        strokeWidth={Math.max(14, thickness + 8)}
      />
      <text
        x={midX}
        y={midY - labelLift}
        textAnchor="middle"
        className="pointer-events-none fill-foreground font-mono text-[10px]"
      >
        {tpsFormatter.format(Math.round(edge.tps))}
      </text>
      <text
        x={midX}
        y={midY + labelDrop}
        textAnchor="middle"
        className="pointer-events-none fill-muted-foreground/80 font-mono text-[9px]"
      >
        {edge.avgLatency.toFixed(1)}ms
      </text>
    </g>
  )
}
