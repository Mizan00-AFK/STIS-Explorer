// Definisi tileset kampus STIS (16x16 px per tile).
// Setiap tile digambar secara prosedural agar tileset bisa dibuat ulang kapan saja
// dengan `npm run assets:tileset`. Index tile (0-based) dipakai oleh generator map.

export const TILE_SIZE = 16
export const COLUMNS = 16
export const MARGIN = 1
export const SPACING = 2

/** Nama tile -> index (0-based). GID Tiled = index + 1. */
export const T = {
  // Ground
  GRASS: 0,
  GRASS_DARK: 1,
  GRASS_FLOWER: 2,
  PAVING: 3,
  PAVING_WARM: 4,
  ASPHALT: 5,
  ASPHALT_DASH_H: 6,
  ASPHALT_DASH_V: 7,
  BUSWAY: 8,
  SIDEWALK: 9,
  ZEBRA: 10,
  PARKING_LINE: 11,
  SOIL: 12,
  ASPHALT_EDGE_V: 13,
  PAVING_ACCENT: 14,
  FLOOR_INDOOR: 15,

  // Atap beton (autotile 3x3)
  ROOF_NW: 16,
  ROOF_N: 17,
  ROOF_NE: 18,
  ROOF_W: 19,
  ROOF_C: 20,
  ROOF_E: 21,
  ROOF_SW: 22,
  ROOF_S: 23,
  ROOF_SE: 24,
  ROOF_AC: 25,
  ROOF_TANK: 26,

  // Fasad gedung (tampak depan, sisi selatan)
  FACADE_WINDOW: 27,
  FACADE_WALL: 28,
  FACADE_BASE_WINDOW: 29,
  FACADE_BASE_WALL: 30,
  DOOR_L: 31,
  DOOR_R: 32,
  FACADE_SIGN: 33,
  FACADE_STRIPE: 34,

  // Masjid
  MOSQUE_ROOF: 35,
  MOSQUE_ROOF_EDGE: 36,
  DOME_TL: 37,
  DOME_TR: 38,
  DOME_BL: 39,
  DOME_BR: 40,
  MOSQUE_WALL_WINDOW: 41,
  MOSQUE_DOOR: 42,
  MOSQUE_WALL: 43,

  // Rumah / bangunan tetangga
  HOUSE_ROOF: 44,
  HOUSE_ROOF_EAVE: 45,
  HOUSE_WALL: 46,
  HOUSE_ROOF_ALT: 47,

  // Pagar keliling kampus
  WALL_H: 48,
  WALL_V: 49,
  WALL_PILLAR: 50,
  GATE_RAIL: 51,

  // Dekorasi
  TREE_TOP: 52,
  TREE_BOTTOM: 53,
  BIGTREE_TL: 54,
  BIGTREE_TR: 55,
  BIGTREE_BL: 56,
  BIGTREE_BR: 57,
  BUSH: 58,
  FLOWER_BED: 59,
  BENCH: 60,
  LAMP_BOTTOM: 61,
  LAMP_TOP: 62,
  CAR_BLUE_L: 63,
  CAR_BLUE_R: 64,
  CAR_RED_L: 65,
  CAR_RED_R: 66,
  MOTORBIKE: 67,
  SIGN_L: 68,
  SIGN_R: 69,
  SHELTER_L: 70,
  SHELTER_R: 71,
  TRASH: 72,
  INFO_BOARD: 73,
  PLANTER: 74,
  ATM_FRONT: 75,
  POST_WINDOW: 76,
  FLAG_POLE: 77,
  DRAIN: 78,
  ROAD_ARROW: 79,

  COLLISION: 80
}

export const TILE_COUNT = 81

