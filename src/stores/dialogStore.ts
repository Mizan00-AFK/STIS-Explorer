import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { gameEvents } from '../game/EventBus'
import type { DialogAction, DialogChoice, DialogScript } from '../game/data/types'
import { useCampusStore } from './campusStore'
import { useUiStore } from './uiStore'

/** Identitas pembicara di kotak dialog. */
export interface DialogSpeaker {
  name: string
  role?: string
  /** Baris sprite chibi untuk potret (NPC). */
  spriteRow?: number
  tint?: number
  /** Ikon emoji sebagai pengganti potret (papan info, fasilitas). */
  icon?: string
}

export const useDialogStore = defineStore('dialog', () => {
  const isVisible = ref(false)
  const speaker = ref<DialogSpeaker>({ name: '' })
  const script = shallowRef<DialogScript | null>(null)
  const nodeId = ref('')
  const lineIndex = ref(0)

  const node = computed(() => script.value?.nodes[nodeId.value] ?? null)
  const messages = computed(() => node.value?.lines ?? [])
  const currentLine = computed(() => messages.value[lineIndex.value] ?? '')
  const isLastLine = computed(() => lineIndex.value >= messages.value.length - 1)
  const choices = computed<DialogChoice[]>(() => (isLastLine.value ? (node.value?.choices ?? []) : []))
  /** Kompatibilitas dengan API lama (`npcName`). */
  const npcName = computed(() => speaker.value.name)

  function openScript(who: DialogSpeaker, dialog: DialogScript) {
    speaker.value = who
    script.value = dialog
    nodeId.value = dialog.start
    lineIndex.value = 0
    isVisible.value = true
  }

  /** API lama: tampilkan daftar pesan sederhana tanpa pilihan. */
  function showDialog(name: string, dialogMessages: string[], who: Partial<DialogSpeaker> = {}, dialogChoices?: DialogChoice[]) {
    openScript({ ...who, name }, { start: 'main', nodes: { main: { lines: dialogMessages, choices: dialogChoices } } })
  }

  function next() {
    if (!isLastLine.value) lineIndex.value++
    else if (choices.value.length === 0) hideDialog()
  }

  function previous() {
    if (lineIndex.value > 0) lineIndex.value--
  }

  function choose(choice: DialogChoice) {
    runAction(choice.action)
  }

  function runAction(action: DialogAction) {
    const campus = useCampusStore()
    const ui = useUiStore()
    switch (action.type) {
      case 'goto':
        nodeId.value = action.node
        lineIndex.value = 0
        return
      case 'close':
        hideDialog()
        return
      case 'open-building':
        hideDialog()
        campus.openBuilding(action.buildingId)
        return
      case 'explore-building':
        hideDialog()
        campus.exploreBuilding(action.buildingId, action.level)
        return
      case 'open-panel':
        hideDialog()
        ui.openMenu(action.panel)
        return
      case 'travel':
        hideDialog()
        gameEvents.emit('travel', action.target)
        return
    }
  }

  function hideDialog() {
    isVisible.value = false
  }

  return {
    isVisible,
    speaker,
    script,
    nodeId,
    lineIndex,
    node,
    npcName,
    messages,
    currentLine,
    isLastLine,
    choices,
    openScript,
    showDialog,
    next,
    previous,
    choose,
    runAction,
    hideDialog
  }
})
