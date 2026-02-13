import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', () => {
  const isVisible = ref(false)
  const npcName = ref('')
  const messages = ref<string[]>([])

  function showDialog(name: string, dialogMessages: string[]) {
    npcName.value = name
    messages.value = dialogMessages
    isVisible.value = true
  }

  function hideDialog() {
    isVisible.value = false
  }

  return {
    isVisible,
    npcName,
    messages,
    showDialog,
    hideDialog
  }
})
