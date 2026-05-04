import { z } from 'zod'
import type { ServerMetric } from '../model/types'

export const serverMetricSchema: z.ZodType<ServerMetric> = z.object({
  totalCount: z.number(),
  errorCount: z.number(),
  errorRate: z.number(),
  p99: z.number(),
  p95: z.number(),
  p90: z.number(),
})
