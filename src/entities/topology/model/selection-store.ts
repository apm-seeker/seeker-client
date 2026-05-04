import { create } from 'zustand'
import type { AgentIdValue } from './types'
import { USER_AGENT_ID } from './types'

interface TopologySelectionState {
  selectedAgentId: AgentIdValue
  setSelectedAgentId: (id: AgentIdValue) => void
  clearSelection: () => void
}

export const useTopologySelection = create<TopologySelectionState>((set) => ({
  selectedAgentId: USER_AGENT_ID,
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),
  clearSelection: () => set({ selectedAgentId: USER_AGENT_ID }),
}))
