import type { FloorData } from './types'

/** Ukuran bidang denah tiap gedung (mengikuti proporsi footprint di peta). */
export const PLAN_SIZE: Record<string, { width: number; height: number }> = {
  'gedung-1': { width: 100, height: 72 },
  'gedung-2': { width: 100, height: 52 },
  'gedung-3': { width: 100, height: 54 },
  'masjid-al-hasanah': { width: 100, height: 77 }
}

export function floorId(buildingId: string, level: number): string {
  return `${buildingId}-lt-${level}`
}

function floor(buildingId: string, level: number, description: string): FloorData {
  return {
    id: floorId(buildingId, level),
    buildingId,
    level,
    name: `Lantai ${level}`,
    description,
    dataStatus: 'demo',
    plan: PLAN_SIZE[buildingId] ?? { width: 100, height: 60 }
  }
}

/**
 * Data lantai. Isi/deskripsi lantai saat ini adalah DATA DEMO (belum ada denah resmi).
 * Ganti deskripsi & `dataStatus` saat denah resmi tersedia.
 */
export const floors: FloorData[] = [
  floor('gedung-1', 1, 'Lobby dan layanan informasi (denah demo).'),
  floor('gedung-1', 2, 'Ruang dosen dan ruang rapat (denah demo).'),
  floor('gedung-1', 3, 'Ruang dosen dan ruang diskusi (denah demo).'),
  floor('gedung-1', 4, 'Ruang pimpinan dan sekretariat (denah demo).'),

  floor('gedung-2', 1, 'Lobby gedung dan laboratorium komputer (denah demo).'),
  floor('gedung-2', 2, 'Laboratorium komputer dan laboratorium (denah demo).'),
  floor('gedung-2', 3, 'Laboratorium dan ruang teknis (denah demo).'),
  floor('gedung-2', 4, 'Ruang kelas (denah demo).'),
  floor('gedung-2', 5, 'Ruang kelas (denah demo).'),
  floor('gedung-2', 6, 'Ruang kelas (denah demo).'),

  floor('gedung-3', 1, 'Kantin dan kantor layanan (denah demo).'),
  floor('gedung-3', 2, 'Ruang kelas (denah demo).'),
  floor('gedung-3', 3, 'Ruang kelas (denah demo).'),
  floor('gedung-3', 4, 'Sekretariat UKM dan ruang kelas (denah demo).'),

  floor('masjid-al-hasanah', 1, 'Ruang salat utama dan tempat wudu (denah demo).'),
  floor('masjid-al-hasanah', 2, 'Ruang salat lantai 2 (denah demo).')
]
