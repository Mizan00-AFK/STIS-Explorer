import Phaser from 'phaser'
import { createGameConfig } from './Game'

/** Membuat instance game Phaser di dalam elemen container. */
export function createGame(container: HTMLElement): Phaser.Game {
  return new Phaser.Game(createGameConfig(container))
}
