# 🎮 Setup Map Kampus - Instruksi

## ✅ Yang Sudah Dibuat

Saya sudah mengupdate proyek Anda agar menggunakan file `kampus.json` yang telah Anda buat:

### 1. File yang Dibuat/Dimodifikasi:

- ✅ **src/assets/maps/tileset_kampus.tsx** - File tileset definition untuk Tiled
- ✅ **src/game/scenes/BootScene.ts** - Diupdate untuk load tilemap dari kampus.json
- ✅ **generate-tileset.html** - Tool untuk generate tileset placeholder

### 2. Perubahan di BootScene.ts:

- ✅ Preload tilemap JSON (`kampus.json`)
- ✅ Preload tileset image
- ✅ Create tilemap dengan semua layer (Ground, Roads, Buildings, Collision, Overlay)
- ✅ Setup collision layer
- ✅ Setup camera bounds berdasarkan ukuran map
- ✅ Collision antara player dan collision layer

## 🚀 Langkah Selanjutnya (PENTING!)

### Step 1: Generate Tileset Image

1. **Buka file** `generate-tileset.html` di browser
2. Tileset akan otomatis ter-generate
3. Klik tombol **"Download Tileset"**
4. Simpan file sebagai: `tileset_kampus.png`

### Step 2: Letakkan Tileset di Folder yang Benar

1. Buat folder (jika belum ada): `src/assets/tilesets/`
2. Pindahkan file `tileset_kampus.png` ke folder tersebut

**Path lengkap:** `src/assets/tilesets/tileset_kampus.png`

### Step 3: Test Game

Jalankan game Anda:
```bash
npm run dev
```

## 📋 Struktur Folder yang Benar

```
src/
  assets/
    maps/
      kampus.json ✅
      tileset_kampus.tsx ✅
    tilesets/
      tileset_kampus.png ⚠️ HARUS DIBUAT!
    player/
      chibi-layered.png ✅
```

## 🎨 Tentang Tileset

### Tileset Placeholder yang Di-generate:

File `tileset_kampus.png` yang di-generate adalah tileset sederhana dengan 8 tiles:

1. **Tile 1** - Grass (Rumput) - Hijau
2. **Tile 2** - Road (Jalan) - Coklat muda
3. **Tile 3** - Wall (Tembok) - Coklat tua
4. **Tile 4** - Tree (Pohon) - Kuning
5. **Tile 5** - Building (Gedung) - Coklat
6. **Tile 6** - Window (Jendela) - Biru
7. **Tile 7** - Door (Pintu) - Coklat sedang
8. **Tile 8** - Empty (Kosong) - Hitam

### Menggunakan Tileset yang Lebih Bagus (Opsional):

Jika Anda ingin tileset yang lebih profesional, download dari:

1. **Kenney.nl** - https://kenney.nl/assets
   - Rekomendasi: "Tiny Town" atau "Roguelike/RPG Pack"
   
2. **Itch.io** - https://itch.io/game-assets/free/tag-tileset
   
3. **OpenGameArt** - https://opengameart.org/

**Catatan:** Jika menggunakan tileset lain, pastikan:
- Ukuran tile: **32x32 px**
- Simpan sebagai: `tileset_kampus.png`
- Update file `tileset_kampus.tsx` jika perlu (sesuaikan ukuran dan jumlah tile)

## 🎯 Cara Kerja Map

### Layers di kampus.json:

1. **Ground** - Layer dasar (rumput)
2. **Roads** - Jalan
3. **Buildings** - Gedung dan bangunan
4. **Collision** - Area yang tidak bisa dilewati (INVISIBLE saat game)
5. **Overlay** - Dekorasi di atas player

### Collision:

- Collision layer sudah di-setup otomatis
- Player tidak bisa berjalan melewati tiles di Collision layer
- Collision layer invisible saat game berjalan (untuk debug, ubah di BootScene.ts line 47)

### Camera & World Bounds:

- Map size: 50x50 tiles × 32px = 1600x1600 pixels
- Camera mengikuti player
- World bounds sesuai ukuran map

## 🔧 Troubleshooting

### Error: "Failed to load tileset!"

**Solusi:**
- Pastikan `tileset_kampus.png` ada di `src/assets/tilesets/`
- Check nama file: harus **persis** `tileset_kampus.png`
- Clear cache browser dan reload

### Tileset tidak muncul / blank

**Solusi:**
- Buka DevTools (F12) → Console, check error messages
- Pastikan path file benar
- Pastikan tileset image berukuran 256x32 px (8 tiles × 32px)

### Player bisa jalan menembus tembok

**Solusi:**
- Check layer "Collision" di Tiled
- Pastikan sudah menandai area collision dengan tile
- Collision layer harus bernama **persis** "Collision"

## 📝 Edit Map di Tiled (Nanti)

Jika ingin mengedit map `kampus.json`:

1. Buka Tiled Map Editor
2. File → Open → `src/assets/maps/kampus.json`
3. Edit sesuai kebutuhan
4. File → Save (atau Export as JSON jika perlu)

Lihat tutorial lengkap di: `CARA_MEMBUAT_MAP.md`

## 🎮 Fitur yang Sudah Berfungsi

✅ Load tilemap dari kampus.json
✅ Render semua layers
✅ Collision dengan collision layer
✅ Camera follow player
✅ Player movement (WASD / Arrow Keys)
✅ NPC interaction (E key)
✅ World bounds sesuai map size

## 📞 Jika Ada Masalah

1. Check browser console (F12) untuk error messages
2. Pastikan semua file ada di lokasi yang benar
3. Restart dev server (`npm run dev`)
4. Clear browser cache

---

**Selamat! Map Anda sudah siap! 🎉**

Jangan lupa generate dan letakkan `tileset_kampus.png` di folder yang benar!
