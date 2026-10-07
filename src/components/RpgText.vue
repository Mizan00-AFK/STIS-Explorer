<script setup lang="ts">
// Teks bergaya mesin ketik RPG. Mengetik ulang setiap kali `text` berubah,
// bisa dipercepat (skip), dan menghormati prefers-reduced-motion.
// Pembaca layar menerima teks lengkap sekaligus (aria-live), bukan per huruf.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    /** Milidetik per karakter. */
    speed?: number
    showCursor?: boolean
  }>(),
  { speed: 22, showCursor: true }
)

const emit = defineEmits<{ done: [] }>()

const displayedText = ref('')
const done = ref(false)
let timer: number | undefined

const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function stop() {
  if (timer !== undefined) window.clearInterval(timer)
  timer = undefined
}

function finish() {
  stop()
  displayedText.value = props.text
  if (!done.value) {
    done.value = true
    emit('done')
  }
}

function start() {
  stop()
  done.value = false
  displayedText.value = ''
  const chars = Array.from(props.text)
  if (reducedMotion || props.speed <= 0 || chars.length === 0) {
    finish()
    return
  }
  let index = 0
  timer = window.setInterval(() => {
    index++
    displayedText.value = chars.slice(0, index).join('')
    if (index >= chars.length) finish()
  }, props.speed)
}

/** Tampilkan seluruh teks seketika. Mengembalikan true bila sebelumnya masih mengetik. */
function skip(): boolean {
  if (done.value) return false
  finish()
  return true
}

watch(() => props.text, start)
onMounted(start)
onBeforeUnmount(stop)

defineExpose({ skip, isDone: () => done.value })
</script>

<template>
  <div class="rpg-text">
    <p aria-hidden="true">
      {{ displayedText }}<span v-if="showCursor && done" class="cursor">▶</span>
    </p>
    <p class="sr-only" aria-live="polite">{{ text }}</p>
  </div>
</template>

<style scoped>
.rpg-text p {
  margin: 0;
  white-space: pre-line;
}
.cursor {
  display: inline-block;
  margin-left: 6px;
  font-size: 0.75em;
  color: var(--orange-500);
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  to {
    visibility: hidden;
  }
}
</style>
