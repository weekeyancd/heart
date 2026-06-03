import { MeshStandardMaterial, type Mesh } from 'three'
import type { RenderState } from './contracts'
import type { SemanticMeshLayer } from './semanticMeshLayer'

export class MaterialController {
  private layer: SemanticMeshLayer

  constructor(layer: SemanticMeshLayer) {
    this.layer = layer
  }

  apply(partId: string, state: RenderState): void {
    const mesh = this.layer.get(partId)
    if (!mesh) return
    this.applyToMesh(mesh, state)
  }

  applyAll(resolved: Map<string, RenderState>): void {
    for (const [partId, state] of resolved) {
      this.apply(partId, state)
    }
  }

  resetAll(): void {
    for (const partId of this.layer.getAllPartIds()) {
      const mesh = this.layer.get(partId)
      if (mesh) {
        this.applyToMesh(mesh, {
          baseColor: [0, 0, 0],
          emissive: 0,
          opacity: 1,
          scale: 1,
          pulse: false,
          oxygenLevel: 0,
          bloodFlowIntensity: 0,
        })
      }
    }
  }

  private applyToMesh(mesh: Mesh, state: RenderState): void {
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material]

    for (const mat of materials) {
      if (!(mat instanceof MeshStandardMaterial)) continue

      mat.emissiveIntensity = state.emissive
      mat.emissive.set(0xffffff)
      mat.opacity = state.opacity
      mat.transparent = state.opacity < 1
    }
  }
}
