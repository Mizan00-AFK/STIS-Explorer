import type Phaser from 'phaser'

/**
 * Membuat gambar mini-map SEKALI dari tile layer Tiled: 1 piksel = 1 tile.
 * Warna diambil dari property tile `minimap` di tileset (lihat tools/lib/tileset.mjs),
 * sehingga perubahan map di Tiled otomatis tercermin di mini-map.
 */
export function buildMinimapImage(map: Phaser.Tilemaps.Tilemap, layerNames: string[]): string {
  const canvas = document.createElement('canvas')
  canvas.width = map.width
  canvas.height = map.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = '#0b1220'
  ctx.fillRect(0, 0, map.width, map.height)

  const colorCache = new Map<number, string | null>()
  const colorOf = (tile: Phaser.Tilemaps.Tile): string | null => {
    const cached = colorCache.get(tile.index)
    if (cached !== undefined) return cached
    const props = tile.tileset?.getTileProperties(tile.index) as Record<string, unknown> | null | undefined
    const color = typeof props?.minimap === 'string' ? props.minimap : null
    colorCache.set(tile.index, color)
    return color
  }

  // Layer bawah dulu, layer atas menimpa.
  for (const name of layerNames) {
    const layer = map.getLayer(name)
    if (!layer) continue
    for (const row of layer.data) {
      for (const tile of row) {
        if (tile.index < 0) continue
        const color = colorOf(tile)
        if (!color) continue
        ctx.fillStyle = color
        ctx.fillRect(tile.x, tile.y, 1, 1)
      }
    }
  }

  try {
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}
