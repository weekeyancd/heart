import { useEffect, useState, useCallback } from 'react'
import { useHeartStore } from '../../store/heartStore'
import { useKnowledgeStore } from '../../store/knowledgeStore'
import './InfoPanel.css'

const TYPE_LABELS: Record<string, string> = {
  chamber: '心腔',
  vessel: '血管',
  valve: '瓣膜',
  structure: '结构',
}

const TYPE_COLORS: Record<string, string> = {
  chamber: 'var(--color-badge-chamber)',
  vessel: 'var(--color-badge-vessel)',
  valve: 'var(--color-badge-valve)',
  structure: 'var(--color-badge-structure)',
}

export function InfoPanel() {
  const selectedId = useHeartStore((s) => s.selectedId)
  const parts = useHeartStore((s) => s.parts)
  const select = useHeartStore((s) => s.select)
  const visitedParts = useKnowledgeStore((s) => s.visitedParts)
  const markVisited = useKnowledgeStore((s) => s.markVisited)

  const [expanded, setExpanded] = useState(false)

  const part = parts.find((p) => p.id === selectedId)

  useEffect(() => {
    if (part && !visitedParts.has(part.id)) {
      markVisited(part.id)
    }
  }, [part?.id, visitedParts, markVisited])

  const toggleExpanded = useCallback(() => setExpanded((v) => !v), [])

  if (!part) {
    return (
      <aside className="info-panel info-panel--empty">
        <div className="info-panel__empty-state">
          <div className="info-panel__empty-icon">♥</div>
          <div className="info-panel__empty-text">点击心脏部位查看详细信息</div>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`info-panel${expanded ? ' info-panel--expanded' : ''}`}>
      <div className="info-panel__handle" onClick={toggleExpanded} role="button" aria-label={expanded ? '收起面板' : '展开面板'}>
        <span className="info-panel__handle-bar" />
      </div>
      <header className="info-panel__header">
        <div className="info-panel__title-row">
          <h2 className="info-panel__name-zh">{part.nameZh}</h2>
          <span className="info-panel__name-en">{part.nameEn}</span>
        </div>
        <div className="info-panel__meta-row">
          <span
            className="info-panel__type-badge"
            style={{ background: TYPE_COLORS[part.type] ?? 'var(--color-accent)' }}
          >
            {TYPE_LABELS[part.type] ?? part.type}
          </span>
          {visitedParts.has(part.id) && (
            <span className="info-panel__visited-dot" title="已浏览">✓</span>
          )}
        </div>
        <button className="info-panel__close" onClick={() => { select(null); setExpanded(false) }} aria-label="关闭">
          ✕
        </button>
      </header>

      <div className="info-panel__body">
        <section className="info-panel__section">
          <h3 className="info-panel__section-title">解剖结构</h3>
          <p className="info-panel__text">{part.layers.anatomy}</p>
        </section>

        <section className="info-panel__section">
          <h3 className="info-panel__section-title">生理功能</h3>
          <p className="info-panel__text">{part.layers.physiology}</p>
        </section>

        {part.layers.clinical && (
          <section className="info-panel__section info-panel__section--clinical">
            <h3 className="info-panel__section-title">临床关联</h3>
            <p className="info-panel__text">{part.layers.clinical}</p>
          </section>
        )}

        <section className="info-panel__section">
          <h3 className="info-panel__section-title">关联结构</h3>
          <div className="info-panel__relations">
            {part.relations.connectsTo.length > 0 && (
              <div className="info-panel__relation-group">
                <span className="info-panel__relation-label">连接</span>
                <span className="info-panel__relation-value">{part.relations.connectsTo.join('、')}</span>
              </div>
            )}
            {part.relations.supplies.length > 0 && (
              <div className="info-panel__relation-group">
                <span className="info-panel__relation-label">供血</span>
                <span className="info-panel__relation-value">{part.relations.supplies.join('、')}</span>
              </div>
            )}
            {part.relations.receivesFrom.length > 0 && (
              <div className="info-panel__relation-group">
                <span className="info-panel__relation-label">接收</span>
                <span className="info-panel__relation-value">{part.relations.receivesFrom.join('、')}</span>
              </div>
            )}
          </div>
        </section>

        {part.funFact && (
          <section className="info-panel__section info-panel__section--fun">
            <div className="info-panel__fun-fact">{part.funFact}</div>
          </section>
        )}
      </div>
    </aside>
  )
}
