<script setup lang="ts">
// Direktori & pencarian kampus. Kosongkan kolom pencarian untuk melihat daftar gedung &
// fasilitas; ketik untuk mencari gedung, ruangan, laboratorium, atau fasilitas.
//  - Gedung/fasilitas -> pemain diarahkan (fast travel) ke lokasinya di peta.
//  - Ruangan -> buka gedung -> lantai -> ruangan disorot di denah.
import { computed, ref } from 'vue'
import { MARKER_CATEGORIES, buildings, facilities, searchCampus, type SearchEntry } from '../game/data/campus'
import type { FacilityCategory } from '../game/data/types'
import { useCampusNavigation } from '../composables/useCampusNavigation'
import { useCampusStore } from '../stores/campusStore'
import { useUiStore } from '../stores/uiStore'
import RpgModal from './RpgModal.vue'

const ui = useUiStore()
const campus = useCampusStore()
const { travelToBuilding, goToFacility, focusRoom } = useCampusNavigation()

type Filter = 'all' | SearchEntry['kind']
const filter = ref<Filter>('all')
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'building', label: 'Gedung' },
  { id: 'room', label: 'Ruangan' },
  { id: 'facility', label: 'Fasilitas' }
]

const query = computed({
  get: () => ui.directoryQuery,
  set: (value: string) => (ui.directoryQuery = value)
})

const results = computed(() => {
  const list = searchCampus(query.value, 60)
  return filter.value === 'all' ? list : list.filter((r) => r.kind === filter.value)
})

const facilityGroups = computed(() => {
  const groups = new Map<FacilityCategory, typeof facilities>()
  for (const f of facilities) {
    const list = groups.get(f.category) ?? []
    list.push(f)
    groups.set(f.category, list)
  }
  return [...groups.entries()].map(([category, items]) => ({ category, ...MARKER_CATEGORIES[category], items }))
})

function close() {
  ui.closeMenu()
}

function select(entry: SearchEntry) {
  if (entry.kind === 'room') focusRoom(entry.id)
  else if (entry.kind === 'building') travelToBuilding(entry.id)
  else goToFacility(entry.id)
}

function showBuildingInfo(id: string) {
  close()
  campus.openBuilding(id)
}

function onEnter() {
  const first = results.value[0]
  if (first) select(first)
}

const KIND_LABEL: Record<SearchEntry['kind'], string> = { building: 'Gedung', room: 'Ruangan', facility: 'Fasilitas' }
</script>

