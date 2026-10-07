import type Phaser from 'phaser'
import { ASSET } from '../constants'
import type { Facing } from '../data/types'

/**
 * Tata letak spritesheet chibi-layered.png (144x48): 3 karakter (baris) x 9 frame 16x16.
 * Kolom 0/3/6 = menghadap bawah, 1/4/7 = samping (menghadap kiri), 2/5/8 = atas.
 * Untuk sprite baru, cukup ubah konfigurasi ini.
 */
export const CHARACTER_SHEET = {
  frameWidth: 16,
  frameHeight: 16,
  columns: 9,
  rows: 3
}

export type SheetDirection = 'down' | 'side' | 'up'

export const DIRECTION_FRAMES: Record<SheetDirection, { idle: number[]; walk: number[] }> = {
  down: { idle: [0], walk: [3, 0, 6, 0] },
  side: { idle: [1], walk: [4, 1, 7, 1] },
  up: { idle: [2], walk: [5, 2, 8, 2] }
}

export const CHARACTER_NAMES = ['Biru', 'Cokelat', 'Merah Muda']

export function facingToSheet(facing: Facing): { dir: SheetDirection; flipX: boolean } {
  if (facing === 'left') return { dir: 'side', flipX: false }
  if (facing === 'right') return { dir: 'side', flipX: true }
  return { dir: facing, flipX: false }
}

export function animKey(row: number, state: 'idle' | 'walk', dir: SheetDirection): string {
  return `char${row}-${state}-${dir}`
}

export function frameIndex(row: number, column: number): number {
  return row * CHARACTER_SHEET.columns + column
}

/** Membuat animasi idle & jalan untuk satu baris karakter (sekali per scene). */
export function ensureCharacterAnims(scene: Phaser.Scene, row: number): void {
  for (const dir of Object.keys(DIRECTION_FRAMES) as SheetDirection[]) {
    const frames = DIRECTION_FRAMES[dir]
    const walkKey = animKey(row, 'walk', dir)
    const idleKey = animKey(row, 'idle', dir)
    if (!scene.anims.exists(walkKey)) {
      scene.anims.create({
        key: walkKey,
        frames: scene.anims.generateFrameNumbers(ASSET.player, { frames: frames.walk.map((c) => frameIndex(row, c)) }),
        frameRate: 8,
        repeat: -1
      })
    }
    if (!scene.anims.exists(idleKey)) {
      scene.anims.create({
        key: idleKey,
        frames: scene.anims.generateFrameNumbers(ASSET.player, { frames: frames.idle.map((c) => frameIndex(row, c)) }),
        frameRate: 2,
        repeat: -1
      })
    }
  }
}
