import type { Interactable } from '../objects/InteractiveObject'

/**
 * Memilih objek interaktif terdekat setiap frame, tetapi hanya memberi tahu Vue/Pinia
 * (lewat `onChange`) ketika target BERUBAH — bukan setiap frame.
 */
export default class InteractionSystem {
  private readonly items: Interactable[] = []
  private current: Interactable | null = null
  private readonly onChange: (target: Interactable | null) => void

  constructor(onChange: (target: Interactable | null) => void) {
    this.onChange = onChange
  }

  add(item: Interactable): void {
    this.items.push(item)
  }

  get target(): Interactable | null {
    return this.current
  }

  update(px: number, py: number): void {
    let best: Interactable | null = null
    let bestScore = Infinity
    for (const item of this.items) {
      const score = item.score(px, py)
      if (score !== null && score < bestScore) {
        best = item
        bestScore = score
      }
    }
    if (best === this.current) return
    this.current?.setFocused(false)
    best?.setFocused(true)
    this.current = best
    this.onChange(best)
  }

  /** Jalankan interaksi pada target saat ini. Mengembalikan false bila tidak ada target. */
  trigger(): boolean {
    if (!this.current) return false
    this.current.interact()
    return true
  }

  clear(): void {
    this.current?.setFocused(false)
    this.current = null
    this.onChange(null)
  }
}
