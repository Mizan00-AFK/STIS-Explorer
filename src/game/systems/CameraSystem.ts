import Phaser from 'phaser'

const MIN_ZOOM = 1.2
const MAX_ZOOM = 2
const USER_ZOOM_STEPS = [0.7, 0.85, 1, 1.2, 1.4]

/**
 * Kamera mengikuti pemain dengan lerp halus, dibatasi ukuran map, dan zoom otomatis
 * berdasarkan ukuran layar (desktop ~1.5–2.0, mobile lebih kecil) + zoom manual.
 */
export default class CameraSystem {
  private readonly scene: Phaser.Scene
  private readonly camera: Phaser.Cameras.Scene2D.Camera
  private readonly worldWidth: number
  private readonly worldHeight: number
  private userZoomIndex = USER_ZOOM_STEPS.indexOf(1)
  private traveling = false

  constructor(scene: Phaser.Scene, target: Phaser.GameObjects.GameObject, worldWidth: number, worldHeight: number) {
    this.scene = scene
    this.camera = scene.cameras.main
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight

    this.camera.setBounds(0, 0, worldWidth, worldHeight)
    this.camera.setRoundPixels(true)
    this.camera.startFollow(target, true, 0.12, 0.12)
    this.camera.setDeadzone(24, 16)
    this.applyZoom()

    scene.scale.on(Phaser.Scale.Events.RESIZE, this.applyZoom, this)
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.scale.off(Phaser.Scale.Events.RESIZE, this.applyZoom, this))
  }

  /** Zoom dasar dari ukuran viewport: layar kecil -> zoom lebih kecil agar area terlihat cukup luas. */
  baseZoom(): number {
    const { width, height } = this.scene.scale.gameSize
    const fit = Math.min(width / 640, height / 400)
    return Phaser.Math.Clamp(fit, MIN_ZOOM, MAX_ZOOM)
  }

  applyZoom(): void {
    const userZoom = USER_ZOOM_STEPS[this.userZoomIndex] ?? 1
    let zoom = this.baseZoom() * userZoom
    // Jangan sampai area pandang lebih besar dari map.
    const { width, height } = this.scene.scale.gameSize
    zoom = Math.max(zoom, width / this.worldWidth, height / this.worldHeight)
    this.camera.setZoom(Math.round(zoom * 100) / 100)
  }

  zoomBy(direction: 1 | -1): void {
    this.userZoomIndex = Phaser.Math.Clamp(this.userZoomIndex + direction, 0, USER_ZOOM_STEPS.length - 1)
    this.applyZoom()
  }

  /** Efek fade untuk fast travel; `teleport` dipanggil saat layar gelap dan mengembalikan posisi baru. */
  travel(teleport: () => { x: number; y: number }, onDone?: () => void): void {
    if (this.traveling) return
    this.traveling = true
    this.camera.fadeOut(180, 7, 13, 26)
    this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      const { x, y } = teleport()
      this.camera.centerOn(x, y) // langsung ke lokasi baru, tanpa panning panjang
      this.camera.fadeIn(260, 7, 13, 26)
      this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
        this.traveling = false
        onDone?.()
      })
    })
  }

  get isTraveling(): boolean {
    return this.traveling
  }
}
