import Phaser from 'phaser'
import NPC from '../objects/NPC'

export default class BootScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keys!: any
  private npcs!: Phaser.GameObjects.Group
  private buildings!: Phaser.Physics.Arcade.StaticGroup
  private interactKey!: Phaser.Input.Keyboard.Key
  private nearbyNPC: NPC | null = null
  private interactText!: Phaser.GameObjects.Text

  constructor() {
    super('BootScene')
  }

  preload() {
    // LOAD SPRITE SHEET
    this.load.spritesheet('player', 'src/assets/player/chibi-layered.png', {
      frameWidth: 16,
      frameHeight: 16
    })
  }

  create() {
    // WORLD
    this.cameras.main.setBounds(0, 0, 2000, 2000)
    this.physics.world.setBounds(0, 0, 2000, 2000)

    // BACKGROUND - Grass
    this.add.rectangle(0, 0, 2000, 2000, 0x4a7c59).setOrigin(0)

    // CREATE MAP - Kampus Sederhana
    this.createCampusMap()

    // CREATE BUILDINGS GROUP
    this.buildings = this.physics.add.staticGroup()

    // CREATE NPCs GROUP
    this.npcs = this.add.group()

    // PLAYER
    this.player = this.physics.add.sprite(400, 300, 'player', 0)
    this.player.setCollideWorldBounds(true)
    this.player.setDepth(10)

    // CAMERA FOLLOW
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(2)

    // INPUT
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('W,A,S,D')
    this.interactKey = this.input.keyboard!.addKey('E')

    // ANIMASI (KOLOM PERTAMA: 9 FRAME)
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6, first: 0 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 4, 7, 4] }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 4, 7, 4] }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 5, 8, 5] }),
      frameRate: 8,
      repeat: -1
    })

    // CREATE BUILDINGS
    this.createBuildings()

    // CREATE NPCs
    this.createNPCs()

    // COLLISION
    this.physics.add.collider(this.player, this.buildings)

    // UI TEXT
    this.add.text(20, 20, 'MOVE: WASD / ARROW | INTERACT: E', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(100)

    // INTERACT TEXT
    this.interactText = this.add.text(0, 0, 'Press E to talk', {
      fontSize: '12px',
      color: '#ffff00',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setVisible(false).setDepth(100).setScrollFactor(0)

    // INTERACT KEY EVENT
    this.interactKey.on('down', () => {
      console.log('E key pressed, nearbyNPC:', this.nearbyNPC)
      if (this.nearbyNPC) {
        this.showNPCDialog(this.nearbyNPC)
      }
    })
  }

  private createCampusMap() {
    // JALAN - Path/Road
    const roadColor = 0x8b7355
    
    // Jalan horizontal
    this.add.rectangle(0, 500, 2000, 100, roadColor).setOrigin(0).setDepth(1)
    
    // Jalan vertikal
    this.add.rectangle(600, 0, 100, 2000, roadColor).setOrigin(0).setDepth(1)
    this.add.rectangle(1300, 0, 100, 2000, roadColor).setOrigin(0).setDepth(1)
  }

  private createBuildings() {
    const buildingColor = 0x8b4513
    const roofColor = 0x654321

    // GEDUNG 1 - Kampus Utama (Kiri Atas)
    const building1 = this.add.rectangle(200, 200, 300, 250, buildingColor)
    building1.setStrokeStyle(4, 0x000000)
    const roof1 = this.add.triangle(200, 200 - 125, 0, 30, 150, -30, -150, -30, roofColor)
    roof1.setStrokeStyle(3, 0x000000)
    this.add.text(200, 200, 'GEDUNG REKTORAT', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.buildings.add(this.add.rectangle(200, 200, 300, 250).setVisible(false))

    // GEDUNG 2 - Fakultas (Kanan Atas)
    const building2 = this.add.rectangle(1000, 200, 300, 250, buildingColor)
    building2.setStrokeStyle(4, 0x000000)
    const roof2 = this.add.triangle(1000, 200 - 125, 0, 30, 150, -30, -150, -30, roofColor)
    roof2.setStrokeStyle(3, 0x000000)
    this.add.text(1000, 200, 'GEDUNG FAKULTAS', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.buildings.add(this.add.rectangle(1000, 200, 300, 250).setVisible(false))

    // GEDUNG 3 - Perpustakaan (Kiri Bawah)
    const building3 = this.add.rectangle(200, 800, 250, 200, buildingColor)
    building3.setStrokeStyle(4, 0x000000)
    const roof3 = this.add.triangle(200, 800 - 100, 0, 30, 125, -30, -125, -30, roofColor)
    roof3.setStrokeStyle(3, 0x000000)
    this.add.text(200, 800, 'PERPUSTAKAAN', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.buildings.add(this.add.rectangle(200, 800, 250, 200).setVisible(false))

    // GEDUNG 4 - Lab Komputer (Kanan Bawah)
    const building4 = this.add.rectangle(1000, 800, 250, 200, buildingColor)
    building4.setStrokeStyle(4, 0x000000)
    const roof4 = this.add.triangle(1000, 800 - 100, 0, 30, 125, -30, -125, -30, roofColor)
    roof4.setStrokeStyle(3, 0x000000)
    this.add.text(1000, 800, 'LAB KOMPUTER', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.buildings.add(this.add.rectangle(1000, 800, 250, 200).setVisible(false))
  }

  private createNPCs() {
    // NPC 1 - Rektor
    const npc1 = new NPC({
      scene: this,
      x: 450,
      y: 550,
      texture: 'player',
      name: 'Prof. Dr. Budi',
      dialog: [
        'Selamat datang di kampus kami!',
        'Saya adalah Rektor universitas ini.',
        'Jangan ragu untuk bertanya jika ada yang ingin kamu ketahui.',
        'Semoga kamu sukses dalam studimu!'
      ]
    })
    npc1.setFrame(12) // Frame berbeda dari player
    this.npcs.add(npc1)

    // NPC 2 - Dosen
    const npc2 = new NPC({
      scene: this,
      x: 800,
      y: 550,
      texture: 'player',
      name: 'Dr. Siti',
      dialog: [
        'Halo mahasiswa baru!',
        'Saya pengajar di Fakultas Komputer.',
        'Jika ingin belajar programming, datang ke lab ya!',
        'Selamat belajar!'
      ]
    })
    npc2.setFrame(15)
    this.npcs.add(npc2)

    // NPC 3 - Pustakawan
    const npc3 = new NPC({
      scene: this,
      x: 350,
      y: 700,
      texture: 'player',
      name: 'Ibu Ani',
      dialog: [
        'Perpustakaan buka dari jam 8 pagi sampai 8 malam.',
        'Ada banyak buku dan jurnal yang bisa kamu pinjam.',
        'Jangan lupa kembalikan tepat waktu ya!'
      ]
    })
    npc3.setFrame(18)
    this.npcs.add(npc3)
  }

  private showNPCDialog(npc: NPC) {
    console.log('Showing dialog for:', npc.npcName)
    console.log('Dialog messages:', npc.dialog)
    
    // Call global callback if available
    if ((window as any).showGameDialog) {
      console.log('Calling window.showGameDialog')
      ;(window as any).showGameDialog({
        name: npc.npcName,
        messages: npc.dialog
      })
    } else {
      console.error('window.showGameDialog not found!')
    }
  }

  update() {
    const speed = 200
    this.player.setVelocity(0)

    let moving = false

    if (this.cursors.left?.isDown || this.keys.A.isDown) {
      this.player.setVelocityX(-speed)
      this.player.setFlipX(false)
      this.player.anims.play('walk-left', true)
      moving = true
    } else if (this.cursors.right?.isDown || this.keys.D.isDown) {
      this.player.setVelocityX(speed)
      this.player.setFlipX(true)
      this.player.anims.play('walk-right', true)
      moving = true
    } else if (this.cursors.up?.isDown || this.keys.W.isDown) {
      this.player.setVelocityY(-speed)
      this.player.anims.play('walk-up', true)
      moving = true
    } else if (this.cursors.down?.isDown || this.keys.S.isDown) {
      this.player.setVelocityY(speed)
      this.player.anims.play('walk-down', true)
      moving = true
    }

    if (!moving) {
      this.player.anims.stop()
      const currentAnim = this.player.anims.currentAnim
      if (currentAnim) {
        if (currentAnim.key.includes('down')) {
          this.player.setFrame(0)
        } else if (currentAnim.key.includes('left') || currentAnim.key.includes('right')) {
          this.player.setFrame(1)
        } else if (currentAnim.key.includes('up')) {
          this.player.setFrame(2)
        }
      }
    }

    // CHECK NEARBY NPC
    this.checkNearbyNPC()
  }

  private checkNearbyNPC() {
    const interactDistance = 80
    let foundNPC = false

    this.npcs.children.entries.forEach((npc) => {
      const npcSprite = npc as NPC
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npcSprite.x,
        npcSprite.y
      )

      if (distance < interactDistance) {
        foundNPC = true
        this.nearbyNPC = npcSprite
        
        // Convert world position to screen position for UI text
        const screenX = this.cameras.main.width / 2
        const screenY = this.cameras.main.height / 2 + 50
        
        this.interactText.setPosition(screenX - 60, screenY)
        this.interactText.setVisible(true)
      }
    })

    if (!foundNPC) {
      this.nearbyNPC = null
      this.interactText.setVisible(false)
    }
  }
}
