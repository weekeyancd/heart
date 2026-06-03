import { useMemo, useEffect, useRef } from 'react'
import { useCirculationStore } from '../../store/circulationStore'
import * as THREE from 'three'

export function CirculationPaths() {
  const paths = useCirculationStore((s) => s.paths)
  const activeLoopId = useCirculationStore((s) => s.activeLoopId)
  const prevObjectsRef = useRef<{ lineObj: THREE.Line; key: string }[]>([])

  const lineObjects = useMemo(() => {
    const activePath = paths.find((p) => p.id === activeLoopId)
    if (!activePath) return []

    const nodeMap = new Map(activePath.nodes.map((n) => [n.partId, n.position]))

    return activePath.edges.map((edge) => {
      const from = nodeMap.get(edge.from)
      const to = nodeMap.get(edge.to)
      if (!from || !to) return null

      const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const color = edge.direction === 'oxy' ? 0xff4444 : 0x7c4dff
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 })
      const lineObj = new THREE.Line(geo, mat)
      return { lineObj, key: `${edge.from}-${edge.to}` }
    }).filter(Boolean) as { lineObj: THREE.Line; key: string }[]
  }, [paths, activeLoopId])

  useEffect(() => {
    const prev = prevObjectsRef.current
    for (const { lineObj } of prev) {
      lineObj.geometry.dispose()
      ;(lineObj.material as THREE.Material).dispose()
    }
    prevObjectsRef.current = lineObjects
    return () => {
      for (const { lineObj } of lineObjects) {
        lineObj.geometry.dispose()
        ;(lineObj.material as THREE.Material).dispose()
      }
    }
  }, [lineObjects])

  if (!activeLoopId || lineObjects.length === 0) return null

  return (
    <group>
      {lineObjects.map(({ lineObj, key }) => (
        <primitive key={key} object={lineObj} />
      ))}
    </group>
  )
}
