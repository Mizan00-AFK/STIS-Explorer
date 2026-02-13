<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { createGame } from '../game/main'
import DialogBox from '../components/DialogBox.vue'
import type Phaser from 'phaser'

const gameContainer = ref<HTMLDivElement | null>(null)
const showDialog = ref(false)
const dialogNpcName = ref('')
const dialogMessages = ref<string[]>([])
let gameInstance: Phaser.Game | null = null

// Global callback untuk dipanggil dari Phaser
;(window as any).showGameDialog = (data: { name: string, messages: string[] }) => {
  console.log('Vue: showGameDialog called!', data)
  dialogNpcName.value = data.name
  dialogMessages.value = data.messages
  showDialog.value = true
  console.log('Vue: showDialog set to', showDialog.value)
}

onMounted(() => {
  console.log('Vue: Component mounted')
  if (gameContainer.value) {
    gameInstance = createGame(gameContainer.value)
    console.log('Vue: Game created')
  }
})

onUnmounted(() => {
  // Cleanup
  ;(window as any).showGameDialog = null
})

function closeDialog() {
  console.log('Vue: Closing dialog')
  showDialog.value = false
}
</script>

<template>
  <div class="game-wrapper">
    <div ref="gameContainer" class="game-container"></div>
    <DialogBox 
      :visible="showDialog"
      :npc-name="dialogNpcName"
      :messages="dialogMessages"
      @close="closeDialog"
    />
  </div>
</template>

<style scoped>
.game-wrapper {
  position: fixed;
  inset: 0;
  background: #000;
}

.game-container {
  width: 100%;
  height: 100%;
}
</style>
