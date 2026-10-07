<script setup lang="ts">
// Dulu: modal "Skill" (portofolio). Sekarang: "Campus Guide" — cara bermain, kontrol, legenda.
import { MARKER_CATEGORIES } from '../game/data/campus'
import { useUiStore } from '../stores/uiStore'
import RpgModal from './RpgModal.vue'

const ui = useUiStore()

const KEYS = [
  { keys: ['W', 'A', 'S', 'D'], alt: ['↑', '←', '↓', '→'], label: 'Berjalan' },
  { keys: ['SHIFT'], label: 'Lari (tahan)' },
  { keys: ['E'], alt: ['SPACE'], label: 'Interaksi / lanjut dialog' },
  { keys: ['ESC'], label: 'Tutup panel / buka menu' },
  { keys: ['/'], alt: ['F'], label: 'Buka pencarian' },
  { keys: ['M'], label: 'Tampilkan / sembunyikan mini-map' },
  { keys: ['+'], alt: ['-'], label: 'Zoom kamera (atau scroll mouse)' }
]

const LEGEND = (['building', 'mosque', 'canteen', 'parking', 'atm', 'toilet', 'security', 'transport', 'gate', 'info'] as const).map((c) => ({
  id: c,
  ...MARKER_CATEGORIES[c]
}))
</script>

<template>
  <RpgModal title="Campus Guide" subtitle="Panduan menjelajah STISMAP" icon="🗺️" size="md" @close="ui.closeMenu()">
    <div class="guide">
      <section>
        <h3 class="rpg-label">Cara Menjelajah</h3>
        <ol class="steps">
          <li>Berjalanlah mengelilingi kampus dan dekati gedung atau NPC.</li>
          <li>Saat muncul prompt <kbd class="kbd">E</kbd>, tekan untuk melihat informasi.</li>
          <li>Pilih <strong>Explore Building</strong> untuk memilih lantai dan melihat denahnya.</li>
          <li>Klik ruangan di denah untuk melihat kapasitas, fasilitas, dan deskripsi.</li>
          <li>Gunakan <strong>🔍 Direktori</strong> untuk langsung menuju gedung, fasilitas, atau ruangan.</li>
        </ol>
      </section>

      <section v-if="!ui.isTouch">
        <h3 class="rpg-label">Kontrol Keyboard</h3>
        <ul class="keys" role="list">
          <li v-for="row in KEYS" :key="row.label">
            <span class="keys__combo">
              <kbd v-for="k in row.keys" :key="k" class="kbd">{{ k }}</kbd>
              <template v-if="row.alt">
                <span class="muted">/</span>
                <kbd v-for="k in row.alt" :key="k" class="kbd">{{ k }}</kbd>
              </template>
            </span>
            <span>{{ row.label }}</span>
          </li>
        </ul>
      </section>
      <section v-else>
        <h3 class="rpg-label">Kontrol Layar Sentuh</h3>
        <ul class="steps">
          <li>Geser joystick di kiri bawah untuk berjalan (dorong penuh untuk berlari).</li>
          <li>Ketuk tombol <strong>INTERACT</strong> di kanan bawah saat dekat gedung/NPC.</li>
          <li>Ketuk bangunan di mini-map untuk langsung pergi ke sana.</li>
        </ul>
      </section>

      <section>
        <h3 class="rpg-label">Legenda Marker</h3>
        <ul class="legend" role="list">
          <li v-for="item in LEGEND" :key="item.id"><span aria-hidden="true">{{ item.icon }}</span> {{ item.label }}</li>
        </ul>
      </section>

      <section>
        <h3 class="rpg-label">Status Data</h3>
        <ul class="status" role="list">
          <li><span class="badge badge--public">ⓘ Info Publik</span> dari artikel/website publik, perlu verifikasi.</li>
          <li><span class="badge badge--osm">ⓘ OpenStreetMap</span> posisi/bentuk dari OpenStreetMap.</li>
          <li><span class="badge badge--demo">⚠ Data Demo</span> contoh, bukan informasi resmi STIS.</li>
        </ul>
      </section>
    </div>

    <template #footer>
      <button type="button" class="rpg-btn rpg-btn--primary" data-autofocus @click="ui.closeMenu()">Mengerti!</button>
    </template>
  </RpgModal>
</template>

<style scoped>
.guide {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.guide h3 {
  margin: 0 0 8px;
}
.steps {
  margin: 0;
  padding-left: 20px;
  line-height: 1.7;
  color: var(--text-muted);
}
.keys {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.keys li {
  display: grid;
  grid-template-columns: minmax(170px, auto) 1fr;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
}
.keys__combo {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
.legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 6px;
  color: var(--text-muted);
}
.status {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}
@media (max-width: 480px) {
  .keys li {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
