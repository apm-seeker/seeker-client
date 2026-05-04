import { serverMetricHandlers } from './server-metric'
import { topologyHandlers } from './topology'

export const handlers = [...topologyHandlers, ...serverMetricHandlers]
