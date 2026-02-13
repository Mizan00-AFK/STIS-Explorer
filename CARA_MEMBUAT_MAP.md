# Cara Membuat Map Sendiri dengan Tiled Map Editor

## 1. Download & Install Tiled

1. Download Tiled dari: https://www.mapeditor.org/
2. Install sesuai OS Anda (Windows/Mac/Linux)

## 2. Persiapkan Tileset

### Opsi A: Download Tileset Gratis
- **Itch.io**: https://itch.io/game-assets/free/tag-tileset
- **OpenGameArt**: https://opengameart.org/
- **Kenney.nl**: https://kenney.nl/assets (recommended - kualitas bagus & gratis)

### Opsi B: Buat Sendiri
- Buat sprite 16x16 atau 32x32 pixel
- Susun dalam grid yang rapi
- Save sebagai PNG

## 3. Membuat Map di Tiled

### Step 1: New Map
1. File → New → New Map
2. Pilih:
   - **Orientation**: Orthogonal
   - **Tile layer format**: CSV
   - **Tile size**: 16x16 (atau sesuai tileset)
   - **Map size**: Misal 100x100 tiles

### Step 2: Import Tileset
1. Map → New Tileset
2. Browse ke file tileset PNG Anda
3. Set **Tile width** dan **Tile height** (misal 16x16)
4. Klik **OK**

### Step 3: Drawing Map

#### Layer yang Disarankan:
1. **Ground** - Rumput, tanah, jalan
2. **Buildings** - Gedung, pohon, objek besar
3. **Collision** - Layer khusus untuk collision
4. **Overlay** - Dekorasi yang di atas player

#### Cara Drawing:
1. Pilih layer di panel Layers
2. Pilih tile dari Tileset panel
3. Klik di map untuk paint
4. Tools yang berguna:
   - **Stamp Brush** (B): Paint biasa
   - **Fill** (F): Fill area
   - **Eraser** (E): Hapus tile

### Step 4: Buat Collision Layer
1. Layer → New → Tile Layer
2. Nama: "Collision"
3. Tandai semua area yang tidak bisa dilewati (gedung, pohon, dll)
4. Bisa pakai warna merah untuk collision

### Step 5: Tambah Object Layer (untuk NPC)
1. Layer → New → Object Layer
2. Nama: "NPCs"
3. Klik **Insert Point** tool
4. Klik di map untuk menambah point
5. Set properties:
   - Name: nama NPC
   - Type: "npc"
   - Custom properties: dialog, sprite, dll

## 4. Export Map

1. File → Export As
2. Format: **JSON**
3. Save di: `src/assets/maps/kampus.json`

## 5. Load Map di Phaser

### Update BootScene.ts:

\`\`\`typescript
preload() {
  // Load tileset image
  this.load.image('tiles', 'src/assets/tilesets/tileset.png')
  
  // Load tilemap JSON
  this.load.tilemapTiledJSON('kampus', 'src/assets/maps/kampus.json')
  
  // Load player sprite
  this.load.spritesheet('player', 'src/assets/player/chibi-layered.png', {
    frameWidth: 16,
    frameHeight: 16
  })
}

create() {
  // Create tilemap
  const map = this.make.tilemap({ key: 'kampus' })
  
  // Add tileset to map
  const tileset = map.addTilesetImage('tileset', 'tiles')
  
  // Create layers
  const groundLayer = map.createLayer('Ground', tileset, 0, 0)
  const buildingsLayer = map.createLayer('Buildings', tileset, 0, 0)
  const collisionLayer = map.createLayer('Collision', tileset, 0, 0)
  
  // Set collision
  collisionLayer.setCollisionByExclusion([-1])
  
  // Hide collision layer (optional)
  collisionLayer.setVisible(false)
  
  // Create player
  this.player = this.physics.add.sprite(100, 100, 'player')
  
  // Add collision between player and collision layer
  this.physics.add.collider(this.player, collisionLayer)
  
  // Load NPCs from object layer
  const npcLayer = map.getObjectLayer('NPCs')
  npcLayer.objects.forEach(obj => {
    // Create NPC at position
    const npc = new NPC({
      scene: this,
      x: obj.x,
      y: obj.y,
      texture: 'player',
      name: obj.name,
      dialog: obj.properties?.dialog || ['Hello!']
    })
  })
}
\`\`\`

## 6. Tips & Tricks

### Performance:
- Gunakan **Tile Layers** untuk static objects
- Gunakan **Object Layers** untuk dynamic objects (NPC, items)
- Jangan buat map terlalu besar (max 200x200 tiles)

### Collision:
- Buat layer collision terpisah, jangan mix dengan visual layer
- Gunakan `setCollisionByExclusion([-1])` untuk collision semua tile kecuali yang kosong

### Depth/Layering:
```typescript
groundLayer.setDepth(0)
buildingsLayer.setDepth(5)
player.setDepth(10)
overlayLayer.setDepth(15)
```

### Camera Bounds:
```typescript
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
```

## 7. Resources Tileset Gratis

1. **Kenney Tiny Town**: https://kenney.nl/assets/tiny-town
2. **Pixel Art Top Down**: https://opengameart.org/content/lpc-base-assets
3. **Modern City**: https://itch.io/game-assets/tag-city
4. **RPG Tileset**: https://opengameart.org/content/16x16-game-assets

## 8. Tutorial Video (Recommended)

- **Tiled Basics**: https://www.youtube.com/watch?v=ZwaomOYGuYo
- **Phaser + Tiled**: https://www.youtube.com/watch?v=XpvXHGNFgDw

---

Selamat membuat map! 🎮
