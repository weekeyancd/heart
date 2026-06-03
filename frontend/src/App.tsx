import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import type { Object3D, Mesh, MeshStandardMaterial } from 'three'

const PART_LABELS: Record<string, string> = {
  'right-atrium': '右心房',
  'right-ventricle': '右心室',
  'left-atrium': '左心房',
  'left-ventricle': '左心室',
  'aorta': '主动脉',
  'pulmonary-artery': '肺动脉',
  'superior-vena-cava': '上腔静脉',
  'inferior-vena-cava': '下腔静脉',
  'pulmonary-vein': '肺静脉',
  'tricuspid-valve': '三尖瓣',
  'mitral-valve': '二尖瓣',
  'pulmonary-valve': '肺动脉瓣',
  'aortic-valve': '主动脉瓣',
  'septum': '室间隔',
}

function HeartModel({ onSelect }: { onSelect: (id: string, label: string) => void }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/heart.glb')

  scene.traverse((child: Object3D) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh
      const mat = mesh.material as MeshStandardMaterial
      if (mat && !mat.emissive) return
      // Make material respond to emissive
      if (mat) {
        mat.emissiveIntensity = 0
        mat.emissive.set(0xffffff)
        mat.transparent = true
      }
      // Read partId from extras
      const partId = (mesh.userData?.partId as string) || mesh.name || ''
      mesh.userData = { ...mesh.userData, partId }
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    const partId = e.object.userData?.partId || e.object.name || ''
    const label = PART_LABELS[partId] || partId
    onSelect(partId, label)
  }

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    const mesh = e.object as Mesh
    const mat = mesh.material as MeshStandardMaterial
    if (mat) {
      mat.emissiveIntensity = 0.3
    }
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: any) => {
    const mesh = e.object as Mesh
    const mat = mesh.material as MeshStandardMaterial
    if (mat) {
      mat.emissiveIntensity = 0
    }
    document.body.style.cursor = 'auto'
  }

  return (
    <primitive
      object={scene}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
}

function App() {
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, -3, -3]} intensity={0.3} />
        <Suspense fallback={null}>
          <HeartModel onSelect={(id, label) => setSelected({ id, label })} />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>

      {selected && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: 8,
          fontFamily: 'system-ui, sans-serif',
          minWidth: 200,
        }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>选中部位</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{selected.label}</div>
          <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>ID: {selected.id}</div>
        </div>
      )}

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
      }}>
        拖拽旋转 · 滚轮缩放 · 点击选择部位
      </div>
    </div>
  )
}

export default App
