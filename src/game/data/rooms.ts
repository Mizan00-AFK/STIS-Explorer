import { corridorPlan, type RoomSpec } from './layout'
import { floorId, PLAN_SIZE } from './floors'
import type { RoomData, RoomType } from './types'

/** Nilai bawaan per jenis ruangan (dipakai untuk data demo). */
const TYPE_DEFAULTS: Record<RoomType, { facilities: string[]; description: string; capacity?: number }> = {
  classroom: {
    capacity: 40,
    facilities: ['AC', 'Proyektor', 'Papan tulis', 'Meja & kursi kuliah'],
    description: 'Ruang kelas untuk kegiatan perkuliahan.'
  },
  'computer-lab': {
    capacity: 40,
    facilities: ['Komputer', 'Proyektor', 'AC', 'Jaringan internet'],
    description: 'Laboratorium komputer untuk praktikum dan pengolahan data.'
  },
  laboratory: {
    capacity: 30,
    facilities: ['Meja praktikum', 'Proyektor', 'AC'],
    description: 'Laboratorium untuk kegiatan praktikum.'
  },
  lecturer: {
    facilities: ['Meja kerja', 'AC', 'Jaringan internet'],
    description: 'Ruang kerja dosen.'
  },
  leadership: {
    facilities: ['Ruang kerja', 'Ruang tamu', 'AC'],
    description: 'Ruang kerja pimpinan.'
  },
  office: {
    facilities: ['Meja layanan', 'Komputer', 'AC'],
    description: 'Ruang kantor dan layanan administrasi.'
  },
  meeting: {
    capacity: 20,
    facilities: ['Meja rapat', 'Proyektor', 'AC'],
    description: 'Ruang rapat.'
  },
  lobby: {
    facilities: ['Area tunggu', 'Papan informasi'],
    description: 'Area penerimaan tamu dan tempat menunggu.'
  },
  canteen: {
    facilities: ['Meja makan', 'Kios makanan & minuman', 'Wastafel'],
    description: 'Kantin untuk mahasiswa dan civitas akademika.'
  },
  prayer: {
    facilities: ['Karpet salat', 'Rak Al-Qur’an', 'Pendingin ruangan'],
    description: 'Ruang salat.'
  },
  ablution: {
    facilities: ['Keran wudu', 'Rak sandal'],
    description: 'Tempat wudu.'
  },
  toilet: {
    facilities: ['Toilet', 'Wastafel'],
    description: 'Toilet.'
  },
  stairs: {
    facilities: [],
    description: 'Tangga penghubung antarlantai.'
  },
  elevator: {
    facilities: [],
    description: 'Lift penghubung antarlantai.'
  },
  'student-activity': {
    facilities: ['Meja rapat', 'Lemari arsip'],
    description: 'Sekretariat Unit Kegiatan Mahasiswa (UKM).'
  },
  service: {
    facilities: ['Rak penyimpanan'],
    description: 'Ruang servis/teknis.'
  },
  corridor: {
    facilities: [],
    description: 'Koridor.'
  }
}

/** Jenis ruangan yang namanya diberi nomor (mis. "Ruang Kelas 401"). */
const NUMBERED_TYPES: RoomType[] = ['classroom', 'computer-lab', 'laboratory', 'lecturer', 'student-activity']

const DEMO_NOTE = 'Data demo — nama, kode, kapasitas, dan fasilitas ruangan belum diverifikasi.'

/** Ruangan standar yang muncul di banyak lantai. */
const STAIRS: RoomSpec = { key: 't', name: 'Tangga', type: 'stairs', weight: 0.55 }
const LIFT: RoomSpec = { key: 'l', name: 'Lift', type: 'elevator', weight: 0.45 }
const TOILET: RoomSpec = { key: 'wc', name: 'Toilet', type: 'toilet', weight: 0.7 }

function numbered(level: number, n: number): string {
  return `${level}${String(n).padStart(2, '0')}`
}

/** Membuat RoomData demo untuk satu lantai berdasarkan denah koridor tengah. */
function demoFloor(
  buildingId: string,
  prefix: string,
  level: number,
  north: RoomSpec[],
  south: RoomSpec[],
  corridorName = 'Koridor'
): RoomData[] {
  const plan = PLAN_SIZE[buildingId] ?? { width: 100, height: 60 }
  const corridor: RoomSpec = { key: 'kor', name: corridorName, type: 'corridor' }
  return corridorPlan(plan, north, south, corridor).map(({ spec, shape }) => {
    const defaults = TYPE_DEFAULTS[spec.type]
    const isNumbered = /^\d+$/.test(spec.key)
    const roomNumber = isNumbered ? numbered(level, Number(spec.key)) : `${level}${spec.key.toUpperCase()}`
    return {
      id: `${prefix}-${level}-${spec.key}`,
      buildingId,
      floorId: floorId(buildingId, level),
      name: isNumbered && NUMBERED_TYPES.includes(spec.type) ? `${spec.name} ${roomNumber}` : spec.name,
      code: `${prefix.toUpperCase()}-${roomNumber}`,
      type: spec.type,
      capacity: spec.capacity ?? defaults.capacity,
      description: `${spec.description ?? defaults.description} ${DEMO_NOTE}`,
      facilities: spec.facilities ?? defaults.facilities,
      dataStatus: 'demo',
      shape
    }
  })
}

const room = (key: string, name: string, type: RoomType, weight = 1): RoomSpec => ({ key, name, type, weight })

