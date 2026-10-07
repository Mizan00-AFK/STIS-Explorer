<script setup lang="ts">
// Mini-map di pojok kanan atas. Gambar dasar dibuat sekali oleh Phaser dari tilemap;
// posisi pemain & area kamera diperbarui lewat requestAnimationFrame dengan memanipulasi
// atribut SVG langsung — tanpa memicu re-render Vue setiap frame.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { gameEvents } from '../game/EventBus'
import { playerTracker } from '../game/shared'
import { useUiStore, type MinimapBuilding } from '../stores/uiStore'

const ui = useUiStore()
const info = computed(() => ui.minimap)
const visibleMarkers = computed(() => (info.value?.markers ?? []).filter((m) => ui.isMarkerVisible(m.category)))

const playerDot = ref<SVGGElement | null>(null)
const viewRect = ref<SVGRectElement | null>(null)
let frame = 0
let lastX = NaN
let lastY = NaN

function tick() {
  frame = requestAnimationFrame(tick)
  const t = playerTracker
  if (t.x === lastX && t.y === lastY) return
  lastX = t.x
  lastY = t.y
  playerDot.value?.setAttribute('transform', `translate(${t.x} ${t.y})`)
  const rect = viewRect.value
  if (rect) {
    rect.setAttribute('x', String(t.viewX))
    rect.setAttribute('y', String(t.viewY))
    rect.setAttribute('width', String(t.viewWidth))
    rect.setAttribute('height', String(t.viewHeight))
  }
}

onMounted(() => {
  frame = requestAnimationFrame(tick)
})
onBeforeUnmount(() => cancelAnimationFrame(frame))

function go(building: MinimapBuilding) {
  gameEvents.emit('travel', { kind: 'building', id: building.id })
}
</script>

<template>
  <div v-if="info" class="minimap rpg-panel" aria-label="Mini-map kampus">
    <svg class="minimap__svg" :viewBox="`0 0 ${info.worldWidth} ${info.worldHeight}`" preserveAspectRatio="xMidYMid meet">
      <image v-if="info.image" :href="info.image" x="0" y="0" :width="info.worldWidth" :height="info.worldHeight" class="minimap__img" />

      <g
        v-for="b in info.buildings"
        :key="b.id"
        class="minimap__building"
        role="button"
        tabindex="0"
        :aria-label="`Pergi ke ${b.name}`"
        @click="go(b)"
        @keydown.enter.prevent="go(b)"
      >
        <title>{{ b.name }}</title>
        <rect :x="b.x" :y="b.y" :width="b.w" :height="b.h" :stroke="b.color" />
      </g>

      <circle v-for="m in visibleMarkers" :key="m.key" :cx="m.x" :cy="m.y" r="16" class="minimap__marker">
        <title>{{ m.label }}</title>
      </circle>

      <rect ref="viewRect" class="minimap__view" x="0" y="0" width="0" height="0" />
      <g ref="playerDot" class="minimap__player">
        <circle r="34" class="minimap__player-pulse" />
        <circle r="20" />
      </g>
    </svg>
    <span class="minimap__label pixel" aria-hidden="true">U ▲</span>
  </div>
</template>

<style scoped>
.minimap {
  position: fixed;
  top: calc(var(--hud-height) + 10px);
  right: 14px;
  z-index: 18;
  width: 196px;
  padding: 4px;
  border-width: 2px;
}
.minimap__svg {
  display: block;
  width: 100%;
  height: auto;
}
.minimap__img {
  image-rendering: pixelated;
}
.minimap__building {
  cursor: pointer;
  outline: none;
}
.minimap__building rect {
  fill: transparent;
  stroke-width: 14;
  stroke-opacity: 0.85;
}
.minimap__building:hover rect,
.minimap__building:focus-visible rect {
  fill: rgba(242, 140, 40, 0.35);
  stroke: #f28c28;
}
.minimap__marker {
  fill: #ffd166;
  stroke: #0b1a33;
  stroke-width: 6;
}
.minimap__view {
  fill: rgba(255, 255, 255, 0.06);
  stroke: rgba(255, 255, 255, 0.75);
  stroke-width: 6;
  pointer-events: none;
}
.minimap__player {
  pointer-events: none;
}
.minimap__player circle {
  fill: #f28c28;
  stroke: #ffffff;
  stroke-width: 6;
}
.minimap__player .minimap__player-pulse {
  fill: rgba(242, 140, 40, 0.35);
  stroke: none;
  animation: pulse 1.4s ease-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}
@keyframes pulse {
  from {
    transform: scale(0.6);
    opacity: 1;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
}
.minimap__label {
  position: absolute;
  top: 8px;
  left: 10px;
  font-size: 7px;
  color: #ffffff;
  text-shadow: 1px 1px 0 #000;
}

@media (max-width: 720px), (pointer: coarse) {
  .minimap {
    width: 132px;
    right: 10px;
  }
}
</style>
