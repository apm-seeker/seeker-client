import { useQuery } from '@tanstack/react-query'
import type { AgentIdValue } from '@/entities/topology'
import { request } from '@/shared/api'
import { serverMetricSchema } from './schema'

export interface UseServerMetricParams {
  startTime: number
  endTime: number
  agentId: AgentIdValue
}

export function useServerMetric({ startTime, endTime, agentId }: UseServerMetricParams) {
  return useQuery({
    queryKey: ['server-metric', { startTime, endTime, agentId }] as const,
    queryFn: () =>
      request(
        {
          url: '/dashboard/metrics',
          params: { startTime, endTime, agentId },
        },
        serverMetricSchema,
      ),
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
  })
}
