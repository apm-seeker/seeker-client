import { useCallback, useRef } from 'react'
import type { EdgeData, NodeData, AgentIdValue } from '@/entities/topology'
import { cn } from '@/shared/lib'
import type { NodePosition } from '../lib/layered-layout'

const MINIMAP_WIDTH = 168
const MINIMAP_HEIGHT = 104
const MINIMAP_PADDING = 8

export interface ViewportRect {
  x: number
  y: number
  width: number
  height: number
}

export interface TopologyMinimapProps {
  nodes: NodeData[]
  edges: EdgeData[]
  positions: Map<AgentIdValue, NodePosition>
  graphWidth: number
  graphHeight: number
  viewport: ViewportRect
  onNavigate: (worldX: number, worldY: number) => void
  className?: string
}

export function TopologyMinimap({
  nodes,
  edges,
  positions,
  graphWidth,
  graphHeight,
  viewport,
  onNavigate,
  className,
}: TopologyMinimapProps) {
  const innerW = MINIMAP_WIDTH - MINIMAP_PADDING * 2
  const innerH = MINIMAP_HEIGHT - MINIMAP_PADDING * 2
  const safeW = graphWidth || 1
  const safeH = graphHeight || 1
  const scale = Math.min(innerW / safeW, innerH / safeH)
  const offsetX = MINIMAP_PADDING + (innerW - safeW * scale) / 2
  const offsetY = MINIMAP_PADDING + (innerH - safeH * scale) / 2

  const tx = (x: number) => offsetX + x * scale
  const ty = (y: number) => offsetY + y * scale

  const svgRef = useRef<SVGSVGElement>(null)
  const isDownRef = useRef(false)

  const navigateFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = svgRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const localX = clientX - rect.left
      const localY = clientY - rect.top
      const worldX = (localX - offsetX) / scale
      const worldY = (localY - offsetY) / scale
      onNavigate(worldX, worldY)
    },
    [offsetX, offsetY, scale, onNavigate],
  )

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return
    isDownRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    navigateFromEvent(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDownRef.current) return
    navigateFromEvent(e.clientX, e.clientY)
  }
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    isDownRef.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const vpLeft = tx(Math.max(0, viewport.x))
  const vpTop = ty(Math.max(0, viewport.y))
  const vpRight = tx(Math.min(graphWidth, viewport.x + viewport.width))
  const vpBottom = ty(Math.min(graphHeight, viewport.y + viewport.height))
  const vpW = Math.max(0, vpRight - vpLeft)
  const vpH = Math.max(0, vpBottom - vpTop)

  return (
    <div
      className={cn(
        'rounded-md border border-border bg-card/85 backdrop-blur-sm',
        className,
      )}
      style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
    >
      <svg
        ref={svgRef}
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="block cursor-pointer touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {edges.map((e) => {
          const from = positions.get(e.fromAgentId)
          const to = positions.get(e.toAgentId)
          if (!from || !to) return null
          return (
            <line
              key={`${e.fromAgentId}->${e.toAgentId}`}
              x1={tx(from.x)}
              y1={ty(from.y)}
              x2={tx(to.x)}
              y2={ty(to.y)}
              className="pointer-events-none stroke-border"
              strokeWidth={0.75}
            />
          )
        })}
        {nodes.map((n) => {
          const p = positions.get(n.agentId)
          if (!p) return null
          return (
            <circle
              key={n.agentId}
              cx={tx(p.x)}
              cy={ty(p.y)}
              r={2.5}
              className={cn(
                'pointer-events-none',
                n.errorRate > 0 ? 'fill-destructive' : 'fill-success',
              )}
            />
          )
        })}
        <rect
          x={vpLeft}
          y={vpTop}
          width={vpW}
          height={vpH}
          className="pointer-events-none fill-primary/15 stroke-primary/80"
          strokeWidth={1}
          rx={2}
          ry={2}
        />
      </svg>
    </div>
  )
}
