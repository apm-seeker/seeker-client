import type { NodeData } from '../model/types'
import { iconForAgentType } from '../lib/agent-icon'
import { cn } from '@/shared/lib'

export const NODE_SIZE = 56
export const NODE_LABEL_OFFSET = 14

const RING_RADIUS = 24
const RING_WIDTH = 3
const INNER_RADIUS = 22
const ICON_SIZE = 26
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export interface TopologyNodeProps {
  node: NodeData
  x: number
  y: number
  selected?: boolean
  hovered?: boolean
  onPointerEnter?: (e: React.PointerEvent<SVGGElement>) => void
  onPointerLeave?: (e: React.PointerEvent<SVGGElement>) => void
  onClick?: (e: React.MouseEvent<SVGGElement>) => void
}

export function TopologyNode({
  node,
  x,
  y,
  selected,
  hovered,
  onPointerEnter,
  onPointerLeave,
  onClick,
}: TopologyNodeProps) {
  const errorRate = Math.max(0, Math.min(1, node.errorRate))
  const errorArcLength = RING_CIRCUMFERENCE * errorRate

  const cx = NODE_SIZE / 2
  const cy = NODE_SIZE / 2

  return (
    <g
      transform={`translate(${x - cx}, ${y - cy})`}
      className="cursor-pointer"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      {/* inner backplate */}
      <circle
        cx={cx}
        cy={cy}
        r={INNER_RADIUS}
        className={cn('fill-card', selected ? 'stroke-primary' : 'stroke-border')}
        strokeWidth={selected ? 2 : hovered ? 1.5 : 1}
      />
      {/* full success ring */}
      <circle
        cx={cx}
        cy={cy}
        r={RING_RADIUS}
        fill="none"
        className="stroke-success"
        strokeWidth={RING_WIDTH}
      />
      {/* error arc overlay (starts at 12 o'clock, grows clockwise) */}
      {errorArcLength > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={RING_RADIUS}
          fill="none"
          className="stroke-destructive"
          strokeWidth={RING_WIDTH}
          strokeDasharray={`${errorArcLength} ${RING_CIRCUMFERENCE - errorArcLength}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
      <image
        href={iconForAgentType(node.agentType)}
        x={cx - ICON_SIZE / 2}
        y={cy - ICON_SIZE / 2}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
      <text
        x={cx}
        y={NODE_SIZE + NODE_LABEL_OFFSET}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[11px] uppercase tracking-wider"
      >
        {node.agentName}
      </text>
    </g>
  )
}
