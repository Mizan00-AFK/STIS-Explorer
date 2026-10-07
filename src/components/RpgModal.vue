<script setup lang="ts">
// Modal dasar bergaya RPG yang dipakai ulang oleh semua panel (About, Fasilitas, Panduan,
// Direktori, Info Gedung). Menangani: ESC untuk menutup, klik backdrop, focus trap,
// fokus awal, dan mengembalikan fokus ke game saat ditutup (aksesibilitas keyboard).
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: string
    size?: 'sm' | 'md' | 'lg'
    /** Tutup saat backdrop diklik. */
    dismissible?: boolean
  }>(),
  { size: 'md', dismissible: true, subtitle: undefined, icon: undefined }
)

const emit = defineEmits<{ close: [] }>()

const titleId = useId()
const panel = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    emit('close')
    return
  }
  if (event.key === 'Tab' && panel.value) {
    const items = Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

onMounted(async () => {
  previouslyFocused = document.activeElement as HTMLElement | null
  await nextTick()
  const autofocus = panel.value?.querySelector<HTMLElement>('[autofocus], [data-autofocus]')
  ;(autofocus ?? panel.value)?.focus()
})

onBeforeUnmount(() => {
  // Kembalikan fokus ke elemen sebelumnya bila masih ada di halaman (mis. tombol HUD).
  if (previouslyFocused && document.body.contains(previouslyFocused) && previouslyFocused !== document.body) {
    previouslyFocused.focus({ preventScroll: true })
  }
})

function onBackdrop() {
  if (props.dismissible) emit('close')
}
</script>

<template>
  <div class="backdrop" @click.self="onBackdrop" @keydown="onKeydown">
    <section
      ref="panel"
      class="rpg-panel modal"
      :class="`modal--${size}`"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
    >
      <header class="modal__header">
        <span v-if="icon" class="modal__icon" aria-hidden="true">{{ icon }}</span>
        <div class="modal__titles">
          <h2 :id="titleId" class="rpg-title">{{ title }}</h2>
          <p v-if="subtitle" class="rpg-subtitle">{{ subtitle }}</p>
        </div>
        <slot name="header-extra" />
        <button class="icon-btn modal__close" type="button" aria-label="Tutup" @click="emit('close')">✕</button>
      </header>

      <div class="modal__body scroll-y">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="modal__footer">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: min(86dvh, 760px);
  animation: rpg-pop 0.18s ease-out;
}
.modal:focus {
  outline: none;
}
.modal--sm {
  max-width: 420px;
}
.modal--md {
  max-width: 560px;
}
.modal--lg {
  max-width: 820px;
}

.modal__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 18px 14px;
  border-bottom: 3px solid var(--panel-border);
  background: linear-gradient(180deg, rgba(30, 111, 217, 0.18), transparent);
}
.modal__icon {
  font-size: 28px;
  line-height: 1;
}
.modal__titles {
  flex: 1;
  min-width: 0;
}
.modal__close {
  flex: none;
  margin: -6px -6px 0 0;
}

.modal__body {
  flex: 1;
  min-height: 0;
  padding: 16px 18px;
}

.modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px calc(14px + var(--safe-bottom));
  border-top: 3px solid var(--panel-border);
  background: rgba(3, 7, 15, 0.35);
}

@media (max-width: 560px) {
  .backdrop {
    align-items: flex-end;
    padding: 0;
  }
  .modal {
    max-height: 92dvh;
    border-radius: 10px 10px 0 0;
  }
  .modal__footer :deep(.rpg-btn) {
    flex: 1 1 auto;
  }
}
</style>
