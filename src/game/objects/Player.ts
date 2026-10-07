import Phaser from 'phaser'
import { ASSET, DEPTH } from '../constants'
import type { Facing } from '../data/types'
import { animKey, ensureCharacterAnims, facingToSheet, frameIndex, DIRECTION_FRAMES } from './characterAnims'

export interface MoveInput {
  /** -1..1 */
  x: number
  /** -1..1 */
  y: number
  run: boolean
}

/** Kedalaman karakter berdasarkan posisi Y agar saling menutupi dengan benar. */
export function characterDepth(y: number): number {
  return DEPTH.characters + y / 100000
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public facing: Facing = 'down'
  public walkSpeed = 90
  public runMultiplier = 1.75
  private readonly row: number
  private readonly shadow: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number, row: number) {
    super(scene, x, y, ASSET.player, frameIndex(row, DIRECTION_FRAMES.down.idle[0] ?? 0))
    this.row = row
    scene.add.existing(this)
    scene.physics.add.existing(this)
    ensureCharacterAnims(scene, row)

    // Hitbox kecil di kaki agar terasa natural saat berjalan di dekat dinding/pohon.
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(10, 6).setOffset(3, 10)
    this.setCollideWorldBounds(true)

    this.shadow = scene.add.image(x, y + 7, ASSET.shadow).setDepth(DEPTH.decor + 0.5)
    this.playIdle()
  }

  /** Gerakkan pemain berdasarkan input (keyboard / joystick). */
  move(input: MoveInput): void {
    const len = Math.hypot(input.x, input.y)
    if (len < 0.15) {
      this.halt()
      return
    }
    const speed = this.walkSpeed * (input.run ? this.runMultiplier : 1) * Math.min(1, len)
    this.setVelocity((input.x / len) * speed, (input.y / len) * speed)

    // Arah hadap mengikuti sumbu dominan; saat diagonal, pertahankan arah sebelumnya bila masih sesuai.
    const horizontal: Facing = input.x < 0 ? 'left' : 'right'
    const vertical: Facing = input.y < 0 ? 'up' : 'down'
    const absX = Math.abs(input.x)
    const absY = Math.abs(input.y)
    if (Math.abs(absX - absY) < 0.2 && (this.facing === horizontal || this.facing === vertical)) {
      // tetap
    } else {
      this.facing = absX > absY ? horizontal : vertical
    }

    const { dir, flipX } = facingToSheet(this.facing)
    this.setFlipX(flipX)
    this.anims.play(animKey(this.row, 'walk', dir), true)
    this.anims.timeScale = input.run ? 1.6 : 1
  }

  halt(): void {
    this.setVelocity(0, 0)
    this.playIdle()
  }

  face(facing: Facing): void {
    this.facing = facing
    this.playIdle()
  }

  private playIdle(): void {
    const { dir, flipX } = facingToSheet(this.facing)
    this.setFlipX(flipX)
    this.anims.timeScale = 1
    this.anims.play(animKey(this.row, 'idle', dir), true)
  }

  /** Pindah instan (fast travel). */
  teleport(x: number, y: number): void {
    this.setPosition(x, y)
    ;(this.body as Phaser.Physics.Arcade.Body).reset(x, y)
    this.syncShadow()
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    this.syncShadow()
  }

  private syncShadow(): void {
    this.shadow.setPosition(this.x, this.y + 7)
    this.setDepth(characterDepth(this.y))
  }

  destroy(fromScene?: boolean): void {
    this.shadow?.destroy()
    super.destroy(fromScene)
  }
}
