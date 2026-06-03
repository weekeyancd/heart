import { Link } from 'react-router-dom'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="home">
      <div className="home__bg-glow" />
      <header className="home__header">
        <div className="home__logo">♥</div>
        <h1 className="home__title">心脏解剖互动教学</h1>
        <p className="home__subtitle">
          直观学习心脏各部位功能及血液循环过程
        </p>
      </header>

      <div className="home__cards">
        <Link to="/learn" className="home__card home__card--primary">
          <div className="home__card-icon">🫀</div>
          <h2 className="home__card-title">3D 交互学习</h2>
          <p className="home__card-desc">
            旋转、缩放、点击探索心脏 14 个解剖部位，观看体循环与肺循环动画
          </p>
          <span className="home__card-action">进入学习 →</span>
        </Link>

        <Link to="/learn" className="home__card home__card--tour" onClick={() => localStorage.setItem('heart-start-tour', '1')}>
          <div className="home__card-icon">📖</div>
          <h2 className="home__card-title">引导式导览</h2>
          <p className="home__card-desc">
            跟随血液流动路径，从右心房到主动脉，逐步理解完整循环
          </p>
          <span className="home__card-action">开始导览 →</span>
        </Link>

        <div className="home__card home__card--coming">
          <div className="home__card-icon">🧪</div>
          <h2 className="home__card-title">知识测验</h2>
          <p className="home__card-desc">
            检验学习成果，巩固心脏解剖与循环知识
          </p>
          <span className="home__card-badge">即将推出</span>
        </div>
      </div>

      <footer className="home__footer">
        <p>拖拽旋转 · 滚轮缩放 · 点击探索</p>
      </footer>
    </div>
  )
}
