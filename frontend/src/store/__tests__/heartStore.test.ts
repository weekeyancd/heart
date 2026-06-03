import { describe, it, expect } from 'vitest'
import { useHeartStore } from '../heartStore'
import { LOCAL_PARTS } from '../../lib/localData'

describe('heartStore', () => {
  beforeEach(() => {
    useHeartStore.setState({
      hoverId: null,
      selectedId: null,
      guidedStep: null,
      parts: [],
      modelMeta: null,
      error: null,
    })
  })

  it('starts with empty state', () => {
    const state = useHeartStore.getState()
    expect(state.hoverId).toBeNull()
    expect(state.selectedId).toBeNull()
    expect(state.guidedStep).toBeNull()
    expect(state.parts).toEqual([])
    expect(state.error).toBeNull()
  })

  it('hover sets hoverId', () => {
    useHeartStore.getState().hover('right-atrium')
    expect(useHeartStore.getState().hoverId).toBe('right-atrium')
  })

  it('hover null clears hoverId', () => {
    useHeartStore.getState().hover('right-atrium')
    useHeartStore.getState().hover(null)
    expect(useHeartStore.getState().hoverId).toBeNull()
  })

  it('select sets selectedId', () => {
    useHeartStore.getState().select('left-ventricle')
    expect(useHeartStore.getState().selectedId).toBe('left-ventricle')
  })

  it('clearSelection resets both hover and selected', () => {
    useHeartStore.getState().hover('aorta')
    useHeartStore.getState().select('aorta')
    useHeartStore.getState().clearSelection()
    expect(useHeartStore.getState().hoverId).toBeNull()
    expect(useHeartStore.getState().selectedId).toBeNull()
  })

  it('setGuidedStep sets the step index', () => {
    useHeartStore.getState().setGuidedStep(3)
    expect(useHeartStore.getState().guidedStep).toBe(3)
  })

  it('setGuidedStep null exits tour', () => {
    useHeartStore.getState().setGuidedStep(0)
    useHeartStore.getState().setGuidedStep(null)
    expect(useHeartStore.getState().guidedStep).toBeNull()
  })

  it('loadParts loads parts from local data when API unavailable', async () => {
    await useHeartStore.getState().loadParts()
    const parts = useHeartStore.getState().parts
    expect(parts.length).toBeGreaterThan(0)
    expect(parts[0].id).toBe(LOCAL_PARTS[0].id)
  })
})
