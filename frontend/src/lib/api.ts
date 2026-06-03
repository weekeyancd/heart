import type { ApiResponse, HeartPart, CirculationPath, ModelMeta } from './contracts'
import { LOCAL_PARTS, LOCAL_PATHS, LOCAL_MODEL_META } from './localData'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  const json: ApiResponse<T> = await res.json()
  if (!json.success) {
    throw new Error(json.error ?? `API error: ${path}`)
  }
  return json.data
}

function toPosition(pos: unknown): [number, number, number] {
  if (Array.isArray(pos) && pos.length >= 3 && pos.slice(0, 3).every(Number.isFinite)) {
    return [pos[0], pos[1], pos[2]]
  }
  return [0, 0, 0]
}

export async function fetchParts(): Promise<HeartPart[]> {
  try {
    return await request<HeartPart[]>('/parts')
  } catch {
    return LOCAL_PARTS
  }
}

export async function fetchPart(id: string): Promise<HeartPart> {
  try {
    return await request<HeartPart>(`/parts/${id}`)
  } catch {
    const part = LOCAL_PARTS.find((p) => p.id === id)
    if (!part) throw new Error(`Part not found: ${id}`)
    return part
  }
}

export async function fetchCirculation(): Promise<CirculationPath[]> {
  try {
    const paths = await request<CirculationPath[]>('/circulation')
    return paths.map(path => ({
      ...path,
      nodes: path.nodes.map(node => ({
        ...node,
        position: toPosition(node.position),
      })),
    }))
  } catch {
    return LOCAL_PATHS
  }
}

export async function fetchCirculationPath(id: string): Promise<CirculationPath> {
  try {
    const path = await request<CirculationPath>(`/circulation/${id}`)
    return {
      ...path,
      nodes: path.nodes.map(node => ({
        ...node,
        position: toPosition(node.position),
      })),
    }
  } catch {
    const path = LOCAL_PATHS.find((p) => p.id === id)
    if (!path) throw new Error(`Circulation path not found: ${id}`)
    return path
  }
}

export async function fetchModelMeta(): Promise<ModelMeta> {
  try {
    return await request<ModelMeta>('/models/meta')
  } catch {
    return LOCAL_MODEL_META
  }
}
