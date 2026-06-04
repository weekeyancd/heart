import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { HeartModel } from './HeartModel'
import { CirculationParticles } from './CirculationParticles'
import { CirculationPaths } from './CirculationPaths'
import { SceneErrorBoundary } from '../ui/SceneErrorBoundary'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function HeartScene() {
  const reducedMotion = useReducedMotion()

  return (
    <SceneErrorBoundary>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, -3, -3]} intensity={0.3} />
        <Suspense fallback={null}>
          <HeartModel reducedMotion={reducedMotion} />
          <CirculationPaths />
          <CirculationParticles reducedMotion={reducedMotion} />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
    </SceneErrorBoundary>
  )
}
