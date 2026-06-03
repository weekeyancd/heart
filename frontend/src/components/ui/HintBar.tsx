import { useHeartStore } from '../../store/heartStore'
import { useCirculationStore } from '../../store/circulationStore'
import './HintBar.css'

export function HintBar() {
  const selectedId = useHeartStore((s) => s.selectedId)
  const activeLoopId = useCirculationStore((s) => s.activeLoopId)

  const hint = activeLoopId
    ? '点击播放/暂停控制血流动画'
    : selectedId
      ? '点击其他部位继续探索，或点击空白处取消选择'
      : '拖拽旋转 · 滚轮缩放 · 点击选择部位'

  return <div className="hint-bar">{hint}</div>
}
