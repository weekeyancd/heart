export interface HeartPart {
  id: string
  nameZh: string
  nameEn: string
  type: 'chamber' | 'vessel' | 'valve' | 'structure'
  layers: {
    anatomy: string
    physiology: string
    clinical?: string
  }
  relations: {
    connectsTo: string[]
    supplies: string[]
    receivesFrom: string[]
    affectedBy: string[]
  }
  circulationPaths: string[]
  funFact: string
}

export interface CirculationPathEdge {
  from: string
  to: string
  direction: 'oxy' | 'deoxy'
  duration: number
  delay: number
  oxygenLevel: number
}

export interface CirculationPath {
  id: string
  nameZh: string
  nameEn: string
  nodes: { partId: string; position: [number, number, number] }[]
  edges: CirculationPathEdge[]
  animationSpeed: number
}

export interface ModelMeta {
  partIds: string[]
  colorMapping: Record<string, { base: string; oxy: string; deoxy: string }>
  occlusionMap: Record<string, string[]>
}

export interface ApiResponse<T> {
  success: boolean
  version: string
  updatedAt: string
  data: T
  error: string | null
}

export interface RenderState {
  baseColor: [number, number, number]
  emissive: number
  opacity: number
  scale: number
  pulse: boolean
  oxygenLevel: number
  bloodFlowIntensity: number
}

export interface FlowSchedule {
  loop: 'systemic' | 'pulmonary'
  startTime: number
  duration: number
  phaseOffset: number
}

export interface KnowledgeStateData {
  visitedParts: string[]
  completedGuidedSteps: number
}

export interface PartInfo {
  partId: string
  type: HeartPart['type']
}

export interface InteractionState {
  hoverId: string | null
  selectedId: string | null
}

export interface KnowledgeProgress {
  userId: string
  visitedParts: string[]
  guidedStepsCompleted: number
  totalParts: number
  completionPercentage: number
}