function classroomFloor(prefix: string, buildingId: string, level: number): RoomData[] {
  return demoFloor(
    buildingId,
    prefix,
    level,
    [room('01', 'Ruang Kelas', 'classroom'), room('02', 'Ruang Kelas', 'classroom'), room('03', 'Ruang Kelas', 'classroom')],
    [STAIRS, LIFT, room('04', 'Ruang Kelas', 'classroom', 1.4), room('05', 'Ruang Kelas', 'classroom', 1.4), TOILET]
  )
}

/**
 * Seluruh ruangan. SEMUA ruangan di bawah ini adalah DATA DEMO.
 * Untuk data asli, ganti/tambahkan objek RoomData secara eksplisit (lihat CARA_MEMBUAT_MAP.md).
 */
export const rooms: RoomData[] = [
  // ---------------- Gedung 1 ----------------
  ...demoFloor(
    'gedung-1',
    'g1',
    1,
    [room('01', 'Lobby', 'lobby', 2.2), room('02', 'Meja Informasi', 'office', 1)],
    [STAIRS, LIFT, room('03', 'Ruang Tunggu', 'lobby', 1.4), TOILET]
  ),
  ...demoFloor(
    'gedung-1',
    'g1',
    2,
    [room('01', 'Ruang Dosen', 'lecturer'), room('02', 'Ruang Dosen', 'lecturer')],
    [STAIRS, LIFT, room('03', 'Ruang Rapat', 'meeting', 1.4), TOILET]
  ),
  ...demoFloor(
    'gedung-1',
    'g1',
    3,
    [room('01', 'Ruang Dosen', 'lecturer'), room('02', 'Ruang Dosen', 'lecturer'), room('03', 'Ruang Dosen', 'lecturer')],
    [STAIRS, LIFT, room('04', 'Ruang Diskusi', 'meeting', 1.4), TOILET]
  ),
  ...demoFloor(
    'gedung-1',
    'g1',
    4,
    [room('01', 'Ruang Pimpinan', 'leadership', 1.6), room('02', 'Sekretariat', 'office')],
    [STAIRS, LIFT, room('03', 'Ruang Rapat Pimpinan', 'meeting', 1.4), TOILET]
  ),

  // ---------------- Gedung 2 ----------------
  ...demoFloor(
    'gedung-2',
    'g2',
    1,
    [room('01', 'Lobby Gedung 2', 'lobby', 1.2), room('02', 'Laboratorium Komputer', 'computer-lab', 1.5), room('03', 'Laboratorium Komputer', 'computer-lab', 1.5)],
    [STAIRS, LIFT, room('04', 'Laboratorium', 'laboratory', 1.5), room('05', 'Ruang Asisten Lab', 'office'), TOILET]
  ),
  ...demoFloor(
    'gedung-2',
    'g2',
    2,
    [room('01', 'Laboratorium Komputer', 'computer-lab'), room('02', 'Laboratorium Komputer', 'computer-lab'), room('03', 'Laboratorium Komputer', 'computer-lab')],
    [STAIRS, LIFT, room('04', 'Laboratorium', 'laboratory', 2), TOILET]
  ),
  ...demoFloor(
    'gedung-2',
    'g2',
    3,
    [room('01', 'Laboratorium', 'laboratory'), room('02', 'Laboratorium', 'laboratory'), room('03', 'Laboratorium', 'laboratory')],
    [STAIRS, LIFT, room('04', 'Ruang Teknis', 'service', 2), TOILET]
  ),
  ...classroomFloor('g2', 'gedung-2', 4),
  ...classroomFloor('g2', 'gedung-2', 5),
  ...classroomFloor('g2', 'gedung-2', 6),

  // ---------------- Gedung 3 ----------------
  ...demoFloor(
    'gedung-3',
    'g3',
    1,
    [room('01', 'Kantin', 'canteen', 2.4), room('02', 'Kantor Layanan', 'office')],
    [STAIRS, room('03', 'Ruang Administrasi', 'office', 2), TOILET]
  ),
  ...demoFloor(
    'gedung-3',
    'g3',
    2,
    [room('01', 'Ruang Kelas', 'classroom'), room('02', 'Ruang Kelas', 'classroom'), room('03', 'Ruang Kelas', 'classroom')],
    [STAIRS, room('04', 'Ruang Kelas', 'classroom', 2), TOILET]
  ),
  ...demoFloor(
    'gedung-3',
    'g3',
    3,
    [room('01', 'Ruang Kelas', 'classroom'), room('02', 'Ruang Kelas', 'classroom'), room('03', 'Ruang Kelas', 'classroom')],
    [STAIRS, room('04', 'Ruang Kelas', 'classroom', 2), TOILET]
  ),
  ...demoFloor(
    'gedung-3',
    'g3',
    4,
    [room('01', 'Sekretariat UKM', 'student-activity'), room('02', 'Sekretariat UKM', 'student-activity'), room('03', 'Sekretariat UKM', 'student-activity')],
    [STAIRS, room('04', 'Ruang Kelas', 'classroom', 2), TOILET]
  ),

  // ---------------- Masjid Al Hasanah ----------------
  ...demoFloor(
    'masjid-al-hasanah',
    'mj',
    1,
    [room('01', 'Ruang Salat Utama', 'prayer')],
    [room('02', 'Tempat Wudu Pria', 'ablution'), room('03', 'Tempat Wudu Wanita', 'ablution'), TOILET, STAIRS],
    'Selasar'
  ),
  ...demoFloor(
    'masjid-al-hasanah',
    'mj',
    2,
    [room('01', 'Ruang Salat Lantai 2', 'prayer')],
    [STAIRS, room('02', 'Area Serbaguna', 'service', 3)],
    'Selasar'
  )
]
