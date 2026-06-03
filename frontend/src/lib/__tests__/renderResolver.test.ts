import { describe, it, expect } from 'vitest'
import { getRenderState } from '../renderResolver'
import type { InteractionState } from '../contracts'

const partTypes = new Map([
  ['right-atrium', 'chamber'],
  ['left-ventricle', 'chamber'],
  ['aorta', 'vessel'],
  ['tricuspid-valve', 'valve'],
  ['septum', 'structure'],
])

const occlusionMap: Record<string, string[]> = {
  'left-ventricle': ['septum'],
}

describe('getRenderState', () => {
  it('returns default render state when nothing is hovered or selected', () => {
    const state: InteractionState = { hoverId: null, selectedId: null }
    const result = getRenderState('right-atrium', state, occlusionMap, partTypes)
    expect(result.emissive).toBe(0)
    expect(result.opacity).toBe(1)
    expect(result.scale).toBe(1)
    expect(result.pulse).toBe(false)
  })

  it('returns highlighted state for hovered part', () => {
    const state: InteractionState = { hoverId: 'right-atrium', selectedId: null }
    const result = getRenderState('right-atrium', state, occlusionMap, partTypes)
    expect(result.emissive).toBe(0.3)
    expect(result.opacity).toBe(1)
  })

  it('returns selected state for selected part', () => {
    const state: InteractionState = { hoverId: null, selectedId: 'right-atrium' }
    const result = getRenderState('right-atrium', state, occlusionMap, partTypes)
    expect(result.emissive).toBe(0.6)
    expect(result.opacity).toBe(1)
    expect(result.scale).toBe(1.02)
    expect(result.pulse).toBe(true)
  })

  it('dims non-selected parts when something is selected', () => {
    const state: InteractionState = { hoverId: null, selectedId: 'right-atrium' }
    const result = getRenderState('aorta', state, occlusionMap, partTypes)
    expect(result.opacity).toBe(0.6)
  })

  it('makes occluder nearly transparent', () => {
    const state: InteractionState = { hoverId: null, selectedId: 'left-ventricle' }
    const result = getRenderState('septum', state, occlusionMap, partTypes)
    expect(result.opacity).toBe(0.12)
  })

  it('dims same-type siblings more than other types', () => {
    const state: InteractionState = { hoverId: null, selectedId: 'right-atrium' }
    const result = getRenderState('left-ventricle', state, occlusionMap, partTypes)
    expect(result.opacity).toBe(0.35)
  })

  it('keeps hovered part visible even when other is selected', () => {
    const state: InteractionState = { hoverId: 'aorta', selectedId: 'right-atrium' }
    const result = getRenderState('aorta', state, occlusionMap, partTypes)
    expect(result.opacity).toBe(1)
  })
})
