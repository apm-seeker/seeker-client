export type AgentIdValue = string

export const USER_AGENT_ID: AgentIdValue = '-1'

export interface NodeData {
  agentId: AgentIdValue
  agentName: string
  agentType: string
  errorRate: number
}

export interface EdgeData {
  fromAgentId: AgentIdValue
  toAgentId: AgentIdValue
  tps: number
  avgLatency: number
  errorRate: number
}

export interface TopologyData {
  nodes: NodeData[]
  edges: EdgeData[]
}
