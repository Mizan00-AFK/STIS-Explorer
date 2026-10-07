import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PreloadScene from './scenes/PreloadScene'
import CampusScene from './scenes/CampusScene'

/**
 * Konfigurasi game Phaser. Sebelumnya file ini langsung membuat game saat di-import
 * (side effect); sekarang hanya mengembalikan konfigurasi agar siklus hidup game
 * dikendalikan oleh GameView.vue (dibuat saat mount, dihancurkan saat unmount).
 */
export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: parent.clientWidth || window.innerWidth,
    height: parent.clientHeight || window.innerHeight,
    backgroundColor: '#070d1a',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.NO_CENTER
    },
    input: {
      keyboard: true,
      touch: true
    },
    banner: false,
    scene: [BootScene, PreloadScene, CampusScene]
  }
}
