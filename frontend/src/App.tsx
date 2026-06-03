import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const HeartPage = lazy(() => import('./pages/HeartPage').then((m) => ({ default: m.HeartPage })))
const QuizPage = lazy(() => import('./pages/QuizPage').then((m) => ({ default: m.QuizPage })))

function LoadingFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--font-size-lg)',
    }}>
      加载中...
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename="/heart">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<HeartPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
