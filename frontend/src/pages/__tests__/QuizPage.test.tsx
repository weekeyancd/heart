import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuizPage } from '../../pages/QuizPage'

describe('QuizPage', () => {
  it('renders coming soon placeholder', () => {
    render(<QuizPage />)
    expect(screen.getByText('知识测验')).toBeInTheDocument()
    expect(screen.getByText(/即将推出/)).toBeInTheDocument()
  })
})
