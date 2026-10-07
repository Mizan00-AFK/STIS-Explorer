import type Phaser from 'phaser'

/**
 * Collision berbasis layer Tiled "Collision": setiap tile yang terisi = tidak bisa dilewati.
 * Layer disembunyikan saat game berjalan (tetap terlihat di Tiled untuk diedit).
 */
export default class CollisionSystem {
  private readonly layer: Phaser.Tilemaps.TilemapLayer | null
  private readonly map: Phaser.Tilemaps.Tilemap

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap, layer: Phaser.Tilemaps.TilemapLayer | null) {
    this.map = map
    this.layer = layer
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    if (layer) {
      layer.setCollisionByExclusion([-1])
      layer.setVisible(false)
    } else {
      console.warn('[STISMAP] Layer "Collision" tidak ditemukan — pemain dapat menembus bangunan.')
    }
  }

  /** Tambah collider antara objek (pemain) dan layer collision + objek statis lain. */
  addCollider(scene: Phaser.Scene, actor: Phaser.Types.Physics.Arcade.ArcadeColliderType, others: Phaser.Types.Physics.Arcade.ArcadeColliderType[] = []): void {
    if (this.layer) scene.physics.add.collider(actor, this.layer)
    for (const other of others) scene.physics.add.collider(actor, other)
  }

  isWalkable(worldX: number, worldY: number): boolean {
    if (worldX < 0 || worldY < 0 || worldX >= this.map.widthInPixels || worldY >= this.map.heightInPixels) return false
    if (!this.layer) return true
    const tile = this.layer.getTileAtWorldXY(worldX, worldY, true)
    return !tile || tile.index === -1
  }

  /** Cari titik yang bisa dipijak terdekat (pencarian spiral per tile). */
  findFreeSpotNear(worldX: number, worldY: number, maxRadiusTiles = 6): { x: number; y: number } {
    if (this.isWalkable(worldX, worldY)) return { x: worldX, y: worldY }
    const size = this.map.tileWidth
    for (let r = 1; r <= maxRadiusTiles; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue
          const x = worldX + dx * size
          const y = worldY + dy * size
          if (this.isWalkable(x, y)) return { x, y }
        }
      }
    }
    return { x: worldX, y: worldY }
  }
}
