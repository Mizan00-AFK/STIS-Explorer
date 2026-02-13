<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  text: string
}>()

const displayedText = ref('')
const done = ref(false)

onMounted(() => {
  let index = 0
  const interval = setInterval(() => {
    displayedText.value += props.text[index]
    index++

    if (index >= props.text.length) {
      clearInterval(interval)
      done.value = true
    }
  }, 30) // kecepatan ketik
})
</script>

<template>
  <div>
    <p>{{ displayedText }}</p>

    <span v-if="done" class="cursor">▶</span>
  </div>
</template>

<style scoped>
.cursor {
  display: inline-block;
  margin-top: 8px;
  animation: blink 1s steps(2, start) infinite;
}

@keyframes blink {
  to {
    visibility: hidden;
  }
}
</style>
