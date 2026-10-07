import Phaser from 'phaser'
import { DEPTH, PIXEL_FONT, TEXT_RESOLUTION } from '../constants'
import type { BuildingData } from '../data/types'
import type { TiledRect } from '../tiled'
import { PRIORITY, type Interactable } from './InteractiveObject'

/** Jarak deteksi di sekeliling footprint gedung (px). */
const AROUND_PADDING = 14

/**
 * Gedung di peta: footprint (object `type=building`) + area pintu (object `type=entrance`).
 * Mendekati gedung memunculkan prompt; pintu masuk mendapat prioritas lebih tinggi.
 */
export default class Building implements Interactable {
  readonly kind = 'building' as const
  readonly id: string
  readonly label: string
  readonly icon: string
  readonly actionLabel = 'Lihat info gedung'
  readonly data: BuildingData
  readonly footprint: TiledRect
  readonly entrance: TiledRect | null

  private readonly nameLabel: Phaser.GameObjects.Text
  private readonly highlight: Phaser.GameObjects.Rectangle
  private readonly onOpen: (building: Building) => void

  constructor(
    scene: Phaser.Scene,
    data: BuildingData,
    footprint: TiledRect,
    entrance: TiledRect | null,
    onOpen: (building: Building) => void
  ) {
    this.data = data
    this.id = data.id
    this.label = data.name
    this.icon = data.icon
    this.footprint = footprint
    this.entrance = entrance
    this.onOpen = onOpen

    this.nameLabel = scene.add
      .text(footprint.centerX, footprint.y + Math.min(28, footprint.height * 0.3), data.shortName, {
        fontFamily: PIXEL_FONT,
        fontSize: '8px',
        color: '#ffffff',
        stroke: '#0b1a33',
        strokeThickness: 4
      })
      .setOrigin(0.5, 0.5)
      .setResolution(TEXT_RESOLUTION)
      .setDepth(DEPTH.labels)

    this.highlight = scene.add
      .rectangle(footprint.x, footprint.y, footprint.width, footprint.height)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xf28c28, 0.9)
      .setDepth(DEPTH.above - 1)
      .setVisible(false)
  }

  /** Titik berdiri di depan pintu (tujuan fast travel). */
  get entrancePoint(): { x: number; y: number } {
    if (this.entrance) return { x: this.entrance.centerX, y: this.entrance.centerY + 4 }
    return { x: this.footprint.centerX, y: this.footprint.y + this.footprint.height + 12 }
  }

  score(px: number, py: number): number | null {
    const e = this.entrance
    if (e && px >= e.x - 4 && px <= e.x + e.width + 4 && py >= e.y - 4 && py <= e.y + e.height + 4) {
      return PRIORITY.entrance + Phaser.Math.Distance.Between(px, py, e.centerX, e.centerY) / 4
    }
    const f = this.footprint
    const dx = Math.max(f.x - px, 0, px - (f.x + f.width))
    const dy = Math.max(f.y - py, 0, py - (f.y + f.height))
    const distance = Math.hypot(dx, dy)
    return distance <= AROUND_PADDING ? PRIORITY.building + distance : null
  }

  interact(): void {
    this.onOpen(this)
  }

  setFocused(focused: boolean): void {
    this.highlight.setVisible(focused)
    this.nameLabel.setColor(focused ? '#f28c28' : '#ffffff')
  }
}
