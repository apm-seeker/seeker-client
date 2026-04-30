import type { TopologyData } from './types'
import { USER_AGENT_ID } from './types'

export const mockTopology: TopologyData = {
  nodes: [
    { agentId: USER_AGENT_ID, agentName: 'USER', agentType: 'USER', errorRate: 0 },
    { agentId: 'gateway-1', agentName: 'API-GATEWAY', agentType: 'GATEWAY', errorRate: 0.002 },
    { agentId: 'order-1', agentName: 'ORDER-SERVICE', agentType: 'TOMCAT', errorRate: 0.012 },
    { agentId: 'product-1', agentName: 'PRODUCT-SERVICE', agentType: 'TOMCAT', errorRate: 0 },
    { agentId: 'payment-1', agentName: 'PAYMENT-SERVICE', agentType: 'TOMCAT', errorRate: 0.072 },
    { agentId: 'order-db', agentName: 'ORDER-DB', agentType: 'MYSQL', errorRate: 0 },
    { agentId: 'product-db', agentName: 'PRODUCT-DB', agentType: 'MYSQL', errorRate: 0 },
  ],
  edges: [
    { fromAgentId: USER_AGENT_ID, toAgentId: 'gateway-1', tps: 1138, avgLatency: 42, errorRate: 0.002 },
    { fromAgentId: 'gateway-1', toAgentId: 'order-1', tps: 612, avgLatency: 58, errorRate: 0.012 },
    { fromAgentId: 'gateway-1', toAgentId: 'product-1', tps: 526, avgLatency: 31, errorRate: 0 },
    { fromAgentId: 'order-1', toAgentId: 'payment-1', tps: 244, avgLatency: 128, errorRate: 0.072 },
    { fromAgentId: 'order-1', toAgentId: 'order-db', tps: 1928, avgLatency: 9, errorRate: 0 },
    { fromAgentId: 'product-1', toAgentId: 'product-db', tps: 1252, avgLatency: 7, errorRate: 0 },
  ],
}
