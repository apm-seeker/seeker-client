import type { AgentIdValue } from '@/entities/topology'
import { USER_AGENT_ID } from '@/entities/topology'
import type { ServerMetric } from './types'

export const mockMetricsByAgent: Record<AgentIdValue, ServerMetric> = {
  [USER_AGENT_ID]: {
    totalCount: 50_000,
    errorCount: 11,
    errorRate: 0.00022,
    p99: 142,
    p95: 98,
    p90: 76,
  },
  'gateway-1': {
    totalCount: 48_300,
    errorCount: 96,
    errorRate: 0.002,
    p99: 118,
    p95: 84,
    p90: 62,
  },
  'order-1': {
    totalCount: 21_400,
    errorCount: 257,
    errorRate: 0.012,
    p99: 187,
    p95: 121,
    p90: 94,
  },
  'product-1': {
    totalCount: 18_900,
    errorCount: 0,
    errorRate: 0,
    p99: 71,
    p95: 48,
    p90: 36,
  },
  'payment-1': {
    totalCount: 9_800,
    errorCount: 706,
    errorRate: 0.072,
    p99: 412,
    p95: 268,
    p90: 198,
  },
  'order-db': {
    totalCount: 67_500,
    errorCount: 0,
    errorRate: 0,
    p99: 22,
    p95: 14,
    p90: 9,
  },
  'product-db': {
    totalCount: 43_800,
    errorCount: 0,
    errorRate: 0,
    p99: 18,
    p95: 11,
    p90: 7,
  },
}