<template>
  <RpgModal title="Campus Directory" subtitle="Cari gedung, ruangan, laboratorium & fasilitas" icon="🧭" size="lg" @close="close">
    <div class="directory">
      <div class="search">
        <label class="sr-only" for="campus-search">Cari lokasi kampus</label>
        <span class="search__icon" aria-hidden="true">🔍</span>
        <input
          id="campus-search"
          v-model="query"
          type="search"
          class="search__input"
          placeholder="Contoh: laboratorium, kantin, kelas 401, masjid..."
          autocomplete="off"
          data-autofocus
          @keydown.enter.prevent="onEnter"
        />
      </div>

      <!-- Hasil pencarian -->
      <template v-if="query.trim()">
        <div class="filters" role="tablist" aria-label="Filter hasil">
          <button
            v-for="f in FILTERS"
            :key="f.id"
            type="button"
            role="tab"
            class="chip"
            :class="{ 'chip--active': filter === f.id }"
            :aria-selected="filter === f.id"
            @click="filter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <p class="muted results-count" aria-live="polite">{{ results.length }} hasil untuk “{{ query }}”</p>

        <ul v-if="results.length" class="results" role="list">
          <li v-for="entry in results" :key="`${entry.kind}-${entry.id}`" class="result">
            <button type="button" class="result__main" @click="select(entry)">
              <span class="result__icon" aria-hidden="true">{{ entry.icon }}</span>
              <span class="result__text">
                <strong>{{ entry.title }}</strong>
                <small>{{ entry.subtitle }}</small>
              </span>
              <span class="result__tags">
                <span class="badge badge--neutral">{{ KIND_LABEL[entry.kind] }}</span>
                <span v-if="entry.isDemo" class="badge badge--demo">Demo</span>
              </span>
            </button>
            <button
              v-if="entry.kind === 'building'"
              type="button"
              class="icon-btn"
              :aria-label="`Info ${entry.title}`"
              title="Info gedung"
              @click="showBuildingInfo(entry.id)"
            >
              ⓘ
            </button>
          </li>
        </ul>
        <p v-else class="empty">Tidak ada lokasi yang cocok. Coba kata kunci lain, mis. “kelas”, “lab”, atau “toilet”.</p>
      </template>

      <!-- Direktori -->
      <template v-else>
        <section class="group">
          <h3 class="rpg-label">Buildings</h3>
          <ul class="cards" role="list">
            <li v-for="b in buildings" :key="b.id">
              <button type="button" class="card" @click="travelToBuilding(b.id)">
                <span class="card__icon" aria-hidden="true">{{ b.icon }}</span>
                <span class="card__text">
                  <strong>{{ b.name }}</strong>
                  <small>{{ b.subtitle }}</small>
                </span>
                <span class="card__go" aria-hidden="true">➜</span>
              </button>
            </li>
          </ul>
        </section>

        <section class="group">
          <h3 class="rpg-label">Facilities</h3>
          <div class="facility-groups">
            <div v-for="group in facilityGroups" :key="group.category" class="facility-group">
              <p class="facility-group__title">{{ group.icon }} {{ group.label }}</p>
              <ul role="list">
                <li v-for="f in group.items" :key="f.id">
                  <button type="button" class="link-btn" @click="goToFacility(f.id)">
                    {{ f.name }}
                    <small v-if="f.locationNote && !f.buildingId" class="muted">(belum dipetakan)</small>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </template>
    </div>
  </RpgModal>
</template>

<style scoped>
.directory {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.search {
  position: relative;
}
.search__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
}
.search__input {
  width: 100%;
  min-height: 48px;
  padding: 10px 14px 10px 44px;
  font-size: 16px;
  color: var(--text);
  background: var(--navy-950);
  border: 3px solid var(--panel-border);
  border-radius: 4px;
}
.search__input:focus {
  outline: none;
  border-color: var(--orange-500);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  min-height: 36px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--navy-800);
  border: 2px solid var(--panel-border);
  border-radius: 999px;
}
.chip--active {
  color: var(--navy-950);
  background: var(--orange-500);
  border-color: var(--orange-500);
}
.results-count {
  margin: 0;
  font-size: 13px;
}

.results {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.result {
  display: flex;
  align-items: center;
  gap: 6px;
}
.result__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 12px;
  text-align: left;
  color: var(--text);
  background: var(--navy-800);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
}
.result__main:hover {
  border-color: var(--orange-500);
}
.result__icon {
  font-size: 22px;
}
.result__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.result__text small {
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.result__tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.empty {
  margin: 0;
  padding: 18px;
  text-align: center;
  color: var(--text-muted);
  border: 2px dashed var(--panel-border);
  border-radius: 4px;
}

.group h3 {
  margin: 0 0 10px;
}
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 64px;
  padding: 10px 12px;
  text-align: left;
  color: var(--text);
  background: linear-gradient(135deg, var(--navy-700), var(--navy-800));
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.card:hover {
  border-color: var(--orange-500);
}
.card__icon {
  font-size: 26px;
}
.card__text {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card__text small {
  color: var(--text-muted);
}
.card__go {
  color: var(--orange-500);
}

.facility-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.facility-group {
  padding: 10px 12px;
  background: rgba(3, 7, 15, 0.3);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
}
.facility-group__title {
  margin: 0 0 6px;
  font-weight: 700;
}
.facility-group ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.link-btn {
  display: block;
  width: 100%;
  min-height: 36px;
  padding: 6px 0;
  text-align: left;
  font-size: 14px;
  color: var(--blue-300);
  background: none;
  border: none;
}
.link-btn:hover {
  color: var(--orange-400);
  text-decoration: underline;
}
</style>
