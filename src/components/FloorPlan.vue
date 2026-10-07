<script setup lang="ts">
// Denah lantai interaktif berbasis SVG. Setiap ruangan bisa diklik / difokus (Tab) dan
// dipilih dengan Enter/Space. Ruangan hasil pencarian disorot dengan animasi.
import { computed } from 'vue'
import { ROOM_TYPE_INFO, isSelectableRoom } from '../game/data/campus'
import type { FloorData, RoomData, RoomType } from '../game/data/types'

const props = defineProps<{
  floor: FloorData
  rooms: RoomData[]
  accent: string
  selectedRoomId: string | null
  highlightedRoomId: string | null
}>()

const emit = defineEmits<{ select: [roomId: string] }>()

const PAD = 4
const viewBox = computed(() => `${-PAD} ${-PAD} ${props.floor.plan.width + PAD * 2} ${props.floor.plan.height + PAD * 2 + 6}`)

const legend = computed(() => {
  const types = new Set<RoomType>(props.rooms.filter(isSelectableRoom).map((r) => r.type))
  return [...types].map((type) => ({ type, ...ROOM_TYPE_INFO[type] }))
})

function fontSize(room: RoomData): number {
  const { w, h } = room.shape
  return Math.max(1.6, Math.min(2.8, w / 9, h / 4.2))
}

/** Pecah nama ruangan agar muat di kotaknya. */
function labelLines(room: RoomData): string[] {
  const fs = fontSize(room)
  const maxChars = Math.max(4, Math.floor(room.shape.w / (fs * 0.62)))
  const words = room.name.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > maxChars && line) {
      lines.push(line)
      line = word
    } else line = candidate
  }
  if (line) lines.push(line)
  const maxLines = Math.max(1, Math.floor(room.shape.h / (fs * 1.35)) - 1)
  return lines.slice(0, maxLines)
}

function onKey(event: KeyboardEvent, room: RoomData) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select', room.id)
  }
}
</script>

<template>
  <figure class="plan">
    <svg class="plan__svg" :viewBox="viewBox" role="group" :aria-label="`Denah ${floor.name}`" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="plan-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(143,186,247,0.08)" stroke-width="0.2" />
        </pattern>
      </defs>

      <!-- Lantai gedung -->
      <rect
        :x="-1"
        :y="-1"
        :width="floor.plan.width + 2"
        :height="floor.plan.height + 2"
        rx="1"
        fill="#0b1a33"
        :stroke="accent"
        stroke-width="1.2"
      />
      <rect x="0" y="0" :width="floor.plan.width" :height="floor.plan.height" fill="url(#plan-grid)" />

      <g v-for="room in rooms" :key="room.id">
        <!-- Koridor: tidak interaktif -->
        <g v-if="!isSelectableRoom(room)" class="corridor">
          <rect :x="room.shape.x" :y="room.shape.y" :width="room.shape.w" :height="room.shape.h" />
          <text :x="room.shape.x + room.shape.w / 2" :y="room.shape.y + room.shape.h / 2" class="corridor__label">
            {{ room.name.toUpperCase() }}
          </text>
        </g>

        <g
          v-else
          class="room"
          :class="{
            'room--selected': room.id === selectedRoomId,
            'room--highlight': room.id === highlightedRoomId
          }"
          role="button"
          tabindex="0"
          :aria-label="`${room.name}, ${room.code}, ${ROOM_TYPE_INFO[room.type].label}`"
          :aria-pressed="room.id === selectedRoomId"
          @click="emit('select', room.id)"
          @keydown="onKey($event, room)"
        >
          <rect
            class="room__rect"
            :x="room.shape.x + 0.4"
            :y="room.shape.y + 0.4"
            :width="room.shape.w - 0.8"
            :height="room.shape.h - 0.8"
            rx="0.6"
            :fill="ROOM_TYPE_INFO[room.type].color"
          />
          <text class="room__code" :x="room.shape.x + 1.6" :y="room.shape.y + 3.4">{{ room.code }}</text>
          <text
            class="room__name"
            :x="room.shape.x + room.shape.w / 2"
            :y="room.shape.y + room.shape.h / 2 + 1.5 - ((labelLines(room).length - 1) * fontSize(room) * 1.2) / 2"
            :font-size="fontSize(room)"
          >
            <tspan
              v-for="(line, i) in labelLines(room)"
              :key="i"
              :x="room.shape.x + room.shape.w / 2"
              :dy="i === 0 ? 0 : fontSize(room) * 1.2"
            >
              {{ line }}
            </tspan>
          </text>
        </g>
      </g>

      <!-- Penunjuk arah utara -->
      <g class="compass" :transform="`translate(${floor.plan.width - 3}, ${floor.plan.height + 4})`">
        <text x="0" y="0" text-anchor="end">▲ U</text>
      </g>
    </svg>

    <figcaption class="plan__legend">
      <span v-for="item in legend" :key="item.type" class="legend-item">
        <span class="legend-item__swatch" :style="{ background: item.color }" aria-hidden="true" />
        {{ item.label }}
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.plan {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}
.plan__svg {
  width: 100%;
  height: auto;
  max-height: 62dvh;
  font-family: var(--font-body);
  user-select: none;
}

.corridor rect {
  fill: #1b2e52;
}
.corridor__label {
  font-family: var(--font-pixel);
  font-size: 1.8px;
  letter-spacing: 0.3px;
  fill: rgba(195, 205, 224, 0.55);
  text-anchor: middle;
  dominant-baseline: middle;
}

.room {
  cursor: pointer;
  outline: none;
}
.room__rect {
  fill-opacity: 0.32;
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 0.35;
  transition: fill-opacity 0.15s ease;
}
.room:hover .room__rect,
.room:focus-visible .room__rect {
  fill-opacity: 0.6;
  stroke: #ffffff;
  stroke-width: 0.6;
}
.room:focus-visible .room__rect {
  stroke: var(--orange-500);
  stroke-width: 0.9;
}
.room--selected .room__rect {
  fill-opacity: 0.85;
  stroke: var(--orange-500);
  stroke-width: 1;
}
.room--highlight .room__rect {
  stroke: var(--orange-400);
  stroke-width: 1;
  animation: pulse 1.1s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    fill-opacity: 0.95;
    stroke-width: 1.6;
  }
}

.room__code {
  font-family: var(--font-pixel);
  font-size: 1.5px;
  fill: rgba(255, 255, 255, 0.8);
}
.room__name {
  font-weight: 700;
  fill: #ffffff;
  text-anchor: middle;
  paint-order: stroke;
  stroke: rgba(7, 13, 26, 0.6);
  stroke-width: 0.35px;
}

.compass text {
  font-family: var(--font-pixel);
  font-size: 2px;
  fill: var(--text-dim);
}

.plan__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-size: 12px;
  color: var(--text-muted);
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.legend-item__swatch {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 2px;
}
</style>
