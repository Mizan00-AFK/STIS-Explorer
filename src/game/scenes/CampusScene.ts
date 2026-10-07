import Phaser from 'phaser'
import { watch, type WatchStopHandle } from 'vue'
import { useCampusStore } from '../../stores/campusStore'
import { useDialogStore } from '../../stores/dialogStore'
import { isInputLocked } from '../../stores/inputLock'
import { useUiStore, type MinimapBuilding, type MinimapMarker } from '../../stores/uiStore'
import { ASSET, DEPTH, LAYER_DEPTH, LAYERS, TILESET_NAME } from '../constants'
import { buildings as buildingList, facilities, getBuilding, getFacility, getNpc, MARKER_CATEGORIES } from '../data/campus'
import { facilityIcon } from '../data/facilities'
import type { DialogChoice, FacilityData, TravelTarget } from '../data/types'
import { gameEvents } from '../EventBus'
import Building from '../objects/Building'
import { ZoneInteractable, PRIORITY } from '../objects/InteractiveObject'
import NPC from '../objects/NPC'
import Player, { type MoveInput } from '../objects/Player'
import { playerTracker, virtualInput } from '../shared'
import CameraSystem from '../systems/CameraSystem'
import CollisionSystem from '../systems/CollisionSystem'
import InteractionSystem from '../systems/InteractionSystem'
import MarkerSystem from '../systems/MarkerSystem'
import { buildMinimapImage } from '../systems/MinimapSystem'
import { objectsOf, tiledRect, tiledString, tiledType, type TiledRect } from '../tiled'

/** Jeda setelah overlay ditutup agar tombol yang sama tidak langsung memicu interaksi lagi. */
const UNLOCK_COOLDOWN_MS = 250

type Keys = Record<'W' | 'A' | 'S' | 'D' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SHIFT', Phaser.Input.Keyboard.Key>

/**
 * Scene utama peta kampus. Phaser menangani map, pemain, collision, gerak, NPC, dan deteksi
 * interaksi. UI (modal, denah, pencarian) ditangani Vue; jembatannya Pinia + gameEvents.
 */
export default class CampusScene extends Phaser.Scene {
  private player!: Player
  private keys!: Keys
  private cameraSystem!: CameraSystem
  private collision!: CollisionSystem
  private interaction!: InteractionSystem
  private markers!: MarkerSystem

  private readonly buildings = new Map<string, Building>()
  private readonly npcs = new Map<string, NPC>()
  /** Area fasilitas dari object layer "Interactive" (key = facilityId). */
  private readonly facilityZones = new Map<string, TiledRect>()

  private locked = true
  private unlockedAt = 0
  private stopWatchers: WatchStopHandle[] = []
  private offEvents: (() => void)[] = []
  private beacon?: Phaser.GameObjects.Image

  constructor() {
    super('CampusScene')
  }

