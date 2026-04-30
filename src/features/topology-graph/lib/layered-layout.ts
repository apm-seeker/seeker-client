import type { EdgeData, NodeData, AgentIdValue } from '@/entities/topology'

export interface LayoutOptions {
  horizontalGap: number
  verticalGap: number
  paddingX: number
  paddingY: number
}

export const DEFAULT_LAYOUT: LayoutOptions = {
  horizontalGap: 200,
  verticalGap: 140,
  paddingX: 110,
  paddingY: 90,
}

export interface NodePosition {
  x: number
  y: number
  layer: number
}

export interface LayoutResult {
  positions: Map<AgentIdValue, NodePosition>
  width: number
  height: number
  layerCount: number
}

/**
 * Layered DAG layout: BFS from sources, each node placed in
 * `max(predecessor.layer) + 1`. Cycles are tolerated by ignoring back-edges
 * (a node's layer is fixed on first assignment for that traversal).
 */
export function layeredLayout(
  nodes: NodeData[],
  edges: EdgeData[],
  options: LayoutOptions = DEFAULT_LAYOUT,
): LayoutResult {
  const positions = new Map<AgentIdValue, NodePosition>()
  if (nodes.length === 0) {
    return { positions, width: options.paddingX * 2, height: options.paddingY * 2, layerCount: 0 }
  }

  const nodeIds = new Set(nodes.map((n) => n.agentId))
  const incoming = new Map<AgentIdValue, AgentIdValue[]>()
  const outgoing = new Map<AgentIdValue, AgentIdValue[]>()
  for (const id of nodeIds) {
    incoming.set(id, [])
    outgoing.set(id, [])
  }
  for (const e of edges) {
    if (!nodeIds.has(e.fromAgentId) || !nodeIds.has(e.toAgentId)) continue
    if (e.fromAgentId === e.toAgentId) continue
    incoming.get(e.toAgentId)!.push(e.fromAgentId)
    outgoing.get(e.fromAgentId)!.push(e.toAgentId)
  }

  const layer = new Map<AgentIdValue, number>()
  const sources = nodes.filter((n) => incoming.get(n.agentId)!.length === 0).map((n) => n.agentId)

  // If there's no obvious source (fully cyclic graph), pick the first node.
  const seeds = sources.length > 0 ? sources : [nodes[0].agentId]
  const queue: AgentIdValue[] = []
  for (const s of seeds) {
    layer.set(s, 0)
    queue.push(s)
  }

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentLayer = layer.get(current)!
    for (const next of outgoing.get(current) ?? []) {
      const candidate = currentLayer + 1
      const existing = layer.get(next)
      if (existing === undefined || existing < candidate) {
        // guard against runaway cycles: clamp to nodes.length
        if (candidate > nodes.length) continue
        layer.set(next, candidate)
        queue.push(next)
      }
    }
  }

  // Any node still unvisited (disconnected) → layer 0.
  for (const n of nodes) {
    if (!layer.has(n.agentId)) layer.set(n.agentId, 0)
  }

  // Group by layer (preserve original input order within each layer).
  const layers: AgentIdValue[][] = []
  for (const n of nodes) {
    const l = layer.get(n.agentId)!
    if (!layers[l]) layers[l] = []
    layers[l].push(n.agentId)
  }

  const layerCount = layers.length
  const maxLayerSize = layers.reduce((max, arr) => Math.max(max, arr?.length ?? 0), 0)

  for (let l = 0; l < layers.length; l++) {
    const ids = layers[l] ?? []
    const count = ids.length
    for (let i = 0; i < count; i++) {
      const x = options.paddingX + l * options.horizontalGap
      const y =
        options.paddingY +
        ((maxLayerSize - 1) / 2) * options.verticalGap +
        (i - (count - 1) / 2) * options.verticalGap
      positions.set(ids[i], { x, y, layer: l })
    }
  }

  const width = options.paddingX * 2 + Math.max(0, layerCount - 1) * options.horizontalGap
  const height = options.paddingY * 2 + Math.max(0, maxLayerSize - 1) * options.verticalGap
  return { positions, width, height, layerCount }
}
