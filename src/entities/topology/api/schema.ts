import { z } from 'zod'
import type { EdgeData, NodeData, TopologyData } from '../model/types'

export const nodeSchema: z.ZodType<NodeData> = z.object({
  agentId: z.string(),
  agentName: z.string(),
  agentType: z.string(),
  errorRate: z.number(),
})

export const edgeSchema: z.ZodType<EdgeData> = z.object({
  fromAgentId: z.string(),
  toAgentId: z.string(),
  tps: z.number(),
  avgLatency: z.number(),
  errorRate: z.number(),
})

export const topologySchema: z.ZodType<TopologyData> = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})
