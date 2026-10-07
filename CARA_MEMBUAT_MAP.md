# Cara Membuat & Mengubah Map STISMAP

Panduan ini menjelaskan cara mengubah peta kampus di **Tiled Map Editor** dan cara menambah
gedung, lantai, ruangan, fasilitas, serta NPC — **tanpa mengubah logika game**.

> Prinsip utama: **posisi** diatur di Tiled (`src/assets/maps/kampus.json`),
> **isi/informasi** diatur di file data (`src/game/data/*.ts`). Keduanya dihubungkan oleh ID.

---

## 1. Persiapan

1. Install **Tiled** dari <https://www.mapeditor.org/> (versi 1.10 atau lebih baru).
2. Buka `src/assets/maps/kampus.json` lewat **File → Open**.
3. Tileset sudah tertanam (embedded) di dalam map, jadi tidak perlu import ulang.
   File `src/assets/maps/tileset_kampus.tsj` tersedia bila Anda ingin membuat map baru.

| Properti map | Nilai |
| --- | --- |
| Ukuran tile | 16 × 16 px (≈ 1,2 m) |
| Ukuran map | 106 × 76 tile (1696 × 1216 px) |
| Tileset | `tileset_kampus` (`src/assets/tilesets/tileset_kampus.png`, margin 1, spacing 2) |

Tata letak awal dibuat dari footprint **OpenStreetMap** kampus Politeknik Statistika STIS
(Jl. Otto Iskandardinata No.64C) lalu disederhanakan ke grid. Posisi gedung adalah perkiraan.

---

## 2. Struktur Layer

### Tile layer (urutan dari bawah ke atas)

| Layer | Isi | Catatan |
| --- | --- | --- |
| `Ground` | Rumput, paving | **Wajib ada** |
| `Roads` | Jalan, trotoar, parkir, gerbang | |
| `Structures` | Atap & fasad gedung, pagar, rumah tetangga | |
| `Decor` | Batang pohon, bangku, lampu, mobil, papan | |
| `Collision` | Area yang **tidak bisa dilewati** | Disembunyikan saat game berjalan. Tile apa pun = padat (pakai tile merah bertanda X) |
| `Overlay` | Kanopi pohon, kepala lampu | Digambar **di atas** pemain |

> Tips: aktifkan visibilitas layer `Collision` saat mengedit agar terlihat area padatnya.

### Object layer

| Layer | `type` objek | Properti wajib | Fungsi |
| --- | --- | --- | --- |
| `Buildings` | `building` | `buildingId` | Footprint gedung (label nama, marker, mini-map, area "mendekati gedung") |
| `Buildings` | `entrance` | `buildingId` | Area pintu masuk (prioritas interaksi & tujuan fast travel) |
| `NPCs` | `npc` (point) | `npcId` | Posisi NPC |
| `Interactive` | `facility` | `facilityId` | Area fasilitas (ATM, parkir, gerbang, halte, …) |
| `Interactive` | `info` | `facilityId` | Titik informasi (papan petunjuk) |
| `Spawn` | `spawn` (point) | – | Titik awal pemain |

`type` dibaca dari **custom property `type`**; jika tidak ada, dari field *Class/Type* objek.
Disarankan mengisi keduanya.

---

## 3. Alur Menambahkan Gedung Baru

Contoh: menambah gedung baru dengan id `gedung-4`.

### Langkah 1 — Gambar gedung di Tiled

1. Buka `kampus.json` di Tiled.
2. Pilih layer `Structures`, gambar atap (tile atap 3×3: sudut, tepi, tengah) dan
   1–3 baris fasad di bagian bawah (tile jendela, dinding, pintu).
3. Pilih layer `Collision`, isi seluruh area gedung dengan tile merah (X).

### Langkah 2 — Tambahkan objek footprint

1. Pilih object layer `Buildings`.
2. Gunakan **Insert Rectangle (R)** dan tarik kotak seukuran gedung.
3. Isi **Name**: `Gedung 4`.
4. Tambahkan custom property:
   - `type` = `building` (string)
   - `buildingId` = `gedung-4` (string)

### Langkah 3 — Tambahkan area pintu masuk

1. Masih di layer `Buildings`, buat kotak kecil (±3×2 tile) **di depan pintu** (di luar area collision).
2. Custom property:
   - `type` = `entrance`
   - `buildingId` = `gedung-4`

### Langkah 4 — Simpan

**File → Save** (format JSON). Pastikan tetap tersimpan di `src/assets/maps/kampus.json`.

### Langkah 5 — Tambahkan data di `src/game/data/buildings.ts`

```ts
{
  id: 'gedung-4',              // HARUS sama dengan buildingId di Tiled
  name: 'Gedung 4',
  shortName: 'GEDUNG 4',       // label di atas atap
  category: 'academic',        // academic | office | worship | service
  subtitle: 'Ruang Kelas',
  description: 'Deskripsi gedung...',
  floors: 3,                   // HARUS sama dengan jumlah lantai di floors.ts
  icon: '🏫',
  color: '#8b5cf6',            // warna aksen denah & mini-map
  highlights: ['Ruang Kelas'],
  dataStatus: 'demo',          // public | osm | demo
  sources: []
}
```

> **Jangan mengarang informasi resmi STIS.** Bila data belum tersedia, gunakan nama seperti
> “Demo Building A” dan `dataStatus: 'demo'` — UI akan menampilkan lencana **DATA DEMO**.

### Langkah 6 — Tambahkan lantai di `src/game/data/floors.ts`

