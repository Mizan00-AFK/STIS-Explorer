// Generator awal (bootstrap) untuk src/assets/maps/kampus.json.
//
// Tata letak mengikuti footprint kampus Politeknik Statistika STIS (Jl. Otto Iskandardinata 64C)
// dari data OpenStreetMap (© OpenStreetMap contributors, ODbL), disederhanakan menjadi grid
// 16x16 px (~1,2 m per tile) dan dirapikan agar nyaman dijelajahi.
//
// PERHATIAN: setelah map diedit manual di Tiled, JANGAN jalankan script ini lagi karena
// kampus.json akan ditimpa. Jalankan: npm run assets:map -- --force
import { writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { T, TILE_SIZE, tilesetDefinition } from './lib/tileset.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'src/assets/maps/kampus.json')

if (existsSync(outPath) && !process.argv.includes('--force')) {
  console.error('kampus.json sudah ada. Tambahkan --force untuk menimpa (perubahan manual di Tiled akan hilang).')
  process.exit(1)
}

const W = 106
const H = 76

const LAYERS = ['Ground', 'Roads', 'Structures', 'Decor', 'Collision', 'Overlay']
const grid = Object.fromEntries(LAYERS.map((n) => [n, new Array(W * H).fill(0)]))

/** Tulis tile (index 0-based) ke layer; GID Tiled = index + 1. */
function set(layer, x, y, tile) {
  if (x < 0 || y < 0 || x >= W || y >= H) return
  grid[layer][y * W + x] = tile + 1
}
function fill(layer, x, y, w, h, tile) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) set(layer, xx, yy, tile)
}
function solid(x, y, w = 1, h = 1) {
  fill('Collision', x, y, w, h, T.COLLISION)
}
function clear(layer, x, y, w = 1, h = 1) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) grid[layer][yy * W + xx] = 0
}

let seed = 12345
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x7fffffff
}

// ---------------------------------------------------------------------------
// Objek Tiled
// ---------------------------------------------------------------------------
let nextObjectId = 1
const objectLayers = { Buildings: [], NPCs: [], Interactive: [], Spawn: [] }

function prop(name, value) {
  return { name, type: typeof value === 'number' ? 'int' : typeof value === 'boolean' ? 'bool' : 'string', value }
}
function rectObject(layer, name, type, tx, ty, tw, th, props = {}) {
  objectLayers[layer].push({
    id: nextObjectId++,
    name,
    type,
    x: tx * TILE_SIZE,
    y: ty * TILE_SIZE,
    width: tw * TILE_SIZE,
    height: th * TILE_SIZE,
    rotation: 0,
    visible: true,
    properties: [prop('type', type), ...Object.entries(props).map(([k, v]) => prop(k, v))]
  })
}
function pointObject(layer, name, type, tx, ty, props = {}) {
  objectLayers[layer].push({
    id: nextObjectId++,
    name,
    type,
    point: true,
    x: tx * TILE_SIZE + TILE_SIZE / 2,
    y: ty * TILE_SIZE + TILE_SIZE / 2,
    width: 0,
    height: 0,
    rotation: 0,
    visible: true,
    properties: [prop('type', type), ...Object.entries(props).map(([k, v]) => prop(k, v))]
  })
}

// ---------------------------------------------------------------------------
// Prefab
// ---------------------------------------------------------------------------

