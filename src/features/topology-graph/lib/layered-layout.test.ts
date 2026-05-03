import { describe, expect, it } from 'vitest'
import type { EdgeData, NodeData } from '@/entities/topology'
import { layeredLayout } from './layered-layout'

const node = (agentId: string): NodeData => ({
  agentId,
  agentName: agentId,
  agentType: 'TOMCAT',
  errorRate: 0,
})

const edge = (from: string, to: string): EdgeData => ({
  fromAgentId: from,
  toAgentId: to,
  tps: 1,
  avgLatency: 1,
  errorRate: 0,
})

describe('layeredLayout', () => {
  it('places linear chain on consecutive layers', () => {
    const { positions } = layeredLayout(
      [node('A'), node('B'), node('C')],
      [edge('A', 'B'), edge('B', 'C')],
    )
    expect(positions.get('A')?.layer).toBe(0)
    expect(positions.get('B')?.layer).toBe(1)
    expect(positions.get('C')?.layer).toBe(2)
  })

  it('uses max of predecessor layers when paths converge', () => {
    // A → B → D, A → D : D should land on layer 2, not 1.
    const { positions } = layeredLayout(
      [node('A'), node('B'), node('D')],
      [edge('A', 'B'), edge('B', 'D'), edge('A', 'D')],
    )
    expect(positions.get('D')?.layer).toBe(2)
  })

  it('places isolated nodes on layer 0', () => {
    const { positions } = layeredLayout([node('A'), node('lonely')], [])
    expect(positions.get('A')?.layer).toBe(0)
    expect(positions.get('lonely')?.layer).toBe(0)
  })

  it('tolerates cycles without infinite loop', () => {
    const { positions } = layeredLayout(
      [node('A'), node('B')],
      [edge('A', 'B'), edge('B', 'A')],
    )
    expect(positions.size).toBe(2)
  })

  it('returns zero-area layout for empty input', () => {
    const result = layeredLayout([], [])
    expect(result.positions.size).toBe(0)
    expect(result.layerCount).toBe(0)
  })
})
