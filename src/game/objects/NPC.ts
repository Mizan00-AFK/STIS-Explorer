import Phaser from 'phaser'
import { ASSET, DEPTH, TEXT_RESOLUTION } from '../constants'
import type { DialogScript, Facing, NpcData } from '../data/types'
import { animKey, ensureCharacterAnims, facingToSheet } from './characterAnims'
import { PRIORITY, type Interactable } from './InteractiveObject'
import { characterDepth } from './Player'

export interface NPCConfig {
  scene: Phaser.Scene
  x: number
  y: number
  data: NpcData
  onTalk: (npc: NPC) => void
}

const TALK_RANGE = 26

/** NPC kampus (satpam, mahasiswa, staf, pemandu) yang bisa diajak bicara. */
export default class NPC extends Phaser.Physics.Arcade.Sprite implements Interactable {
  readonly kind = 'npc' as const
  readonly id: string
  readonly label: string
  readonly icon = '💬'
  readonly actionLabel = 'Bicara'

  public npcName: string
  public dialog: DialogScript
  public readonly npcData: NpcData
  public isInteracting = false

  private readonly homeFacing: Facing
  private readonly nameLabel: Phaser.GameObjects.Text
  private readonly indicator: Phaser.GameObjects.Text
  private readonly shadow: Phaser.GameObjects.Image
  private readonly onTalk: (npc: NPC) => void
  private indicatorTween?: Phaser.Tweens.Tween

  constructor(config: NPCConfig) {
    super(config.scene, config.x, config.y, ASSET.player)
    const { scene, data } = config

    this.npcData = data
    this.id = data.id
    this.label = `${data.name} (${data.role})`
    this.npcName = data.name
    this.dialog = data.dialog
    this.homeFacing = data.facing
    this.onTalk = config.onTalk

    scene.add.existing(this)
    scene.physics.add.existing(this, true) // static body: tidak bisa didorong pemain
    const body = this.body as Phaser.Physics.Arcade.StaticBody
    body.setSize(10, 6).setOffset(3, 10)

    ensureCharacterAnims(scene, data.spriteRow)
    if (data.tint !== undefined) this.setTint(data.tint)
    this.setDepth(characterDepth(this.y))
    this.faceTo(data.facing)

    this.shadow = scene.add.image(this.x, this.y + 7, ASSET.shadow).setDepth(DEPTH.decor + 0.5)

    this.nameLabel = scene.add
      .text(this.x, this.y - 13, data.name, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '7px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#0b1a33',
        strokeThickness: 3
      })
      .setOrigin(0.5, 1)
      .setResolution(TEXT_RESOLUTION)
      .setDepth(DEPTH.labels)

    this.indicator = scene.add
      .text(this.x, this.y - 22, '!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#f28c28',
        stroke: '#0b1a33',
        strokeThickness: 3
      })
      .setOrigin(0.5, 1)
      .setResolution(TEXT_RESOLUTION)
      .setDepth(DEPTH.labels)
      .setVisible(false)
  }

  faceTo(facing: Facing): void {
    const { dir, flipX } = facingToSheet(facing)
    this.setFlipX(flipX)
    this.anims.play(animKey(this.npcData.spriteRow, 'idle', dir), true)
  }

  /** Menoleh ke arah titik (mis. pemain). */
  facePoint(x: number, y: number): void {
    const dx = x - this.x
    const dy = y - this.y
    this.faceTo(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down')
  }

  score(px: number, py: number): number | null {
    const distance = Phaser.Math.Distance.Between(px, py, this.x, this.y)
    return distance <= TALK_RANGE ? PRIORITY.npc + distance : null
  }

  interact(): void {
    this.onTalk(this)
  }

  setFocused(focused: boolean): void {
    this.indicator.setVisible(focused)
    if (focused && !this.indicatorTween) {
      this.indicatorTween = this.scene.tweens.add({
        targets: this.indicator,
        y: this.y - 25,
        duration: 380,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    } else if (!focused) {
      this.indicatorTween?.stop()
      this.indicatorTween = undefined
      this.indicator.setY(this.y - 22)
      this.faceTo(this.homeFacing)
    }
  }

  destroy(fromScene?: boolean): void {
    this.indicatorTween?.stop()
    this.nameLabel?.destroy()
    this.indicator?.destroy()
    this.shadow?.destroy()
    super.destroy(fromScene)
  }
}
