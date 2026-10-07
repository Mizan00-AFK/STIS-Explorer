<script setup lang="ts">
// Dulu: modal "Profile" (portofolio). Sekarang: "About STIS" — tentang kampus & STISMAP.
import { CAMPUS_INFO } from '../game/data/campus'
import { SOURCES } from '../game/data/buildings'
import { useUiStore } from '../stores/uiStore'
import RpgModal from './RpgModal.vue'
import RpgText from './RpgText.vue'

const ui = useUiStore()
</script>

<template>
  <RpgModal title="About STIS" :subtitle="CAMPUS_INFO.name" icon="🎓" size="md" @close="ui.closeMenu()">
    <div class="about">
      <div class="about__intro rpg-panel">
        <RpgText
          text="Selamat datang di Politeknik Statistika STIS — kampus yang dikenal sebagai Kampus Otista. Jelajahi gedung, lantai, dan ruangannya lewat STISMAP!"
        />
      </div>

      <section>
        <h3 class="rpg-label">Lokasi Kampus</h3>
        <p>📍 {{ CAMPUS_INFO.address }}</p>
        <p class="muted">
          Kampus berada di tepi Jl. Otto Iskandardinata (Otista) dan Jl. Sensus Raya. Di dalam area kampus terdapat tiga
          gedung utama dan Masjid Al Hasanah.
        </p>
      </section>

      <section>
        <h3 class="rpg-label">Informasi Resmi</h3>
        <p>
          Informasi resmi tentang program studi, penerimaan mahasiswa, dan pengumuman kampus tersedia di
          <a :href="CAMPUS_INFO.website" target="_blank" rel="noopener noreferrer">stis.ac.id</a>.
        </p>
      </section>

      <section>
        <h3 class="rpg-label">Tentang STISMAP</h3>
        <p class="muted">
          STISMAP adalah peta kampus interaktif bergaya game RPG pixel. Tata letak peta mengikuti footprint dari
          OpenStreetMap; informasi gedung diambil dari sumber publik; dan denah ruangan saat ini masih
          <strong>data demo</strong> sampai denah resmi tersedia.
        </p>
        <ul class="sources">
          <li v-for="source in Object.values(SOURCES)" :key="source.label">
            <a :href="source.url" target="_blank" rel="noopener noreferrer">{{ source.label }}</a>
          </li>
        </ul>
      </section>
    </div>

    <template #footer>
      <button type="button" class="rpg-btn rpg-btn--primary" data-autofocus @click="ui.closeMenu()">Close</button>
    </template>
  </RpgModal>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.about__intro {
  padding: 14px 16px;
  font-size: 15px;
  line-height: 1.6;
  border-color: var(--blue-500);
}
.about section p {
  margin: 6px 0 0;
  line-height: 1.65;
}
.sources {
  margin: 8px 0 0;
  padding-left: 18px;
  font-size: 13px;
}
</style>
