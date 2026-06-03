import { create } from 'zustand'

interface KnowledgeState {
  visitedParts: Set<string>
  completedGuidedSteps: number
  markVisited: (partId: string) => void
  incrementGuidedSteps: () => void
  reset: () => void
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  visitedParts: new Set<string>(),
  completedGuidedSteps: 0,

  markVisited: (partId) =>
    set((state) => {
      if (state.visitedParts.has(partId)) return state
      const next = new Set(state.visitedParts)
      next.add(partId)
      return { visitedParts: next }
    }),

  incrementGuidedSteps: () =>
    set((state) => ({ completedGuidedSteps: state.completedGuidedSteps + 1 })),

  reset: () => set({ visitedParts: new Set<string>(), completedGuidedSteps: 0 }),
}))
