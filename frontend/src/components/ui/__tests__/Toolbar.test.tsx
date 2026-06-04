import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Toolbar } from '../Toolbar'
import { useHeartStore } from '../../../store/heartStore'
import { useCirculationStore } from '../../../store/circulationStore'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Toolbar', () => {
  beforeEach(() => {
    useHeartStore.setState({ guidedStep: null, selectedId: null })
    useCirculationStore.setState({
      activeLoopId: null,
      isPlaying: false,
      playbackSpeed: 1,
    })
  })

  it('renders title and back link', () => {
    renderWithRouter(<Toolbar />)
    expect(screen.getByText('心脏解剖互动教学')).toBeInTheDocument()
    expect(screen.getByLabelText('返回首页')).toBeInTheDocument()
  })

  it('renders systemic and pulmonary loop toggle buttons', () => {
    renderWithRouter(<Toolbar />)
    expect(screen.getByText('体循环')).toBeInTheDocument()
    expect(screen.getByText('肺循环')).toBeInTheDocument()
  })

  it('toggles systemic loop on click', () => {
    renderWithRouter(<Toolbar />)
    fireEvent.click(screen.getByText('体循环'))
    expect(useCirculationStore.getState().activeLoopId).toBe('systemic-loop')
  })

  it('deactivates loop on second click', () => {
    useCirculationStore.setState({ activeLoopId: 'systemic-loop' })
    renderWithRouter(<Toolbar />)
    fireEvent.click(screen.getByText('体循环'))
    expect(useCirculationStore.getState().activeLoopId).toBeNull()
  })

  it('shows play/pause and speed buttons when loop is active', () => {
    useCirculationStore.setState({ activeLoopId: 'systemic-loop' })
    renderWithRouter(<Toolbar />)
    expect(screen.getByText('播放')).toBeInTheDocument()
    expect(screen.getByText('1x')).toBeInTheDocument()
  })

  it('toggles play/pause', () => {
    useCirculationStore.setState({ activeLoopId: 'systemic-loop', isPlaying: false })
    renderWithRouter(<Toolbar />)
    fireEvent.click(screen.getByText('播放'))
    expect(useCirculationStore.getState().isPlaying).toBe(true)
  })

  it('cycles playback speed', () => {
    useCirculationStore.setState({ activeLoopId: 'systemic-loop', playbackSpeed: 1 })
    renderWithRouter(<Toolbar />)
    fireEvent.click(screen.getByText('1x'))
    expect(useCirculationStore.getState().playbackSpeed).toBe(1.5)
  })

  it('shows tour button when not in tour mode', () => {
    renderWithRouter(<Toolbar />)
    expect(screen.getByText('导览')).toBeInTheDocument()
  })

  it('hides tour button during guided tour', () => {
    useHeartStore.setState({ guidedStep: 0 })
    renderWithRouter(<Toolbar />)
    expect(screen.queryByText('导览')).not.toBeInTheDocument()
  })

  it('resets all state on reset click', () => {
    useHeartStore.setState({ selectedId: 'right-atrium', guidedStep: 0 })
    useCirculationStore.setState({ activeLoopId: 'systemic-loop' })
    renderWithRouter(<Toolbar />)
    fireEvent.click(screen.getByText('重置'))
    expect(useHeartStore.getState().selectedId).toBeNull()
    expect(useHeartStore.getState().guidedStep).toBeNull()
    expect(useCirculationStore.getState().activeLoopId).toBeNull()
  })
})
