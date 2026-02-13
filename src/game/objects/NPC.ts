import Phaser from 'phaser'

export interface NPCConfig {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
  name: string
  dialog: string[]
}

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  public npcName: string
  public dialog: string[]
  public isInteracting: boolean = false

  constructor(config: NPCConfig) {
    super(config.scene, config.x, config.y, config.texture)

    this.npcName = config.name
    this.dialog = config.dialog

    // Add to scene
    config.scene.add.existing(this)
    config.scene.physics.add.existing(this)

    // Set properties
    this.setImmovable(true)
    
    // Add indicator above NPC
    this.createInteractionIndicator()
  }

  private createInteractionIndicator() {
    // Bisa ditambahkan icon "!" di atas NPC nanti
  }

  public showDialog(callback: (dialog: string[]) => void) {
    callback(this.dialog)
  }
}
