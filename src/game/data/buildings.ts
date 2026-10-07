import type { BuildingData, SourceRef } from './types'

export const SOURCES = {
  official: { label: 'Website resmi Politeknik Statistika STIS', url: 'https://www.stis.ac.id/' },
  gramedia: {
    label: 'Gramedia — Profil Politeknik Statistika STIS',
    url: 'https://www.gramedia.com/pendidikan/universitas/politeknik-statistika-stis/'
  },
  skuling: { label: 'Skuling — Profil STIS', url: 'https://skuling.id/profil-stis/' },
  osm: { label: 'OpenStreetMap (© OpenStreetMap contributors, ODbL)', url: 'https://www.openstreetmap.org/way/486074780' }
} satisfies Record<string, SourceRef>

const POSITION_NOTE =
  'Posisi gedung di peta mengikuti footprint OpenStreetMap, tetapi pencocokan nama gedung dengan footprint masih perkiraan dan perlu diverifikasi.'

/**
 * Daftar gedung. Footprint & area pintu masuk ditentukan di Tiled (object layer "Buildings")
 * dengan property `buildingId` yang sama dengan `id` di sini.
 */
export const buildings: BuildingData[] = [
  {
    id: 'gedung-1',
    name: 'Gedung 1',
    shortName: 'GEDUNG 1',
    category: 'office',
    subtitle: 'Lobby, Ruang Dosen & Ruang Pimpinan',
    description:
      'Menurut informasi publik, Gedung 1 memiliki 4 lantai yang berisi lobby, ruang dosen, dan ruang pimpinan Politeknik Statistika STIS.',
    floors: 4,
    icon: '🏛️',
    color: '#1e6fd9',
    highlights: ['Lobby', 'Ruang Dosen', 'Ruang Pimpinan'],
    dataStatus: 'public',
    locationNote: POSITION_NOTE,
    sources: [SOURCES.gramedia, SOURCES.osm],
    keywords: ['lobi', 'dosen', 'pimpinan', 'direktur', 'administrasi']
  },
  {
    id: 'gedung-2',
    name: 'Gedung 2',
    shortName: 'GEDUNG 2',
    category: 'academic',
    subtitle: 'Ruang Kelas, Laboratorium & Lab Komputer',
    description:
      'Menurut informasi publik, Gedung 2 memiliki 6 lantai yang berisi ruang kelas, laboratorium, dan laboratorium komputer.',
    floors: 6,
    icon: '🏫',
    color: '#f28c28',
    highlights: ['Ruang Kelas', 'Laboratorium', 'Lab Komputer'],
    dataStatus: 'public',
    locationNote: POSITION_NOTE,
    sources: [SOURCES.gramedia, SOURCES.osm],
    keywords: ['kelas', 'kuliah', 'lab', 'komputer', 'praktikum']
  },
  {
    id: 'gedung-3',
    name: 'Gedung 3',
    shortName: 'GEDUNG 3',
    category: 'service',
    subtitle: 'Kantor, Kantin & Ruang UKM',
    description:
      'Menurut informasi publik, Gedung 3 memiliki 4 lantai yang berisi kantor, kantin, dan ruang Unit Kegiatan Mahasiswa (UKM).',
    floors: 4,
    icon: '🏢',
    color: '#2bb3a3',
    highlights: ['Kantor', 'Kantin', 'Ruang UKM'],
    dataStatus: 'public',
    locationNote: POSITION_NOTE,
    sources: [SOURCES.gramedia, SOURCES.osm],
    keywords: ['kantin', 'makan', 'ukm', 'organisasi', 'kantor']
  },
  {
    id: 'masjid-al-hasanah',
    name: 'Masjid Al Hasanah',
    shortName: 'MASJID',
    category: 'worship',
    subtitle: 'Masjid Kampus',
    description:
      'Masjid kampus Politeknik Statistika STIS. Data OpenStreetMap mencatat bangunan masjid ini memiliki 2 lantai.',
    floors: 2,
    icon: '🕌',
    markerCategory: 'mosque',
    color: '#2f8f5b',
    highlights: ['Tempat Ibadah', '2 Lantai'],
    dataStatus: 'osm',
    locationNote: 'Posisi dan nama masjid sesuai data OpenStreetMap.',
    sources: [SOURCES.osm, SOURCES.gramedia],
    keywords: ['masjid', 'mushola', 'salat', 'sholat', 'ibadah']
  }
]
