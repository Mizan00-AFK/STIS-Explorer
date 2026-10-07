// Event bus kecil untuk PERINTAH dari Vue ke Phaser (mis. "pindah ke gedung X").
// State yang dibaca Vue disimpan di Pinia; event bus hanya untuk aksi sesaat.
// Sengaja tidak memakai Phaser.Events agar bundle Vue tidak ikut memuat Phaser.
import type { TravelTarget } from './data/types'

export interface GameEvents {
  /** Pindahkan pemain ke lokasi gedung / fasilitas / NPC. */
  travel: TravelTarget
  /** Tombol INTERACT (mobile) atau klik prompt interaksi. */
  interact: undefined
  /** Kembalikan kamera ke pemain (setelah resize, dsb). */
  'recenter-camera': undefined
  /** Ubah zoom kamera (+1 masuk, -1 keluar). */
  zoom: 1 | -1
}

type Handler<T> = (payload: T) => void

class EventBus {
  private handlers = new Map<keyof GameEvents, Set<Handler<never>>>()

  on<K extends keyof GameEvents>(event: K, handler: Handler<GameEvents[K]>): () => void {
    let set = this.handlers.get(event)
    if (!set) {
      set = new Set()
      this.handlers.set(event, set)
    }
    set.add(handler as Handler<never>)
    return () => this.off(event, handler)
  }

  off<K extends keyof GameEvents>(event: K, handler: Handler<GameEvents[K]>): void {
    this.handlers.get(event)?.delete(handler as Handler<never>)
  }

  emit<K extends keyof GameEvents>(event: K, ...payload: GameEvents[K] extends undefined ? [] : [GameEvents[K]]): void {
    this.handlers.get(event)?.forEach((handler) => (handler as Handler<GameEvents[K] | undefined>)(payload[0]))
  }
}

export const gameEvents = new EventBus()