/** Warna untuk mini-map (disimpan sebagai property tile `minimap`). */
export const MINIMAP_COLORS = {
  [T.GRASS]: '#4f9a4a',
  [T.GRASS_DARK]: '#4f9a4a',
  [T.GRASS_FLOWER]: '#4f9a4a',
  [T.PAVING]: '#c9c6bd',
  [T.PAVING_WARM]: '#d4b48c',
  [T.PAVING_ACCENT]: '#c9c6bd',
  [T.ASPHALT]: '#4a4d55',
  [T.ASPHALT_DASH_H]: '#4a4d55',
  [T.ASPHALT_DASH_V]: '#4a4d55',
  [T.ASPHALT_EDGE_V]: '#4a4d55',
  [T.ROAD_ARROW]: '#4a4d55',
  [T.PARKING_LINE]: '#4a4d55',
  [T.ZEBRA]: '#8c8f96',
  [T.BUSWAY]: '#a5443d',
  [T.SIDEWALK]: '#b8b2a7',
  [T.SOIL]: '#7a5636',
  [T.FLOOR_INDOOR]: '#c9c6bd',
  ...Object.fromEntries(
    [T.ROOF_NW, T.ROOF_N, T.ROOF_NE, T.ROOF_W, T.ROOF_C, T.ROOF_E, T.ROOF_SW, T.ROOF_S, T.ROOF_SE, T.ROOF_AC, T.ROOF_TANK].map((i) => [i, '#8fa1b8'])
  ),
  ...Object.fromEntries(
    [T.FACADE_WINDOW, T.FACADE_WALL, T.FACADE_BASE_WINDOW, T.FACADE_BASE_WALL, T.DOOR_L, T.DOOR_R, T.FACADE_SIGN, T.FACADE_STRIPE].map((i) => [i, '#e6dcc4'])
  ),
  ...Object.fromEntries([T.MOSQUE_ROOF, T.MOSQUE_ROOF_EDGE].map((i) => [i, '#2f8f5b'])),
  ...Object.fromEntries([T.DOME_TL, T.DOME_TR, T.DOME_BL, T.DOME_BR].map((i) => [i, '#e0b23a'])),
  ...Object.fromEntries([T.MOSQUE_WALL_WINDOW, T.MOSQUE_DOOR, T.MOSQUE_WALL].map((i) => [i, '#f4f1ea'])),
  ...Object.fromEntries([T.HOUSE_ROOF, T.HOUSE_ROOF_EAVE, T.HOUSE_WALL].map((i) => [i, '#9c5644'])),
  [T.HOUSE_ROOF_ALT]: '#a8703f',
  ...Object.fromEntries([T.WALL_H, T.WALL_V, T.WALL_PILLAR].map((i) => [i, '#e8e4d8'])),
  ...Object.fromEntries([T.TREE_BOTTOM, T.BIGTREE_BL, T.BIGTREE_BR].map((i) => [i, '#2a6e34']))
}

// ---------------------------------------------------------------------------
// Utilitas gambar
// ---------------------------------------------------------------------------

function hex(c) {
  if (c === null || c === undefined) return null
  const v = c.replace('#', '')
  const a = v.length === 8 ? parseInt(v.slice(6, 8), 16) : 255
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16), a]
}

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Kanvas 16x16 untuk satu tile. */
class TileCanvas {
  constructor(seed) {
    this.data = new Uint8Array(TILE_SIZE * TILE_SIZE * 4)
    this.rand = rng(seed * 9973 + 17)
  }
  px(x, y, color) {
    if (x < 0 || y < 0 || x >= TILE_SIZE || y >= TILE_SIZE) return
    const c = hex(color)
    if (!c) return
    const i = (y * TILE_SIZE + x) * 4
    const a = c[3] / 255
    const d = this.data
    const da = d[i + 3] / 255
    const outA = a + da * (1 - a)
    if (outA === 0) return
    for (let k = 0; k < 3; k++) d[i + k] = Math.round((c[k] * a + d[i + k] * da * (1 - a)) / outA)
    d[i + 3] = Math.round(outA * 255)
  }
  rect(x, y, w, h, color) {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) this.px(xx, yy, color)
  }
  fill(color) {
    this.rect(0, 0, TILE_SIZE, TILE_SIZE, color)
  }
  hline(x, y, w, color) {
    this.rect(x, y, w, 1, color)
  }
  vline(x, y, h, color) {
    this.rect(x, y, 1, h, color)
  }
  speckle(colors, density) {
    for (let y = 0; y < TILE_SIZE; y++)
      for (let x = 0; x < TILE_SIZE; x++)
        if (this.rand() < density) this.px(x, y, colors[Math.floor(this.rand() * colors.length)])
  }
  /** Lingkaran terisi (untuk kanopi pohon, kubah, dll.). */
  disc(cx, cy, r, color) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
        if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) this.px(x, y, color)
  }
  /** Gambar pola dari array string. Karakter dipetakan lewat `map`; '.' = transparan. */
  pattern(rows, map, ox = 0, oy = 0) {
    rows.forEach((row, y) => {
      ;[...row].forEach((ch, x) => {
        if (ch !== '.' && map[ch]) this.px(ox + x, oy + y, map[ch])
      })
    })
  }
}

// ---------------------------------------------------------------------------
// Palet
// ---------------------------------------------------------------------------