  create() {
    const ui = useUiStore()
    try {
      this.buildWorld()
    } catch (error) {
      console.error('[STISMAP] Gagal membangun scene kampus:', error)
      ui.setGameError('Unable to load campus map. Terjadi kesalahan saat membangun peta.', [String(error)])
      return
    }

    this.setupInput()
    this.setupBridges()
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this)
    this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanup, this)

    ui.setGameReady()
  }

  // ---------------------------------------------------------------------------
  // Pembangunan dunia
  // ---------------------------------------------------------------------------

  private buildWorld() {
    const map = this.make.tilemap({ key: ASSET.map })
    const tileset = map.addTilesetImage(TILESET_NAME, ASSET.tiles)
    if (!tileset) throw new Error(`Tileset "${TILESET_NAME}" tidak dapat dipasang.`)

    for (const name of LAYERS.tiles) {
      if (map.getLayerIndex(name) === null) continue
      map.createLayer(name, tileset, 0, 0)?.setDepth(LAYER_DEPTH[name] ?? 0)
    }
    const collisionLayer = map.getLayerIndex(LAYERS.collision) !== null ? map.createLayer(LAYERS.collision, tileset, 0, 0) : null
    this.collision = new CollisionSystem(this, map, collisionLayer)

    // Pemain
    const spawnObj = objectsOf(map, LAYERS.spawn).find((o) => tiledType(o) === 'spawn') ?? null
    const spawn = spawnObj ? { x: spawnObj.x ?? 0, y: spawnObj.y ?? 0 } : { x: map.widthInPixels / 2, y: map.heightInPixels / 2 }
    this.player = new Player(this, spawn.x, spawn.y, useUiStore().characterRow)

    this.interaction = new InteractionSystem((target) => {
      useCampusStore().setNearby(
        target ? { kind: target.kind, id: target.id, label: target.label, icon: target.icon, actionLabel: target.actionLabel } : null
      )
    })
    this.markers = new MarkerSystem(this)

    const minimapBuildings = this.createBuildings(map)
    this.createNpcs(map)
    this.createFacilities(map)
    const minimapMarkers = this.createMarkers()

    this.collision.addCollider(this, this.player, [...this.npcs.values()])
    this.cameraSystem = new CameraSystem(this, this.player, map.widthInPixels, map.heightInPixels)

    useUiStore().setMinimap({
      image: buildMinimapImage(map, ['Ground', 'Roads', 'Structures', 'Decor']),
      worldWidth: map.widthInPixels,
      worldHeight: map.heightInPixels,
      buildings: minimapBuildings,
      markers: minimapMarkers
    })
  }

  private createBuildings(map: Phaser.Tilemaps.Tilemap): MinimapBuilding[] {
    const objects = objectsOf(map, LAYERS.buildings)
    const entrances = new Map<string, TiledRect>()
    for (const obj of objects) {
      const id = tiledString(obj, 'buildingId')
      if (tiledType(obj) === 'entrance' && id) entrances.set(id, tiledRect(obj))
    }

    const result: MinimapBuilding[] = []
    for (const obj of objects) {
      if (tiledType(obj) !== 'building') continue
      const id = tiledString(obj, 'buildingId')
      const data = getBuilding(id)
      if (!id || !data) {
        console.warn(`[STISMAP] Objek gedung "${obj.name}" memakai buildingId "${id}" yang tidak ada di buildings.ts`)
        continue
      }
      const footprint = tiledRect(obj)
      const building = new Building(this, data, footprint, entrances.get(id) ?? null, (b) => useCampusStore().openBuilding(b.id))
      this.buildings.set(id, building)
      this.interaction.add(building)
      result.push({ id, name: data.name, color: data.color, x: footprint.x, y: footprint.y, w: footprint.width, h: footprint.height })
    }
    for (const b of buildingList) if (!this.buildings.has(b.id)) console.warn(`[STISMAP] Gedung "${b.id}" belum punya objek di Tiled.`)
    return result
  }

  private createNpcs(map: Phaser.Tilemaps.Tilemap) {
    const dialog = useDialogStore()
    for (const obj of objectsOf(map, LAYERS.npcs)) {
      if (tiledType(obj) !== 'npc') continue
      const id = tiledString(obj, 'npcId')
      const data = getNpc(id)
      if (!id || !data) {
        console.warn(`[STISMAP] NPC "${obj.name}" memakai npcId "${id}" yang tidak ada di npcs.ts`)
        continue
      }
      const npc = new NPC({
        scene: this,
        x: obj.x ?? 0,
        y: obj.y ?? 0,
        data,
        onTalk: (n) => {
          n.facePoint(this.player.x, this.player.y)
          dialog.openScript({ name: n.npcData.name, role: n.npcData.role, spriteRow: n.npcData.spriteRow, tint: n.npcData.tint }, n.dialog)
        }
      })
      this.npcs.set(id, npc)
      this.interaction.add(npc)
    }
  }

  private createFacilities(map: Phaser.Tilemaps.Tilemap) {
    for (const obj of objectsOf(map, LAYERS.interactive)) {
      const type = tiledType(obj)
      if (type !== 'facility' && type !== 'info') continue
      const id = tiledString(obj, 'facilityId') ?? tiledString(obj, 'infoId')
      const facility = getFacility(id)
      if (!id || !facility) {
        console.warn(`[STISMAP] Objek "${obj.name}" memakai facilityId "${id}" yang tidak ada di facilities.ts`)
        continue
      }
      const rect = tiledRect(obj)
      this.facilityZones.set(id, rect)
      this.interaction.add(
        new ZoneInteractable({
          kind: type === 'info' ? 'info' : 'facility',
          id,
          label: facility.name,
          icon: facilityIcon(facility.category),
          actionLabel: type === 'info' ? 'Baca informasi' : 'Lihat fasilitas',
          rect,
          priority: PRIORITY.facility,
          onInteract: () => this.openFacility(facility)
        })
      )
    }
  }

  /** Marker gedung & fasilitas. Mengembalikan daftar marker untuk mini-map. */
  private createMarkers(): MinimapMarker[] {
    const list: MinimapMarker[] = []
    for (const building of this.buildings.values()) {
      const category = building.data.markerCategory ?? 'building'
      const point = this.markers.add(category, building.data.icon, building.footprint.centerX, building.footprint.y + 8)
      list.push({
        key: `b-${building.id}`,
        icon: building.data.icon,
        label: building.data.name,
        category,
        x: point.x,
        y: point.y,
        target: { kind: 'building', id: building.id }
      })
    }
    for (const facility of facilities) {
      if (facility.marker === false) continue
      const anchor = this.facilityAnchor(facility)
      if (!anchor) continue
      const icon = facilityIcon(facility.category)
      const point = this.markers.add(facility.category, icon, anchor.x, anchor.y)
      list.push({
        key: `f-${facility.id}`,
        icon,
        label: facility.name,
        category: facility.category,
        x: point.x,
        y: point.y,
        target: { kind: 'facility', id: facility.id }
      })
    }
    this.markers.applyVisibility(useUiStore().hiddenMarkers)
    return list
  }

  private facilityAnchor(facility: FacilityData): { x: number; y: number } | null {
    const zone = this.facilityZones.get(facility.id)
    if (zone) return { x: zone.centerX, y: zone.y - 2 }
    const building = facility.buildingId ? this.buildings.get(facility.buildingId) : undefined
    if (building) {
      const p = building.entrancePoint
      return { x: p.x, y: p.y - 22 }
    }
    return null
  }

  // ---------------------------------------------------------------------------
  // Input & jembatan Vue
  // ---------------------------------------------------------------------------

  private setupInput() {
    const keyboard = this.input.keyboard
    if (!keyboard) return
    this.keys = keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT') as Keys
    keyboard.addCapture('SPACE')

    const interact = () => {
      if (this.canAct()) this.interaction.trigger()
    }
    keyboard.on('keydown-E', interact)
    keyboard.on('keydown-SPACE', interact)
    keyboard.on('keydown-ESC', () => this.canAct() && useUiStore().openMenu('menu'))
    keyboard.on('keydown-M', () => this.canAct() && useUiStore().toggleMinimap())
    const openSearch = (event: KeyboardEvent) => {
      if (!this.canAct()) return
      // Cegah karakter "/" atau "f" ikut terketik ke kolom pencarian yang langsung difokuskan.
      event.preventDefault()
      useUiStore().openMenu('directory', { query: '' })
    }
    keyboard.on('keydown-FORWARD_SLASH', openSearch)
    keyboard.on('keydown-F', openSearch)
    keyboard.on('keydown', (event: KeyboardEvent) => {
      if (this.locked) return
      if (event.key === '+' || event.key === '=') this.cameraSystem.zoomBy(1)
      else if (event.key === '-') this.cameraSystem.zoomBy(-1)
    })

    this.input.on(Phaser.Input.Events.POINTER_WHEEL, (_p: Phaser.Input.Pointer, _o: unknown, _dx: number, dy: number) => {
      if (!this.locked) this.cameraSystem.zoomBy(dy > 0 ? -1 : 1)
    })
  }

  private setupBridges() {
    const ui = useUiStore()

    // Kunci input saat overlay Vue terbuka (dipantau via watch, bukan dicek setiap frame).
    this.stopWatchers.push(watch(isInputLocked, (locked) => this.setLocked(locked), { immediate: true }))
    this.stopWatchers.push(watch(() => [...ui.hiddenMarkers], (hidden) => this.markers.applyVisibility(hidden)))

    this.offEvents.push(gameEvents.on('travel', (target) => this.travelTo(target)))
    this.offEvents.push(
      gameEvents.on('interact', () => {
        if (this.canAct()) this.interaction.trigger()
      })
    )
    this.offEvents.push(gameEvents.on('zoom', (dir) => this.cameraSystem.zoomBy(dir)))
  }

  private setLocked(locked: boolean) {
    this.locked = locked
    const keyboard = this.input.keyboard
    if (keyboard) {
      keyboard.enabled = !locked
      // Lepas tangkapan keyboard agar input teks Vue bisa mengetik W/A/S/D/spasi.
      if (locked) keyboard.disableGlobalCapture()
      else keyboard.enableGlobalCapture()
      keyboard.resetKeys()
    }
    if (!locked) this.unlockedAt = this.time.now
    this.player?.halt()
  }

  private canAct(): boolean {
    return !this.locked && !this.cameraSystem.isTraveling && this.time.now - this.unlockedAt > UNLOCK_COOLDOWN_MS
  }

  private openFacility(facility: FacilityData) {
    const dialog = useDialogStore()
    const lines = facility.dialog ?? [facility.description]
    const choices: DialogChoice[] = []
    if (facility.buildingId) {
      choices.push({ label: `Info ${getBuilding(facility.buildingId)?.name ?? 'gedung'}`, action: { type: 'open-building', buildingId: facility.buildingId } })
    }
    if (facility.category === 'info') choices.push({ label: 'Buka Panduan Kampus', action: { type: 'open-panel', panel: 'guide' } })
    if (choices.length > 0) choices.push({ label: 'Tutup', action: { type: 'close' } })
    dialog.showDialog(
      facility.name,
      lines,
      { role: MARKER_CATEGORIES[facility.category].label, icon: facilityIcon(facility.category) },
      choices.length > 0 ? choices : undefined
    )
  }

  // ---------------------------------------------------------------------------
  // Fast travel (dari Direktori / Pencarian / NPC)
  // ---------------------------------------------------------------------------

  private resolveTarget(target: TravelTarget): { x: number; y: number; label: string } | null {
    if (target.kind === 'building') {
      const building = this.buildings.get(target.id)
      return building ? { ...building.entrancePoint, label: building.data.name } : null
    }
    if (target.kind === 'npc') {
      const npc = this.npcs.get(target.id)
      return npc ? { x: npc.x, y: npc.y + 18, label: npc.npcName } : null
    }
    const facility = getFacility(target.id)
    if (!facility) return null
    const zone = this.facilityZones.get(facility.id)
    if (zone) return { x: zone.centerX, y: zone.y + zone.height + 6, label: facility.name }
    const building = facility.buildingId ? this.buildings.get(facility.buildingId) : undefined
    return building ? { ...building.entrancePoint, label: facility.name } : null
  }

  travelTo(target: TravelTarget) {
    const ui = useUiStore()
    const destination = this.resolveTarget(target)
    if (!destination) {
      ui.toast('Lokasi ini belum tersedia di peta.', 'warning')
      return
    }
    const spot = this.collision.findFreeSpotNear(destination.x, destination.y)
    this.cameraSystem.travel(
      () => {
        this.player.teleport(spot.x, spot.y)
        this.player.face('up')
        this.showBeacon(destination.x, destination.y - 10)
        return spot
      },
      () => ui.toast(`📍 Tiba di ${destination.label}`, 'success')
    )
  }

  private showBeacon(x: number, y: number) {
    this.beacon?.destroy()
    const beacon = this.add.image(x, y, ASSET.beacon).setDepth(DEPTH.beacon).setAlpha(0.95)
    this.beacon = beacon
    this.tweens.add({ targets: beacon, scale: { from: 0.4, to: 1.4 }, alpha: { from: 1, to: 0 }, duration: 900, repeat: 2 })
    this.time.delayedCall(2800, () => beacon.destroy())
  }

  // ---------------------------------------------------------------------------
  // Game loop — TIDAK menulis ke Pinia setiap frame.
  // ---------------------------------------------------------------------------

  update() {
    if (!this.player) return

    if (this.locked || this.cameraSystem.isTraveling) {
      this.player.halt()
    } else {
      this.player.move(this.readMoveInput())
      this.interaction.update(this.player.x, this.player.y)
      const target = this.interaction.target
      if (target instanceof NPC) target.facePoint(this.player.x, this.player.y)
    }

    const view = this.cameras.main.worldView
    playerTracker.x = this.player.x
    playerTracker.y = this.player.y
    playerTracker.viewX = view.x
    playerTracker.viewY = view.y
    playerTracker.viewWidth = view.width
    playerTracker.viewHeight = view.height
  }

  private readMoveInput(): MoveInput {
    const k = this.keys
    let x = virtualInput.x
    let y = virtualInput.y
    if (k) {
      if (k.A.isDown || k.LEFT.isDown) x = -1
      else if (k.D.isDown || k.RIGHT.isDown) x = 1
      if (k.W.isDown || k.UP.isDown) y = -1
      else if (k.S.isDown || k.DOWN.isDown) y = 1
    }
    return { x, y, run: virtualInput.run || (k?.SHIFT.isDown ?? false) }
  }

  private cleanup() {
    this.stopWatchers.forEach((stop) => stop())
    this.stopWatchers = []
    this.offEvents.forEach((off) => off())
    this.offEvents = []
    useCampusStore().setNearby(null)
  }
}
