import type { NearbyTarget } from '../../stores/campusStore'

export type InteractableKind = NearbyTarget['kind']

/**
 * Kontrak semua objek yang bisa diinteraksikan (NPC, gedung, fasilitas, titik informasi).
 * InteractionSystem memilih objek dengan skor terkecil di sekitar pemain.
 */
export interface Interactable {
  readonly kind: InteractableKind
  readonly id: string
  readonly label: string
  readonly icon: string
  /** Teks aksi pada prompt, mis. "Bicara", "Lihat info gedung". */
  readonly actionLabel: string
  /** Skor kedekatan (lebih kecil = prioritas lebih tinggi), atau null bila di luar jangkauan. */
  score(px: number, py: number): number | null
  interact(): void
  setFocused(focused: boolean): void
}

/** Prioritas dasar per jenis agar NPC > pintu gedung > fasilitas > sekitar gedung. */
export const PRIORITY = {
  npc: 0,
  entrance: 100,
  facility: 200,
  building: 300
} as const

export interface ZoneOptions {
  kind: InteractableKind
  id: string
  label: string
  icon: string
  actionLabel: string
  rect: { x: number; y: number; width: number; height: number }
  /** Perluasan area deteksi (px). */
  padding?: number
  priority: number
  onInteract: () => void
  onFocus?: (focused: boolean) => void
}

/** Area persegi (dari object layer Tiled) yang memicu interaksi saat pemain berada di dalamnya. */
export class ZoneInteractable implements Interactable {
  readonly kind: InteractableKind
  readonly id: string
  readonly label: string
  readonly icon: string
  readonly actionLabel: string
  private readonly options: ZoneOptions

  constructor(options: ZoneOptions) {
    this.options = options
    this.kind = options.kind
    this.id = options.id
    this.label = options.label
    this.icon = options.icon
    this.actionLabel = options.actionLabel
  }

  score(px: number, py: number): number | null {
    const { rect, padding = 6, priority } = this.options
    const inside =
      px >= rect.x - padding && px <= rect.x + rect.width + padding && py >= rect.y - padding && py <= rect.y + rect.height + padding
    if (!inside) return null
    const cx = rect.x + rect.width / 2
    const cy = rect.y + rect.height / 2
    return priority + Math.min(99, Math.hypot(px - cx, py - cy) / 4)
  }

  interact(): void {
    this.options.onInteract()
  }

  setFocused(focused: boolean): void {
    this.options.onFocus?.(focused)
  }
}