const P = {
  outline: '#26304a',
  grass: '#4f9a4a',
  grassDark: '#3f8340',
  grassLight: '#66b35a',
  paving: '#c9c6bd',
  pavingLine: '#aba79d',
  pavingHi: '#dad7cf',
  warm: '#d4b48c',
  warmLine: '#b8946b',
  asphalt: '#4a4d55',
  asphaltA: '#555963',
  asphaltB: '#40434a',
  white: '#ececec',
  yellow: '#f2c230',
  busway: '#a5443d',
  buswayB: '#b35249',
  sidewalk: '#b8b2a7',
  sidewalkLine: '#9e978b',
  soil: '#7a5636',
  soilB: '#8b6542',
  navy: '#13284d',
  blue: '#1e6fd9',
  orange: '#f28c28',
  roof: '#a3b2c4',
  roofHi: '#b9c6d5',
  roofEdge: '#6d7f96',
  wall: '#efe6d2',
  wallShade: '#d6c9ad',
  glass: '#3d7fc4',
  glassHi: '#8fc3f0',
  frame: '#2b3a52',
  skirt: '#8a8f99',
  green: '#2f8f5b',
  greenDark: '#1f6b42',
  gold: '#e0b23a',
  goldDark: '#b88a20',
  mosqueWall: '#f4f1ea',
  teal: '#2a9d8f',
  houseRoof: '#b5523b',
  houseRoofDark: '#8e3e2c',
  houseRoofAlt: '#c9783a',
  houseWall: '#e9dcc3',
  fenceCap: '#dcd7ca',
  fenceFace: '#b9b2a3',
  fenceDark: '#857f72',
  leaf: '#2f7d3a',
  leafDark: '#24632e',
  leafLight: '#4c9f4f',
  trunk: '#6b4a2b',
  shadow: '#00000040'
}

// ---------------------------------------------------------------------------
// Penggambar tile
// ---------------------------------------------------------------------------

function grass(t, variant = 0) {
  t.fill(P.grass)
  t.speckle([P.grassDark, P.grassLight], variant === 1 ? 0.22 : 0.12)
  if (variant === 1) {
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(t.rand() * 14) + 1
      const y = Math.floor(t.rand() * 13) + 2
      t.px(x, y, P.grassDark)
      t.px(x, y - 1, P.grassDark)
    }
  }
}

function paving(t, base, line, hi) {
  t.fill(base)
  t.hline(0, 0, 16, line)
  t.hline(0, 8, 16, line)
  t.vline(0, 0, 8, line)
  t.vline(8, 8, 8, line)
  t.hline(1, 1, 7, hi)
  t.hline(9, 1, 7, hi)
  t.hline(1, 9, 7, hi)
  t.hline(9, 9, 7, hi)
  t.speckle([line], 0.03)
}

function asphalt(t) {
  t.fill(P.asphalt)
  t.speckle([P.asphaltA, P.asphaltB], 0.18)
}

/** Atap beton datar dengan parapet. edges: {n,s,e,w} */
function roof(t, edges) {
  t.fill(P.roof)
  t.speckle([P.roofHi, '#98a8bb'], 0.08)
  const e = P.roofEdge
  if (edges.n) {
    t.rect(0, 0, 16, 3, e)
    t.hline(0, 0, 16, P.outline)
    t.hline(0, 3, 16, '#8c9db1')
  }
  if (edges.s) {
    t.rect(0, 13, 16, 3, e)
    t.hline(0, 12, 16, P.roofHi)
  }
  if (edges.w) {
    t.rect(0, 0, 3, 16, e)
    t.vline(0, 0, 16, P.outline)
    t.vline(3, edges.n ? 3 : 0, edges.s ? 10 : 16, '#8c9db1')
  }
  if (edges.e) {
    t.rect(13, 0, 3, 16, e)
    t.vline(15, 0, 16, P.outline)
  }
}

function facade(t, { window = false, base = false, stripe = false }) {
  t.fill(P.wall)
  t.hline(0, 0, 16, P.wallShade)
  t.hline(0, 1, 16, P.wallShade)
  if (stripe) {
    t.rect(0, 5, 16, 3, P.blue)
    t.hline(0, 8, 16, P.orange)
  }
  if (window) {
    t.rect(2, 3, 12, 8, P.frame)
    t.rect(3, 4, 10, 6, P.glass)
    t.vline(8, 4, 6, P.frame)
    t.px(4, 5, P.glassHi)
    t.px(5, 4, P.glassHi)
    t.px(9, 5, P.glassHi)
    t.px(10, 4, P.glassHi)
    t.hline(2, 11, 12, P.wallShade)
  }
  if (base) {
    t.rect(0, 13, 16, 3, P.skirt)
    t.hline(0, 13, 16, '#6f747d')
  }
}

function door(t, side) {
  facade(t, { base: true })
  // kusen pintu kaca
  t.rect(0, 2, 16, 14, P.frame)
  const gx = side === 'L' ? 2 : 1
  t.rect(gx, 4, 13, 12, '#5aa0dc')
  t.rect(gx + 2, 5, 2, 6, P.glassHi)
  if (side === 'L') t.vline(15, 2, 14, '#1b2638')
  else t.vline(0, 2, 14, '#1b2638')
  // gagang
  t.rect(side === 'L' ? 12 : 3, 9, 1, 3, '#d0d6de')
  // kanopi
  t.rect(0, 2, 16, 2, P.navy)
  t.hline(0, 3, 16, P.orange)
}

