<script setup lang="ts">
// Tampilan error (map/sprite/data gagal dimuat) agar tidak terjadi layar kosong.
import { onMounted, ref } from 'vue'
import { useUiStore } from '../stores/uiStore'

const emit = defineEmits<{ retry: []; exit: [] }>()
const ui = useUiStore()
const retryBtn = ref<HTMLButtonElement | null>(null)

onMounted(() => retryBtn.value?.focus())
</script>

<template>
  <div class="error" role="alertdialog" aria-labelledby="error-title" aria-describedby="error-desc">
    <div class="rpg-panel error__box">
      <p class="error__icon" aria-hidden="true">⚠️</p>
      <h2 id="error-title" class="rpg-title">Oops! Kampus gagal dimuat</h2>
      <p id="error-desc" class="error__message">{{ ui.errorMessage || 'Unable to load campus map.' }}</p>
      <details v-if="ui.errorDetails.length" class="error__details">
        <summary>Detail teknis</summary>
        <ul>
          <li v-for="detail in ui.errorDetails" :key="detail">{{ detail }}</li>
        </ul>
      </details>
      <div class="error__actions">
        <button type="button" class="rpg-btn rpg-btn--ghost" @click="emit('exit')">Layar Judul</button>
        <button ref="retryBtn" type="button" class="rpg-btn rpg-btn--primary" @click="emit('retry')">↻ Retry</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  position: fixed;
  inset: 0;
  z-index: 85;
  display: grid;
  place-items: center;
  padding: 16px;
  background: var(--navy-950);
}
.error__box {
  width: min(480px, 100%);
  padding: 24px;
  text-align: center;
  border-color: var(--red-500);
}
.error__icon {
  margin: 0;
  font-size: 40px;
}
.error__message {
  margin: 12px 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}
.error__details {
  margin-top: 12px;
  text-align: left;
  font-size: 13px;
  color: var(--text-dim);
}
.error__details ul {
  margin: 6px 0 0;
  padding-left: 18px;
  max-height: 160px;
  overflow-y: auto;
}
.error__actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}
</style>
