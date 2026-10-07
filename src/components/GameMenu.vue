<script setup lang="ts">
// Menu permainan: panel informasi, toggle marker per kategori, mini-map, kembali ke judul.
import { computed } from 'vue'
import { MARKER_CATEGORIES } from '../game/data/campus'
import type { MarkerCategory, PanelId } from '../game/data/types'
import { gameEvents } from '../game/EventBus'
import { useUiStore } from '../stores/uiStore'
import RpgModal from './RpgModal.vue'

const emit = defineEmits<{ exit: [] }>()
const ui = useUiStore()

const PANELS: { id: PanelId; icon: string; label: string; desc: string }[] = [
  { id: 'directory', icon: '🧭', label: 'Campus Directory', desc: 'Cari & pergi ke lokasi' },
  { id: 'about', icon: '🎓', label: 'About STIS', desc: 'Tentang kampus & STISMAP' },
  { id: 'facilities', icon: '🧰', label: 'Campus Facilities', desc: 'Daftar fasilitas kampus' },
  { id: 'guide', icon: '🗺️', label: 'Campus Guide', desc: 'Kontrol & cara bermain' }
]

/** Hanya kategori yang benar-benar punya marker di peta. */
const markerCategories = computed(() => {
  const counts = new Map<MarkerCategory, number>()
  for (const m of ui.minimap?.markers ?? []) counts.set(m.category, (counts.get(m.category) ?? 0) + 1)
  return [...counts.entries()].map(([id, count]) => ({ id, count, ...MARKER_CATEGORIES[id] }))
})

const allVisible = computed(() => markerCategories.value.every((c) => ui.isMarkerVisible(c.id)))

function toggleAll() {
  ui.setAllMarkers(
    !allVisible.value,
    markerCategories.value.map((c) => c.id)
  )
}
</script>

<template>
  <RpgModal title="Menu" subtitle="STISMAP — Virtual Campus Explorer" icon="☰" size="md" @close="ui.closeMenu()">
    <div class="menu">
      <ul class="menu__panels" role="list">
        <li v-for="(panel, i) in PANELS" :key="panel.id">
          <button type="button" class="menu-item" :data-autofocus="i === 0 ? '' : undefined" @click="ui.openMenu(panel.id)">
            <span class="menu-item__icon" aria-hidden="true">{{ panel.icon }}</span>
            <span class="menu-item__text">
              <strong>{{ panel.label }}</strong>
              <small>{{ panel.desc }}</small>
            </span>
          </button>
        </li>
      </ul>

      <section class="menu__section">
        <div class="menu__section-head">
          <h3 class="rpg-label">Map Markers</h3>
          <button type="button" class="rpg-btn rpg-btn--ghost rpg-btn--sm" @click="toggleAll">
            {{ allVisible ? 'Sembunyikan semua' : 'Tampilkan semua' }}
          </button>
        </div>
        <div class="toggles">
          <label v-for="cat in markerCategories" :key="cat.id" class="toggle">
            <input type="checkbox" :checked="ui.isMarkerVisible(cat.id)" @change="ui.toggleMarker(cat.id)" />
            <span aria-hidden="true">{{ cat.icon }}</span>
            {{ cat.label }}
            <small class="muted">({{ cat.count }})</small>
          </label>
        </div>
      </section>

      <section class="menu__section">
        <h3 class="rpg-label">Tampilan</h3>
        <div class="toggles">
          <label class="toggle">
            <input type="checkbox" :checked="ui.minimapVisible" @change="ui.toggleMinimap()" />
            <span aria-hidden="true">🗺️</span> Mini-map
          </label>
        </div>
        <div class="zoom">
          <span class="muted">Zoom kamera</span>
          <button type="button" class="rpg-btn rpg-btn--sm" aria-label="Perkecil" @click="gameEvents.emit('zoom', -1)">−</button>
          <button type="button" class="rpg-btn rpg-btn--sm" aria-label="Perbesar" @click="gameEvents.emit('zoom', 1)">+</button>
        </div>
      </section>
    </div>

    <template #footer>
      <button type="button" class="rpg-btn rpg-btn--ghost" @click="emit('exit')">⏏ Layar Judul</button>
      <button type="button" class="rpg-btn rpg-btn--primary" @click="ui.closeMenu()">▶ Lanjut Jelajah</button>
    </template>
  </RpgModal>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.menu__panels {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 8px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 60px;
  padding: 10px 12px;
  text-align: left;
  color: var(--text);
  background: var(--navy-800);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.menu-item:hover {
  border-color: var(--orange-500);
}
.menu-item__icon {
  font-size: 24px;
}
.menu-item__text {
  display: flex;
  flex-direction: column;
}
.menu-item__text small {
  color: var(--text-muted);
}
.menu__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.menu__section h3 {
  margin: 0 0 8px;
}
.toggles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 6px;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 6px 10px;
  background: rgba(3, 7, 15, 0.3);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  cursor: pointer;
}
.toggle input {
  width: 18px;
  height: 18px;
  accent-color: var(--orange-500);
}
.zoom {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.zoom .muted {
  margin-right: auto;
}
</style>
