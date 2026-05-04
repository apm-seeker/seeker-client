import { useQuery } from '@tanstack/react-query'
import { request } from '@/shared/api'
import { topologySchema } from './schema'

export interface UseTopologyParams {
  startTime: number
  endTime: number
}

export function useTopology({ startTime, endTime }: UseTopologyParams) {
  return useQuery({
    queryKey: ['topology', { startTime, endTime }] as const,
    queryFn: () =>
      request(
        {
          url: '/dashboard/topology',
          params: { startTime, endTime },
        },
        topologySchema,
      ),
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
  })
}