/** Gedung beratap beton datar dengan fasad menghadap selatan. */
function building(x, y, w, h, { facadeRows = 3, doors = [], signs = [], stripe = false } = {}) {
  const roofBottom = y + h - facadeRows - 1
  for (let yy = y; yy <= roofBottom; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      const n = yy === y
      const s = yy === roofBottom
      const wst = xx === x
      const e = xx === x + w - 1
      let tile = T.ROOF_C
      if (n && wst) tile = T.ROOF_NW
      else if (n && e) tile = T.ROOF_NE
      else if (s && wst) tile = T.ROOF_SW
      else if (s && e) tile = T.ROOF_SE
      else if (n) tile = T.ROOF_N
      else if (s) tile = T.ROOF_S
      else if (wst) tile = T.ROOF_W
      else if (e) tile = T.ROOF_E
      else if (rand() < 0.012) tile = rand() < 0.6 ? T.ROOF_AC : T.ROOF_TANK
      set('Structures', xx, yy, tile)
    }
  }
  for (let r = 0; r < facadeRows; r++) {
    const yy = roofBottom + 1 + r
    const bottom = r === facadeRows - 1
    for (let xx = x; xx < x + w; xx++) {
      const edge = xx === x || xx === x + w - 1
      const rhythm = (xx - x) % 4 === 0
      let tile
      if (bottom) tile = edge || rhythm ? T.FACADE_BASE_WALL : T.FACADE_BASE_WINDOW
      else if (r === 0 && stripe) tile = T.FACADE_STRIPE
      else tile = edge || rhythm ? T.FACADE_WALL : T.FACADE_WINDOW
      set('Structures', xx, yy, tile)
    }
  }
  const baseRow = y + h - 1
  for (const dx of doors) {
    set('Structures', x + dx, baseRow, T.DOOR_L)
    set('Structures', x + dx + 1, baseRow, T.DOOR_R)
  }
  for (const dx of signs) set('Structures', x + dx, baseRow - 1, T.FACADE_SIGN)
  solid(x, y, w, h)
}

function house(x, y, w, h, alt = false) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++)
      set('Structures', xx, yy, yy === y + h - 1 ? T.HOUSE_ROOF_EAVE : alt ? T.HOUSE_ROOF_ALT : T.HOUSE_ROOF)
  solid(x, y, w, h)
}

function tree(x, y) {
  set('Overlay', x, y - 1, T.TREE_TOP)
  set('Decor', x, y, T.TREE_BOTTOM)
  solid(x, y)
}

function bigTree(x, y) {
  set('Overlay', x, y, T.BIGTREE_TL)
  set('Overlay', x + 1, y, T.BIGTREE_TR)
  set('Decor', x, y + 1, T.BIGTREE_BL)
  set('Decor', x + 1, y + 1, T.BIGTREE_BR)
  solid(x, y + 1, 2, 1)
}

function decor(x, y, tile, blocking = true) {
  set('Decor', x, y, tile)
  if (blocking) solid(x, y)
}

function lamp(x, y) {
  set('Overlay', x, y - 1, T.LAMP_TOP)
  decor(x, y, T.LAMP_BOTTOM)
}

// ---------------------------------------------------------------------------
// 1. Dasar: rumput di luar, paving di dalam kampus
// ---------------------------------------------------------------------------
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) set('Ground', x, y, rand() < 0.1 ? T.GRASS_DARK : T.GRASS)

const CAMPUS = { x0: 6, y0: 5, x1: 86, y1: 65 } // area dalam pagar
fill('Ground', CAMPUS.x0, CAMPUS.y0, CAMPUS.x1 - CAMPUS.x0 + 1, CAMPUS.y1 - CAMPUS.y0 + 1, T.PAVING)

// ---------------------------------------------------------------------------
// 2. Jalan di sekitar kampus
// ---------------------------------------------------------------------------
// Trotoar Jl. Otto Iskandardinata (sisi timur)
fill('Roads', 88, 0, 3, H, T.SIDEWALK)
// Jl. Otto Iskandardinata (jalan utama + jalur TransJakarta di tengah)
for (let y = 0; y < H; y++) {
  for (let x = 91; x < W; x++) {
    let tile = T.ASPHALT
    if (x === 91 || x === W - 1) tile = T.ASPHALT_EDGE_V
    else if ((x === 94 || x === 102) && y % 4 < 2) tile = T.ASPHALT_DASH_V
    else if (x >= 97 && x <= 99) tile = T.BUSWAY
    set('Roads', x, y, tile)
  }
}
solid(91, 0, W - 91, H) // jalan raya tidak bisa dilalui pejalan kaki
// Jl. Sensus Raya (sisi selatan)
for (let x = 0; x < 91; x++) {
  for (let y = 67; y <= 70; y++) set('Roads', x, y, y === 68 && x % 4 < 2 ? T.ASPHALT_DASH_H : T.ASPHALT)
}
clear('Roads', 88, 67, 3, 4)
fill('Roads', 88, 67, 3, 4, T.ZEBRA)
// Trotoar kecil di depan pagar selatan
fill('Roads', 0, 71, 88, 1, T.SIDEWALK)

