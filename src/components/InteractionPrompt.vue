<script setup lang="ts">
// Prompt interaksi saat pemain berada di dekat gedung/NPC/fasilitas.
// Tidak membuka modal otomatis — pemain harus menekan E/SPACE (atau mengetuk prompt).
import { computed } from 'vue'
import { gameEvents } from '../game/EventBus'
import { useCampusStore } from '../stores/campusStore'
import { useUiStore } from '../stores/uiStore'

const campus = useCampusStore()
const ui = useUiStore()

const target = computed(() => campus.nearby)

const hint = computed(() => {
  const t = target.value
  if (!t) return ''
  if (t.kind === 'building') return 'untuk melihat informasi gedung'
  if (t.kind === 'npc') return 'untuk berbicara'
  if (t.kind === 'info') return 'untuk membaca informasi'
  return 'untuk melihat fasilitas'
})
</script>

<template>
  <Transition name="slide-up">
    <button
      v-if="target"
      :key="`${target.kind}-${target.id}`"
      type="button"
      class="prompt rpg-panel rpg-panel--accent"
      :aria-label="`${target.actionLabel}: ${target.label}`"
      @click="gameEvents.emit('interact')"
    >
      <span class="prompt__title">
        <span aria-hidden="true">{{ target.icon }}</span>
        <span class="pixel">{{ target.label }}</span>
      </span>
      <span class="prompt__hint">
        <template v-if="ui.isTouch">Ketuk <strong>INTERACT</strong> {{ hint }}</template>
        <template v-else>Tekan <kbd class="kbd">E</kbd> {{ hint }}</template>
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.prompt {
  position: fixed;
  left: 50%;
  bottom: calc(28px + var(--safe-bottom));
  z-index: 15;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  max-width: min(420px, calc(100vw - 32px));
  padding: 12px 16px;
  text-align: left;
  color: var(--text);
  cursor: pointer;
}
.prompt.slide-up-enter-from,
.prompt.slide-up-leave-to {
  transform: translate(-50%, 16px);
}
.prompt__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}
.prompt__title .pixel {
  font-size: 11px;
  text-transform: uppercase;
  line-height: 1.5;
}
.prompt__hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-muted);
}

/* Di layar sentuh, prompt dinaikkan di atas joystick & tombol INTERACT. */
@media (pointer: coarse) {
  .prompt {
    bottom: calc(184px + var(--safe-bottom));
    max-width: calc(100vw - 32px);
  }
}
</style>
