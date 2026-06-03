import { useEffect } from 'react'
import { HeartScene } from '../components/heart/HeartScene'
import { InfoPanel } from '../components/ui/InfoPanel'
import { Toolbar } from '../components/ui/Toolbar'
import { HintBar } from '../components/ui/HintBar'
import { GuidedTour } from '../components/ui/GuidedTour'
import { useHeartStore } from '../store/heartStore'
import { useCirculationStore } from '../store/circulationStore'
import './HeartPage.css'

export function HeartPage() {
  const loadParts = useHeartStore((s) => s.loadParts)
  const loadModelMeta = useHeartStore((s) => s.loadModelMeta)
  const loadPaths = useCirculationStore((s) => s.loadPaths)
  const setGuidedStep = useHeartStore((s) => s.setGuidedStep)
  const select = useHeartStore((s) => s.select)

  useEffect(() => {
    loadParts()
    loadModelMeta()
    loadPaths()
  }, [loadParts, loadModelMeta, loadPaths])

  useEffect(() => {
    if (localStorage.getItem('heart-start-tour') === '1') {
      localStorage.removeItem('heart-start-tour')
      const timer = setTimeout(() => {
        setGuidedStep(0)
        select('right-atrium')
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [setGuidedStep, select])

  return (
    <div className="heart-page">
      <HeartScene />
      <Toolbar />
      <InfoPanel />
      <HintBar />
      <GuidedTour />
    </div>
  )
}
