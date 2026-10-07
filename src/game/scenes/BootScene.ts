import Phaser from 'phaser'
import { ASSET } from '../constants'

/**
 * Scene pertama: menyiapkan tekstur kecil yang dibuat lewat kode (bayangan, beacon tujuan),
 * lalu berpindah ke PreloadScene untuk memuat aset map & sprite.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    const g = this.make.graphics({ x: 0, y: 0 }, false)

    // Bayangan elips di bawah karakter.
    g.fillStyle(0x000000, 0.28)
    g.fillEllipse(6, 2.5, 12, 5)
    g.generateTexture(ASSET.shadow, 12, 5)
    g.clear()

    // Cincin penanda tujuan fast travel.
    g.lineStyle(2, 0xf28c28, 1)
    g.strokeCircle(16, 16, 14)
    g.lineStyle(1, 0xffffff, 0.8)
    g.strokeCircle(16, 16, 10)
    g.generateTexture(ASSET.beacon, 32, 32)
    g.destroy()

    this.scene.start('PreloadScene')
  }
}
