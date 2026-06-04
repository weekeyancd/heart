import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollProgress } from '../useScrollProgress'

describe('useScrollProgress', () => {
  it('returns 0 initially', () => {
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)
  })

  it('accepts a custom element', () => {
    const div = document.createElement('div')
    Object.defineProperty(div, 'scrollHeight', { value: 200, configurable: true })
    Object.defineProperty(div, 'clientHeight', { value: 100, configurable: true })
    Object.defineProperty(div, 'scrollTop', { value: 50, configurable: true })
    Object.defineProperty(div, 'addEventListener', { value: vi.fn() })
    Object.defineProperty(div, 'removeEventListener', { value: vi.fn() })

    const { result } = renderHook(() => useScrollProgress(div))
    expect(result.current).toBe(0.5)
  })
})
