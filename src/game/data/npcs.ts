import type { NpcData } from './types'

/**
 * NPC kampus. Semua NPC adalah karakter fiktif pemandu (bukan tokoh/pejabat asli STIS).
 * Posisi NPC ditentukan di Tiled (object layer "NPCs", property `npcId`).
 */
export const npcs: NpcData[] = [
  {
    id: 'guide',
    name: 'Pemandu Kampus',
    role: 'Guide',
    spriteRow: 2,
    tint: 0xffe0b0,
    facing: 'down',
    dialog: {
      start: 'start',
      nodes: {
        start: {
          lines: [
            'Halo! Selamat datang di Politeknik Statistika STIS — Kampus Otista.',
            'Saya Pemandu Kampus. Saya akan membantu kamu mengenal lingkungan kampus.'
          ],
          choices: [
            { label: 'Informasi Gedung', action: { type: 'goto', node: 'buildings' } },
            { label: 'Informasi Fasilitas', action: { type: 'goto', node: 'facilities' } },
            { label: 'Tips untuk Mahasiswa Baru', action: { type: 'goto', node: 'tips' } },
            { label: 'Sampai jumpa!', action: { type: 'close' } }
          ]
        },
        buildings: {
          lines: [
            'Kampus ini punya tiga gedung utama dan sebuah masjid.',
            'Menurut info publik: Gedung 1 (4 lantai) berisi lobby, ruang dosen, dan ruang pimpinan.',
            'Gedung 2 (6 lantai) berisi ruang kelas, laboratorium, dan lab komputer.',
            'Gedung 3 (4 lantai) berisi kantor, kantin, dan ruang UKM. Mau saya antar?'
          ],
          choices: [
            { label: 'Antar ke Gedung 1', action: { type: 'travel', target: { kind: 'building', id: 'gedung-1' } } },
            { label: 'Antar ke Gedung 2', action: { type: 'travel', target: { kind: 'building', id: 'gedung-2' } } },
            { label: 'Antar ke Gedung 3', action: { type: 'travel', target: { kind: 'building', id: 'gedung-3' } } },
            { label: 'Kembali', action: { type: 'goto', node: 'start' } }
          ]
        },
        facilities: {
          lines: [
            'Di sekitar sini ada Masjid Al Hasanah, ATM, area parkir, dan Halte BPS di depan kampus.',
            'Info publik juga menyebut perpustakaan, auditorium, klinik, dan koperasi mahasiswa — lokasinya belum dipetakan di STISMAP.',
            'Gunakan Direktori Kampus untuk mencari lokasi dengan cepat.'
          ],
          choices: [
            { label: 'Buka Direktori Kampus', action: { type: 'open-panel', panel: 'directory' } },
            { label: 'Lihat Daftar Fasilitas', action: { type: 'open-panel', panel: 'facilities' } },
            { label: 'Kembali', action: { type: 'goto', node: 'start' } }
          ]
        },
        tips: {
          lines: [
            'Tips 1: dekati gedung lalu tekan E untuk melihat info dan denah tiap lantai.',
            'Tips 2: gunakan pencarian 🔍 untuk menemukan ruangan, lalu ruangannya akan disorot di denah.',
            'Tips 3: datang lebih awal di hari pertama supaya tidak terburu-buru mencari ruangan.',
            'Tips 4: denah ruangan di STISMAP masih data demo — selalu cek pengumuman resmi kampus.'
          ],
          choices: [
            { label: 'Buka Panduan Kampus', action: { type: 'open-panel', panel: 'guide' } },
            { label: 'Kembali', action: { type: 'goto', node: 'start' } }
          ]
        }
      }
    }
  },
  {
    id: 'security',
    name: 'Pak Satpam',
    role: 'Satpam',
    spriteRow: 0,
    tint: 0x9db4ff,
    facing: 'left',
    dialog: {
      start: 'start',
      nodes: {
        start: {
          lines: [
            'Selamat datang di kampus STIS!',
            'Kampus ini punya gerbang di sisi Jl. Otto Iskandardinata dan di sisi Jl. Sensus Raya.'
          ],
          choices: [
            { label: 'Di mana halte terdekat?', action: { type: 'goto', node: 'halte' } },
            { label: 'Antar saya ke masjid', action: { type: 'travel', target: { kind: 'building', id: 'masjid-al-hasanah' } } },
            { label: 'Terima kasih, Pak!', action: { type: 'close' } }
          ]
        },
        halte: {
          lines: [
            'Halte BPS ada di trotoar depan kampus, di sebelah timur pagar.',
            'Halte TransJakarta terdekat di Jl. Otista: Bidara Cina dan Gelanggang Remaja.'
          ],
          choices: [
            { label: 'Antar ke Halte BPS', action: { type: 'travel', target: { kind: 'facility', id: 'halte-bps' } } },
            { label: 'Oke, terima kasih!', action: { type: 'close' } }
          ]
        }
      }
    }
  },
  {
    id: 'student-dimas',
    name: 'Kak Dimas',
    role: 'Mahasiswa',
    spriteRow: 1,
    facing: 'down',
    dialog: {
      start: 'start',
      nodes: {
        start: {
          lines: [
            'Halo, maba ya? Selamat datang!',
            'Koridor ini enak buat istirahat di antara jam kuliah.',
            'Kalau mau cari ruang kelas, cek denah Gedung 2 atau Gedung 3.'
          ],
          choices: [
            { label: 'Lihat denah Gedung 2', action: { type: 'explore-building', buildingId: 'gedung-2', level: 4 } },
            { label: 'Lihat denah Gedung 3', action: { type: 'explore-building', buildingId: 'gedung-3', level: 2 } },
            { label: 'Oke, makasih Kak!', action: { type: 'close' } }
          ]
        }
      }
    }
  },
  {
    id: 'student-salsa',
    name: 'Kak Salsa',
    role: 'Mahasiswi',
    spriteRow: 2,
    facing: 'down',
    dialog: {
      start: 'start',
      nodes: {
        start: {
          lines: [
            'Hai! Gedung di belakangku ini Gedung 3.',
            'Menurut info publik, di Gedung 3 ada kantor, kantin, dan ruang UKM.',
            'Yuk cek info gedungnya!'
          ],
          choices: [
            { label: 'Buka info Gedung 3', action: { type: 'open-building', buildingId: 'gedung-3' } },
            { label: 'Nanti saja', action: { type: 'close' } }
          ]
        }
      }
    }
  },
  {
    id: 'staff-rina',
    name: 'Bu Rina',
    role: 'Staf Kampus',
    spriteRow: 2,
    tint: 0xc8f0d0,
    facing: 'up',
    dialog: {
      start: 'start',
      nodes: {
        start: {
          lines: [
            'Selamat datang! Pintu di sebelah sini adalah pintu Gedung 2.',
            'Gedung 2 memiliki 6 lantai: ruang kelas, laboratorium, dan lab komputer.',
            'Catatan: denah ruangan di aplikasi ini masih data demo, ya.'
          ],
          choices: [
            { label: 'Buka info Gedung 2', action: { type: 'open-building', buildingId: 'gedung-2' } },
            { label: 'Tentang STIS', action: { type: 'open-panel', panel: 'about' } },
            { label: 'Terima kasih, Bu!', action: { type: 'close' } }
          ]
        }
      }
    }
  }
]
