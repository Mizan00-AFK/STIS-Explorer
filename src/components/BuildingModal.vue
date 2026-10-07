<script setup lang="ts">
// Panel informasi gedung: nama, kategori, deskripsi, jumlah lantai, sumber data,
// tombol EXPLORE BUILDING (masuk ke pemilih lantai & denah) dan CLOSE.
import { computed } from 'vue'
import { useCampusStore } from '../stores/campusStore'
import { floorsOf } from '../game/data/campus'
import DataBadge from './DataBadge.vue'
import RpgModal from './RpgModal.vue'

const campus = useCampusStore()
const building = computed(() => campus.currentBuilding)
const floorCount = computed(() => (building.value ? floorsOf(building.value.id).length : 0))

function close() {
  campus.isBuildingModalOpen = false
}
</script>

<template>
  <RpgModal v-if="building" :title="building.name" :subtitle="building.subtitle" :icon="building.icon" size="md" @close="close">
    <div class="building">
      <div class="building__badges">
        <DataBadge :status="building.dataStatus" />
        <span class="badge badge--neutral">🏢 {{ building.floors }} Lantai</span>
      </div>

      <section>
        <h3 class="rpg-label">Deskripsi</h3>
        <p>{{ building.description }}</p>
      </section>

      <section class="building__stats">
        <div class="stat">
          <span class="rpg-label">Jumlah Lantai</span>
          <strong class="stat__value pixel">{{ building.floors }}</strong>
        </div>
        <div class="stat">
          <span class="rpg-label">Isi Gedung</span>
          <ul class="stat__list">
            <li v-for="item in building.highlights" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>

      <p v-if="building.locationNote" class="note">📍 {{ building.locationNote }}</p>

      <details class="sources">
        <summary>Sumber data</summary>
        <ul>
          <li v-for="source in building.sources" :key="source.label">
            <a v-if="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }}</a>
            <span v-else>{{ source.label }}</span>
          </li>
        </ul>
      </details>
    </div>

    <template #footer>
      <button type="button" class="rpg-btn rpg-btn--ghost" @click="close">Close</button>
      <button
        type="button"
        class="rpg-btn rpg-btn--primary"
        data-autofocus
        :disabled="floorCount === 0"
        @click="campus.exploreBuilding(building.id)"
      >
        🚪 Explore Building
      </button>
    </template>
  </RpgModal>
</template>

<style scoped>
.building {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.building p {
  margin: 6px 0 0;
  color: var(--text-muted);
  line-height: 1.65;
}
.building__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.building__stats {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
}
.stat {
  padding: 12px 14px;
  background: rgba(3, 7, 15, 0.35);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
}
.stat__value {
  display: block;
  margin-top: 8px;
  font-size: 22px;
  color: var(--orange-400);
}
.stat__list {
  margin: 8px 0 0;
  padding-left: 18px;
  color: var(--text);
}
.note {
  padding: 10px 12px;
  font-size: 13px;
  background: rgba(255, 209, 102, 0.08);
  border-left: 4px solid var(--yellow-400);
  border-radius: 2px;
}
.sources {
  font-size: 13px;
  color: var(--text-dim);
}
.sources summary {
  cursor: pointer;
}
.sources ul {
  margin: 6px 0 0;
  padding-left: 18px;
}
@media (max-width: 480px) {
  .building__stats {
    grid-template-columns: 1fr;
  }
}
</style>
