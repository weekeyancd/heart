import { useEffect, useState } from 'react'

export function useScrollProgress(element?: HTMLElement | null): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target = element ?? window

    const handler = () => {
      if (target === window) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(scrollHeight > 0 ? window.scrollY / scrollHeight : 0)
      } else {
        const scrollHeight = target.scrollHeight - target.clientHeight
        setProgress(scrollHeight > 0 ? target.scrollTop / scrollHeight : 0)
      }
    }

    target.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => target.removeEventListener('scroll', handler)
  }, [element])

  return progress
}
