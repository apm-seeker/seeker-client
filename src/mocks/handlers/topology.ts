import { http, HttpResponse } from 'msw'
import { mockTopology } from '@/entities/topology'
import { env } from '@/shared/config'

export const topologyHandlers = [
  http.get(`${env.apiBaseUrl}/dashboard/topology`, () => HttpResponse.json(mockTopology)),
]
