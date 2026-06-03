export function QuizPage() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-lg)',
      background: 'var(--color-bg)',
    }}>
      <div style={{ fontSize: '56px', lineHeight: 1 }}>🧪</div>
      <h1 style={{
        fontSize: 'var(--font-size-hero)',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        知识测验
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)' }}>
        即将推出 — 通过测验巩固你的心脏解剖知识
      </p>
    </div>
  )
}
