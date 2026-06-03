import { describe, it, expect } from 'vitest'
import { GUIDED_STEPS } from '../guidedTourSteps'

describe('guidedTourSteps', () => {
  it('has exactly 12 steps covering the blood flow path', () => {
    expect(GUIDED_STEPS).toHaveLength(12)
  })

  it('each step has a valid partId and instruction', () => {
    for (const step of GUIDED_STEPS) {
      expect(step.partId).toBeTruthy()
      expect(step.instruction).toBeTruthy()
      expect(step.instruction.length).toBeGreaterThan(10)
    }
  })

  it('starts with right-atrium (deoxygenated blood entry)', () => {
    expect(GUIDED_STEPS[0].partId).toBe('right-atrium')
  })

  it('follows anatomical blood flow order', () => {
    const expectedOrder = [
      'right-atrium',
      'tricuspid-valve',
      'right-ventricle',
      'pulmonary-valve',
      'pulmonary-artery',
      'pulmonary-vein',
      'left-atrium',
      'mitral-valve',
      'left-ventricle',
      'aortic-valve',
      'aorta',
      'septum',
    ]
    const actualOrder = GUIDED_STEPS.map((s) => s.partId)
    expect(actualOrder).toEqual(expectedOrder)
  })

  it('all partIds are unique', () => {
    const ids = GUIDED_STEPS.map((s) => s.partId)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
