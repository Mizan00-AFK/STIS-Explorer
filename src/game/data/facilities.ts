import { SOURCES } from './buildings'
import type { FacilityCategory, FacilityData, MarkerCategory } from './types'

/** Ikon & label tiap kategori marker. */
export const MARKER_CATEGORIES: Record<MarkerCategory, { icon: string; label: string }> = {
  building: { icon: '🏫', label: 'Gedung' },
  library: { icon: '📚', label: 'Perpustakaan' },
  canteen: { icon: '🍴', label: 'Kantin' },
  mosque: { icon: '🕌', label: 'Masjid' },
  sport: { icon: '🏃', label: 'Area Olahraga' },
  toilet: { icon: '🚻', label: 'Toilet' },
  parking: { icon: '🅿️', label: 'Parkir' },
  atm: { icon: '🏧', label: 'ATM' },
  security: { icon: '👮', label: 'Keamanan' },
  transport: { icon: '🚌', label: 'Transportasi' },
  gate: { icon: '🚪', label: 'Gerbang' },
  info: { icon: 'ℹ️', label: 'Informasi' },
  health: { icon: '🏥', label: 'Klinik' },
  shop: { icon: '🛒', label: 'Koperasi' },
  hall: { icon: '🎤', label: 'Auditorium' },
  laboratory: { icon: '💻', label: 'Laboratorium' },
  student: { icon: '🎭', label: 'Kemahasiswaan' }
}

export function facilityIcon(category: FacilityCategory): string {
  return MARKER_CATEGORIES[category].icon
}

const UNMAPPED = 'Lokasi fasilitas ini belum dipetakan karena belum ada data posisi yang terverifikasi.'

/**
 * Fasilitas kampus. Fasilitas yang punya objek di Tiled (object layer "Interactive",
 * property `facilityId`) atau `buildingId` akan muncul sebagai marker di peta.
 */
