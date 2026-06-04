import { useEffect } from 'react'
import { useHeartStore } from '../../store/heartStore'
import { useKnowledgeStore } from '../../store/knowledgeStore'
import { GUIDED_STEPS } from '../../lib/guidedTourSteps'
import './GuidedTour.css'

export function GuidedTour() {
  const guidedStep = useHeartStore((s) => s.guidedStep)
  const select = useHeartStore((s) => s.select)
  const setGuidedStep = useHeartStore((s) => s.setGuidedStep)
  const parts = useHeartStore((s) => s.parts)
  const visitedParts = useKnowledgeStore((s) => s.visitedParts)
  const markVisited = useKnowledgeStore((s) => s.markVisited)
  const incrementGuidedSteps = useKnowledgeStore((s) => s.incrementGuidedSteps)

  const stepIdx = guidedStep ?? -1
  const step = GUIDED_STEPS[stepIdx]
  const part = parts.find((p) => p.id === step?.partId)

  useEffect(() => {
    if (step && !visitedParts.has(step.partId)) {
      markVisited(step.partId)
    }
  }, [step?.partId, visitedParts, markVisited])

  if (guidedStep === null || !step || !part) return null

  const handleNext = () => {
    const nextIdx = stepIdx + 1
    if (nextIdx >= GUIDED_STEPS.length) {
      setGuidedStep(null)
      select(null)
      return
    }
    setGuidedStep(nextIdx)
    select(GUIDED_STEPS[nextIdx].partId)
    incrementGuidedSteps()
  }

  const handlePrev = () => {
    if (stepIdx <= 0) return
    const prevIdx = stepIdx - 1
    setGuidedStep(prevIdx)
    select(GUIDED_STEPS[prevIdx].partId)
  }

  const handleExit = () => {
    setGuidedStep(null)
    select(null)
  }

  return (
    <div className="guided-tour">
      <div className="guided-tour__progress">
        {GUIDED_STEPS.map((_, i) => (
          <div
            key={i}
            className={`guided-tour__dot ${
              i === stepIdx ? 'guided-tour__dot--active' :
              i < stepIdx ? 'guided-tour__dot--completed' : ''
            }`}
          />
        ))}
      </div>

      <div className="guided-tour__content">
        <div className="guided-tour__part-name">{part.nameZh} {part.nameEn}</div>
        <div className="guided-tour__instruction">{step.instruction}</div>
      </div>

      <div className="guided-tour__actions">
        <button className="guided-tour__btn guided-tour__btn--exit" onClick={handleExit}>
          退出导览
        </button>
        <span className="guided-tour__step-counter">{stepIdx + 1} / {GUIDED_STEPS.length}</span>
        <div className="guided-tour__nav">
          {stepIdx > 0 && (
            <button className="guided-tour__btn" onClick={handlePrev}>上一步</button>
          )}
          <button className="guided-tour__btn guided-tour__btn--primary" onClick={handleNext}>
            {stepIdx >= GUIDED_STEPS.length - 1 ? '完成' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}
