import { Link } from 'react-router-dom'
import { useCirculationStore } from '../../store/circulationStore'
import { useHeartStore } from '../../store/heartStore'
import './Toolbar.css'

export function Toolbar() {
  const activeLoopId = useCirculationStore((s) => s.activeLoopId)
  const isPlaying = useCirculationStore((s) => s.isPlaying)
  const playbackSpeed = useCirculationStore((s) => s.playbackSpeed)
  const setActiveLoop = useCirculationStore((s) => s.setActiveLoop)
  const play = useCirculationStore((s) => s.play)
  const pause = useCirculationStore((s) => s.pause)
  const setSpeed = useCirculationStore((s) => s.setSpeed)
  const guidedStep = useHeartStore((s) => s.guidedStep)
  const setGuidedStep = useHeartStore((s) => s.setGuidedStep)
  const select = useHeartStore((s) => s.select)
  const clearSelection = useHeartStore((s) => s.clearSelection)

  const handleLoopToggle = (loopId: string) => {
    setActiveLoop(activeLoopId === loopId ? null : loopId)
  }

  const handleReset = () => {
    clearSelection()
    setActiveLoop(null)
    setGuidedStep(null)
  }

  const handleStartTour = () => {
    setGuidedStep(0)
    select('right-atrium')
  }

  const handlePlayPause = () => {
    if (isPlaying) pause()
    else play()
  }

  const handleSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2]
    const idx = speeds.indexOf(playbackSpeed)
    setSpeed(speeds[(idx + 1) % speeds.length])
  }

  return (
    <nav className="toolbar">
      <div className="toolbar__left">
        <Link to="/" className="toolbar__back" aria-label="返回首页">←</Link>
        <h1 className="toolbar__title">心脏解剖互动教学</h1>
      </div>
      <div className="toolbar__center">
        <button
          className={`toolbar__btn ${activeLoopId === 'systemic-loop' ? 'toolbar__btn--active' : ''}`}
          onClick={() => handleLoopToggle('systemic-loop')}
        >
          体循环
        </button>
        <button
          className={`toolbar__btn ${activeLoopId === 'pulmonary-loop' ? 'toolbar__btn--active' : ''}`}
          onClick={() => handleLoopToggle('pulmonary-loop')}
        >
          肺循环
        </button>
        {activeLoopId && (
          <>
            <button className="toolbar__btn" onClick={handlePlayPause}>
              {isPlaying ? '暂停' : '播放'}
            </button>
            <button className="toolbar__btn" onClick={handleSpeed}>
              {playbackSpeed}x
            </button>
          </>
        )}
      </div>
      <div className="toolbar__right">
        {guidedStep === null && (
          <button className="toolbar__btn" onClick={handleStartTour}>
            导览
          </button>
        )}
        <button className="toolbar__btn toolbar__btn--reset" onClick={handleReset}>
          重置
        </button>
      </div>
    </nav>
  )
}
