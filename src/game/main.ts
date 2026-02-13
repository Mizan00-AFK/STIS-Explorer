import Phaser from 'phaser'
import BootScene from './scenes/BootScene'

export function createGame(container: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
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
    scene: [BootScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  })
}
