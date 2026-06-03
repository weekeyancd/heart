import type { Object3D, Mesh } from 'three'
import type { ModelMeta } from './contracts'

export interface SemanticMeshLayer {
  readonly rawMeshes: Map<string, Mesh>
  readonly mapping: Map<Object3D, string>
  readonly partTypes: Map<string, string>
  get(partId: string): Mesh | undefined
  getPartId(object: Object3D): string | undefined
  getAllPartIds(): string[]
  getByType(type: string): Mesh[]
}

export function buildSemanticMeshLayer(
  scene: Object3D,
  meta?: ModelMeta
): SemanticMeshLayer {
  const rawMeshes = new Map<string, Mesh>()
  const mapping = new Map<Object3D, string>()
  const partTypes = new Map<string, string>()

  scene.traverse((child) => {
    if (!(child as Mesh).isMesh) return
    const mesh = child as Mesh
    const partId = (mesh.userData?.partId as string) || mesh.name || ''
    if (!partId) return

    rawMeshes.set(partId, mesh)
    mapping.set(mesh, partId)
  })

  if (meta) {
    for (const id of meta.partIds) {
      partTypes.set(id, 'structure')
    }
  }

  return {
    rawMeshes,
    mapping,
    partTypes,
    get(partId) {
      return rawMeshes.get(partId)
    },
    getPartId(object: Object3D) {
      return mapping.get(object)
    },
    getAllPartIds() {
      return Array.from(rawMeshes.keys())
    },
    getByType(type) {
      const result: Mesh[] = []
      for (const [id, mesh] of rawMeshes) {
        if (partTypes.get(id) === type) {
          result.push(mesh)
        }
      }
      return result
    },
  }
}
