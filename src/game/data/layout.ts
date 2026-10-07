import type { RoomShape, RoomType } from './types'

/** Spesifikasi ruangan sebelum diberi posisi pada denah. */
export interface RoomSpec {
  /** Akhiran id & kode ruangan, mis. "01" -> ruang 401 di lantai 4. */
  key: string
  name: string
  type: RoomType
  /** Bobot lebar relatif terhadap ruangan lain di baris yang sama. */
  weight?: number
  capacity?: number
  facilities?: string[]
  description?: string
}

export interface PlannedRoom {
  spec: RoomSpec
  shape: RoomShape
}

function placeRow(specs: RoomSpec[], y: number, h: number, width: number): PlannedRoom[] {
  const total = specs.reduce((sum, s) => sum + (s.weight ?? 1), 0)
  let x = 0
  return specs.map((spec, i) => {
    const isLast = i === specs.length - 1
    const w = isLast ? width - x : Math.round(((spec.weight ?? 1) / total) * width * 10) / 10
    const shape = { x, y, w, h }
    x += w
    return { spec, shape }
  })
}

/**
 * Denah koridor tengah (double-loaded corridor): deret ruangan di sisi utara dan selatan,
 * dipisahkan koridor. Cocok untuk denah demo; denah asli dapat ditulis manual dengan `shape`.
 */
export function corridorPlan(
  plan: { width: number; height: number },
  north: RoomSpec[],
  south: RoomSpec[],
  corridor: RoomSpec = { key: 'kor', name: 'Koridor', type: 'corridor' },
  corridorRatio = 0.2
): PlannedRoom[] {
  const corridorH = Math.round(plan.height * corridorRatio * 10) / 10
  const rowH = (plan.height - corridorH) / 2
  return [
    ...placeRow(north, 0, rowH, plan.width),
    { spec: corridor, shape: { x: 0, y: rowH, w: plan.width, h: corridorH } },
    ...placeRow(south, rowH + corridorH, plan.height - rowH - corridorH, plan.width)
  ]
}