function tinyText(t, text, x, y, color) {
  // Font 3x5 sederhana untuk papan nama.
  const F = {
    S: ['###', '#..', '###', '..#', '###'],
    T: ['###', '.#.', '.#.', '.#.', '.#.'],
    I: ['###', '.#.', '.#.', '.#.', '###'],
    P: ['##.', '#.#', '##.', '#..', '#..'],
    O: ['###', '#.#', '#.#', '#.#', '###'],
    L: ['#..', '#..', '#..', '#..', '###'],
    A: ['.#.', '#.#', '###', '#.#', '#.#'],
    M: ['#.#', '###', '#.#', '#.#', '#.#'],
    B: ['##.', '#.#', '##.', '#.#', '##.'],
    i: ['#', '.', '#', '#', '#']
  }
  let cx = x
  for (const ch of text) {
    const g = F[ch]
    if (!g) {
      cx += 2
      continue
    }
    t.pattern(g, { '#': color }, cx, y)
    cx += g[0].length + 1
  }
}

const DRAW = {
  [T.GRASS]: (t) => grass(t, 0),
  [T.GRASS_DARK]: (t) => grass(t, 1),
  [T.GRASS_FLOWER]: (t) => {
    grass(t, 0)
    const spots = [
      [3, 4, '#f4d35e'],
      [11, 3, '#ffffff'],
      [6, 11, '#ef6f6c'],
      [13, 12, '#f4d35e'],
      [2, 13, '#ffffff']
    ]
    for (const [x, y, c] of spots) {
      t.px(x, y, c)
      t.px(x + 1, y, c)
      t.px(x, y + 1, c)
      t.px(x + 1, y + 1, '#c9a227')
    }
  },
  [T.PAVING]: (t) => paving(t, P.paving, P.pavingLine, P.pavingHi),
  [T.PAVING_WARM]: (t) => paving(t, P.warm, P.warmLine, '#e0c4a0'),
  [T.PAVING_ACCENT]: (t) => {
    paving(t, P.paving, P.pavingLine, P.pavingHi)
    t.rect(4, 4, 8, 8, '#2c4a7a')
    t.rect(6, 6, 4, 4, P.orange)
  },
  [T.ASPHALT]: (t) => asphalt(t),
  [T.ASPHALT_DASH_H]: (t) => {
    asphalt(t)
    t.rect(2, 7, 8, 2, P.white)
  },
  [T.ASPHALT_DASH_V]: (t) => {
    asphalt(t)
    t.rect(7, 2, 2, 8, P.white)
  },
  [T.ASPHALT_EDGE_V]: (t) => {
    asphalt(t)
    t.rect(7, 0, 2, 16, P.yellow)
  },
  [T.ROAD_ARROW]: (t) => {
    asphalt(t)
    t.pattern(
      ['......##......', '.....####.....', '....######....', '...##.##.##...', '......##......', '......##......', '......##......', '......##......'],
      { '#': P.white },
      1,
      4
    )
  },
  [T.BUSWAY]: (t) => {
    t.fill(P.busway)
    t.speckle([P.buswayB, '#97392f'], 0.18)
  },
  [T.SIDEWALK]: (t) => {
    t.fill(P.sidewalk)
    t.hline(0, 0, 16, P.sidewalkLine)
    t.vline(0, 0, 16, P.sidewalkLine)
    t.hline(0, 8, 16, P.sidewalkLine)
    t.speckle(['#c7c1b6'], 0.06)
  },
  [T.ZEBRA]: (t) => {
    asphalt(t)
    t.rect(0, 1, 16, 3, P.white)
    t.rect(0, 9, 16, 3, P.white)
  },
  [T.PARKING_LINE]: (t) => {
    asphalt(t)
    t.rect(0, 0, 1, 16, P.white)
    t.rect(0, 15, 16, 1, P.white)
  },
  [T.SOIL]: (t) => {
    t.fill(P.soil)
    t.speckle([P.soilB, '#6a4a2e'], 0.25)
  },
  [T.FLOOR_INDOOR]: (t) => {
    t.fill('#e3ddd0')
    t.hline(0, 0, 16, '#c9c2b2')
    t.vline(0, 0, 16, '#c9c2b2')
  },

  // Atap
  [T.ROOF_NW]: (t) => roof(t, { n: 1, w: 1 }),
  [T.ROOF_N]: (t) => roof(t, { n: 1 }),
  [T.ROOF_NE]: (t) => roof(t, { n: 1, e: 1 }),
  [T.ROOF_W]: (t) => roof(t, { w: 1 }),
  [T.ROOF_C]: (t) => roof(t, {}),
  [T.ROOF_E]: (t) => roof(t, { e: 1 }),
  [T.ROOF_SW]: (t) => roof(t, { s: 1, w: 1 }),
  [T.ROOF_S]: (t) => roof(t, { s: 1 }),
  [T.ROOF_SE]: (t) => roof(t, { s: 1, e: 1 }),
  [T.ROOF_AC]: (t) => {
    roof(t, {})
    t.rect(3, 4, 10, 8, P.outline)
    t.rect(4, 5, 8, 6, '#d5dbe3')
    t.disc(8, 8, 2.5, '#7d8a9c')
    t.px(8, 8, '#d5dbe3')
    t.hline(3, 12, 10, '#00000030')
  },
  [T.ROOF_TANK]: (t) => {
    roof(t, {})
    t.disc(8, 8, 5.5, P.outline)
    t.disc(8, 8, 4.5, '#3f78b5')
    t.disc(7, 7, 2, '#6aa2db')
  },

  // Fasad
  [T.FACADE_WINDOW]: (t) => facade(t, { window: true }),
  [T.FACADE_WALL]: (t) => facade(t, {}),
  [T.FACADE_BASE_WINDOW]: (t) => facade(t, { window: true, base: true }),
  [T.FACADE_BASE_WALL]: (t) => facade(t, { base: true }),
  [T.DOOR_L]: (t) => door(t, 'L'),
  [T.DOOR_R]: (t) => door(t, 'R'),
  [T.FACADE_SIGN]: (t) => {
    facade(t, {})
    t.rect(0, 3, 16, 10, P.navy)
    t.hline(0, 12, 16, P.orange)
    tinyText(t, 'STIS', 1, 5, '#ffffff')
  },
  [T.FACADE_STRIPE]: (t) => facade(t, { stripe: true }),

  // Masjid
  [T.MOSQUE_ROOF]: (t) => {
    t.fill(P.green)
    for (let y = 0; y < 16; y += 4) t.hline(0, y, 16, P.greenDark)
    for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 ? 0 : 4; x < 16; x += 8) t.vline(x, y, 4, P.greenDark)
  },
  [T.MOSQUE_ROOF_EDGE]: (t) => {
    t.fill(P.green)
    for (let y = 0; y < 12; y += 4) t.hline(0, y, 16, P.greenDark)
    t.rect(0, 12, 16, 4, P.greenDark)
    t.hline(0, 15, 16, P.outline)
  },
  [T.DOME_TL]: (t) => {
    t.fill(P.green)
    t.disc(16, 16, 13, P.goldDark)
    t.disc(16, 16, 12, P.gold)
    t.disc(12, 11, 3, '#f3d27a')
    t.rect(15, 0, 1, 4, P.outline)
    t.px(14, 1, P.gold)
  },
  [T.DOME_TR]: (t) => {
    t.fill(P.green)
    t.disc(0, 16, 13, P.goldDark)
    t.disc(0, 16, 12, P.gold)
    t.rect(0, 0, 1, 4, P.outline)
    t.px(1, 1, P.gold)
  },
  [T.DOME_BL]: (t) => {
    t.fill(P.green)
    t.disc(16, 0, 13, P.goldDark)
    t.disc(16, 0, 12, P.gold)
    t.hline(4, 12, 12, P.goldDark)
  },
  [T.DOME_BR]: (t) => {
    t.fill(P.green)
    t.disc(0, 0, 13, P.goldDark)
    t.disc(0, 0, 12, P.gold)
    t.hline(0, 12, 12, P.goldDark)
  },
  [T.MOSQUE_WALL_WINDOW]: (t) => {
    t.fill(P.mosqueWall)
    t.pattern(['..####..', '.#....#.', '#......#', '#......#', '#......#', '#......#', '#......#', '########'], { '#': P.greenDark }, 4, 3)
    t.rect(5, 6, 6, 5, P.teal)
    t.rect(6, 5, 4, 1, P.teal)
    t.rect(0, 14, 16, 2, P.skirt)
  },
  [T.MOSQUE_DOOR]: (t) => {
    t.fill(P.mosqueWall)
    t.pattern(
      ['....######....', '...#......#...', '..#........#..', '.#..........#.', '.#..........#.', '.#..........#.', '.#..........#.', '.#..........#.', '.#..........#.', '.#..........#.', '.#..........#.', '.#..........#.', '.############.'],
      { '#': P.greenDark },
      1,
      3
    )
    t.rect(3, 6, 10, 10, '#7a4f2a')
    t.rect(5, 5, 6, 1, '#7a4f2a')
    t.vline(8, 6, 10, '#5d3b1f')
  },
  [T.MOSQUE_WALL]: (t) => {
    t.fill(P.mosqueWall)
    t.hline(0, 0, 16, '#d9d3c5')
    t.rect(0, 14, 16, 2, P.skirt)
  },

  // Rumah
  [T.HOUSE_ROOF]: (t) => {
    t.fill(P.houseRoof)
    for (let y = 1; y < 16; y += 3) t.hline(0, y, 16, P.houseRoofDark)
  },
  [T.HOUSE_ROOF_EAVE]: (t) => {
    t.fill(P.houseRoof)
    for (let y = 1; y < 10; y += 3) t.hline(0, y, 16, P.houseRoofDark)
    t.rect(0, 10, 16, 2, P.houseRoofDark)
    t.rect(0, 12, 16, 4, P.houseWall)
    t.rect(3, 12, 4, 3, P.glass)
    t.rect(10, 12, 3, 4, '#7a4f2a')
  },
  [T.HOUSE_WALL]: (t) => {
    t.fill(P.houseWall)
    t.rect(4, 4, 8, 6, P.frame)
    t.rect(5, 5, 6, 4, P.glass)
    t.rect(0, 14, 16, 2, P.skirt)
  },
  [T.HOUSE_ROOF_ALT]: (t) => {
    t.fill(P.houseRoofAlt)
    for (let y = 1; y < 16; y += 3) t.hline(0, y, 16, '#a85e2a')
  },

  // Pagar
  [T.WALL_H]: (t) => {
    t.rect(0, 4, 16, 4, P.fenceCap)
    t.rect(0, 8, 16, 6, P.fenceFace)
    t.hline(0, 4, 16, P.fenceDark)
    t.hline(0, 13, 16, P.fenceDark)
    t.vline(0, 8, 6, P.fenceDark)
    t.hline(0, 14, 16, P.shadow)
  },
  [T.WALL_V]: (t) => {
    t.rect(5, 0, 6, 16, P.fenceCap)
    t.vline(5, 0, 16, P.fenceDark)
    t.vline(10, 0, 16, P.fenceDark)
    t.vline(11, 0, 16, P.shadow)
  },
  [T.WALL_PILLAR]: (t) => {
    t.rect(3, 1, 10, 13, P.fenceFace)
    t.rect(3, 1, 10, 4, P.fenceCap)
    t.hline(3, 1, 10, P.fenceDark)
    t.hline(3, 13, 10, P.fenceDark)
    t.vline(3, 1, 13, P.fenceDark)
    t.vline(12, 1, 13, P.fenceDark)
    t.rect(6, 7, 4, 3, P.navy)
    t.hline(3, 14, 10, P.shadow)
  },
  [T.GATE_RAIL]: (t) => {
    t.rect(0, 13, 16, 2, '#6f747d')
    t.hline(0, 13, 16, '#9aa0a8')
  },

  // Pohon
  [T.TREE_TOP]: (t) => {
    t.disc(8, 13, 7.5, P.leafDark)
    t.disc(8, 13, 6.5, P.leaf)
    t.disc(6, 11, 3, P.leafLight)
  },
  [T.TREE_BOTTOM]: (t) => {
    t.disc(8, 13, 4, P.shadow)
    t.rect(7, 4, 3, 10, P.trunk)
    t.vline(7, 4, 10, '#5a3d22')
    t.disc(8, -3, 7.5, P.leafDark)
    t.disc(8, -3, 6.5, P.leaf)
  },
  [T.BIGTREE_TL]: (t) => {
    t.disc(16, 16, 14, P.leafDark)
    t.disc(16, 16, 13, P.leaf)
    t.disc(11, 11, 4, P.leafLight)
    t.disc(7, 15, 2, P.leafDark)
  },
  [T.BIGTREE_TR]: (t) => {
    t.disc(0, 16, 14, P.leafDark)
    t.disc(0, 16, 13, P.leaf)
    t.disc(6, 9, 3, P.leafLight)
  },
  [T.BIGTREE_BL]: (t) => {
    t.disc(16, 10, 6, P.shadow)
    t.disc(16, -2, 14, P.leafDark)
    t.disc(16, -2, 13, P.leaf)
    t.rect(13, 6, 3, 8, P.trunk)
    t.vline(13, 6, 8, '#5a3d22')
  },
  [T.BIGTREE_BR]: (t) => {
    t.disc(0, -2, 14, P.leafDark)
    t.disc(0, -2, 13, P.leaf)
    t.rect(0, 6, 3, 8, P.trunk)
  },
  [T.BUSH]: (t) => {
    t.disc(8, 11, 6, P.shadow)
    t.disc(8, 9, 6.5, P.leafDark)
    t.disc(8, 9, 5.5, '#3c8a42')
    t.disc(6, 7, 2, P.leafLight)
  },
  [T.FLOWER_BED]: (t) => {
    t.rect(1, 3, 14, 11, '#8a6a4a')
    t.rect(2, 4, 12, 9, P.soil)
    const c = ['#ef6f6c', '#f4d35e', '#ffffff', '#c86bd6']
    for (let y = 5; y < 12; y += 3) for (let x = 3; x < 13; x += 3) {
      t.px(x, y + 1, P.leaf)
      t.px(x, y, c[(x + y) % 4])
      t.px(x + 1, y, c[(x + y + 1) % 4])
    }
  },
  [T.BENCH]: (t) => {
    t.rect(1, 12, 14, 2, P.shadow)
    t.rect(1, 6, 14, 2, '#8b5a2b')
    t.rect(1, 9, 14, 2, '#a86d35')
    t.rect(2, 11, 1, 3, '#3a3a3a')
    t.rect(13, 11, 1, 3, '#3a3a3a')
    t.hline(1, 6, 14, '#6b4220')
  },
  [T.LAMP_BOTTOM]: (t) => {
    t.disc(8, 14, 3, P.shadow)
    t.rect(7, 0, 2, 14, '#3d4452')
    t.rect(6, 13, 4, 2, '#2a303b')
  },
  [T.LAMP_TOP]: (t) => {
    t.rect(7, 8, 2, 8, '#3d4452')
    t.rect(4, 5, 8, 3, '#2a303b')
    t.rect(5, 8, 6, 1, '#ffe08a')
    t.disc(8, 9, 4, '#ffe08a30')
  },
  [T.CAR_BLUE_L]: (t) => car(t, 'L', '#2f6fb5', '#24578f'),
  [T.CAR_BLUE_R]: (t) => car(t, 'R', '#2f6fb5', '#24578f'),
  [T.CAR_RED_L]: (t) => car(t, 'L', '#b8403a', '#8f2f2a'),
  [T.CAR_RED_R]: (t) => car(t, 'R', '#b8403a', '#8f2f2a'),
  [T.MOTORBIKE]: (t) => {
    t.rect(4, 12, 9, 2, P.shadow)
    t.disc(4.5, 11.5, 2.2, '#1d1d1d')
    t.disc(12.5, 11.5, 2.2, '#1d1d1d')
    t.rect(5, 8, 7, 3, '#c0392b')
    t.rect(6, 7, 4, 1, '#2b2b2b')
    t.rect(11, 6, 1, 3, '#888')
    t.rect(10, 5, 3, 1, '#555')
  },
  [T.SIGN_L]: (t) => {
    t.rect(1, 13, 15, 2, P.shadow)
    t.rect(1, 2, 15, 11, P.outline)
    t.rect(2, 3, 14, 9, P.navy)
    t.hline(2, 11, 14, P.orange)
    tinyText(t, 'POL', 4, 5, '#ffffff')
    t.rect(3, 13, 2, 2, '#5a6170')
  },
  [T.SIGN_R]: (t) => {
    t.rect(0, 13, 15, 2, P.shadow)
    t.rect(0, 2, 15, 11, P.outline)
    t.rect(0, 3, 14, 9, P.navy)
    t.hline(0, 11, 14, P.orange)
    tinyText(t, 'STIS', 0, 5, '#ffffff')
    t.rect(11, 13, 2, 2, '#5a6170')
  },
  [T.SHELTER_L]: (t) => {
    t.rect(0, 2, 16, 4, P.blue)
    t.hline(0, 5, 16, '#174f9c')
    t.rect(2, 6, 1, 9, '#5a6170')
    t.rect(4, 10, 12, 2, '#9aa0a8')
  },
  [T.SHELTER_R]: (t) => {
    t.rect(0, 2, 16, 4, P.blue)
    t.hline(0, 5, 16, '#174f9c')
    t.rect(13, 6, 1, 9, '#5a6170')
    t.rect(0, 10, 12, 2, '#9aa0a8')
    t.rect(6, 3, 5, 2, P.orange)
  },
  [T.TRASH]: (t) => {
    t.disc(8, 13, 3, P.shadow)
    t.rect(5, 6, 6, 8, '#2e7d4f')
    t.rect(4, 5, 8, 2, '#235f3c')
    t.vline(7, 8, 5, '#3f9a66')
  },
  [T.INFO_BOARD]: (t) => {
    t.rect(2, 13, 12, 2, P.shadow)
    t.rect(3, 9, 1, 6, '#6b4a2b')
    t.rect(12, 9, 1, 6, '#6b4a2b')
    t.rect(1, 2, 14, 9, '#6b4a2b')
    t.rect(2, 3, 12, 7, '#f4f1de')
    t.hline(3, 4, 8, P.navy)
    t.hline(3, 6, 10, '#9aa0a8')
    t.hline(3, 8, 7, '#9aa0a8')
    t.rect(11, 4, 2, 2, P.orange)
  },
  [T.PLANTER]: (t) => {
    t.rect(1, 6, 14, 9, '#8a8f99')
    t.rect(2, 7, 12, 3, P.soil)
    t.disc(5, 6, 3, P.leaf)
    t.disc(11, 6, 3, P.leaf)
    t.disc(8, 5, 3, P.leafLight)
  },
  [T.ATM_FRONT]: (t) => {
    t.fill(P.wall)
    t.rect(2, 2, 12, 14, P.frame)
    t.rect(3, 3, 10, 13, '#1f4f8f')
    t.rect(5, 5, 6, 4, '#9fe0ff')
    t.rect(5, 11, 6, 1, '#cfd6df')
    t.rect(4, 0, 8, 2, P.orange)
  },
  [T.POST_WINDOW]: (t) => {
    t.fill('#f4f1de')
    t.rect(1, 3, 14, 7, P.frame)
    t.rect(2, 4, 12, 5, P.glass)
    t.px(3, 5, P.glassHi)
    t.rect(0, 12, 16, 4, P.skirt)
  },
  [T.FLAG_POLE]: (t) => {
    t.rect(7, 2, 1, 13, '#c8ccd2')
    t.rect(8, 2, 6, 2, '#d62828')
    t.rect(8, 4, 6, 2, '#ffffff')
    t.rect(6, 14, 3, 1, '#6f747d')
  },
  [T.DRAIN]: (t) => {
    paving(t, P.paving, P.pavingLine, P.pavingHi)
    t.rect(3, 6, 10, 4, '#3d4452')
    for (let x = 4; x < 13; x += 2) t.vline(x, 6, 4, '#7d8590')
  },

  [T.COLLISION]: (t) => {
    t.fill('#ff3b3b80')
    for (let i = 0; i < 16; i++) {
      t.px(i, i, '#ffffffc0')
      t.px(15 - i, i, '#ffffffc0')
    }
  }
}