```ts
// 1) Di objek PLAN_SIZE: ukuran bidang denah (unit SVG), sesuaikan proporsi footprint
'gedung-4': { width: 100, height: 60 },

// 2) Di array floors:
floor('gedung-4', 1, 'Deskripsi lantai 1'),
floor('gedung-4', 2, 'Deskripsi lantai 2'),
floor('gedung-4', 3, 'Deskripsi lantai 3'),
```

### Langkah 7 — Tambahkan ruangan di `src/game/data/rooms.ts`

**Cara cepat (denah koridor tengah otomatis):**

```ts
...demoFloor('gedung-4', 'g4', 1,
  [room('01', 'Ruang Kelas', 'classroom'), room('02', 'Ruang Kelas', 'classroom')], // sisi utara
  [STAIRS, room('03', 'Laboratorium', 'laboratory', 2), TOILET]                     // sisi selatan
),
```

**Cara manual (data asli, bentuk ruangan bebas):**

```ts
{
  id: 'g4-2-04',
  buildingId: 'gedung-4',
  floorId: 'gedung-4-lt-2',
  name: 'Laboratorium Komputer',
  code: 'LAB-204',
  type: 'computer-lab',
  capacity: 40,
  description: 'Laboratorium komputer untuk praktikum.',
  facilities: ['Komputer', 'Proyektor', 'AC', 'WiFi'],
  image: '/images/rooms/lab-204.jpg',      // taruh file di public/images/rooms/
  dataStatus: 'public',
  shape: { x: 0, y: 0, w: 30, h: 24 }      // koordinat di dalam PLAN_SIZE gedung
}
```

Jenis ruangan (`type`) yang tersedia: `classroom`, `laboratory`, `computer-lab`, `lecturer`,
`leadership`, `office`, `meeting`, `lobby`, `canteen`, `prayer`, `ablution`, `toilet`, `stairs`,
`elevator`, `student-activity`, `service`, `corridor` (koridor tidak bisa diklik).

### Langkah 8 — Jalankan project

```bash
npm run dev
```

Saat start, data divalidasi otomatis (`validateCampusData()` di `src/game/data/campus.ts`).
Jika ada ID yang tidak cocok (mis. `floors` ≠ jumlah lantai), game menampilkan pesan error
beserta detailnya, dan peringatan muncul di console browser bila objek Tiled tidak punya data.

---

## 4. Menambah Fasilitas

1. Di Tiled, layer `Interactive`: buat kotak di lokasi fasilitas dengan properti
   `type = facility` dan `facilityId = kantin-baru`.
2. Di `src/game/data/facilities.ts` tambahkan:

```ts
{
  id: 'kantin-baru',
  name: 'Kantin Baru',
  category: 'canteen',   // library | canteen | mosque | sport | toilet | parking | atm | ...
  description: '...',
  dataStatus: 'demo',
  dialog: ['Teks yang muncul saat pemain menekan E di lokasi ini.']
}
```

Fasilitas yang berada **di dalam gedung** cukup diberi `buildingId` (dan opsional `floorId`/`roomId`)
tanpa objek Tiled — marker otomatis muncul di depan pintu gedungnya, dan Direktori akan membuka
denah lantai/ruangan terkait.

---

## 5. Menambah NPC

1. Di Tiled, layer `NPCs`: **Insert Point**, properti `type = npc`, `npcId = npc-baru`.
2. Di `src/game/data/npcs.ts` tambahkan data NPC dengan pohon dialog:

```ts
{
  id: 'npc-baru',
  name: 'Kak Rara',
  role: 'Mahasiswi',
  spriteRow: 2,           // baris karakter pada chibi-layered.png (0-2)
  tint: 0xffd0d0,         // opsional
  facing: 'down',
  dialog: {
    start: 'start',
    nodes: {
      start: {
        lines: ['Halo!', 'Mau ke mana?'],
        choices: [
          { label: 'Ke Gedung 2', action: { type: 'travel', target: { kind: 'building', id: 'gedung-2' } } },
          { label: 'Lihat denah Gedung 3', action: { type: 'explore-building', buildingId: 'gedung-3', level: 2 } },
          { label: 'Dah!', action: { type: 'close' } }
        ]
      }
    }
  }
}
```

Aksi pilihan dialog: `close`, `goto` (pindah node), `open-building`, `explore-building`,
`open-panel` (`about` | `facilities` | `guide` | `directory` | `menu`), `travel`.

---

## 6. Membuat Ulang Tileset / Map Awal (opsional)

Tileset pixel art dibuat secara prosedural:

```bash
npm run assets:tileset        # menulis ulang tileset_kampus.png & tileset_kampus.tsj
npm run assets:map -- --force # MENIMPA kampus.json dengan map awal (perubahan Tiled hilang!)
```

Untuk menambah tile baru, edit `tools/lib/tileset.mjs` (tambahkan index di `T` dan fungsi gambar
di `DRAW`), lalu jalankan `npm run assets:tileset`. Tile baru otomatis tersedia di Tiled.
Warna mini-map diambil dari property tile `minimap` (diatur di `MINIMAP_COLORS`).

> ⚠️ Setelah map diedit manual di Tiled, **jangan** menjalankan `assets:map` lagi.

---

## 7. Tips

- **Collision**: gunakan layer `Collision` saja; jangan campur dengan layer visual.
- **Area pintu** (`entrance`) harus berada di luar area collision agar bisa dimasuki pemain.
- **Depth**: objek tinggi (kanopi pohon) taruh di `Overlay` agar menutupi pemain dari belakang.
- **Performa**: map hingga ±150×150 tile masih ringan. Hindari ratusan objek interaktif.
- Setelah mengubah map, cek mini-map: warnanya dibuat otomatis dari tile layer.
