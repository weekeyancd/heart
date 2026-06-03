import { create } from 'zustand'
import type { CirculationPath } from '../lib/contracts'
import { fetchCirculation } from '../lib/api'

interface CirculationState {
  paths: CirculationPath[]
  activeLoopId: string | null
  isPlaying: boolean
  playbackSpeed: number
  currentTime: number
  error: string | null
  loadPaths: () => Promise<void>
  setActiveLoop: (loopId: string | null) => void
  play: () => void
  pause: () => void
  reset: () => void
  setSpeed: (speed: number) => void
  tick: (delta: number) => void
}

export const useCirculationStore = create<CirculationState>((set) => ({
  paths: [],
  activeLoopId: null,
  isPlaying: false,
  playbackSpeed: 1.0,
  currentTime: 0,
  error: null,

  loadPaths: async () => {
    try {
      const paths = await fetchCirculation()
      set({ paths, error: null })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load circulation paths' })
    }
  },

  setActiveLoop: (loopId) =>
    set({ activeLoopId: loopId, currentTime: 0, isPlaying: loopId !== null }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  reset: () => set({ currentTime: 0 }),

  setSpeed: (speed) => set({ playbackSpeed: speed }),

  tick: (delta) =>
    set((state) => ({
      currentTime: state.currentTime + delta * state.playbackSpeed,
    })),
}))
