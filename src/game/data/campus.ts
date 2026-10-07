// Titik masuk data kampus: struktur campus -> buildings -> floors -> rooms,
// fungsi lookup, indeks pencarian, dan validasi integritas data.
import { buildings } from './buildings'
import { floors } from './floors'
import { rooms } from './rooms'
import { facilities, facilityIcon, MARKER_CATEGORIES } from './facilities'
import { npcs } from './npcs'
import type { BuildingData, DialogAction, FacilityData, FloorData, NpcData, RoomData, RoomType } from './types'

export { buildings, floors, rooms, facilities, npcs, MARKER_CATEGORIES }

export const CAMPUS_INFO = {
  name: 'Politeknik Statistika STIS',
  nickname: 'Kampus Otista',
  address: 'Jl. Otto Iskandardinata No.64C, Bidara Cina, Kec. Jatinegara, Kota Jakarta Timur, DKI Jakarta 13330',
  website: 'https://www.stis.ac.id/'
}

const buildingMap = new Map(buildings.map((b) => [b.id, b]))
const floorMap = new Map(floors.map((f) => [f.id, f]))
const roomMap = new Map(rooms.map((r) => [r.id, r]))
const facilityMap = new Map(facilities.map((f) => [f.id, f]))
const npcMap = new Map(npcs.map((n) => [n.id, n]))

export const getBuilding = (id: string | null | undefined): BuildingData | undefined => (id ? buildingMap.get(id) : undefined)
export const getFloor = (id: string | null | undefined): FloorData | undefined => (id ? floorMap.get(id) : undefined)
export const getRoom = (id: string | null | undefined): RoomData | undefined => (id ? roomMap.get(id) : undefined)
export const getFacility = (id: string | null | undefined): FacilityData | undefined => (id ? facilityMap.get(id) : undefined)
export const getNpc = (id: string | null | undefined): NpcData | undefined => (id ? npcMap.get(id) : undefined)

export function floorsOf(buildingId: string): FloorData[] {
  return floors.filter((f) => f.buildingId === buildingId).sort((a, b) => a.level - b.level)
}

export function roomsOf(floorId: string): RoomData[] {
  return rooms.filter((r) => r.floorId === floorId)
}

export function findFloorByLevel(buildingId: string, level: number): FloorData | undefined {
  return floors.find((f) => f.buildingId === buildingId && f.level === level)
}

export const ROOM_TYPE_INFO: Record<RoomType, { label: string; color: string; icon: string }> = {
  classroom: { label: 'Ruang Kelas', color: '#3b82f6', icon: '📘' },
  'computer-lab': { label: 'Lab Komputer', color: '#8b5cf6', icon: '💻' },
  laboratory: { label: 'Laboratorium', color: '#a855f7', icon: '🧪' },
  lecturer: { label: 'Ruang Dosen', color: '#0ea5e9', icon: '🧑‍🏫' },
  leadership: { label: 'Ruang Pimpinan', color: '#1d4ed8', icon: '🏛️' },
  office: { label: 'Kantor / Layanan', color: '#14b8a6', icon: '🗂️' },
  meeting: { label: 'Ruang Rapat', color: '#06b6d4', icon: '🤝' },
  lobby: { label: 'Lobby', color: '#f59e0b', icon: '🛎️' },
  canteen: { label: 'Kantin', color: '#f97316', icon: '🍴' },
  prayer: { label: 'Ruang Salat', color: '#22c55e', icon: '🕌' },
  ablution: { label: 'Tempat Wudu', color: '#38bdf8', icon: '💧' },
  toilet: { label: 'Toilet', color: '#94a3b8', icon: '🚻' },
  stairs: { label: 'Tangga', color: '#64748b', icon: '🪜' },
  elevator: { label: 'Lift', color: '#475569', icon: '🛗' },
  'student-activity': { label: 'Kegiatan Mahasiswa', color: '#ec4899', icon: '🎭' },
  service: { label: 'Ruang Servis', color: '#78716c', icon: '🧰' },
  corridor: { label: 'Koridor', color: '#334155', icon: '🚶' }
}

/** Ruangan yang bisa diklik di denah (koridor tidak). */
export function isSelectableRoom(room: RoomData): boolean {
  return room.type !== 'corridor'
}

// ---------------------------------------------------------------------------
// Pencarian
// ---------------------------------------------------------------------------

export type SearchKind = 'building' | 'room' | 'facility'

