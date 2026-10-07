<script setup lang="ts">
// Layar pembuka sebelum game Phaser dimulai: logo, judul, pilihan karakter, ENTER CAMPUS.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CharacterSprite from '../components/CharacterSprite.vue'
import { CHARACTER_NAMES } from '../game/objects/characterAnims'
import { useUiStore } from '../stores/uiStore'

const emit = defineEmits<{ enter: [] }>()
const ui = useUiStore()
const enterBtn = ref<HTMLButtonElement | null>(null)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') ui.selectCharacter((ui.characterRow + CHARACTER_NAMES.length - 1) % CHARACTER_NAMES.length)
  else if (event.key === 'ArrowRight') ui.selectCharacter((ui.characterRow + 1) % CHARACTER_NAMES.length)
}

onMounted(() => {
  enterBtn.value?.focus()
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="intro">
    <div class="sky" aria-hidden="true">
      <span class="stars stars--1" />
      <span class="stars stars--2" />
      <span class="cloud cloud--1" />
      <span class="cloud cloud--2" />
    </div>

    <!-- Siluet kampus pixel (Gedung 3, Gedung 1, Gedung 2, Masjid) -->
    <svg class="skyline" viewBox="0 0 320 60" preserveAspectRatio="xMidYMax slice" aria-hidden="true" shape-rendering="crispEdges">
      <rect x="0" y="52" width="320" height="8" fill="#13284d" />
      <g fill="#1c3766">
        <rect x="18" y="20" width="70" height="32" />
        <rect x="96" y="14" width="56" height="38" />
        <rect x="160" y="8" width="88" height="44" />
        <rect x="262" y="34" width="40" height="18" />
        <rect x="278" y="26" width="8" height="8" />
        <rect x="280" y="22" width="4" height="4" />
      </g>
      <g fill="#f28c28" opacity="0.9">
        <rect x="96" y="22" width="56" height="2" />
      </g>
      <g fill="#ffd166" class="windows">
        <rect v-for="i in 8" :key="`a${i}`" :x="22 + (i - 1) * 8" y="26" width="4" height="3" />
        <rect v-for="i in 8" :key="`b${i}`" :x="22 + (i - 1) * 8" y="36" width="4" height="3" />
        <rect v-for="i in 6" :key="`c${i}`" :x="100 + (i - 1) * 9" y="30" width="5" height="3" />
        <rect v-for="i in 6" :key="`d${i}`" :x="100 + (i - 1) * 9" y="40" width="5" height="3" />
        <rect v-for="i in 10" :key="`e${i}`" :x="164 + (i - 1) * 8.5" y="14" width="4" height="3" />
        <rect v-for="i in 10" :key="`f${i}`" :x="164 + (i - 1) * 8.5" y="24" width="4" height="3" />
        <rect v-for="i in 10" :key="`g${i}`" :x="164 + (i - 1) * 8.5" y="34" width="4" height="3" />
      </g>
    </svg>

    <section class="intro__card">
      <img class="intro__logo" src="/images/stismap-256.png" alt="Logo STISMAP" width="148" height="148" />
      <p class="intro__eyebrow pixel">STISMAP · Virtual Campus Explorer</p>
      <h1 class="intro__title pixel">Politeknik Statistika STIS</h1>
      <p class="intro__tagline pixel">Explore Our Campus</p>

      <div class="chars" role="radiogroup" aria-label="Pilih karakter">
        <button
          v-for="(name, row) in CHARACTER_NAMES"
          :key="name"
          type="button"
          role="radio"
          class="char"
          :class="{ 'char--active': ui.characterRow === row }"
          :aria-checked="ui.characterRow === row"
          :aria-label="`Karakter ${name}`"
          @click="ui.selectCharacter(row)"
        >
          <CharacterSprite :row="row" :scale="3" :animated="ui.characterRow === row" />
        </button>
      </div>

      <button ref="enterBtn" type="button" class="rpg-btn rpg-btn--primary enter" @click="emit('enter')">▶ Enter Campus</button>
      <p class="intro__hint">
        <kbd class="kbd">ENTER</kbd> mulai · <kbd class="kbd">←</kbd> <kbd class="kbd">→</kbd> pilih karakter
      </p>
    </section>

    <footer class="intro__footer">
      Peta berdasarkan data © OpenStreetMap contributors · Denah ruangan masih data demo · Info resmi:
      <a href="https://www.stis.ac.id/" target="_blank" rel="noopener noreferrer">stis.ac.id</a>
    </footer>
  </main>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(180deg, #050a14 0%, #0b1a33 55%, #1c3766 100%);
}

.sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.stars {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  image-rendering: pixelated;
}
.stars--1 {
  background-image:
    radial-gradient(2px 2px at 20px 30px, #fff 50%, transparent 51%),
    radial-gradient(2px 2px at 140px 80px, #ffd166 50%, transparent 51%),
    radial-gradient(2px 2px at 260px 40px, #fff 50%, transparent 51%),
    radial-gradient(2px 2px at 90px 160px, #8fbaf7 50%, transparent 51%);
  background-size: 300px 220px;
  animation: twinkle 3s steps(2) infinite;
}
.stars--2 {
  background-image:
    radial-gradient(2px 2px at 60px 110px, #fff 50%, transparent 51%),
    radial-gradient(2px 2px at 200px 20px, #8fbaf7 50%, transparent 51%),
    radial-gradient(2px 2px at 300px 150px, #fff 50%, transparent 51%);
  background-size: 360px 260px;
  animation: twinkle 4.2s steps(2) infinite reverse;
}
@keyframes twinkle {
  50% {
    opacity: 0.35;
  }
}
.cloud {
  position: absolute;
  height: 14px;
  background: rgba(143, 186, 247, 0.12);
  box-shadow:
    14px -8px 0 0 rgba(143, 186, 247, 0.12),
    32px 0 0 0 rgba(143, 186, 247, 0.12);
  animation: drift linear infinite;
}
.cloud--1 {
  top: 16%;
  width: 70px;
  animation-duration: 60s;
}
.cloud--2 {
  top: 32%;
  width: 48px;
  animation-duration: 85s;
  animation-delay: -40s;
}
@keyframes drift {
  from {
    transform: translateX(-120px);
  }
  to {
    transform: translateX(110vw);
  }
}

.skyline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 34vh;
  opacity: 0.9;
}
.windows rect {
  animation: lights 5s steps(2) infinite;
}
.windows rect:nth-child(3n) {
  animation-delay: -2s;
}
@keyframes lights {
  50% {
    opacity: 0.35;
  }
}

.intro__card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: min(560px, 100%);
  padding: 28px 24px 22px;
  text-align: center;
  background: rgba(7, 13, 26, 0.72);
  border: 3px solid var(--panel-border);
  border-radius: 8px;
  box-shadow: 0 0 0 3px var(--panel-shadow), 8px 8px 0 3px rgba(3, 7, 15, 0.7);
  animation: rpg-pop 0.4s ease-out;
}
.intro__logo {
  width: clamp(96px, 22vw, 148px);
  height: auto;
  image-rendering: pixelated;
  filter: drop-shadow(4px 4px 0 rgba(3, 7, 15, 0.8));
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  50% {
    transform: translateY(-6px);
  }
}
.intro__eyebrow {
  margin: 0;
  font-size: 8px;
  color: var(--blue-300);
}
.intro__title {
  margin: 0;
  font-size: clamp(14px, 3.6vw, 22px);
  line-height: 1.6;
  text-transform: uppercase;
  text-shadow: 3px 3px 0 var(--navy-700);
}
.intro__tagline {
  margin: 0;
  font-size: clamp(10px, 2.4vw, 13px);
  color: var(--orange-400);
  text-transform: uppercase;
  animation: blink 1.6s steps(2) infinite;
}
@keyframes blink {
  50% {
    opacity: 0.55;
  }
}

.chars {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.char {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  padding: 0;
  background: var(--navy-800);
  border: 3px solid var(--panel-border);
  border-radius: 6px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.char--active {
  border-color: var(--orange-500);
  background: var(--navy-600);
}

.enter {
  margin-top: 6px;
  min-width: 240px;
  min-height: 52px;
  font-size: 12px;
}
.intro__hint {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-dim);
}

.intro__footer {
  position: absolute;
  bottom: calc(10px + var(--safe-bottom));
  left: 16px;
  right: 16px;
  z-index: 1;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  text-shadow: 1px 1px 0 #000;
}

@media (pointer: coarse) {
  .intro__hint {
    display: none;
  }
}
@media (max-height: 640px) {
  .intro__logo {
    width: 80px;
  }
  .intro__footer {
    display: none;
  }
}
</style>
