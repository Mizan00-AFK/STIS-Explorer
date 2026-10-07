<script setup lang="ts">
// Kontrol layar sentuh: joystick virtual (kiri bawah) + tombol INTERACT (kanan bawah).
// Joystick menulis ke `virtualInput` (objek biasa, bukan Pinia) yang dibaca Phaser tiap frame.
import { onBeforeUnmount, reactive, ref } from 'vue'
import { gameEvents } from '../game/EventBus'
import { virtualInput } from '../game/shared'
import { useCampusStore } from '../stores/campusStore'

const campus = useCampusStore()

const RADIUS = 52
const base = ref<HTMLElement | null>(null)
const knob = reactive({ x: 0, y: 0, active: false })
let pointerId: number | null = null

function update(event: PointerEvent) {
  const el = base.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  let dx = event.clientX - (rect.left + rect.width / 2)
  let dy = event.clientY - (rect.top + rect.height / 2)
  const dist = Math.hypot(dx, dy)
  if (dist > RADIUS) {
    dx = (dx / dist) * RADIUS
    dy = (dy / dist) * RADIUS
  }
  knob.x = dx
  knob.y = dy
  const nx = dx / RADIUS
  const ny = dy / RADIUS
  const magnitude = Math.hypot(nx, ny)
  // Zona mati kecil agar karakter tidak bergeser saat jempol hanya menempel.
  virtualInput.x = magnitude < 0.2 ? 0 : nx
  virtualInput.y = magnitude < 0.2 ? 0 : ny
  virtualInput.run = magnitude > 0.92
}

function onDown(event: PointerEvent) {
  if (pointerId !== null) return
  pointerId = event.pointerId
  knob.active = true
  try {
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  } catch {
    // Beberapa browser lama tidak mendukung pointer capture untuk sentuhan; joystick tetap berfungsi.
  }
  update(event)
}

function onMove(event: PointerEvent) {
  if (event.pointerId === pointerId) update(event)
}

function release(event?: PointerEvent) {
  if (event && event.pointerId !== pointerId) return
  pointerId = null
  knob.active = false
  knob.x = 0
  knob.y = 0
  virtualInput.x = 0
  virtualInput.y = 0
  virtualInput.run = false
}

/** Tombol arah untuk aksesibilitas / pengguna yang lebih suka D-pad. */
function press(x: number, y: number) {
  virtualInput.x = x
  virtualInput.y = y
}

onBeforeUnmount(() => release())
</script>

<template>
  <div class="mobile-controls">
    <div
      ref="base"
      class="joystick"
      :class="{ 'joystick--active': knob.active }"
      role="application"
      aria-label="Joystick: geser untuk berjalan"
      @pointerdown.prevent="onDown"
      @pointermove.prevent="onMove"
      @pointerup="release"
      @pointercancel="release"
      @lostpointercapture="release"
    >
      <button class="dpad dpad--up" type="button" aria-label="Atas" @pointerdown.stop.prevent="press(0, -1)" @pointerup="release()" @pointerleave="release()">▲</button>
      <button class="dpad dpad--left" type="button" aria-label="Kiri" @pointerdown.stop.prevent="press(-1, 0)" @pointerup="release()" @pointerleave="release()">◀</button>
      <button class="dpad dpad--down" type="button" aria-label="Bawah" @pointerdown.stop.prevent="press(0, 1)" @pointerup="release()" @pointerleave="release()">▼</button>
      <button class="dpad dpad--right" type="button" aria-label="Kanan" @pointerdown.stop.prevent="press(1, 0)" @pointerup="release()" @pointerleave="release()">▶</button>
      <span class="joystick__knob" :style="{ transform: `translate(${knob.x}px, ${knob.y}px)` }" aria-hidden="true" />
    </div>

    <button
      type="button"
      class="interact"
      :class="{ 'interact--ready': campus.nearby }"
      :aria-label="campus.nearby ? `Interact: ${campus.nearby.label}` : 'Interact'"
      @click="gameEvents.emit('interact')"
    >
      <span class="interact__icon" aria-hidden="true">{{ campus.nearby?.icon ?? '✋' }}</span>
      <span class="pixel">INTERACT</span>
    </button>
  </div>
</template>

<style scoped>
.mobile-controls {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 16;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 18px calc(18px + var(--safe-bottom));
  pointer-events: none;
}
.mobile-controls > * {
  pointer-events: auto;
}

.joystick {
  position: relative;
  width: 148px;
  height: 148px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(30, 111, 217, 0.25), rgba(11, 26, 51, 0.65));
  border: 3px solid rgba(143, 186, 247, 0.45);
  box-shadow: 0 0 0 3px rgba(3, 7, 15, 0.6);
  touch-action: none;
  user-select: none;
}
.joystick--active {
  border-color: var(--orange-500);
}
.joystick__knob {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #ffffff, var(--blue-400) 45%, var(--navy-700));
  border: 3px solid var(--panel-shadow);
  pointer-events: none;
  transition: transform 0.05s linear;
}
.dpad {
  position: absolute;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border: none;
  touch-action: none;
}
.dpad--up {
  top: 0;
  left: 50%;
  margin-left: -20px;
}
.dpad--down {
  bottom: 0;
  left: 50%;
  margin-left: -20px;
}
.dpad--left {
  left: 0;
  top: 50%;
  margin-top: -20px;
}
.dpad--right {
  right: 0;
  top: 50%;
  margin-top: -20px;
}

.interact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  color: var(--text);
  background: rgba(11, 26, 51, 0.8);
  border: 3px solid var(--panel-border);
  box-shadow: 0 0 0 3px rgba(3, 7, 15, 0.6), 4px 4px 0 rgba(3, 7, 15, 0.6);
  touch-action: manipulation;
}
.interact .pixel {
  font-size: 7px;
}
.interact__icon {
  font-size: 26px;
}
.interact--ready {
  background: var(--orange-500);
  color: #1a0f02;
  border-color: #ffd7a8;
  animation: ready 1.2s ease-in-out infinite;
}
@keyframes ready {
  50% {
    transform: scale(1.06);
  }
}
</style>
