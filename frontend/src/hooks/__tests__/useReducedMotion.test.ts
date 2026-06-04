import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReducedMotion } from '../useReducedMotion'

describe('useReducedMotion', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns false when reduced motion is not preferred', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when reduced motion is preferred', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('responds to media query changes', () => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = []
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn((_event: string, handler: (e: MediaQueryListEvent) => void) => {
        listeners.push(handler)
      }),
      removeEventListener: vi.fn(),
    })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      listeners.forEach((fn) =>
        fn({ matches: true } as MediaQueryListEvent)
      )
    })
    expect(result.current).toBe(true)
  })
})
