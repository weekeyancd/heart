import { describe, it, expect, beforeEach } from 'vitest'
import { useCirculationStore } from '../circulationStore'

describe('circulationStore', () => {
  beforeEach(() => {
    useCirculationStore.setState({
      paths: [],
      activeLoopId: null,
      isPlaying: false,
      playbackSpeed: 1.0,
      currentTime: 0,
      error: null,
    })
  })

  it('starts with default state', () => {
    const state = useCirculationStore.getState()
    expect(state.activeLoopId).toBeNull()
    expect(state.isPlaying).toBe(false)
    expect(state.playbackSpeed).toBe(1.0)
    expect(state.currentTime).toBe(0)
    expect(state.error).toBeNull()
  })

  it('setActiveLoop starts playing and resets time', () => {
    useCirculationStore.getState().setActiveLoop('systemic-loop')
    const state = useCirculationStore.getState()
    expect(state.activeLoopId).toBe('systemic-loop')
    expect(state.isPlaying).toBe(true)
    expect(state.currentTime).toBe(0)
  })

  it('setActiveLoop null stops playing', () => {
    useCirculationStore.getState().setActiveLoop('pulmonary-loop')
    useCirculationStore.getState().setActiveLoop(null)
    expect(useCirculationStore.getState().activeLoopId).toBeNull()
    expect(useCirculationStore.getState().isPlaying).toBe(false)
  })

  it('setActiveLoop sets loop directly (toggle is in Toolbar, not store)', () => {
    useCirculationStore.getState().setActiveLoop('systemic-loop')
    expect(useCirculationStore.getState().activeLoopId).toBe('systemic-loop')
    useCirculationStore.getState().setActiveLoop('pulmonary-loop')
    expect(useCirculationStore.getState().activeLoopId).toBe('pulmonary-loop')
  })

  it('play and pause toggle isPlaying', () => {
    useCirculationStore.getState().play()
    expect(useCirculationStore.getState().isPlaying).toBe(true)
    useCirculationStore.getState().pause()
    expect(useCirculationStore.getState().isPlaying).toBe(false)
  })

  it('setSpeed changes playback speed', () => {
    useCirculationStore.getState().setSpeed(2.0)
    expect(useCirculationStore.getState().playbackSpeed).toBe(2.0)
  })

  it('reset sets currentTime to 0', () => {
    useCirculationStore.getState().tick(10)
    useCirculationStore.getState().reset()
    expect(useCirculationStore.getState().currentTime).toBe(0)
  })

  it('tick advances currentTime by delta * speed', () => {
    useCirculationStore.getState().setSpeed(2.0)
    useCirculationStore.getState().tick(5)
    expect(useCirculationStore.getState().currentTime).toBe(10)
  })

  it('tick accumulates over multiple calls', () => {
    useCirculationStore.getState().tick(3)
    useCirculationStore.getState().tick(4)
    expect(useCirculationStore.getState().currentTime).toBe(7)
  })
})
