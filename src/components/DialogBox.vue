<script setup lang="ts">
// Kotak dialog RPG: nama & potret karakter, teks bertahap, pilihan dialog, next & close.
// Kontrol: SPACE / E / ENTER = lanjut, ↑ ↓ = pilih opsi, 1-9 = pilih cepat, ESC = tutup.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDialogStore } from '../stores/dialogStore'
import { useUiStore } from '../stores/uiStore'
import CharacterSprite from './CharacterSprite.vue'
import RpgText from './RpgText.vue'

const dialog = useDialogStore()
const ui = useUiStore()

const textRef = ref<InstanceType<typeof RpgText> | null>(null)
const typingDone = ref(false)
const activeChoice = ref(0)
const choiceButtons = ref<HTMLButtonElement[]>([])
const box = ref<HTMLElement | null>(null)

const showChoices = computed(() => typingDone.value && dialog.choices.length > 0)
const progress = computed(() => `${dialog.lineIndex + 1} / ${dialog.messages.length}`)

watch(
  () => [dialog.nodeId, dialog.lineIndex, dialog.currentLine],
  () => {
    typingDone.value = false
    activeChoice.value = 0
  }
)

watch(showChoices, async (visible) => {
  if (!visible) return
  await nextTick()
  choiceButtons.value[0]?.focus()
})

function advance() {
  // Klik / SPACE saat teks masih diketik -> tampilkan seluruh teks dulu.
  if (textRef.value?.skip()) return
  if (showChoices.value) {
    const choice = dialog.choices[activeChoice.value]
    if (choice) dialog.choose(choice)
    return
  }
  dialog.next()
}

function onKeydown(event: KeyboardEvent) {
  const key = event.key
  if (key === 'Escape') {
    dialog.hideDialog()
  } else if (key === ' ' || key === 'Enter' || key.toLowerCase() === 'e') {
    advance()
  } else if (showChoices.value && (key === 'ArrowDown' || key === 's' || key === 'S')) {
    activeChoice.value = (activeChoice.value + 1) % dialog.choices.length
    choiceButtons.value[activeChoice.value]?.focus()
  } else if (showChoices.value && (key === 'ArrowUp' || key === 'w' || key === 'W')) {
    activeChoice.value = (activeChoice.value - 1 + dialog.choices.length) % dialog.choices.length
    choiceButtons.value[activeChoice.value]?.focus()
  } else if (showChoices.value && /^[1-9]$/.test(key)) {
    const choice = dialog.choices[Number(key) - 1]
    if (choice) dialog.choose(choice)
  } else if (key === 'ArrowLeft' || key === 'Backspace') {
    dialog.previous()
  } else {
    return
  }
  // Tandai sudah ditangani agar Phaser tidak memproses tombol yang sama.
  event.preventDefault()
  event.stopPropagation()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown, true)
  box.value?.focus()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, true))
</script>

<template>
  <div class="dialog-layer">
    <section
      ref="box"
      class="rpg-panel dialog"
      role="dialog"
      aria-modal="false"
      :aria-label="`Dialog dengan ${dialog.speaker.name}`"
      tabindex="-1"
      @click="advance"
    >
      <div class="dialog__portrait" aria-hidden="true">
        <CharacterSprite
          v-if="dialog.speaker.spriteRow !== undefined"
          :row="dialog.speaker.spriteRow"
          :tint="dialog.speaker.tint"
          :scale="4"
        />
        <span v-else class="dialog__icon">{{ dialog.speaker.icon ?? '💬' }}</span>
      </div>

      <div class="dialog__main">
        <header class="dialog__header">
          <h3 class="dialog__name pixel">{{ dialog.speaker.name }}</h3>
          <span v-if="dialog.speaker.role" class="badge badge--neutral">{{ dialog.speaker.role }}</span>
          <button class="icon-btn dialog__close" type="button" aria-label="Tutup dialog" @click.stop="dialog.hideDialog()">✕</button>
        </header>

        <RpgText ref="textRef" class="dialog__text" :text="dialog.currentLine" @done="typingDone = true" />

        <ul v-if="showChoices" class="dialog__choices" role="list">
          <li v-for="(choice, index) in dialog.choices" :key="choice.label">
            <button
              :ref="(el) => { if (el) choiceButtons[index] = el as HTMLButtonElement }"
              type="button"
              class="choice"
              :class="{ 'choice--active': index === activeChoice }"
              @click.stop="dialog.choose(choice)"
              @focus="activeChoice = index"
            >
              <span class="choice__num" aria-hidden="true">{{ index + 1 }}</span>
              {{ choice.label }}
            </button>
          </li>
        </ul>

        <footer class="dialog__footer">
          <span class="rpg-label">{{ progress }}</span>
          <span v-if="!showChoices" class="dialog__hint">
            <template v-if="ui.isTouch">Ketuk untuk lanjut</template>
            <template v-else>Tekan <kbd class="kbd">SPACE</kbd> untuk lanjut</template>
          </span>
          <span v-else class="dialog__hint">Pilih jawaban <template v-if="!ui.isTouch">(↑ ↓ / 1-{{ dialog.choices.length }})</template></span>
        </footer>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dialog-layer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  display: flex;
  justify-content: center;
  padding: 0 16px calc(20px + var(--safe-bottom));
  pointer-events: none;
}

.dialog {
  pointer-events: auto;
  display: flex;
  gap: 16px;
  width: min(820px, 100%);
  padding: 16px;
  cursor: pointer;
  animation: rpg-pop 0.18s ease-out;
  border-color: var(--blue-500);
}
.dialog:focus {
  outline: none;
}

.dialog__portrait {
  flex: none;
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  background: radial-gradient(circle at 50% 40%, var(--navy-600), var(--navy-900));
  border: 3px solid var(--orange-500);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.dialog__icon {
  font-size: 40px;
}

.dialog__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialog__header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dialog__name {
  margin: 0;
  font-size: 12px;
  color: var(--orange-400);
  text-transform: uppercase;
}
.dialog__close {
  margin-left: auto;
  width: 34px;
  height: 34px;
  font-size: 16px;
}

.dialog__text {
  min-height: 3.2em;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
}

.dialog__choices {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}
.choice {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  background: var(--navy-800);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
}
.choice:hover,
.choice--active {
  border-color: var(--orange-500);
  background: var(--navy-700);
}
.choice--active::after {
  content: '◀';
  margin-left: auto;
  color: var(--orange-500);
  font-size: 10px;
}
.choice__num {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--navy-950);
  background: var(--orange-500);
  border-radius: 3px;
}

.dialog__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-dim);
  font-size: 13px;
}
.dialog__hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 560px) {
  .dialog-layer {
    padding: 0 8px calc(8px + var(--safe-bottom));
  }
  .dialog {
    gap: 10px;
    padding: 12px;
  }
  .dialog__portrait {
    width: 56px;
    height: 56px;
  }
  .dialog__portrait :deep(.sprite) {
    transform: scale(0.75);
  }
  .dialog__text {
    font-size: 15px;
  }
}
</style>
