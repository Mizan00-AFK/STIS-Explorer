import Phaser from 'phaser'
import { DEPTH, TEXT_RESOLUTION } from '../constants'
import type { MarkerCategory } from '../data/types'

interface Marker {
  category: MarkerCategory
  text: Phaser.GameObjects.Text
  tween: Phaser.Tweens.Tween
}

/** Marker ikon (🏫 📚 🍴 🕌 🚻 🅿️ ...) yang melayang di atas lokasi dan bisa di-toggle per kategori. */
export default class MarkerSystem {
  private readonly scene: Phaser.Scene
  private readonly markers: Marker[] = []
  /** Jumlah marker per titik jangkar, untuk menggeser marker yang bertumpuk. */
  private readonly anchors = new Map<string, number>()

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  add(category: MarkerCategory, icon: string, x: number, y: number): { x: number; y: number } {
    const anchorKey = `${Math.round(x / 8)}:${Math.round(y / 8)}`
    const index = this.anchors.get(anchorKey) ?? 0
    this.anchors.set(anchorKey, index + 1)
    // Marker ke-2, ke-3, ... di titik yang sama digeser bergantian kiri/kanan.
    const offsetX = index === 0 ? 0 : (index % 2 === 1 ? 1 : -1) * Math.ceil(index / 2) * 13
    const px = x + offsetX

    const text = this.scene.add
      .text(px, y, icon, { fontSize: '11px', fontFamily: 'system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif' })
      .setOrigin(0.5, 1)
      .setResolution(TEXT_RESOLUTION)
      .setDepth(DEPTH.markers)
    const tween = this.scene.tweens.add({
      targets: text,
      y: y - 3,
      duration: 900 + index * 120,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    this.markers.push({ category, text, tween })
    return { x: px, y }
  }

  applyVisibility(hidden: readonly MarkerCategory[]): void {
    for (const marker of this.markers) {
      const visible = !hidden.includes(marker.category)
      marker.text.setVisible(visible)
      if (visible) marker.tween.resume()
      else marker.tween.pause()
    }
  }

  get categories(): MarkerCategory[] {
    return [...new Set(this.markers.map((m) => m.category))]
  }
}
