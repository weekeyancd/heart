import { describe, it, expect } from 'vitest'
import { fetchParts, fetchCirculation, fetchModelMeta, fetchPart, fetchCirculationPath } from '../api'

describe('api fallback to local data', () => {
  it('fetchParts returns local data when API unavailable', async () => {
    const parts = await fetchParts()
    expect(parts.length).toBeGreaterThan(0)
    expect(parts[0]).toHaveProperty('id')
    expect(parts[0]).toHaveProperty('nameZh')
    expect(parts[0]).toHaveProperty('layers')
  })

  it('fetchPart returns specific part from local data', async () => {
    const part = await fetchPart('right-atrium')
    expect(part.id).toBe('right-atrium')
    expect(part.nameZh).toBe('右心房')
  })

  it('fetchPart throws for unknown id', async () => {
    await expect(fetchPart('nonexistent')).rejects.toThrow('Part not found')
  })

  it('fetchCirculation returns circulation paths from local data', async () => {
    const paths = await fetchCirculation()
    expect(paths.length).toBeGreaterThan(0)
    expect(paths[0]).toHaveProperty('id')
    expect(paths[0]).toHaveProperty('nodes')
    expect(paths[0]).toHaveProperty('edges')
  })

  it('fetchCirculationPath returns specific path from local data', async () => {
    const path = await fetchCirculationPath('systemic-loop')
    expect(path.id).toBe('systemic-loop')
    expect(path.nameZh).toBe('体循环')
  })

  it('fetchCirculationPath throws for unknown id', async () => {
    await expect(fetchCirculationPath('nonexistent')).rejects.toThrow('Circulation path not found')
  })

  it('fetchModelMeta returns meta from local data', async () => {
    const meta = await fetchModelMeta()
    expect(meta).toHaveProperty('partIds')
    expect(meta).toHaveProperty('colorMapping')
    expect(meta).toHaveProperty('occlusionMap')
    expect(meta.partIds.length).toBeGreaterThan(0)
  })
})
