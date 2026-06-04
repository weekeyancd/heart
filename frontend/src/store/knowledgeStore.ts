import { create } from 'zustand'
import { fetchProgress, postVisit, putGuidedSteps, deleteProgress } from '../lib/api'

const USER_ID_KEY = 'heart-user-id'

function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = `user-${crypto.randomUUID().slice(0, 8)}`
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

interface KnowledgeState {
  visitedParts: Set<string>
  completedGuidedSteps: number
  userId: string
  isLoading: boolean
  markVisited: (partId: string) => void
  incrementGuidedSteps: () => void
  reset: () => void
  loadProgress: () => Promise<void>
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  visitedParts: new Set<string>(),
  completedGuidedSteps: 0,
  userId: getUserId(),
  isLoading: false,

  markVisited: (partId) =>
    set((state) => {
      if (state.visitedParts.has(partId)) return state
      const next = new Set(state.visitedParts)
      next.add(partId)
      postVisit(state.userId, partId)
      return { visitedParts: next }
    }),

  incrementGuidedSteps: () =>
    set((state) => {
      const next = state.completedGuidedSteps + 1
      putGuidedSteps(state.userId, next)
      return { completedGuidedSteps: next }
    }),

  reset: () => {
    const { userId } = get()
    deleteProgress(userId)
    set({ visitedParts: new Set<string>(), completedGuidedSteps: 0 })
  },

  loadProgress: async () => {
    set({ isLoading: true })
    try {
      const { userId } = get()
      const progress = await fetchProgress(userId)
      if (progress) {
        set({
          visitedParts: new Set(progress.visitedParts),
          completedGuidedSteps: progress.guidedStepsCompleted,
        })
      }
    } finally {
      set({ isLoading: false })
    }
  },
}))