// ---------------------------------------------------------------------------
// 3. Bangunan tetangga (di luar kampus)
// ---------------------------------------------------------------------------
// Utara: permukiman + Graha Marba
for (let x = 0; x < 43; x += 6) house(x, 0, 5, 3, x % 12 === 0)
building(44, -2, 23, 6, { facadeRows: 0 })
fill('Collision', 44, 0, 23, 4, T.COLLISION)
for (let x = 68; x < 86; x += 6) house(x, 0, 5, 3, true)
// Barat: SD Negeri Bidara Cina 01 & rumah warga
house(0, 6, 4, 6)
house(0, 14, 4, 6, true)
house(0, 22, 4, 8)
building(0, 34, 5, 32, { facadeRows: 0 })
// Selatan: rumah di seberang Jl. Sensus Raya
for (let x = 0; x < 86; x += 7) house(x, 72, 6, 4, x % 14 === 0)

// ---------------------------------------------------------------------------
// 4. Pagar keliling kampus + gerbang
// ---------------------------------------------------------------------------
const GATE_NORTH = { y: 18, h: 4 } // gerbang utama (Jl. Otista)
const GATE_SOUTH_EAST = { y: 49, h: 4 } // gerbang keluar (Jl. Otista)
const GATE_SENSUS = { x: 59, w: 3 } // gerbang Jl. Sensus Raya

for (let x = 5; x <= 87; x++) {
  set('Structures', x, 4, T.WALL_H)
  solid(x, 4)
  if (x >= GATE_SENSUS.x && x < GATE_SENSUS.x + GATE_SENSUS.w) {
    set('Roads', x, 66, T.GATE_RAIL)
    continue
  }
  set('Structures', x, 66, T.WALL_H)
  solid(x, 66)
}
for (let y = 4; y <= 66; y++) {
  set('Structures', 5, y, T.WALL_V)
  solid(5, y)
  const inGate = (y >= GATE_NORTH.y && y < GATE_NORTH.y + GATE_NORTH.h) || (y >= GATE_SOUTH_EAST.y && y < GATE_SOUTH_EAST.y + GATE_SOUTH_EAST.h)
  if (inGate) continue
  set('Structures', 87, y, T.WALL_V)
  solid(87, y)
}
for (const [x, y] of [
  [5, 4],
  [87, 4],
  [5, 66],
  [87, 66],
  [87, GATE_NORTH.y - 1],
  [87, GATE_NORTH.y + GATE_NORTH.h],
  [87, GATE_SOUTH_EAST.y - 1],
  [87, GATE_SOUTH_EAST.y + GATE_SOUTH_EAST.h],
  [GATE_SENSUS.x - 1, 66],
  [GATE_SENSUS.x + GATE_SENSUS.w, 66]
]) {
  set('Structures', x, y, T.WALL_PILLAR)
  solid(x, y)
}
// Jalan masuk dari Jl. Otista ke gerbang (melintasi trotoar)
fill('Roads', 87, GATE_NORTH.y, 4, GATE_NORTH.h, T.ASPHALT)
fill('Roads', 87, GATE_SOUTH_EAST.y, 4, GATE_SOUTH_EAST.h, T.ASPHALT)
fill('Roads', GATE_SENSUS.x, 66, GATE_SENSUS.w, 1, T.ASPHALT)

