import Phaser from 'phaser'
import BootScene from './scenes/BootScene'

console.log('Game.ts loaded')

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  render: {
  pixelArt: true,
  antialias: false
},
  scene: [BootScene]
})
