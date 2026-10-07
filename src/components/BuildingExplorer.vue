<script setup lang="ts">
// Overlay "masuk gedung": BUILDING X -> SELECT FLOOR -> denah lantai -> detail ruangan.
// Tidak membuat scene Phaser baru; peta kampus tetap berjalan (terkunci) di belakang.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCampusStore } from '../stores/campusStore'
import DataBadge from './DataBadge.vue'
import FloorPlan from './FloorPlan.vue'
import FloorSelector from './FloorSelector.vue'
import RoomModal from './RoomModal.vue'

const campus = useCampusStore()
const root = ref<HTMLElement | null>(null)

const building = computed(() => campus.currentBuilding)
const floor = computed(() => campus.currentFloor)
const room = computed(() => (campus.isRoomModalOpen ? campus.selectedRoom : undefined))

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  event.preventDefault()
  event.stopPropagation()
  campus.closeModal()
}

onMounted(() => root.value?.focus())

// Saat dibuka dari ESC di dalam RoomModal, pastikan fokus tidak hilang.
onBeforeUnmount(() => {
  if (document.activeElement === document.body) document.getElementById('game-root')?.focus()
})
</script>

<template>
  <div
    v-if="building && floor"
    ref="root"
    class="explorer"
    role="dialog"
    aria-modal="true"
    :aria-label="`Denah ${building.name}`"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <header class="explorer__top">
      <button type="button" class="rpg-btn rpg-btn--sm" @click="campus.returnToCampus()">← Back to Campus</button>
      <div class="explorer__title">
        <span class="explorer__icon" aria-hidden="true">{{ building.icon }}</span>
        <div>
          <h2 class="rpg-title">{{ building.name }}</h2>
          <p class="muted explorer__sub">{{ building.subtitle }}</p>
        </div>
      </div>
      <button type="button" class="rpg-btn rpg-btn--ghost rpg-btn--sm" @click="campus.openBuilding(building.id)">ⓘ Info</button>
    </header>

    <div class="explorer__body" :class="{ 'explorer__body--room': room }">
      <aside class="rpg-panel explorer__floors">
        <FloorSelector :floors="campus.buildingFloors" :current-floor-id="campus.currentFloorId" @select="campus.openFloor" />
      </aside>

      <main class="rpg-panel explorer__plan">
        <div class="plan-head">
          <div>
            <h3 class="rpg-title plan-head__title">{{ floor.name }}</h3>
            <p class="muted plan-head__desc">{{ floor.description }}</p>
          </div>
          <DataBadge :status="floor.dataStatus" />
        </div>
        <p v-if="floor.dataStatus === 'demo'" class="demo-note">
          ⚠ Denah ini adalah <strong>data demo</strong> untuk memperlihatkan fitur — bukan denah resmi STIS.
        </p>
        <FloorPlan
          :floor="floor"
          :rooms="campus.floorRooms"
          :accent="building.color"
          :selected-room-id="campus.selectedRoomId"
          :highlighted-room-id="campus.highlightedRoomId"
          @select="campus.openRoom"
        />
        <p class="plan-hint muted">Klik / ketuk ruangan untuk melihat detail. Keyboard: <kbd class="kbd">TAB</kbd> lalu <kbd class="kbd">ENTER</kbd>.</p>
      </main>

      <Transition name="slide-up">
        <div v-if="room" class="explorer__room">
          <RoomModal :room="room" @back="campus.closeRoom()" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  position: fixed;
  inset: 0;
  z-index: 42;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  padding-bottom: calc(16px + var(--safe-bottom));
  background:
    radial-gradient(ellipse at top, rgba(30, 111, 217, 0.25), transparent 60%),
    rgba(7, 13, 26, 0.97);
  animation: rpg-pop 0.2s ease-out;
}
.explorer:focus {
  outline: none;
}

.explorer__top {
  display: flex;
  align-items: center;
  gap: 14px;
}
.explorer__title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.explorer__icon {
  font-size: 32px;
}
.explorer__sub {
  margin: 4px 0 0;
  font-size: 14px;
}

.explorer__body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 14px;
}
.explorer__body--room {
  grid-template-columns: 200px minmax(0, 1fr) 340px;
}

.explorer__floors {
  padding: 14px;
  overflow-y: auto;
}

.explorer__plan {
  min-width: 0;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.plan-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.plan-head__title {
  font-size: 13px;
}
.plan-head__desc {
  margin: 6px 0 0;
  font-size: 14px;
}
.demo-note {
  margin: 0;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--yellow-400);
  background: rgba(255, 209, 102, 0.08);
  border: 2px dashed rgba(255, 209, 102, 0.4);
  border-radius: 4px;
}
.plan-hint {
  margin: 0;
  font-size: 13px;
}

.explorer__room {
  min-height: 0;
  display: flex;
}
.explorer__room > * {
  flex: 1;
}

@media (max-width: 1100px) {
  .explorer__body--room {
    grid-template-columns: 200px minmax(0, 1fr);
  }
  .explorer__room {
    position: fixed;
    right: 16px;
    top: 80px;
    bottom: calc(16px + var(--safe-bottom));
    width: min(360px, calc(100vw - 32px));
    z-index: 2;
  }
}

@media (max-width: 860px) {
  .explorer {
    padding: 10px;
    gap: 10px;
  }
  .explorer__top {
    flex-wrap: wrap;
    gap: 10px;
  }
  .explorer__title {
    order: -1;
    flex-basis: 100%;
  }
  .explorer__body,
  .explorer__body--room {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }
  .explorer__floors {
    padding: 10px;
  }
  .explorer__room {
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    width: 100%;
    max-height: 78dvh;
  }
  .explorer__room :deep(.room) {
    border-radius: 10px 10px 0 0;
  }
}
</style>
