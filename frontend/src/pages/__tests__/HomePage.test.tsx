import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '../../pages/HomePage'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }))
  })

  it('renders hero title and subtitle', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('心脏解剖互动教学')).toBeInTheDocument()
    expect(screen.getByText(/直观学习心脏各部位功能/)).toBeInTheDocument()
  })

  it('renders three navigation cards', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('3D 交互学习')).toBeInTheDocument()
    expect(screen.getByText('引导式导览')).toBeInTheDocument()
    expect(screen.getByText('知识测验')).toBeInTheDocument()
  })

  it('has link to learn page', () => {
    renderWithRouter(<HomePage />)
    const links = screen.getAllByRole('link')
    const learnLinks = links.filter((l) => l.getAttribute('href') === '/learn')
    expect(learnLinks.length).toBeGreaterThan(0)
  })

  it('shows coming soon badge on quiz card', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText('即将推出')).toBeInTheDocument()
  })

  it('renders footer with interaction hints', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText(/拖拽旋转/)).toBeInTheDocument()
  })
})
