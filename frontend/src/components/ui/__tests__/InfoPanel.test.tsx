import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InfoPanel } from '../InfoPanel'
import { useHeartStore } from '../../../store/heartStore'
import { useKnowledgeStore } from '../../../store/knowledgeStore'
import type { HeartPart } from '../../lib/contracts'

const MOCK_PART: HeartPart = {
  id: 'right-atrium',
  nameZh: '右心房',
  nameEn: 'Right Atrium',
  type: 'chamber',
  layers: {
    anatomy: '右心房壁薄，约2mm',
    physiology: '接收上下腔静脉回流的静脉血',
    clinical: '房颤最常见起源部位',
  },
  relations: {
    connectsTo: ['三尖瓣', '上腔静脉'],
    supplies: [],
    receivesFrom: ['上腔静脉', '下腔静脉'],
    affectedBy: [],
  },
  circulationPaths: ['systemic-loop'],
  funFact: '右心房的容量约为60mL',
}

describe('InfoPanel', () => {
  beforeEach(() => {
    useHeartStore.setState({ selectedId: null, parts: [MOCK_PART] })
    useKnowledgeStore.setState({ visitedParts: new Set() })
  })

  it('shows empty state when no part is selected', () => {
    render(<InfoPanel />)
    expect(screen.getByText(/点击心脏部位查看详细信息/)).toBeInTheDocument()
  })

  it('shows part details when a part is selected', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(screen.getByText('右心房')).toBeInTheDocument()
    expect(screen.getByText('Right Atrium')).toBeInTheDocument()
    expect(screen.getByText('心腔')).toBeInTheDocument()
  })

  it('shows anatomy and physiology sections', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(screen.getByText('解剖结构')).toBeInTheDocument()
    expect(screen.getByText(/右心房壁薄/)).toBeInTheDocument()
    expect(screen.getByText('生理功能')).toBeInTheDocument()
    expect(screen.getByText(/接收上下腔静脉/)).toBeInTheDocument()
  })

  it('shows clinical section when present', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(screen.getByText('临床关联')).toBeInTheDocument()
    expect(screen.getByText(/房颤最常见/)).toBeInTheDocument()
  })

  it('shows fun fact when present', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(screen.getByText(/右心房的容量/)).toBeInTheDocument()
  })

  it('shows relation groups', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(screen.getByText('连接')).toBeInTheDocument()
    expect(screen.getByText('三尖瓣、上腔静脉')).toBeInTheDocument()
    expect(screen.getByText('接收')).toBeInTheDocument()
    expect(screen.getByText('上腔静脉、下腔静脉')).toBeInTheDocument()
  })

  it('marks part as visited on render', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(useKnowledgeStore.getState().visitedParts.has('right-atrium')).toBe(true)
  })

  it('shows visited indicator for already-visited parts', () => {
    useKnowledgeStore.setState({ visitedParts: new Set(['right-atrium']) })
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    expect(screen.getByTitle('已浏览')).toBeInTheDocument()
  })

  it('closes panel when close button is clicked', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    const closeBtn = screen.getByLabelText('关闭')
    fireEvent.click(closeBtn)
    expect(useHeartStore.getState().selectedId).toBeNull()
  })

  it('toggles expanded state when handle is clicked', () => {
    useHeartStore.setState({ selectedId: 'right-atrium' })
    render(<InfoPanel />)
    const panel = screen.getByRole('button', { name: /展开面板/ })
    fireEvent.click(panel)
    expect(screen.getByRole('button', { name: /收起面板/ })).toBeInTheDocument()
  })
})
