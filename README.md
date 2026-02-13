# 🎮 STIS-Explore

<div align="center">

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

## ✨ Fitur Utama

- 🎮 **Kontrol Karakter Real-time** - Gerakkan karakter menggunakan keyboard (WASD/Arrow Keys)
- 💬 **Sistem Dialog NPC** - Berinteraksi dengan NPC untuk mendapatkan informasi
- 🗺️ **Peta Kampus Interaktif** - Jelajahi berbagai lokasi di kampus STIS
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

### 1. Clone Repository

```bash
git clone https://github.com/username/STIS-Explore.git
cd STIS-Explore
```

### 2. Install Dependencies

```bash
npm install
```

atau jika menggunakan pnpm:

```bash
pnpm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

### 4. Build untuk Production

```bash
npm run build
```

File hasil build akan berada di folder `dist/`.

### 5. Preview Production Build

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
STIS-Explore/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Asset gambar dan resource
│   │   └── player/        # Sprite karakter player
│   ├── components/        # Vue components
│   │   ├── DialogBox.vue  # Komponen dialog NPC
│   │   ├── ProfileModal.vue   # Modal profil
│   │   ├── ProjectModal.vue   # Modal proyek
│   │   ├── SkillModal.vue     # Modal skill
│   │   ├── RpgText.vue        # Text komponen RPG-style
│   │   └── rpg-style.css      # Global RPG styling
│   ├── game/              # Phaser game logic
│   │   ├── Game.ts        # Konfigurasi game utama
│   │   ├── main.ts        # Entry point game
│   │   ├── scenes/        # Game scenes
│   │   │   └── BootScene.ts   # Scene utama
│   │   └── objects/       # Game objects
│   │       └── NPC.ts     # Class untuk NPC
│   ├── stores/            # Pinia stores
│   │   ├── dialogStore.ts     # State dialog
│   │   └── uiStore.ts         # State UI
│   ├── views/             # Vue views/pages
│   │   └── GameView.vue   # View utama game
│   ├── App.vue            # Root component
│   ├── main.ts            # Entry point aplikasi
│   └── style.css          # Global styles
├── CARA_MEMBUAT_MAP.md    # Panduan membuat map custom
├── index.html             # HTML entry point
├── package.json           # Dependencies dan scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Dokumentasi proyek
```

## 🎨 Customization

### Menambah NPC Baru

Edit file `src/game/scenes/BootScene.ts`:

```typescript
this.createNPC(x, y, 'Nama NPC', [
  'Dialog line 1',
  'Dialog line 2',
  'Dialog line 3'
])
```

### Membuat Map Sendiri

Ikuti panduan lengkap di [CARA_MEMBUAT_MAP.md](CARA_MEMBUAT_MAP.md) untuk membuat custom map menggunakan Tiled Map Editor.

### Mengubah Sprite Karakter

1. Siapkan sprite sheet dengan dimensi 16x16 pixel per frame
2. Ganti file di `src/assets/player/`
3. Update path di `BootScene.ts`

## 🤝 Contributing

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Development Roadmap

- [ ] Tambah lebih banyak lokasi kampus
- [ ] Implementasi sistem mini-map
- [ ] Tambah sound effects dan background music
- [ ] Sistem inventory untuk item collection
- [ ] Mobile touch controls
- [ ] Multiplayer support
- [ ] Save/Load game state
- [ ] Quest system

## 🐛 Known Issues

- Collision detection perlu optimasi lebih lanjut
- Performance issue pada map yang sangat besar
- Mobile responsiveness masih dalam pengembangan

## 📄 License

Proyek ini bersifat open source dan tersedia di bawah [MIT License](LICENSE).

## 👨‍💻 Author

**STIS Development Team**

Dibuat dengan ❤️ untuk Politeknik Statistika STIS

## 🙏 Acknowledgments

- [Phaser](https://phaser.io/) - Game engine luar biasa
- [Vue.js](https://vuejs.org/) - Framework yang powerful
- [Kenney.nl](https://kenney.nl/) - Free game assets
- Komunitas open source yang selalu supportive!

---

<div align="center">

**⭐ Jika proyek ini bermanfaat, jangan lupa berikan star! ⭐**

Made with 💻 and ☕ in Indonesia

</div>
