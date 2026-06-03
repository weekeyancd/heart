import { describe, it, expect } from 'vitest'
import { buildSemanticMeshLayer } from '../semanticMeshLayer'
import { Object3D, Mesh, BufferGeometry, MeshStandardMaterial } from 'three'

function makeMockMesh(name: string, partId?: string): Mesh {
  const mesh = new Mesh(new BufferGeometry(), new MeshStandardMaterial())
  mesh.name = name
  if (partId) mesh.userData.partId = partId
  return mesh
}

describe('buildSemanticMeshLayer', () => {
  it('returns empty layer for empty scene', () => {
    const scene = new Object3D()
    const layer = buildSemanticMeshLayer(scene)
    expect(layer.getAllPartIds()).toEqual([])
  })

  it('maps meshes by name when no partId in userData', () => {
    const scene = new Object3D()
    const mesh = makeMockMesh('right-atrium')
    scene.add(mesh)

    const layer = buildSemanticMeshLayer(scene)
    expect(layer.get('right-atrium')).toBe(mesh)
    expect(layer.getAllPartIds()).toEqual(['right-atrium'])
  })

  it('prefers userData.partId over mesh name', () => {
    const scene = new Object3D()
    const mesh = makeMockMesh('mesh_001', 'left-ventricle')
    scene.add(mesh)

    const layer = buildSemanticMeshLayer(scene)
    expect(layer.get('left-ventricle')).toBe(mesh)
    expect(layer.get('mesh_001')).toBeUndefined()
  })

  it('skips non-mesh objects', () => {
    const scene = new Object3D()
    const group = new Object3D()
    group.name = 'some-group'
    scene.add(group)
    const mesh = makeMockMesh('aorta')
    scene.add(mesh)

    const layer = buildSemanticMeshLayer(scene)
    expect(layer.getAllPartIds()).toEqual(['aorta'])
  })

  it('getPartId returns partId for a mesh', () => {
    const scene = new Object3D()
    const mesh = makeMockMesh('septum')
    scene.add(mesh)

    const layer = buildSemanticMeshLayer(scene)
    expect(layer.getPartId(mesh)).toBe('septum')
  })

  it('getPartId returns undefined for unknown object', () => {
    const scene = new Object3D()
    const layer = buildSemanticMeshLayer(scene)
    expect(layer.getPartId(new Object3D())).toBeUndefined()
  })

  it('populates partTypes from meta when provided', () => {
    const scene = new Object3D()
    scene.add(makeMockMesh('right-atrium'))
    scene.add(makeMockMesh('aorta'))

    const layer = buildSemanticMeshLayer(scene, {
      partIds: ['right-atrium', 'aorta'],
      colorMapping: {},
      occlusionMap: {},
    })

    expect(layer.getByType('structure')).toHaveLength(2)
  })

  it('getByType filters by type', () => {
    const scene = new Object3D()
    const mesh1 = makeMockMesh('part-a')
    const mesh2 = makeMockMesh('part-b')
    scene.add(mesh1)
    scene.add(mesh2)

    const layer = buildSemanticMeshLayer(scene, {
      partIds: ['part-a'],
      colorMapping: {},
      occlusionMap: {},
    })

    const structureMeshes = layer.getByType('structure')
    expect(structureMeshes).toHaveLength(1)
    expect(structureMeshes[0]).toBe(mesh1)
  })
})
