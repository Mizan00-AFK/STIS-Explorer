/** Key aset Phaser. */
export const ASSET = {
  tiles: 'tiles',
  map: 'kampus',
  player: 'player',
  shadow: 'shadow',
  beacon: 'beacon'
} as const

/** Nama tileset di Tiled (harus sama dengan `name` tileset di kampus.json). */
export const TILESET_NAME = 'tileset_kampus'

/** Nama layer di Tiled. Layer opsional boleh tidak ada. */
export const LAYERS = {
  tiles: ['Ground', 'Roads', 'Structures', 'Decor', 'Overlay'] as const,
  collision: 'Collision',
  /** Layer yang digambar DI ATAS pemain (kanopi pohon, lampu). */
  above: 'Overlay',
  buildings: 'Buildings',
  npcs: 'NPCs',
  interactive: 'Interactive',
  spawn: 'Spawn'
} as const

/** Urutan gambar (depth). Karakter disortir berdasarkan posisi Y di antara CHARACTERS dan ABOVE. */
export const DEPTH = {
  ground: 0,
  roads: 1,
  structures: 2,
  decor: 3,
  characters: 10,
  above: 50,
  labels: 60,
  markers: 70,
  beacon: 80
} as const

export const LAYER_DEPTH: Record<string, number> = {
  Ground: DEPTH.ground,
  Roads: DEPTH.roads,
  Structures: DEPTH.structures,
  Decor: DEPTH.decor,
  Overlay: DEPTH.above
}

/** Teks tajam meski kamera di-zoom. */
export const TEXT_RESOLUTION = 4

export const PIXEL_FONT = '"Press Start 2P", monospace'
