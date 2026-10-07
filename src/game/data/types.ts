// Tipe data kampus. Semua konten (gedung, lantai, ruangan, fasilitas, NPC) bersifat data-driven:
// menambah gedung baru cukup dengan menambah data, tanpa mengubah logika game / UI.

/**
 * Status keakuratan data:
 * - `public`: diambil dari sumber publik (artikel/website) — tetap perlu verifikasi pihak kampus.
 * - `osm`: posisi/bentuk berdasarkan OpenStreetMap.
 * - `demo`: data contoh/dummy, BUKAN informasi resmi STIS.
 */
export type DataStatus = 'public' | 'osm' | 'demo'

export interface SourceRef {
  label: string
  url?: string
}

export type BuildingCategory = 'academic' | 'office' | 'worship' | 'service'

export interface BuildingData {
  id: string
  name: string
  /** Label singkat di atas atap gedung pada peta. */
  shortName: string
  category: BuildingCategory
  subtitle: string
  description: string
  /** Jumlah lantai (harus sama dengan jumlah data lantai di floors.ts). */
  floors: number
  icon: string
  /** Kategori marker di peta (bawaan: 'building'). */
  markerCategory?: MarkerCategory
  /** Warna aksen untuk denah & mini-map. */
  color: string
  highlights: string[]
  dataStatus: DataStatus
  /** Catatan tentang posisi/penamaan gedung di peta. */
  locationNote?: string
  sources: SourceRef[]
  image?: string
  keywords?: string[]
}

export interface FloorData {
  id: string
  buildingId: string
  level: number
  name: string
  description: string
  dataStatus: DataStatus
  /** Ukuran bidang denah (unit SVG). Ruangan memakai koordinat di dalam bidang ini. */
  plan: { width: number; height: number }
}

export type RoomType =
  | 'classroom'
  | 'laboratory'
  | 'computer-lab'
  | 'lecturer'
  | 'leadership'
  | 'office'
  | 'meeting'
  | 'lobby'
  | 'canteen'
  | 'prayer'
  | 'ablution'
  | 'toilet'
  | 'stairs'
  | 'elevator'
  | 'student-activity'
  | 'service'
  | 'corridor'

export interface RoomShape {
  x: number
  y: number
  w: number
  h: number
}

export interface RoomData {
  id: string
  buildingId: string
  floorId: string
  name: string
  code: string
  type: RoomType
  capacity?: number
  description: string
  facilities: string[]
  image?: string
  dataStatus: DataStatus
  shape: RoomShape
}

export type FacilityCategory =
  | 'library'
  | 'canteen'
  | 'mosque'
  | 'sport'
  | 'toilet'
  | 'parking'
  | 'atm'
  | 'security'
  | 'transport'
  | 'gate'
  | 'info'
  | 'health'
  | 'shop'
  | 'hall'
  | 'laboratory'
  | 'student'

export interface FacilityData {
  id: string
  name: string
  category: FacilityCategory
  description: string
  dataStatus: DataStatus
  /** Jika fasilitas berada di dalam gedung. */
  buildingId?: string
  floorId?: string
  roomId?: string
  /** Keterangan bila lokasi belum dipetakan / masih perkiraan. */
  locationNote?: string
  /** Tampilkan marker di peta (bawaan: true bila lokasinya diketahui). */
  marker?: boolean
  /** Baris dialog saat pemain berinteraksi di peta (opsional). */
  dialog?: string[]
  sources?: SourceRef[]
  keywords?: string[]
}

export type MarkerCategory = FacilityCategory | 'building'

export type PanelId = 'about' | 'facilities' | 'guide' | 'directory' | 'menu'

export type TravelTarget = { kind: 'building' | 'facility' | 'npc'; id: string }

export type DialogAction =
  | { type: 'close' }
  | { type: 'goto'; node: string }
  | { type: 'open-building'; buildingId: string }
  | { type: 'explore-building'; buildingId: string; level?: number }
  | { type: 'open-panel'; panel: PanelId }
  | { type: 'travel'; target: TravelTarget }

export interface DialogChoice {
  label: string
  action: DialogAction
}

export interface DialogNode {
  lines: string[]
  /** Pilihan muncul setelah baris terakhir ditampilkan. */
  choices?: DialogChoice[]
}

export interface DialogScript {
  start: string
  nodes: Record<string, DialogNode>
}

export type Facing = 'down' | 'left' | 'right' | 'up'

export interface NpcData {
  id: string
  name: string
  role: string
  /** Baris karakter pada spritesheet chibi-layered.png (0-2). */
  spriteRow: number
  /** Warna tint (0xRRGGBB) agar NPC dengan sprite sama tetap berbeda. */
  tint?: number
  facing: Facing
  dialog: DialogScript
}
