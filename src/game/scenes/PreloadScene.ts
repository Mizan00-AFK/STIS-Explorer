import Phaser from 'phaser'
// URL aset di-resolve oleh Vite agar tetap benar setelah `npm run build`
// (path string 'src/assets/...' hanya berjalan saat dev server).
import tilesetUrl from '../../assets/tilesets/tileset_kampus.png'
import mapUrl from '../../assets/maps/kampus.json?url'
import playerUrl from '../../assets/player/chibi-layered.png'
import { useUiStore } from '../../stores/uiStore'
import { ASSET, LAYERS, TILESET_NAME } from '../constants'
import { CHARACTER_SHEET } from '../objects/characterAnims'

const LABELS: Record<string, string> = {
  [ASSET.tiles]: 'tileset kampus',
  [ASSET.map]: 'peta kampus',
  [ASSET.player]: 'sprite karakter'
}

/** Memuat aset dan melaporkan progres ke layar loading (Vue) lewat uiStore. */
export default class PreloadScene extends Phaser.Scene {
  private failed: string[] = []

  constructor() {
    super('PreloadScene')
  }

  preload() {
    const ui = useUiStore()
    this.failed = []
    ui.setLoading(0, 'Menyiapkan peta kampus...')

    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => ui.setLoading(value))
    this.load.on(Phaser.Loader.Events.FILE_COMPLETE, (key: string) => ui.setLoading(this.load.progress, `Memuat ${LABELS[key] ?? key}...`))
    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      this.failed.push(LABELS[file.key] ?? file.key)
      console.error('[STISMAP] Gagal memuat aset:', file.key, file.src)
    })

    this.load.image(ASSET.tiles, tilesetUrl)
    this.load.tilemapTiledJSON(ASSET.map, mapUrl)
    this.load.spritesheet(ASSET.player, playerUrl, {
      frameWidth: CHARACTER_SHEET.frameWidth,
      frameHeight: CHARACTER_SHEET.frameHeight
    })
  }

  create() {
    const ui = useUiStore()
    if (this.failed.length > 0) {
      ui.setGameError('Unable to load campus map. Gagal memuat aset kampus.', this.failed.map((f) => `Gagal memuat ${f}`))
      return
    }

    const problems = this.validateMap()
    if (problems.length > 0) {
      ui.setGameError('Unable to load campus map. File peta tidak valid.', problems)
      return
    }

    ui.setLoading(1, 'Membangun kampus...')
    this.scene.start('CampusScene')
  }

  /** Pastikan map Tiled memiliki tileset & layer wajib sebelum CampusScene dibuat. */
  private validateMap(): string[] {
    const data = this.cache.tilemap.get(ASSET.map)?.data as
      | { tilesets?: { name?: string }[]; layers?: { name?: string }[] }
      | undefined
    if (!data) return ['kampus.json tidak terbaca.']
    const problems: string[] = []
    if (!data.tilesets?.some((t) => t.name === TILESET_NAME)) problems.push(`Tileset "${TILESET_NAME}" tidak ditemukan di kampus.json.`)
    const layerNames = new Set((data.layers ?? []).map((l) => l.name))
    if (!layerNames.has('Ground')) problems.push('Layer "Ground" tidak ditemukan di kampus.json.')
    if (!layerNames.has(LAYERS.collision)) console.warn('[STISMAP] Layer "Collision" tidak ada; collision dinonaktifkan.')
    return problems
  }
}
