<script setup lang="ts">
import { useUiStore } from '../stores/uiStore'

const ui = useUiStore()
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <TransitionGroup name="slide-up">
      <div v-for="toast in ui.toasts" :key="toast.id" class="toast rpg-panel" :class="`toast--${toast.tone}`">
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  left: 50%;
  top: calc(var(--hud-height) + 10px);
  z-index: 60;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  width: max-content;
  max-width: calc(100vw - 32px);
}
/* Layar kecil: turunkan agar tidak menutupi mini-map di pojok kanan atas. */
@media (max-width: 720px) {
  .toasts {
    top: calc(var(--hud-height) + 112px);
  }
}
.toast {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
}
.toast--success {
  border-color: var(--green-500);
}
.toast--warning {
  border-color: var(--yellow-400);
}
</style>