// ---------------------------------------------------------------------------
// 5. Jalur kendaraan drop-off berbentuk U (gerbang utara -> gerbang selatan)
// ---------------------------------------------------------------------------
fill('Roads', 76, GATE_NORTH.y, 11, GATE_NORTH.h, T.ASPHALT)
fill('Roads', 76, GATE_NORTH.y, 3, GATE_SOUTH_EAST.y + GATE_SOUTH_EAST.h - GATE_NORTH.y, T.ASPHALT)
fill('Roads', 76, GATE_SOUTH_EAST.y, 11, GATE_SOUTH_EAST.h, T.ASPHALT)
for (let y = GATE_NORTH.y + 5; y < GATE_SOUTH_EAST.y - 1; y += 3) set('Roads', 77, y, T.ASPHALT_DASH_V)
// Pulau taman di dalam jalur U
fill('Ground', 79, GATE_NORTH.y + GATE_NORTH.h, 8, GATE_SOUTH_EAST.y - GATE_NORTH.y - GATE_NORTH.h, T.GRASS)
for (let y = 24; y < 48; y += 5) set('Ground', 85, y, T.GRASS_FLOWER)
decor(80, 23, T.SIGN_L)
decor(81, 23, T.SIGN_R)
fill('Ground', 80, 24, 2, 1, T.GRASS_FLOWER)
tree(84, 25)
tree(80, 29)
bigTree(83, 31)
tree(80, 35)
tree(85, 45)
tree(80, 46)

// Pos keamanan (di pulau taman, dekat gerbang)
building(81, 39, 4, 3, { facadeRows: 1 })
set('Structures', 82, 41, T.POST_WINDOW)
set('Structures', 83, 41, T.POST_WINDOW)

// ---------------------------------------------------------------------------
// 6. Gedung kampus (posisi mengikuti footprint OSM, label gedung = perkiraan)
// ---------------------------------------------------------------------------
// Gedung 3 – blok utara
building(13, 10, 35, 19, { doors: [30], signs: [15] })
// Gedung 1 – sayap timur (menghadap halaman depan)
building(51, 18, 22, 16, { doors: [15], signs: [13], stripe: true })
// Gedung 2 – blok besar barat-selatan
building(6, 37, 51, 26, { doors: [42], signs: [40, 10] })

// Masjid Al Hasanah (sudut tenggara, 2 lantai)
{
  const x = 62
  const y = 53
  const w = 13
  const h = 10
  for (let yy = y; yy < y + h - 2; yy++)
    for (let xx = x; xx < x + w; xx++) set('Structures', xx, yy, yy === y + h - 3 ? T.MOSQUE_ROOF_EDGE : T.MOSQUE_ROOF)
  set('Structures', 67, 55, T.DOME_TL)
  set('Structures', 68, 55, T.DOME_TR)
  set('Structures', 67, 56, T.DOME_BL)
  set('Structures', 68, 56, T.DOME_BR)
  for (let xx = x; xx < x + w; xx++) {
    set('Structures', xx, y + h - 2, xx % 2 === 0 ? T.MOSQUE_WALL_WINDOW : T.MOSQUE_WALL)
    set('Structures', xx, y + h - 1, T.MOSQUE_WALL)
  }
  set('Structures', 68, y + h - 1, T.MOSQUE_DOOR)
  set('Structures', 67, y + h - 2, T.MOSQUE_WALL_WINDOW)
  set('Structures', 69, y + h - 2, T.MOSQUE_WALL_WINDOW)
  solid(x, y, w, h)
}

// Kios ATM (sudut timur laut, sesuai titik ATM di OSM)
building(68, 6, 7, 4, { facadeRows: 1 })
set('Structures', 70, 9, T.ATM_FRONT)
set('Structures', 72, 9, T.ATM_FRONT)

