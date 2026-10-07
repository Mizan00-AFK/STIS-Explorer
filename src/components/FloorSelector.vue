<script setup lang="ts">
// Daftar lantai (ditampilkan dari lantai teratas seperti tombol lift).
// Navigasi keyboard: ↑ ↓ berpindah lantai.
import { computed } from 'vue'
import { roomsOf, isSelectableRoom } from '../game/data/campus'
import type { FloorData } from '../game/data/types'

const props = defineProps<{
  floors: FloorData[]
  currentFloorId: string | null
}>()

const emit = defineEmits<{ select: [floorId: string] }>()

const ordered = computed(() => [...props.floors].sort((a, b) => b.level - a.level))

function roomCount(floor: FloorData): number {
  return roomsOf(floor.id).filter(isSelectableRoom).length
}

function onKeydown(event: KeyboardEvent) {
  const sorted = [...props.floors].sort((a, b) => a.level - b.level)
  const index = sorted.findIndex((f) => f.id === props.currentFloorId)
  let next: FloorData | undefined
  if (event.key === 'ArrowUp') next = sorted[Math.min(sorted.length - 1, index + 1)]
  else if (event.key === 'ArrowDown') next = sorted[Math.max(0, index - 1)]
  if (!next) return
  event.preventDefault()
  emit('select', next.id)
  requestAnimationFrame(() => document.getElementById(`floor-btn-${next.id}`)?.focus())
}
</script>

<template>
  <nav class="floors" aria-label="Pilih lantai" @keydown="onKeydown">
    <p class="rpg-label floors__title">Select Floor</p>
    <ul class="floors__list" role="list">
      <li v-for="floor in ordered" :key="floor.id">
        <button
          :id="`floor-btn-${floor.id}`"
          type="button"
          class="floor-btn"
          :class="{ 'floor-btn--active': floor.id === currentFloorId }"
          :aria-current="floor.id === currentFloorId ? 'true' : undefined"
          @click="emit('select', floor.id)"
        >
          <span class="floor-btn__level pixel">{{ floor.level }}</span>
          <span class="floor-btn__text">
            <strong>Floor {{ floor.level }}</strong>
            <small>{{ roomCount(floor) }} ruangan</small>
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.floors__title {
  margin: 0 0 10px;
}
.floors__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.floor-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 6px 10px;
  text-align: left;
  color: var(--text);
  background: var(--navy-800);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.floor-btn:hover {
  border-color: var(--blue-400);
}
.floor-btn--active {
  background: var(--blue-500);
  border-color: var(--orange-500);
}
.floor-btn__level {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  font-size: 12px;
  color: var(--navy-950);
  background: #f4f1de;
  border-radius: 50%;
  box-shadow: inset 0 -3px 0 #b7b29a;
}
.floor-btn--active .floor-btn__level {
  background: var(--orange-500);
  box-shadow: inset 0 -3px 0 #b35f12;
}
.floor-btn__text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.floor-btn__text small {
  color: var(--text-muted);
}
.floor-btn--active .floor-btn__text small {
  color: #e6efff;
}

@media (max-width: 860px) {
  .floors__list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .floors__list li {
    flex: none;
  }
  .floor-btn {
    width: auto;
    padding-right: 14px;
  }
}
</style>
