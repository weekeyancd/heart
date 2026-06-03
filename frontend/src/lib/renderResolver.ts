import type { InteractionState, RenderState } from './contracts'

const DEFAULT_RENDER: RenderState = {
  baseColor: [0, 0, 0],
  emissive: 0,
  opacity: 1,
  scale: 1,
  pulse: false,
  oxygenLevel: 0,
  bloodFlowIntensity: 0,
}

const TYPE_GROUPS: Record<string, string> = {
  chamber: 'chamber',
  vessel: 'vessel',
  valve: 'valve',
  structure: 'structure',
}

export function getRenderState(
  partId: string,
  state: InteractionState,
  occlusionMap: Record<string, string[]>,
  partTypes: Map<string, string>
): RenderState {
  const { hoverId, selectedId } = state

  if (selectedId === partId) {
    return { ...DEFAULT_RENDER, emissive: 0.6, opacity: 1, scale: 1.02, pulse: true }
  }

  if (selectedId !== null) {
    const occluders = occlusionMap[selectedId] ?? []
    if (occluders.includes(partId)) {
      return { ...DEFAULT_RENDER, opacity: 0.12 }
    }

    const selectedType = partTypes.get(selectedId) ?? ''
    const currentType = partTypes.get(partId) ?? ''
    const selectedGroup = TYPE_GROUPS[selectedType] ?? ''
    const currentGroup = TYPE_GROUPS[currentType] ?? ''

    if (currentGroup && currentGroup === selectedGroup && partId !== selectedId) {
      return { ...DEFAULT_RENDER, opacity: 0.35 }
    }

    if (partId !== hoverId) {
      return { ...DEFAULT_RENDER, opacity: 0.6 }
    }
  }

  if (hoverId === partId) {
    return { ...DEFAULT_RENDER, emissive: 0.3, opacity: 1 }
  }

  return DEFAULT_RENDER
}
