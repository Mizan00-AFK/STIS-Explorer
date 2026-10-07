<script setup lang="ts">
// Detail ruangan: nama, kode, kapasitas, fasilitas ✓, deskripsi, foto, BACK TO FLOOR.
// Tampil sebagai panel samping di desktop dan bottom-sheet di mobile.
import { nextTick, onMounted, ref, watch } from 'vue'
import { ROOM_TYPE_INFO, getBuilding, getFloor } from '../game/data/campus'
import type { RoomData } from '../game/data/types'
import DataBadge from './DataBadge.vue'

const props = defineProps<{ room: RoomData }>()
const emit = defineEmits<{ back: [] }>()

const heading = ref<HTMLElement | null>(null)

function focusHeading() {
  nextTick(() => heading.value?.focus())
}
onMounted(focusHeading)
watch(() => props.room.id, focusHeading)
</script>

<template>
  <aside class="rpg-panel rpg-panel--accent room" :aria-labelledby="`room-title-${room.id}`">
    <header class="room__header">
      <span class="room__icon" aria-hidden="true">{{ ROOM_TYPE_INFO[room.type].icon }}</span>
      <div>
        <h3 :id="`room-title-${room.id}`" ref="heading" class="rpg-title room__title" tabindex="-1">{{ room.name }}</h3>
        <p class="room__code pixel">{{ room.code }}</p>
      </div>
    </header>

    <div class="room__body scroll-y">
      <div class="room__badges">
        <DataBadge :status="room.dataStatus" />
        <span class="badge badge--neutral">{{ ROOM_TYPE_INFO[room.type].label }}</span>
      </div>

      <p class="room__where muted">
        📍 {{ getBuilding(room.buildingId)?.name }} · {{ getFloor(room.floorId)?.name }}
      </p>

      <section v-if="room.capacity" class="room__section">
        <h4 class="rpg-label">Capacity</h4>
        <p class="room__capacity"><strong class="pixel">{{ room.capacity }}</strong> orang</p>
      </section>

      <section v-if="room.facilities.length" class="room__section">
        <h4 class="rpg-label">Facilities</h4>
        <ul class="check-list">
          <li v-for="item in room.facilities" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="room__section">
        <h4 class="rpg-label">Description</h4>
        <p class="muted">{{ room.description }}</p>
      </section>

      <section class="room__section">
        <h4 class="rpg-label">Photo</h4>
        <img v-if="room.image" class="room__photo" :src="room.image" :alt="`Foto ${room.name}`" loading="lazy" />
        <div v-else class="room__photo room__photo--empty" role="img" aria-label="Foto ruangan belum tersedia">
          <span aria-hidden="true">📷</span>
          <span>Foto belum tersedia</span>
        </div>
      </section>
    </div>

    <footer class="room__footer">
      <button type="button" class="rpg-btn rpg-btn--blue rpg-btn--block" @click="emit('back')">← Back to Floor</button>
    </footer>
  </aside>
</template>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 100%;
  animation: rpg-pop 0.18s ease-out;
}
.room__header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px 16px 12px;
  border-bottom: 3px solid var(--panel-border);
}
.room__icon {
  font-size: 30px;
  line-height: 1;
}
.room__title {
  font-size: 12px;
}
.room__title:focus {
  outline: none;
}
.room__code {
  margin: 6px 0 0;
  font-size: 10px;
  color: var(--orange-400);
}
.room__body {
  flex: 1;
  min-height: 0;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.room__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.room__where {
  margin: 0;
  font-size: 14px;
}
.room__section h4 {
  margin: 0 0 6px;
}
.room__section p {
  margin: 0;
  line-height: 1.6;
}
.room__capacity strong {
  font-size: 16px;
  color: var(--orange-400);
  margin-right: 6px;
}
.room__photo {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border: 2px solid var(--panel-border);
  border-radius: 4px;
}
.room__photo--empty {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-dim);
  background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0 8px, transparent 8px 16px), var(--navy-900);
}
.room__photo--empty span:first-child {
  font-size: 28px;
}
.room__footer {
  padding: 12px 16px calc(14px + var(--safe-bottom));
  border-top: 3px solid var(--panel-border);
}
</style>
