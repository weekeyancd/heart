import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HintBar } from '../HintBar'
import { useHeartStore } from '../../../store/heartStore'
import { useCirculationStore } from '../../../store/circulationStore'

describe('HintBar', () => {
  afterEach(() => {
    useHeartStore.setState({ selectedId: null })
    useCirculationStore.setState({ activeLoopId: null })
  })

  it('shows default hint when nothing is selected', () => {
    render(<HintBar />)
    expect(screen.getByText(/拖拽旋转/)).toBeInTheDocument()
  })

  it('shows exploration hint when a part is selected', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<HintBar />)
    expect(screen.getByText(/点击其他部位继续探索/)).toBeInTheDocument()
  })

  it('shows circulation hint when a loop is active', () => {
    useCirculationStore.setState({ activeLoopId: 'systemic-loop' })
    render(<HintBar />)
    expect(screen.getByText(/点击播放\/暂停控制血流动画/)).toBeInTheDocument()
  })

  it('prefers circulation hint over selection hint', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    useCirculationStore.setState({ activeLoopId: 'pulmonary-loop' })
    render(<HintBar />)
    expect(screen.getByText(/点击播放\/暂停控制血流动画/)).toBeInTheDocument()
  })
})