// ---------------------------------------------------------------------------
// 7. Ruang terbuka, parkir & dekorasi
// ---------------------------------------------------------------------------
// Area parkir motor & mobil (utara)
fill('Roads', 50, 11, 16, 4, T.ASPHALT)
for (let x = 50; x < 66; x++) set('Roads', x, 11, T.PARKING_LINE)
for (let x = 50; x < 66; x++) set('Roads', x, 14, T.PARKING_LINE)
for (let x = 51; x < 65; x += 2) decor(x, 11, T.MOTORBIKE)
decor(52, 14, T.CAR_BLUE_L)
decor(53, 14, T.CAR_BLUE_R)
decor(57, 14, T.CAR_RED_L)
decor(58, 14, T.CAR_RED_R)
decor(62, 14, T.CAR_BLUE_L)
decor(63, 14, T.CAR_BLUE_R)

// Taman sisi barat & utara (sepanjang pagar)
fill('Ground', 6, 5, 6, 30, T.GRASS)
fill('Ground', 12, 5, 37, 4, T.GRASS)
for (let y = 7; y < 34; y += 4) tree(7, y)
for (let x = 14; x < 48; x += 5) tree(x, 6)
bigTree(9, 12)
bigTree(9, 24)
for (let y = 10; y < 34; y += 6) set('Ground', 11, y, T.GRASS_FLOWER)

// Koridor antara Gedung 3 dan Gedung 2 (area nongkrong mahasiswa)
fill('Ground', 12, 30, 39, 6, T.PAVING_WARM)
for (let x = 16; x < 48; x += 8) {
  decor(x, 30, T.PLANTER)
  decor(x + 2, 34, T.BENCH)
  lamp(x + 4, 30)
}
decor(49, 34, T.TRASH)

// Halaman depan (plaza) antara Gedung 1, Gedung 2 dan masjid
fill('Ground', 58, 35, 17, 17, T.PAVING)
for (let x = 60; x < 74; x += 3) set('Ground', x, 43, T.PAVING_ACCENT)
fill('Ground', 58, 46, 3, 5, T.GRASS)
fill('Ground', 72, 46, 3, 5, T.GRASS)
tree(59, 48)
tree(73, 48)
decor(71, 36, T.INFO_BOARD)
decor(62, 38, T.BENCH)
decor(70, 40, T.BENCH)
decor(60, 41, T.FLOWER_BED)
decor(74, 41, T.FLOWER_BED)
lamp(59, 37)
lamp(74, 37)
decor(64, 45, T.PLANTER)
decor(69, 45, T.PLANTER)
decor(66, 50, T.TRASH)

// Jalur selatan (antara Gedung 2 / masjid dan pagar selatan)
fill('Ground', 6, 63, 81, 3, T.PAVING_WARM)
for (let x = 10; x < 56; x += 9) decor(x, 65, T.BUSH)
decor(76, 63, T.BUSH)
tree(85, 64)
tree(78, 60)
set('Ground', 85, 58, T.GRASS_FLOWER)

// Ruang antara Gedung 1 dan parkir
fill('Ground', 49, 16, 1, 1, T.PAVING)
lamp(49, 16)
tree(66, 7)
tree(76, 13)
decor(75, 15, T.BENCH)

// Halte BPS (trotoar Jl. Otista)
decor(88, 39, T.SHELTER_L, false)
decor(89, 39, T.SHELTER_R, false)
solid(88, 39, 2, 1)
for (let y = 2; y < H; y += 9) if (y < 17 || y > 53) tree(88, y)

