import { create } from 'zustand'
import type { HeartPart, ModelMeta } from '../lib/contracts'
import { fetchParts, fetchModelMeta } from '../lib/api'

interface HeartState {
  hoverId: string | null
  selectedId: string | null
  guidedStep: number | null
  parts: HeartPart[]
  modelMeta: ModelMeta | null
  error: string | null
  hover: (id: string | null) => void
  select: (id: string | null) => void
  setGuidedStep: (step: number | null) => void
  loadParts: () => Promise<void>
  loadModelMeta: () => Promise<void>
  clearSelection: () => void
}

export const useHeartStore = create<HeartState>((set) => ({
  hoverId: null,
  selectedId: null,
  guidedStep: null,
  parts: [],
  modelMeta: null,
  error: null,

  hover: (id) => set({ hoverId: id }),

  select: (id) => set({ selectedId: id }),

  setGuidedStep: (step) => set({ guidedStep: step }),

  loadParts: async () => {
    try {
      const parts = await fetchParts()
      set({ parts, error: null })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load parts' })
    }
  },

  loadModelMeta: async () => {
    try {
      const modelMeta = await fetchModelMeta()
      set({ modelMeta, error: null })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load model meta' })
    }
  },

  clearSelection: () => set({ selectedId: null, hoverId: null }),
}))