function car(t, side, body, dark) {
  // Mobil tampak atas, 2 tile horizontal.
  const L = side === 'L'
  t.rect(L ? 2 : 0, 13, 14, 2, P.shadow)
  if (L) {
    t.rect(2, 3, 14, 10, P.outline)
    t.rect(3, 4, 13, 8, body)
    t.rect(7, 4, 5, 8, '#9fd0f0')
    t.rect(8, 5, 3, 6, dark)
    t.rect(3, 4, 2, 2, '#fff3b0')
    t.rect(3, 10, 2, 2, '#fff3b0')
    t.rect(4, 2, 3, 1, '#1d1d1d')
    t.rect(4, 13, 3, 1, '#1d1d1d')
  } else {
    t.rect(0, 3, 14, 10, P.outline)
    t.rect(0, 4, 13, 8, body)
    t.rect(1, 4, 6, 8, dark)
    t.rect(7, 4, 3, 8, '#9fd0f0')
    t.rect(11, 4, 2, 2, '#e05050')
    t.rect(11, 10, 2, 2, '#e05050')
    t.rect(8, 2, 3, 1, '#1d1d1d')
    t.rect(8, 13, 3, 1, '#1d1d1d')
  }
}

/** Menggambar seluruh tile; mengembalikan array Uint8Array (16x16 RGBA). */
export function drawAllTiles() {
  const tiles = []
  for (let i = 0; i < TILE_COUNT; i++) {
    const t = new TileCanvas(i + 1)
    const fn = DRAW[i]
    if (fn) fn(t)
    tiles.push(t.data)
  }
  return tiles
}

export const ATLAS_ROWS = Math.ceil(TILE_COUNT / COLUMNS)
export const ATLAS_WIDTH = MARGIN * 2 + COLUMNS * TILE_SIZE + (COLUMNS - 1) * SPACING
export const ATLAS_HEIGHT = MARGIN * 2 + ATLAS_ROWS * TILE_SIZE + (ATLAS_ROWS - 1) * SPACING

/** Definisi tileset Tiled (dipakai embedded di map dan sebagai file .tsj). */
export function tilesetDefinition(imagePath) {
  return {
    columns: COLUMNS,
    image: imagePath,
    imageheight: ATLAS_HEIGHT,
    imagewidth: ATLAS_WIDTH,
    margin: MARGIN,
    name: 'tileset_kampus',
    spacing: SPACING,
    tilecount: TILE_COUNT,
    tileheight: TILE_SIZE,
    tilewidth: TILE_SIZE,
    tiles: Object.entries(MINIMAP_COLORS).map(([id, color]) => ({
      id: Number(id),
      properties: [{ name: 'minimap', type: 'string', value: color }]
    }))
  }
}
