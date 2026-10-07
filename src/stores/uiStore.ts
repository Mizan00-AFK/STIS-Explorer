import { defineStore } from 'pinia'
import type { MarkerCategory, PanelId, TravelTarget } from '../game/data/types'

export type Screen = 'intro' | 'game'
export type GameStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface MinimapBuilding {
  id: string
  name: string
  color: string
  x: number
  y: number
  w: number
  h: number
}

export interface MinimapMarker {
  key: string
  icon: string
  label: string
  category: MarkerCategory
  x: number
  y: number
  target: TravelTarget
}

/** Data mini-map yang dibuat SEKALI oleh Phaser setelah map dimuat. */
export interface MinimapInfo {
  image: string
  worldWidth: number
  worldHeight: number
  buildings: MinimapBuilding[]
  markers: MinimapMarker[]
}

export interface Toast {
  id: number
  message: string
  tone: 'info' | 'success' | 'warning'
}

const PREFS_KEY = 'stismap:prefs'

interface Prefs {
  characterRow: number
  hiddenMarkers: MarkerCategory[]
  minimapVisible: boolean
}

function loadPrefs(): Partial<Prefs> {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? (JSON.parse(raw) as Partial<Prefs>) : {}
  } catch {
    return {}
  }
}

function detectTouch(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window
}

let toastSeq = 0

export const useUiStore = defineStore('ui', {
  state: () => {
    const prefs = loadPrefs()
    return {
      screen: 'intro' as Screen,
      /** Panel/menu yang sedang terbuka (About, Fasilitas, Panduan, Direktori, Menu). */
      activeMenu: null as PanelId | null,
      /** Fasilitas yang disorot saat panel Fasilitas dibuka. */
      focusedFacilityId: null as string | null,
      directoryQuery: '',

      gameStatus: 'idle' as GameStatus,
      loadProgress: 0,
      loadMessage: '',
      errorMessage: '',
      errorDetails: [] as string[],

      characterRow: typeof prefs.characterRow === 'number' ? prefs.characterRow : 0,
      hiddenMarkers: Array.isArray(prefs.hiddenMarkers) ? prefs.hiddenMarkers : ([] as MarkerCategory[]),
      minimapVisible: prefs.minimapVisible ?? true,
      minimap: null as MinimapInfo | null,

      toasts: [] as Toast[],
      isTouch: detectTouch()
    }
  },
  getters: {
    isMarkerVisible: (state) => (category: MarkerCategory) => !state.hiddenMarkers.includes(category)
  },
  actions: {
    openMenu(menu: PanelId, options: { query?: string; facilityId?: string } = {}) {
      this.activeMenu = menu
      if (options.query !== undefined) this.directoryQuery = options.query
      this.focusedFacilityId = options.facilityId ?? null
    },
    closeMenu() {
      this.activeMenu = null
      this.focusedFacilityId = null
    },

    startGame() {
      this.screen = 'game'
    },
    returnToTitle() {
      this.screen = 'intro'
      this.activeMenu = null
      this.gameStatus = 'idle'
      this.minimap = null
    },

    setLoading(progress: number, message?: string) {
      this.gameStatus = 'loading'
      this.loadProgress = Math.max(0, Math.min(1, progress))
      if (message) this.loadMessage = message
    },
    setGameReady() {
      this.gameStatus = 'ready'
      this.loadProgress = 1
    },
    setGameError(message: string, details: string[] = []) {
      this.gameStatus = 'error'
      this.errorMessage = message
      this.errorDetails = details
    },

    selectCharacter(row: number) {
      this.characterRow = row
      this.savePrefs()
    },
    toggleMarker(category: MarkerCategory) {
      this.hiddenMarkers = this.hiddenMarkers.includes(category)
        ? this.hiddenMarkers.filter((c) => c !== category)
        : [...this.hiddenMarkers, category]
      this.savePrefs()
    },
    setAllMarkers(visible: boolean, categories: MarkerCategory[]) {
      this.hiddenMarkers = visible ? [] : [...categories]
      this.savePrefs()
    },
    toggleMinimap() {
      this.minimapVisible = !this.minimapVisible
      this.savePrefs()
    },
    setMinimap(info: MinimapInfo) {
      this.minimap = info
    },

    toast(message: string, tone: Toast['tone'] = 'info', duration = 3200) {
      const id = ++toastSeq
      this.toasts = [...this.toasts.slice(-2), { id, message, tone }]
      window.setTimeout(() => this.dismissToast(id), duration)
    },
    dismissToast(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    savePrefs() {
      try {
        const prefs: Prefs = {
          characterRow: this.characterRow,
          hiddenMarkers: this.hiddenMarkers,
          minimapVisible: this.minimapVisible
        }
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
      } catch {
        // localStorage tidak tersedia (mode privat, dsb.) — preferensi tidak disimpan.
      }
    }
  }
})
