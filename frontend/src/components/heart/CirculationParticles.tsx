import { useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCirculationStore } from '../../store/circulationStore'
import * as THREE from 'three'

interface ParticleData {
  position: THREE.Vector3
  velocity: THREE.Vector3
  progress: number
  fromPos: THREE.Vector3
  toPos: THREE.Vector3
  duration: number
  delay: number
  color: THREE.Color
  phaseOffset: number
}

interface CirculationParticlesProps {
  reducedMotion?: boolean
}

const OXY_COLOR = new THREE.Color('#ff4444')
const DEOXY_COLOR = new THREE.Color('#7c4dff')
const PARTICLE_COUNT_PER_EDGE = 4

export function CirculationParticles({ reducedMotion = false }: CirculationParticlesProps) {
  const paths = useCirculationStore((s) => s.paths)
  const activeLoopId = useCirculationStore((s) => s.activeLoopId)
  const isPlaying = useCirculationStore((s) => s.isPlaying)
  const playbackSpeed = useCirculationStore((s) => s.playbackSpeed)

  const { particles, geometry, material } = useMemo(() => {
    const activePath = paths.find((p) => p.id === activeLoopId)
    if (!activePath) {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
      return {
        particles: [],
        geometry: geo,
        material: new THREE.PointsMaterial({ size: 0, transparent: true }),
      }
    }

    const nodeMap = new Map(activePath.nodes.map((n) => [n.partId, n.position]))
    const allParticles: ParticleData[] = []

    for (const edge of activePath.edges) {
      const fromPos = nodeMap.get(edge.from)
      const toPos = nodeMap.get(edge.to)
      if (!fromPos || !toPos) continue

      const from = new THREE.Vector3(...fromPos)
      const to = new THREE.Vector3(...toPos)
      const color = edge.direction === 'oxy' ? OXY_COLOR : DEOXY_COLOR

      for (let i = 0; i < PARTICLE_COUNT_PER_EDGE; i++) {
        allParticles.push({
          position: from.clone(),
          velocity: new THREE.Vector3(),
          progress: i / PARTICLE_COUNT_PER_EDGE,
          fromPos: from,
          toPos: to,
          duration: edge.duration,
          delay: edge.delay,
          color,
          phaseOffset: i / PARTICLE_COUNT_PER_EDGE,
        })
      }
    }

    const positions = new Float32Array(allParticles.length * 3)
    const colors = new Float32Array(allParticles.length * 3)

    for (let i = 0; i < allParticles.length; i++) {
      const p = allParticles[i]
      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 2] = p.position.z
      colors[i * 3] = p.color.r
      colors[i * 3 + 1] = p.color.g
      colors[i * 3 + 2] = p.color.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    return { particles: allParticles, geometry: geo, material: mat }
  }, [paths, activeLoopId])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((_, delta) => {
    if (!isPlaying || particles.length === 0 || reducedMotion) return

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const tick = useCirculationStore.getState().tick
    tick(delta)

    const { currentTime } = useCirculationStore.getState()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const elapsed = currentTime * playbackSpeed - p.delay
      const t = ((elapsed / p.duration) + p.phaseOffset) % 1
      const clampedT = Math.max(0, Math.min(1, t))

      p.position.lerpVectors(p.fromPos, p.toPos, clampedT)
      posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z)
    }

    posAttr.needsUpdate = true
  })

  if (!activeLoopId || particles.length === 0) return null

  return <points geometry={geometry} material={material} />
}
