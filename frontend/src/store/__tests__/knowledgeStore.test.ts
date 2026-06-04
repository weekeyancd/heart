import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useKnowledgeStore } from '../knowledgeStore'

vi.mock('../../lib/api', () => ({
  fetchProgress: vi.fn().mockResolvedValue(null),
  postVisit: vi.fn().mockResolvedValue(undefined),
  putGuidedSteps: vi.fn().mockResolvedValue(undefined),
  deleteProgress: vi.fn().mockResolvedValue(undefined),
}))

describe('knowledgeStore', () => {
  beforeEach(() => {
    useKnowledgeStore.getState().reset()
  })

  it('starts with empty visited set and zero steps', () => {
    const state = useKnowledgeStore.getState()
    expect(state.visitedParts.size).toBe(0)
    expect(state.completedGuidedSteps).toBe(0)
  })

  it('markVisited adds part to visited set', () => {
    useKnowledgeStore.getState().markVisited('right-atrium')
    expect(useKnowledgeStore.getState().visitedParts.has('right-atrium')).toBe(true)
  })

  it('markVisited is idempotent — no duplicate entries', () => {
    useKnowledgeStore.getState().markVisited('aorta')
    useKnowledgeStore.getState().markVisited('aorta')
    expect(useKnowledgeStore.getState().visitedParts.size).toBe(1)
  })

  it('markVisited preserves previously visited parts', () => {
    useKnowledgeStore.getState().markVisited('right-atrium')
    useKnowledgeStore.getState().markVisited('left-ventricle')
    const state = useKnowledgeStore.getState()
    expect(state.visitedParts.has('right-atrium')).toBe(true)
    expect(state.visitedParts.has('left-ventricle')).toBe(true)
    expect(state.visitedParts.size).toBe(2)
  })

  it('incrementGuidedSteps increments counter', () => {
    useKnowledgeStore.getState().incrementGuidedSteps()
    expect(useKnowledgeStore.getState().completedGuidedSteps).toBe(1)
    useKnowledgeStore.getState().incrementGuidedSteps()
    expect(useKnowledgeStore.getState().completedGuidedSteps).toBe(2)
  })

  it('reset clears all state', () => {
    useKnowledgeStore.getState().markVisited('septum')
    useKnowledgeStore.getState().incrementGuidedSteps()
    useKnowledgeStore.getState().incrementGuidedSteps()
    useKnowledgeStore.getState().reset()
    const state = useKnowledgeStore.getState()
    expect(state.visitedParts.size).toBe(0)
    expect(state.completedGuidedSteps).toBe(0)
  })

  it('has userId', () => {
    const state = useKnowledgeStore.getState()
    expect(state.userId).toBeTruthy()
  })
})
