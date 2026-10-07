<script setup lang="ts">
// Layar loading saat aset Phaser dimuat: STIS CAMPUS / Loading... / [████████░░]
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useUiStore } from '../stores/uiStore'

const ui = useUiStore()
const BLOCKS = 16

const percent = computed(() => Math.round(ui.loadProgress * 100))
const filled = computed(() => Math.round(ui.loadProgress * BLOCKS))

const TIPS = [
  'Tips: dekati gedung lalu tekan E untuk melihat denahnya.',
  'Tips: tekan / untuk mencari ruangan dengan cepat.',
  'Tips: tahan SHIFT untuk berlari.',
  'Tips: ketuk gedung di mini-map untuk langsung ke sana.'
]
const tipIndex = ref(0)
let timer: number | undefined
onMounted(() => {
  timer = window.setInterval(() => (tipIndex.value = (tipIndex.value + 1) % TIPS.length), 2600)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <div class="loading" role="progressbar" aria-label="Memuat kampus" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent">
    <img class="loading__logo" src="/images/logo-256.png" alt="" width="112" height="112" />
    <h2 class="loading__title pixel">STIS CAMPUS</h2>
    <p class="loading__text pixel">Loading<span class="dots" aria-hidden="true">...</span></p>
    <div class="bar" aria-hidden="true">
      <span v-for="i in BLOCKS" :key="i" class="bar__block" :class="{ 'bar__block--on': i <= filled }" />
    </div>
    <p class="loading__meta">{{ percent }}% · {{ ui.loadMessage }}</p>
    <p class="loading__tip muted">{{ TIPS[tipIndex] }}</p>
  </div>
</template>

<style scoped>
.loading {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
  background:
    radial-gradient(ellipse at center, rgba(30, 111, 217, 0.22), transparent 65%),
    var(--navy-950);
}
.loading__logo {
  image-rendering: pixelated;
  border-radius: 8px;
  box-shadow: 0 0 0 3px var(--panel-border), 6px 6px 0 3px var(--panel-shadow);
  animation: bob 1.6s ease-in-out infinite;
}
@keyframes bob {
  50% {
    transform: translateY(-6px);
  }
}
.loading__title {
  margin: 8px 0 0;
  font-size: clamp(16px, 4vw, 24px);
  color: var(--text);
  text-shadow: 3px 3px 0 var(--navy-700);
}
.loading__text {
  margin: 0;
  font-size: 11px;
  color: var(--orange-400);
}
.dots {
  display: inline-block;
  width: 3ch;
  text-align: left;
  animation: dots 1.2s steps(4) infinite;
  overflow: hidden;
  vertical-align: bottom;
}
@keyframes dots {
  from {
    width: 0;
  }
  to {
    width: 3ch;
  }
}
.bar {
  display: flex;
  gap: 3px;
  padding: 5px;
  background: var(--navy-900);
  border: 3px solid var(--panel-border);
  border-radius: 4px;
  box-shadow: 4px 4px 0 var(--panel-shadow);
}
.bar__block {
  width: clamp(10px, 3.4vw, 16px);
  height: 20px;
  background: rgba(255, 255, 255, 0.06);
}
.bar__block--on {
  background: linear-gradient(180deg, var(--orange-400), var(--orange-500));
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.25);
}
.loading__meta {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}
.loading__tip {
  margin: 8px 0 0;
  font-size: 14px;
  min-height: 1.5em;
}
</style>
