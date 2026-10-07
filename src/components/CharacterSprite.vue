<script setup lang="ts">
// Menampilkan satu frame dari spritesheet chibi (untuk potret dialog & pemilihan karakter).
// Tint dibuat dengan blend "multiply" + mask agar warnanya sama dengan setTint di Phaser.
import { computed } from 'vue'
import spriteUrl from '../assets/player/chibi-layered.png'
import { CHARACTER_SHEET } from '../game/objects/characterAnims'

const props = withDefaults(
  defineProps<{
    row: number
    column?: number
    scale?: number
    tint?: number
    /** Animasi langkah sederhana (frame jalan menghadap bawah). */
    animated?: boolean
  }>(),
  { column: 0, scale: 4, tint: undefined, animated: false }
)

const size = computed(() => CHARACTER_SHEET.frameWidth * props.scale)

const style = computed(() => {
  const s = props.scale
  const fw = CHARACTER_SHEET.frameWidth * s
  const sheetW = CHARACTER_SHEET.frameWidth * CHARACTER_SHEET.columns * s
  const sheetH = CHARACTER_SHEET.frameHeight * CHARACTER_SHEET.rows * s
  const position = `-${props.column * fw}px -${props.row * fw}px`
  const tint = props.tint !== undefined ? `#${props.tint.toString(16).padStart(6, '0')}` : null
  return {
    width: `${size.value}px`,
    height: `${size.value}px`,
    '--sprite': `url("${spriteUrl}")`,
    '--sheet-size': `${sheetW}px ${sheetH}px`,
    '--pos': position,
    '--row-y': `-${props.row * fw}px`,
    '--fw': `${fw}px`,
    '--tint': tint ?? 'transparent',
    '--blend': tint ? 'multiply' : 'normal'
  } as Record<string, string>
})
</script>

<template>
  <span class="sprite" :class="{ 'sprite--animated': animated }" :style="style" aria-hidden="true" />
</template>

<style scoped>
.sprite {
  display: inline-block;
  flex: none;
  background-image: var(--sprite), linear-gradient(var(--tint), var(--tint));
  background-size: var(--sheet-size), 100% 100%;
  background-position: var(--pos), 0 0;
  background-repeat: no-repeat;
  background-blend-mode: var(--blend);
  -webkit-mask-image: var(--sprite);
  mask-image: var(--sprite);
  -webkit-mask-size: var(--sheet-size);
  mask-size: var(--sheet-size);
  -webkit-mask-position: var(--pos);
  mask-position: var(--pos);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  image-rendering: pixelated;
}

/* Jalan di tempat: frame 3 -> 0 -> 6 -> 0 (menghadap bawah). */
.sprite--animated {
  animation: walk 0.6s steps(1) infinite;
}
@keyframes walk {
  0% {
    background-position: calc(var(--fw) * -3) var(--row-y), 0 0;
    -webkit-mask-position: calc(var(--fw) * -3) var(--row-y);
    mask-position: calc(var(--fw) * -3) var(--row-y);
  }
  25% {
    background-position: 0 var(--row-y), 0 0;
    -webkit-mask-position: 0 var(--row-y);
    mask-position: 0 var(--row-y);
  }
  50% {
    background-position: calc(var(--fw) * -6) var(--row-y), 0 0;
    -webkit-mask-position: calc(var(--fw) * -6) var(--row-y);
    mask-position: calc(var(--fw) * -6) var(--row-y);
  }
  75% {
    background-position: 0 var(--row-y), 0 0;
    -webkit-mask-position: 0 var(--row-y);
    mask-position: 0 var(--row-y);
  }
}
</style>
