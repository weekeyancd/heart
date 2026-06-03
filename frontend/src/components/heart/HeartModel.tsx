import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useHeartStore } from '../../store/heartStore'
import { buildSemanticMeshLayer } from '../../lib/semanticMeshLayer'
import type { SemanticMeshLayer } from '../../lib/semanticMeshLayer'
import { MaterialController } from '../../lib/materialController'
import { getRenderState } from '../../lib/renderResolver'

const HEARTBEAT_BPM = 72
const HEARTBEAT_PERIOD = 60 / HEARTBEAT_BPM

export function HeartModel() {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'models/heart.glb')
  const layerRef = useRef<SemanticMeshLayer | null>(null)
  const controllerRef = useRef<MaterialController | null>(null)
  const clockRef = useRef(0)

  const hoverId = useHeartStore((s) => s.hoverId)
  const selectedId = useHeartStore((s) => s.selectedId)
  const modelMeta = useHeartStore((s) => s.modelMeta)
  const parts = useHeartStore((s) => s.parts)
  const hover = useHeartStore((s) => s.hover)
  const select = useHeartStore((s) => s.select)

  useEffect(() => {
    const layer = buildSemanticMeshLayer(scene, modelMeta ?? undefined)
    for (const part of parts) {
      layer.partTypes.set(part.id, part.type)
    }
    layerRef.current = layer
    controllerRef.current = new MaterialController(layer)
  }, [scene, modelMeta, parts])

  useEffect(() => {
    const controller = controllerRef.current
    const layer = layerRef.current
    if (!controller || !layer) return

    const occlusionMap = modelMeta?.occlusionMap ?? {}
    const resolved = new Map<string, ReturnType<typeof getRenderState>>()

    for (const partId of layer.getAllPartIds()) {
      resolved.set(partId, getRenderState(partId, { hoverId, selectedId }, occlusionMap, layer.partTypes))
    }

    controller.applyAll(resolved)
  }, [hoverId, selectedId, modelMeta])

  useEffect(() => {
    clockRef.current = 0
    const layer = layerRef.current
    if (!selectedId && layer) {
      for (const id of layer.getAllPartIds()) {
        const mesh = layer.get(id)
        if (mesh) mesh.scale.setScalar(1)
      }
    }
  }, [selectedId])

  useFrame((_, delta) => {
    const controller = controllerRef.current
    const layer = layerRef.current
    if (!controller || !layer || !selectedId) return

    clockRef.current += delta
    const phase = (clockRef.current % HEARTBEAT_PERIOD) / HEARTBEAT_PERIOD
    const pulse = Math.exp(-phase * 8) * Math.sin(phase * Math.PI * 4) * 0.04

    const mesh = layer.get(selectedId)
    if (mesh) {
      mesh.scale.setScalar(1 + pulse)
    }
  })

  const resolvePartId = (e: ThreeEvent<MouseEvent>): string | null => {
    const layer = layerRef.current
    if (!layer) return null
    const ud = e.object.userData
    const fromData = typeof ud?.partId === 'string' ? ud.partId : undefined
    return layer.getPartId(e.object) ?? fromData ?? e.object.name ?? null
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const partId = resolvePartId(e)
    select(partId ?? null)
  }

  const handlePointerOver = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const partId = resolvePartId(e)
    if (partId) hover(partId)
    document.body.style.cursor = partId ? 'pointer' : 'auto'
  }

  const handlePointerOut = () => {
    hover(null)
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
