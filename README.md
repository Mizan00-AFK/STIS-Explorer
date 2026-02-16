# 🎮 STIS-Explore

<div align="center">

<img src="public/logostis.png" alt="STIS Logo" width="200"/>

<br/>
<br/>

**Peta Interaktif Kampus STIS dalam Bentuk RPG 2D**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Phaser](https://img.shields.io/badge/Phaser-3.90-6D42C7?style=flat&logo=phaser&logoColor=white)](https://phaser.io/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📖 Deskripsi

STIS-Explore adalah aplikasi web interaktif berbasis game RPG 2D yang menampilkan peta kampus STIS (Sekolah Tinggi Ilmu Statistik). Pengunjung dapat menjelajahi kampus secara virtual, berinteraksi dengan NPC, dan mendapatkan informasi melalui dialog bergaya retro-RPG.

Proyek ini menggabungkan teknologi modern web development dengan estetika pixel art klasik, menciptakan pengalaman yang unik dan engaging untuk mengenal kampus STIS.

## 🖼️ Preview

<div align="center">
  <img src="public/logo.png" alt="STIS-Explore Game Preview" width="600"/>
  <p><em>Jelajahi kampus STIS dalam dunia pixel art!</em></p>
</div>

## ✨ Fitur Utama

- 🎮 **Kontrol Karakter Real-time** - Menggerakkan karakter menggunakan keyboard (WASD/Arrow Keys)
- 💬 **Sistem Dialog NPC** - Berinteraksi dengan NPC untuk mendapatkan informasi
- 🗺️ **Peta Kampus Interaktif** - Menjelajahi berbagai lokasi di kampus STIS
- 🎨 **Pixel Art Aesthetic** - Gaya visual retro dengan font Press Start 2P
- 📱 **Responsive Design** - Menyesuaikan dengan berbagai ukuran layar
- ⚡ **Performa Tinggi** - Dibangun dengan Vite untuk loading super cepat
- 🎯 **Collision Detection** - Sistem tabrakan untuk interaksi realistis
- 📦 **State Management** - Menggunakan Pinia untuk manajemen state yang efisien

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Vue.js** | 3.5.25 | Framework JavaScript progresif untuk membangun UI |
| **TypeScript** | 5.9.3 | Superset JavaScript dengan type safety |
| **Phaser** | 3.90.0 | Game engine 2D untuk HTML5 |
| **Pinia** | 3.0.4 | State management library untuk Vue |
| **Vite** | 7.3.1 | Build tool modern dengan HMR super cepat |

## 📋 Prasyarat

Pastikan sistem Anda telah menginstall:

- **Node.js** versi 18.x atau lebih baru
- **npm** atau **pnpm** atau **yarn**
- **Git** (untuk cloning repository)

## 🚀 Instalasi & Menjalankan Proyek

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/stismap.git
cd stismap
```

### 2️⃣ Install Dependencies

```bash
npm install
```

<details>
<summary>Atau gunakan package manager lain</summary>

**Menggunakan pnpm:**
```bash
pnpm install
```

**Menggunakan yarn:**
```bash
yarn install
```
</details>

### 3️⃣ Jalankan Development Server

```bash
npm run dev
```

### 4️⃣ Build untuk Production

```bash
npm run build
```

File hasil build akan tersimpan di folder `dist/`.

### 5️⃣ Preview Production Build

```bash
npm run preview
```

## 🎮 Cara Bermain

### Kontrol Karakter

- **W / ↑** - Gerak ke atas
- **A / ←** - Gerak ke kiri
- **S / ↓** - Gerak ke bawah
- **D / →** - Gerak ke kanan
- **E** - Berinteraksi dengan NPC

### Tips

- Dekati NPC hingga muncul indikator "E to talk"
- Tekan tombol E untuk memulai dialog
- Jelajahi setiap sudut kampus untuk menemukan informasi menarik!

## 📁 Struktur Proyek

```
stismap/
├── public/                    # Static assets
│   ├── logo.png              # Logo game
│   ├── logostis.png          # Logo STIS
│   └── stis.png              # Logo alternatif
│
├── src/
│   ├── assets/               # Game assets & resources
│   │   ├── maps/            
│   │   │   └── kampus.json   # Tilemap data dari Tiled
│   │   ├── player/
│   │   │   └── chibi-layered.png  # Player sprite sheet
│   │   └── tilesets/
│   │       └── tileset_kampus.png # Tileset image
│   │
│   ├── components/           # Vue components
│   │   ├── DialogBox.vue     # Komponen dialog NPC
│   │   ├── ProfileModal.vue  # Modal profil
│   │   ├── ProjectModal.vue  # Modal proyek
│   │   ├── SkillModal.vue    # Modal skill
│   │   ├── RpgText.vue       # Text komponen RPG-style
│   │   └── rpg-style.css     # Global RPG styling
│   │
│   ├── game/                 # Phaser game logic
│   │   ├── Game.ts           # Konfigurasi game utama
│   │   ├── main.ts           # Entry point game
│   │   ├── scenes/
│   │   │   └── BootScene.ts  # Scene utama game
│   │   └── objects/
│   │       └── NPC.ts        # Class untuk NPC
│   │
│   ├── stores/               # Pinia state management
│   │   ├── dialogStore.ts    # State dialog system
│   │   └── uiStore.ts        # State UI components
│   │
│   ├── views/                # Vue views/pages
│   │   └── GameView.vue      # View utama game
│   │
│   ├── App.vue               # Root Vue component
│   ├── main.ts               # Entry point aplikasi
│   └── style.css             # Global styles
│
├── .gitignore                # Git ignore rules
├── CARA_MEMBUAT_MAP.md       # 📘 Panduan membuat map custom
├── index.html                # HTML entry point
├── package.json              # NPM dependencies & scripts
├── README.md                 # 📖 Dokumentasi proyek (file ini)
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
└── LICENSE                   # MIT License
```

## 🎨 Customization & Development

### 🗺️ Membuat Map Sendiri  

Gunakan **Tiled Map Editor** untuk membuat custom map:

1. Download [Tiled Map Editor](https://www.mapeditor.org/)
2. Ikuti panduan lengkap di **[CARA_MEMBUAT_MAP.md](CARA_MEMBUAT_MAP.md)**
3. Export sebagai JSON dan simpan di `src/assets/maps/`
4. Update reference di `BootScene.ts`

### 👥 Menambah NPC Baru

Edit `src/game/scenes/BootScene.ts` dalam method `createNPCs()`:

```typescript
const npc = new NPC({
  scene: this,
  x: 720,
  y: 720,
  texture: 'player',
  name: 'Nama NPC',
  dialog: [
    'Dialog baris pertama',
    'Dialog baris kedua',
    'Dialog baris ketiga'
  ]
})
npc.setFrame(12) // Set frame sprite berbeda
this.npcs.add(npc)
```

### 🎭 Mengubah Sprite Karakter

1. **Siapkan sprite sheet** dengan spesifikasi:
   - Dimensi per frame: **16x16 pixel**
   - Format: PNG dengan transparency
   - Layout: Grid horizontal atau vertikal

2. **Ganti file** di `src/assets/player/chibi-layered.png`

3. **Update konfigurasi** di `BootScene.ts`:
```typescript
this.load.spritesheet('player', 'src/assets/player/YOUR_SPRITE.png', {
  frameWidth: 16,
  frameHeight: 16
})
```

### 🎨 Mengubah Tileset

1. **Buat tileset image** sesuai spesifikasi kampus.json:
   - Tile size: **32x32 pixel**
   - Format: PNG
   - Susunan: Horizontal strip (1 row, multiple columns)

2. **Simpan** di `src/assets/tilesets/tileset_kampus.png`

3. Tileset akan otomatis terbaca oleh game engine

## 🤝 Contributing

Kontribusi dari komunitas sangat kami apresiasi! Berikut cara berkontribusi:

### Cara untuk berkontribusi

1. **Fork** repository ini
2. **Create branch** untuk fitur baru
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** perubahan Anda
   ```bash
   git commit -m 'Menambahkan fitur baru : (sebutkan fiturnya)'
   ```
4. **Push** ke branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open Pull Request** dengan deskripsi lengkap

### Contribution Guidelines

- 📝 Tulis kode yang clean dan readable
- ✅ Test fitur sebelum submit PR
- 📖 Update dokumentasi jika diperlukan
- 🎨 Follow existing code style
- 💬 Beri deskripsi jelas pada commit message

## �️ Development Roadmap

### 🚀 Rencana Fitur Kedepannya

- [ ] **Expanded Map** - Tambah lebih banyak lokasi kampus (ruang kelas, lab, kantin, dll)
- [ ] **Mini-Map System** - Navigasi lebih mudah dengan mini-map di pojok layar
- [ ] **Audio System** - Sound effects dan background music
- [ ] **Inventory System** - Koleksi item dan achievement
- [ ] **Mobile Support** - Touch controls untuk perangkat mobile
- [ ] **Save/Load System** - Simpan progress game
- [ ] **Quest System** - Misi dan quest untuk eksplorasi
- [ ] **Multiplayer** - Real-time multiplayer support

### 🔧 Technical Improvements

- [ ] Performance optimization untuk map besar
- [ ] Better collision detection algorithm
- [ ] Improved mobile responsiveness
- [ ] Loading screen dengan progress bar
- [ ] Better error handling

## ⚠️ Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Collision detection perlu optimasi | Medium | 🔄 In Progress |
| Performance drop pada map >100x100 tiles | Low | 📋 Planned |
| Mobile touch controls belum tersedia | Medium | 📋 Planned |
| Audio autoplay blocked di beberapa browser | Low | 🐛 Known |

## 📄 License

Proyek ini bersifat **open source** dan tersedia di bawah [MIT License](LICENSE).

```
MIT License - Bebas digunakan untuk keperluan personal maupun komersial
```

## 👨‍💻 Author & Contributors

**Ananda Mizan Ali**

Dibuat dengan ❤️ untuk **Politeknik Statistika STIS**

### Contributors

Terima kasih kepada semua kontributor yang telah membantu proyek ini! 🙏

## 🙏 Acknowledgments

Special thanks to:

- **[Phaser.io](https://phaser.io/)** - Game engine HTML5 yang powerful
- **[Vue.js Team](https://vuejs.org/)** - Framework JavaScript yang amazing
- **[Tiled Map Editor](https://www.mapeditor.org/)** - Tool untuk membuat tilemap
- **[Kenney.nl](https://kenney.nl/)** - Free game assets berkualitas tinggi
- **Open Source Community** - Yang selalu supportive dan inspiring

## 📞 Contact & Support

- 📧 Email: goodpers888@gmail.com
- 🌐 Website: 
- 💬 Issues: [GitHub Issues](https://github.com/username/stismap/issues)

---

<div align="center">

### ⭐ Jika proyek ini bermanfaat, jangan lupa berikan star! ⭐

**Made with 💻 and ☕ in Indonesia**

© 2026 Ananda Mizan Ali. All rights reserved.

</div>