// ---------------------------------------------------------------------------
// 8. Object layer (dibaca game: gedung, NPC, titik interaksi, spawn)
// ---------------------------------------------------------------------------
// Footprint gedung (type=building) + area pintu masuk (type=entrance)
rectObject('Buildings', 'Gedung 3', 'building', 13, 10, 35, 19, { buildingId: 'gedung-3' })
rectObject('Buildings', 'Gedung 3 - Pintu', 'entrance', 42, 29, 4, 2, { buildingId: 'gedung-3' })
rectObject('Buildings', 'Gedung 1', 'building', 51, 18, 22, 16, { buildingId: 'gedung-1' })
rectObject('Buildings', 'Gedung 1 - Pintu', 'entrance', 65, 34, 4, 2, { buildingId: 'gedung-1' })
rectObject('Buildings', 'Gedung 2', 'building', 6, 37, 51, 26, { buildingId: 'gedung-2' })
rectObject('Buildings', 'Gedung 2 - Pintu', 'entrance', 47, 63, 4, 2, { buildingId: 'gedung-2' })
rectObject('Buildings', 'Masjid Al Hasanah', 'building', 62, 53, 13, 10, { buildingId: 'masjid-al-hasanah' })
rectObject('Buildings', 'Masjid - Pintu', 'entrance', 67, 63, 3, 2, { buildingId: 'masjid-al-hasanah' })

// NPC
pointObject('NPCs', 'Pemandu Kampus', 'npc', 68, 37, { npcId: 'guide' })
pointObject('NPCs', 'Pak Satpam', 'npc', 80, 43, { npcId: 'security' })
pointObject('NPCs', 'Kak Dimas', 'npc', 23, 32, { npcId: 'student-dimas' })
pointObject('NPCs', 'Kak Salsa', 'npc', 39, 31, { npcId: 'student-salsa' })
pointObject('NPCs', 'Bu Rina', 'npc', 53, 64, { npcId: 'staff-rina' })

// Fasilitas & titik informasi
rectObject('Interactive', 'Papan Informasi', 'info', 70, 37, 3, 2, { infoId: 'papan-informasi' })
rectObject('Interactive', 'ATM', 'facility', 69, 10, 5, 2, { facilityId: 'atm' })
rectObject('Interactive', 'Area Parkir', 'facility', 50, 12, 16, 2, { facilityId: 'parkir' })
rectObject('Interactive', 'Pos Keamanan', 'facility', 80, 42, 6, 2, { facilityId: 'pos-keamanan' })
rectObject('Interactive', 'Gerbang Utama', 'facility', 83, GATE_NORTH.y, 4, GATE_NORTH.h, { facilityId: 'gerbang-utama' })
rectObject('Interactive', 'Gerbang Sensus Raya', 'facility', GATE_SENSUS.x, 64, GATE_SENSUS.w, 2, { facilityId: 'gerbang-sensus' })
rectObject('Interactive', 'Halte BPS', 'facility', 88, 40, 3, 2, { facilityId: 'halte-bps' })

// Titik awal pemain
pointObject('Spawn', 'player', 'spawn', 66, 39)

// ---------------------------------------------------------------------------
// 9. Tulis file Tiled JSON
// ---------------------------------------------------------------------------
let layerId = 1
const layers = LAYERS.map((name) => ({
  data: grid[name],
  height: H,
  id: layerId++,
  name,
  opacity: name === 'Collision' ? 0.5 : 1,
  type: 'tilelayer',
  visible: name !== 'Collision',
  width: W,
  x: 0,
  y: 0
}))
for (const [name, objects] of Object.entries(objectLayers)) {
  layers.push({
    draworder: 'topdown',
    id: layerId++,
    name,
    objects,
    opacity: 1,
    type: 'objectgroup',
    visible: true,
    x: 0,
    y: 0
  })
}

const map = {
  compressionlevel: -1,
  height: H,
  infinite: false,
  layers,
  nextlayerid: layerId,
  nextobjectid: nextObjectId,
  orientation: 'orthogonal',
  renderorder: 'right-down',
  tiledversion: '1.10.2',
  tileheight: TILE_SIZE,
  tilesets: [{ firstgid: 1, ...tilesetDefinition('../tilesets/tileset_kampus.png') }],
  tilewidth: TILE_SIZE,
  type: 'map',
  version: '1.10',
  width: W
}

writeFileSync(outPath, JSON.stringify(map))
console.log(`Map dibuat: ${W}x${H} tile (${W * TILE_SIZE}x${H * TILE_SIZE}px) -> ${outPath}`)