export interface SearchEntry {
  kind: SearchKind
  id: string
  title: string
  subtitle: string
  icon: string
  isDemo: boolean
  haystack: string
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function locationLabel(buildingId?: string, floorId?: string): string {
  const building = getBuilding(buildingId)
  const floor = getFloor(floorId)
  if (!building) return 'Lokasi belum dipetakan'
  return floor ? `${building.name} · ${floor.name}` : building.name
}

export const searchIndex: SearchEntry[] = [
  ...buildings.map<SearchEntry>((b) => ({
    kind: 'building',
    id: b.id,
    title: b.name,
    subtitle: `${b.subtitle} · ${b.floors} lantai`,
    icon: b.icon,
    isDemo: b.dataStatus === 'demo',
    haystack: normalize([b.name, b.shortName, b.subtitle, b.description, ...b.highlights, ...(b.keywords ?? []), 'gedung'].join(' '))
  })),
  ...facilities.map<SearchEntry>((f) => ({
    kind: 'facility',
    id: f.id,
    title: f.name,
    subtitle: f.buildingId ? locationLabel(f.buildingId, f.floorId) : f.locationNote ? 'Lokasi belum dipetakan' : 'Area kampus',
    icon: facilityIcon(f.category),
    isDemo: f.dataStatus === 'demo',
    haystack: normalize([f.name, MARKER_CATEGORIES[f.category].label, f.description, ...(f.keywords ?? []), 'fasilitas'].join(' '))
  })),
  ...rooms.filter(isSelectableRoom).map<SearchEntry>((r) => ({
    kind: 'room',
    id: r.id,
    title: r.name,
    subtitle: `${r.code} · ${locationLabel(r.buildingId, r.floorId)}`,
    icon: ROOM_TYPE_INFO[r.type].icon,
    isDemo: r.dataStatus === 'demo',
    haystack: normalize([r.name, r.code, ROOM_TYPE_INFO[r.type].label, ...r.facilities, 'ruang ruangan'].join(' '))
  }))
]

const KIND_ORDER: Record<SearchKind, number> = { building: 0, facility: 1, room: 2 }

/** Cari gedung, fasilitas, dan ruangan. Semua kata kunci harus cocok. */
export function searchCampus(query: string, limit = 40): SearchEntry[] {
  const q = normalize(query)
  if (!q) return []
  const tokens = q.split(' ')
  return searchIndex
    .filter((entry) => tokens.every((t) => entry.haystack.includes(t)))
    .map((entry) => {
      const title = normalize(entry.title)
      const score = (title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2) * 10 + KIND_ORDER[entry.kind]
      return { entry, score }
    })
    .sort((a, b) => a.score - b.score || a.entry.title.localeCompare(b.entry.title, 'id', { numeric: true }))
    .slice(0, limit)
    .map((r) => r.entry)
}

// ---------------------------------------------------------------------------
// Validasi
// ---------------------------------------------------------------------------

function checkAction(action: DialogAction, nodes: Record<string, unknown>, where: string, errors: string[]) {
  if (action.type === 'goto' && !nodes[action.node]) errors.push(`${where}: node dialog "${action.node}" tidak ada`)
  if ((action.type === 'open-building' || action.type === 'explore-building') && !buildingMap.has(action.buildingId))
    errors.push(`${where}: gedung "${action.buildingId}" tidak ada`)
  if (action.type === 'travel') {
    const { kind, id } = action.target
    const exists = kind === 'building' ? buildingMap.has(id) : kind === 'facility' ? facilityMap.has(id) : npcMap.has(id)
    if (!exists) errors.push(`${where}: tujuan ${kind} "${id}" tidak ada`)
  }
}

/** Mengembalikan daftar kesalahan data (kosong bila valid). */
export function validateCampusData(): string[] {
  const errors: string[] = []
  const dupes = (list: { id: string }[], label: string) => {
    const seen = new Set<string>()
    for (const item of list) {
      if (seen.has(item.id)) errors.push(`${label} duplikat: ${item.id}`)
      seen.add(item.id)
    }
  }
  dupes(buildings, 'Gedung')
  dupes(floors, 'Lantai')
  dupes(rooms, 'Ruangan')
  dupes(facilities, 'Fasilitas')
  dupes(npcs, 'NPC')

  for (const b of buildings) {
    const count = floorsOf(b.id).length
    if (count !== b.floors) errors.push(`${b.name}: floors=${b.floors} tetapi data lantai berjumlah ${count}`)
  }
  for (const f of floors) if (!buildingMap.has(f.buildingId)) errors.push(`Lantai ${f.id}: gedung "${f.buildingId}" tidak ada`)
  for (const r of rooms) {
    const floor = floorMap.get(r.floorId)
    if (!floor) errors.push(`Ruangan ${r.id}: lantai "${r.floorId}" tidak ada`)
    else if (floor.buildingId !== r.buildingId) errors.push(`Ruangan ${r.id}: buildingId tidak cocok dengan lantainya`)
  }
  for (const f of facilities) {
    if (f.buildingId && !buildingMap.has(f.buildingId)) errors.push(`Fasilitas ${f.id}: gedung "${f.buildingId}" tidak ada`)
    if (f.floorId && !floorMap.has(f.floorId)) errors.push(`Fasilitas ${f.id}: lantai "${f.floorId}" tidak ada`)
    if (f.roomId && !roomMap.has(f.roomId)) errors.push(`Fasilitas ${f.id}: ruangan "${f.roomId}" tidak ada`)
  }
  for (const n of npcs) {
    if (!n.dialog.nodes[n.dialog.start]) errors.push(`NPC ${n.id}: node awal "${n.dialog.start}" tidak ada`)
    for (const [key, node] of Object.entries(n.dialog.nodes)) {
      if (node.lines.length === 0) errors.push(`NPC ${n.id}: node "${key}" tidak punya baris dialog`)
      for (const choice of node.choices ?? []) checkAction(choice.action, n.dialog.nodes, `NPC ${n.id}/${key}`, errors)
    }
  }
  return errors
}
