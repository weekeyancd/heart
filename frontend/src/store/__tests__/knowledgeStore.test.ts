import { describe, it, expect, beforeEach } from 'vitest'
import { useKnowledgeStore } from '../knowledgeStore'

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
})
