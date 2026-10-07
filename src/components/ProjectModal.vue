<script setup lang="ts">
// Dulu: modal "Project" (portofolio). Sekarang: "Campus Facilities" — daftar fasilitas kampus.
import { nextTick, onMounted } from 'vue'
import { MARKER_CATEGORIES, facilities, getBuilding } from '../game/data/campus'
import { useCampusNavigation } from '../composables/useCampusNavigation'
import { useUiStore } from '../stores/uiStore'
import DataBadge from './DataBadge.vue'
import RpgModal from './RpgModal.vue'

const ui = useUiStore()
const { goToFacility, canNavigateToFacility } = useCampusNavigation()

onMounted(async () => {
  if (!ui.focusedFacilityId) return
  await nextTick()
  const el = document.getElementById(`facility-${ui.focusedFacilityId}`)
  el?.scrollIntoView({ block: 'center' })
  el?.focus()
})
</script>

<template>
  <RpgModal title="Campus Facilities" subtitle="Fasilitas di Kampus Otista" icon="🧰" size="lg" @close="ui.closeMenu()">
    <ul class="facilities" role="list">
      <li
        v-for="f in facilities"
        :id="`facility-${f.id}`"
        :key="f.id"
        class="facility"
        :class="{ 'facility--focused': f.id === ui.focusedFacilityId }"
        tabindex="-1"
      >
        <span class="facility__icon" aria-hidden="true">{{ MARKER_CATEGORIES[f.category].icon }}</span>
        <div class="facility__body">
          <div class="facility__head">
            <strong>{{ f.name }}</strong>
            <DataBadge :status="f.dataStatus" />
          </div>
          <p class="muted">{{ f.description }}</p>
          <p v-if="f.buildingId" class="facility__where">📍 {{ getBuilding(f.buildingId)?.name }}</p>
          <p v-if="f.locationNote" class="facility__note">{{ f.locationNote }}</p>
          <button v-if="canNavigateToFacility(f.id)" type="button" class="rpg-btn rpg-btn--sm rpg-btn--blue" @click="goToFacility(f.id)">
            {{ f.roomId || f.floorId ? 'Lihat di denah' : 'Pergi ke lokasi' }}
          </button>
        </div>
      </li>
    </ul>
  </RpgModal>
</template>

<style scoped>
.facilities {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
}
.facility {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(3, 7, 15, 0.3);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
}
.facility--focused {
  border-color: var(--orange-500);
  box-shadow: 0 0 0 2px rgba(242, 140, 40, 0.35);
}
.facility__icon {
  font-size: 26px;
}
.facility__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}
.facility__head {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.facility__body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}
.facility__where {
  color: var(--blue-300);
}
.facility__note {
  font-size: 12px !important;
  color: var(--yellow-400);
}
</style>
