<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  npcName: string
  messages: string[]
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  next: []
}>()

const currentIndex = ref(0)

const currentMessage = computed(() => {
  return props.messages[currentIndex.value] || ''
})

const isLastMessage = computed(() => {
  return currentIndex.value >= props.messages.length - 1
})

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
  console.log('DialogBox: visible changed to', newVal)
  console.log('DialogBox: npcName', props.npcName)
  console.log('DialogBox: messages', props.messages)
  if (newVal) {
    currentIndex.value = 0
  }
})

function handleNext() {
  if (isLastMessage.value) {
    currentIndex.value = 0
    emit('close')
  } else {
    currentIndex.value++
    emit('next')
  }
}

function handleClose() {
  currentIndex.value = 0
  emit('close')
}

// Reset index when dialog opens
function resetDialog() {
  currentIndex.value = 0
}

defineExpose({
  resetDialog
})
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="dialog-overlay" @click="handleClose">
      <div class="dialog-box" @click.stop>
        <div class="dialog-header">
          <h3>{{ npcName }}</h3>
          <button class="close-btn" @click="handleClose">×</button>
        </div>
        <div class="dialog-content">
          <p>{{ currentMessage }}</p>
        </div>
        <div class="dialog-footer">
          <span class="dialog-hint">{{ currentIndex + 1 }} / {{ messages.length }}</span>
          <button class="next-btn" @click="handleNext">
            {{ isLastMessage ? 'Tutup' : 'Lanjut' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-box {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 3px solid #64748b;
  border-radius: 12px;
  padding: 0;
  min-width: 400px;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  font-family: 'Courier New', monospace;
}

.dialog-header {
  background: #0f172a;
  border-bottom: 2px solid #64748b;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 9px 9px 0 0;
}

.dialog-header h3 {
  margin: 0;
  color: #fbbf24;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f87171;
}

.dialog-content {
  padding: 24px;
  min-height: 100px;
}

.dialog-content p {
  margin: 0;
  color: #e2e8f0;
  font-size: 16px;
  line-height: 1.6;
}

.dialog-footer {
  background: #0f172a;
  border-top: 2px solid #64748b;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 9px 9px;
}

.dialog-hint {
  color: #94a3b8;
  font-size: 12px;
}

.next-btn {
  background: #3b82f6;
  border: 2px solid #2563eb;
  color: white;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  transition: all 0.2s;
}

.next-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