export const facilities: FacilityData[] = [
  {
    id: 'kantin',
    name: 'Kantin',
    category: 'canteen',
    description: 'Menurut informasi publik, kantin kampus berada di Gedung 3.',
    dataStatus: 'public',
    buildingId: 'gedung-3',
    floorId: 'gedung-3-lt-1',
    roomId: 'g3-1-01',
    locationNote: 'Gedung sesuai info publik; posisi lantai/ruangan pada denah adalah data demo.',
    sources: [SOURCES.gramedia],
    keywords: ['makan', 'minum', 'jajan']
  },
  {
    id: 'masjid',
    name: 'Masjid Al Hasanah',
    category: 'mosque',
    description: 'Masjid kampus dua lantai di sisi tenggara kampus.',
    dataStatus: 'osm',
    buildingId: 'masjid-al-hasanah',
    // Marker masjid sudah diwakili marker gedungnya (markerCategory: 'mosque').
    marker: false,
    sources: [SOURCES.osm],
    keywords: ['salat', 'sholat', 'ibadah', 'mushola']
  },
  {
    id: 'lab-komputer',
    name: 'Laboratorium Komputer',
    category: 'laboratory',
    description: 'Menurut informasi publik, laboratorium dan lab komputer berada di Gedung 2.',
    dataStatus: 'public',
    buildingId: 'gedung-2',
    floorId: 'gedung-2-lt-1',
    locationNote: 'Gedung sesuai info publik; posisi lantai/ruangan pada denah adalah data demo.',
    sources: [SOURCES.gramedia],
    keywords: ['lab', 'komputer', 'praktikum']
  },
  {
    id: 'ruang-ukm',
    name: 'Ruang UKM',
    category: 'student',
    description: 'Menurut informasi publik, ruang Unit Kegiatan Mahasiswa berada di Gedung 3.',
    dataStatus: 'public',
    buildingId: 'gedung-3',
    floorId: 'gedung-3-lt-4',
    locationNote: 'Gedung sesuai info publik; posisi lantai/ruangan pada denah adalah data demo.',
    sources: [SOURCES.gramedia],
    keywords: ['ukm', 'organisasi', 'kegiatan mahasiswa']
  },
  {
    id: 'toilet',
    name: 'Toilet',
    category: 'toilet',
    description: 'Toilet tersedia di setiap gedung pada denah demo.',
    dataStatus: 'demo',
    buildingId: 'gedung-1',
    floorId: 'gedung-1-lt-1',
    roomId: 'g1-1-wc',
    locationNote: 'Posisi toilet pada denah adalah data demo.',
    keywords: ['wc', 'kamar mandi']
  },
  {
    id: 'atm',
    name: 'ATM',
    category: 'atm',
    description: 'Titik ATM di sisi timur laut kampus, dekat area parkir.',
    dataStatus: 'osm',
    sources: [SOURCES.osm],
    dialog: ['Ini titik ATM kampus (lokasi sesuai data OpenStreetMap).', 'Bank penyedia ATM belum tercatat di STISMAP.'],
    keywords: ['uang', 'tarik tunai', 'bank']
  },
  {
    id: 'parkir',
    name: 'Area Parkir',
    category: 'parking',
    description:
      'Info publik menyebut kampus memiliki parkir basement. Area parkir terbuka di peta ini adalah representasi perkiraan.',
    dataStatus: 'demo',
    sources: [SOURCES.gramedia],
    dialog: ['Area parkir (representasi perkiraan).', 'Menurut info publik, kampus juga memiliki parkir basement.'],
    keywords: ['motor', 'mobil', 'kendaraan', 'basement']
  },
  {
    id: 'pos-keamanan',
    name: 'Pos Keamanan',
    category: 'security',
    description: 'Bangunan kecil dekat gerbang Jl. Otto Iskandardinata. Fungsi sebagai pos keamanan adalah perkiraan.',
    dataStatus: 'demo',
    sources: [SOURCES.osm],
    dialog: ['Pos keamanan kampus (fungsi bangunan merupakan perkiraan).', 'Sapa Pak Satpam di dekat sini untuk info gerbang dan halte.'],
    keywords: ['satpam', 'security', 'keamanan']
  },
  {
    id: 'gerbang-utama',
    name: 'Gerbang Jl. Otto Iskandardinata',
    category: 'gate',
    description: 'Gerbang kampus di sisi Jl. Otto Iskandardinata (Otista). Kampus ini dikenal sebagai Kampus Otista.',
    dataStatus: 'osm',
    sources: [SOURCES.osm],
    dialog: [
      'Gerbang kampus di sisi Jl. Otto Iskandardinata.',
      'Alamat kampus: Jl. Otto Iskandardinata No.64C, Bidara Cina, Jatinegara, Jakarta Timur.'
    ],
    keywords: ['otista', 'pintu masuk', 'alamat']
  },
  {
    id: 'gerbang-sensus',
    name: 'Gerbang Jl. Sensus Raya',
    category: 'gate',
    description: 'Gerbang kampus di sisi selatan, menghadap Jl. Sensus Raya.',
    dataStatus: 'osm',
    sources: [SOURCES.osm],
    dialog: ['Gerbang kampus di sisi Jl. Sensus Raya.'],
    keywords: ['sensus', 'pintu', 'selatan']
  },
  {
    id: 'halte-bps',
    name: 'Halte BPS',
    category: 'transport',
    description:
      'Halte bus di trotoar Jl. Otto Iskandardinata, tepat di depan kampus. Halte TransJakarta terdekat: Bidara Cina dan Gelanggang Remaja.',
    dataStatus: 'osm',
    sources: [SOURCES.osm],
    dialog: [
      'Halte BPS — halte bus di depan kampus.',
      'Halte TransJakarta terdekat di Jl. Otista: Bidara Cina dan Gelanggang Remaja (data OpenStreetMap).'
    ],
    keywords: ['bus', 'transjakarta', 'halte', 'angkutan']
  },
  {
    id: 'papan-informasi',
    name: 'Papan Informasi STISMAP',
    category: 'info',
    description: 'Papan petunjuk cara menjelajah STISMAP.',
    dataStatus: 'demo',
    dialog: [
      'Selamat datang di STISMAP — Virtual Campus Explorer!',
      'Gerak: WASD / tombol panah. Lari: tahan SHIFT. Interaksi: E atau SPACE.',
      'Cari gedung atau ruangan lewat tombol 🔍 di kanan atas (atau tekan / ).',
      'Data ruangan di dalam gedung masih data demo. Selalu cek informasi resmi di stis.ac.id.'
    ],
    keywords: ['bantuan', 'petunjuk', 'kontrol']
  },
  {
    id: 'perpustakaan',
    name: 'Perpustakaan',
    category: 'library',
    description: 'Info publik menyebut kampus memiliki perpustakaan.',
    dataStatus: 'public',
    locationNote: UNMAPPED,
    sources: [SOURCES.gramedia],
    keywords: ['buku', 'baca', 'library', 'pustaka']
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    category: 'hall',
    description: 'Info publik menyebut kampus memiliki auditorium.',
    dataStatus: 'public',
    locationNote: UNMAPPED,
    sources: [SOURCES.gramedia, SOURCES.skuling],
    keywords: ['aula', 'acara', 'seminar']
  },
  {
    id: 'klinik',
    name: 'Klinik',
    category: 'health',
    description: 'Info publik menyebut kampus memiliki klinik.',
    dataStatus: 'public',
    locationNote: UNMAPPED,
    sources: [SOURCES.gramedia, SOURCES.skuling],
    keywords: ['kesehatan', 'poliklinik', 'sakit']
  },
  {
    id: 'koperasi',
    name: 'Koperasi Mahasiswa',
    category: 'shop',
    description: 'Info publik menyebut kampus memiliki koperasi mahasiswa.',
    dataStatus: 'public',
    locationNote: UNMAPPED,
    sources: [SOURCES.gramedia],
    keywords: ['kopma', 'toko', 'belanja', 'atk']
  },
  {
    id: 'ruang-kesenian',
    name: 'Ruang Kesenian',
    category: 'student',
    description: 'Info publik menyebut kampus memiliki ruang kesenian.',
    dataStatus: 'public',
    locationNote: UNMAPPED,
    sources: [SOURCES.gramedia],
    keywords: ['seni', 'musik', 'tari']
  }
]
