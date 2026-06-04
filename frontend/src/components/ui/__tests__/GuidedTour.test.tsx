import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { GuidedTour } from '../GuidedTour'
import { useHeartStore } from '../../../store/heartStore'
import { useKnowledgeStore } from '../../../store/knowledgeStore'
import type { HeartPart } from '../../../lib/contracts'

function makePart(id: string, nameZh: string, nameEn: string): HeartPart {
  return {
    id,
    nameZh,
    nameEn,
    type: 'chamber',
    layers: { anatomy: nameZh, physiology: nameZh },
    relations: { connectsTo: [], supplies: [], receivesFrom: [], affectedBy: [] },
    circulationPaths: [],
    funFact: '',
  }
}

const MOCK_PARTS: HeartPart[] = [
  makePart('right-atrium', '右心房', 'Right Atrium'),
  makePart('tricuspid-valve', '三尖瓣', 'Tricuspid Valve'),
  makePart('right-ventricle', '右心室', 'Right Ventricle'),
  makePart('pulmonary-valve', '肺动脉瓣', 'Pulmonary Valve'),
  makePart('pulmonary-artery', '肺动脉', 'Pulmonary Artery'),
  makePart('pulmonary-vein', '肺静脉', 'Pulmonary Vein'),
  makePart('left-atrium', '左心房', 'Left Atrium'),
  makePart('mitral-valve', '二尖瓣', 'Mitral Valve'),
  makePart('left-ventricle', '左心室', 'Left Ventricle'),
  makePart('aortic-valve', '主动脉瓣', 'Aortic Valve'),
  makePart('aorta', '主动脉', 'Aorta'),
  makePart('septum', '室间隔', 'Septum'),
]

describe('GuidedTour', () => {
  beforeEach(() => {
    useHeartStore.setState({ guidedStep: null, parts: MOCK_PARTS, selectedId: null })
    useKnowledgeStore.setState({ visitedParts: new Set(), completedGuidedSteps: 0 })
  })

  it('returns null when guidedStep is null', () => {
    const { container } = render(<GuidedTour />)
    expect(container.innerHTML).toBe('')
  })

  it('renders tour content when guidedStep is set', () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    expect(screen.getByText('退出导览')).toBeInTheDocument()
    expect(screen.getByText('下一步')).toBeInTheDocument()
  })

  it('displays step counter', () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    expect(screen.getByText(/1 \/ 12/)).toBeInTheDocument()
  })

  it('advances to next step on next button click', () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    fireEvent.click(screen.getByText('下一步'))
    expect(useHeartStore.getState().guidedStep).toBe(1)
  })

  it('exits tour on exit button click', () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    fireEvent.click(screen.getByText('退出导览'))
    expect(useHeartStore.getState().guidedStep).toBeNull()
    expect(useHeartStore.getState().selectedId).toBeNull()
  })

  it('shows previous button after first step', () => {
    useHeartStore.setState({ guidedStep: 1 })
    render(<GuidedTour />)
    expect(screen.getByText('上一步')).toBeInTheDocument()
  })

  it('hides previous button on first step', () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    expect(screen.queryByText('上一步')).not.toBeInTheDocument()
  })

  it('marks visited parts during tour', () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    expect(useKnowledgeStore.getState().visitedParts.has('right-atrium')).toBe(true)
  })

  it('increments guided steps count on next', async () => {
    useHeartStore.setState({ guidedStep: 0 })
    render(<GuidedTour />)
    await act(() => {
      fireEvent.click(screen.getByText('下一步'))
    })
    expect(useKnowledgeStore.getState().completedGuidedSteps).toBe(1)
  })

  it('shows completion button on last step', () => {
    useHeartStore.setState({ guidedStep: 11 })
    render(<GuidedTour />)
    expect(screen.getByText('完成')).toBeInTheDocument()
  })
})
