import { http, HttpResponse } from 'msw'
import { mockMetricsByAgent } from '@/entities/server-metric'
import { env } from '@/shared/config'

export const serverMetricHandlers = [
  http.get(`${env.apiBaseUrl}/dashboard/metrics`, ({ request }) => {
    const url = new URL(request.url)
    const agentId = url.searchParams.get('agentId')
    if (!agentId) {
      return HttpResponse.json({ message: 'agentId is required' }, { status: 400 })
    }
    const metric = mockMetricsByAgent[agentId]
    if (!metric) {
      return HttpResponse.json({ message: 'Agent not found' }, { status: 404 })
    }
    return HttpResponse.json(metric)
  }),
]
