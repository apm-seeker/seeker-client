import { useId, useMemo, useRef, useState } from 'react'
import { ParentSize } from '@visx/responsive'
import type { TopologyData, AgentIdValue, NodeData } from '@/entities/topology'
import { TopologyEdge, TopologyNode } from '@/entities/topology'
import { cn } from '@/shared/lib'
import { layeredLayout } from '../lib/layered-layout'
import { useZoomPan } from '../model/use-zoom-pan'
import { EdgeTooltip, NodeTooltip } from './topology-graph-tooltip'
import { TopologyMinimap } from './topology-minimap'

export interface TopologyGraphProps {
  data: TopologyData
  className?: string
}

export function TopologyGraph({ data, className }: TopologyGraphProps) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <ParentSize debounceTime={50}>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <TopologyGraphCanvas data={data} containerWidth={width} containerHeight={height} />
          ) : null
        }
      </ParentSize>
    </div>
  )
}

type HoverTarget =
  | { kind: 'node'; agentId: AgentIdValue }
  | { kind: 'edge'; from: AgentIdValue; to: AgentIdValue }
  | null

interface TooltipPos {
  x: number
  y: number
}

const EDGE_MIN_STROKE = 1.5
const EDGE_MAX_STROKE = 7

function edgeStrokeFromShare(tps: number, totalTps: number): number {
  if (totalTps <= 0) return EDGE_MIN_STROKE
  const ratio = Math.max(0, Math.min(1, tps / totalTps))
  return EDGE_MIN_STROKE + ratio * (EDGE_MAX_STROKE - EDGE_MIN_STROKE)
}

function TopologyGraphCanvas({
  data,
  containerWidth,
  containerHeight,
}: {
  data: TopologyData
  containerWidth: number
  containerHeight: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const idBase = useId().replace(/[:]/g, '_')
  const clipId = `topology-clip-${idBase}`
  const [hover, setHover] = useState<HoverTarget>(null)
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null)
  const [selected, setSelected] = useState<AgentIdValue | null>(null)

  const {
    positions,
    width: worldWidth,
    height: worldHeight,
  } = useMemo(() => layeredLayout(data.nodes, data.edges), [data.nodes, data.edges])

  const totalTps = useMemo(
    () => data.edges.reduce((sum, e) => sum + Math.max(0, e.tps), 0),
    [data.edges],
  )

  const { state, bind, navigateTo, consumeRecentDrag } = useZoomPan(
    { width: containerWidth, height: containerHeight },
    { width: worldWidth, height: worldHeight },
  )

  const nodeById = useMemo(() => {
    const map = new Map<AgentIdValue, NodeData>()
    for (const n of data.nodes) map.set(n.agentId, n)
    return map
  }, [data.nodes])

  const updateTooltipPos = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltipPos({ x: clientX - rect.left, y: clientY - rect.top })
  }

  const onNodeClick = (agentId: AgentIdValue) => {
    if (consumeRecentDrag()) return
    setSelected((prev) => (prev === agentId ? null : agentId))
  }

  const hoveredNode = hover?.kind === 'node' ? (nodeById.get(hover.agentId) ?? null) : null
  const hoveredEdge =
    hover?.kind === 'edge'
      ? (data.edges.find((e) => e.fromAgentId === hover.from && e.toAgentId === hover.to) ??
        null)
      : null

  return (
    <div ref={containerRef} className="absolute inset-0">
      <svg
        ref={bind.ref}
        width={containerWidth}
        height={containerHeight}
        onPointerDown={bind.onPointerDown}
        onPointerMove={bind.onPointerMove}
        onPointerUp={bind.onPointerUp}
        onPointerLeave={() => {
          setHover(null)
          setTooltipPos(null)
        }}
        className="block touch-none cursor-grab select-none active:cursor-grabbing"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={containerWidth} height={containerHeight} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <g transform={`translate(${state.x},${state.y}) scale(${state.k})`}>
            {data.edges.map((e) => {
              const from = positions.get(e.fromAgentId)
              const to = positions.get(e.toAgentId)
              if (!from || !to) return null
              const isHovered =
                hover?.kind === 'edge' &&
                hover.from === e.fromAgentId &&
                hover.to === e.toAgentId
              return (
                <TopologyEdge
                  key={`${e.fromAgentId}->${e.toAgentId}`}
                  edge={e}
                  fromX={from.x}
                  fromY={from.y}
                  toX={to.x}
                  toY={to.y}
                  strokeWidth={edgeStrokeFromShare(e.tps, totalTps)}
                  hovered={isHovered}
                  onPointerEnter={(event) => {
                    setHover({ kind: 'edge', from: e.fromAgentId, to: e.toAgentId })
                    updateTooltipPos(event.clientX, event.clientY)
                  }}
                  onPointerLeave={() => {
                    setHover(null)
                    setTooltipPos(null)
                  }}
                />
              )
            })}
            {data.nodes.map((n) => {
              const p = positions.get(n.agentId)
              if (!p) return null
              const isHovered = hover?.kind === 'node' && hover.agentId === n.agentId
              return (
                <TopologyNode
                  key={n.agentId}
                  node={n}
                  x={p.x}
                  y={p.y}
                  hovered={isHovered}
                  selected={selected === n.agentId}
                  onPointerEnter={(event) => {
                    setHover({ kind: 'node', agentId: n.agentId })
                    updateTooltipPos(event.clientX, event.clientY)
                  }}
                  onPointerLeave={() => {
                    setHover(null)
                    setTooltipPos(null)
                  }}
                  onClick={() => onNodeClick(n.agentId)}
                />
              )
            })}
          </g>
        </g>
      </svg>

      {tooltipPos && hoveredNode && (
        <NodeTooltip node={hoveredNode} x={tooltipPos.x} y={tooltipPos.y} />
      )}
      {tooltipPos && hoveredEdge && (
        <EdgeTooltip
          edge={hoveredEdge}
          fromName={nodeById.get(hoveredEdge.fromAgentId)?.agentName ?? hoveredEdge.fromAgentId}
          toName={nodeById.get(hoveredEdge.toAgentId)?.agentName ?? hoveredEdge.toAgentId}
          x={tooltipPos.x}
          y={tooltipPos.y}
        />
      )}

      <TopologyMinimap
        nodes={data.nodes}
        edges={data.edges}
        positions={positions}
        graphWidth={worldWidth}
        graphHeight={worldHeight}
        viewport={{
          x: -state.x / state.k,
          y: -state.y / state.k,
          width: containerWidth / state.k,
          height: containerHeight / state.k,
        }}
        onNavigate={navigateTo}
        className="absolute bottom-4 right-4 hidden sm:block"
      />
    </div>
  )
}
