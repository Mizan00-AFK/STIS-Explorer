// Membuat ulang src/assets/tilesets/tileset_kampus.png dan tileset Tiled (.tsj).
// Jalankan: npm run assets:tileset
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { encodePng } from './lib/png.mjs'
import {
  drawAllTiles,
  tilesetDefinition,
  TILE_SIZE,
  COLUMNS,
  MARGIN,
  SPACING,
  ATLAS_WIDTH as width,
  ATLAS_HEIGHT as height,
  TILE_COUNT
} from './lib/tileset.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cell = TILE_SIZE + SPACING
const atlas = new Uint8Array(width * height * 4)

function copyPixel(src, sx, sy, dx, dy) {
  const si = (sy * TILE_SIZE + sx) * 4
  const di = (dy * width + dx) * 4
  for (let k = 0; k < 4; k++) atlas[di + k] = src[si + k]
}

drawAllTiles().forEach((tile, i) => {
  const ox = MARGIN + (i % COLUMNS) * cell
  const oy = MARGIN + Math.floor(i / COLUMNS) * cell
  // Ekstrusi 1px di sekeliling tile untuk mencegah garis/bleeding saat kamera di-zoom.
  for (let y = -1; y <= TILE_SIZE; y++) {
    for (let x = -1; x <= TILE_SIZE; x++) {
      const sx = Math.min(TILE_SIZE - 1, Math.max(0, x))
      const sy = Math.min(TILE_SIZE - 1, Math.max(0, y))
      copyPixel(tile, sx, sy, ox + x, oy + y)
    }
  }
})

const pngPath = resolve(root, 'src/assets/tilesets/tileset_kampus.png')
mkdirSync(dirname(pngPath), { recursive: true })
writeFileSync(pngPath, encodePng(width, height, atlas))

const tsj = {
  ...tilesetDefinition('../tilesets/tileset_kampus.png'),
  tiledversion: '1.10.2',
  type: 'tileset',
  version: '1.10'
}
writeFileSync(resolve(root, 'src/assets/maps/tileset_kampus.tsj'), JSON.stringify(tsj, null, 1))

console.log(`Tileset dibuat: ${width}x${height}px, ${TILE_COUNT} tile -> ${pngPath}`)
