<script setup lang="ts">
// View utama permainan. Membuat game Phaser (lazy-load agar layar pembuka cepat tampil),
// menampilkan overlay Vue (HUD, dialog, modal gedung, denah, direktori), loading & error,
// serta menyinkronkan deep link.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type Phaser from 'phaser'
import BuildingExplorer from '../components/BuildingExplorer.vue'
import BuildingModal from '../components/BuildingModal.vue'
import CampusDirectory from '../components/CampusDirectory.vue'
import DialogBox from '../components/DialogBox.vue'
import ErrorState from '../components/ErrorState.vue'
import GameHud from '../components/GameHud.vue'
import GameMenu from '../components/GameMenu.vue'
import InteractionPrompt from '../components/InteractionPrompt.vue'
import LoadingScreen from '../components/LoadingScreen.vue'
import MiniMap from '../components/MiniMap.vue'
import MobileControls from '../components/MobileControls.vue'
import ProfileModal from '../components/ProfileModal.vue'
import ProjectModal from '../components/ProjectModal.vue'
import SkillModal from '../components/SkillModal.vue'
import ToastStack from '../components/ToastStack.vue'
import { applyRoute, useDeepLinkSync, type AppRoute } from '../composables/useDeepLink'
import { validateCampusData } from '../game/data/campus'
import { useCampusStore } from '../stores/campusStore'
import { useDialogStore } from '../stores/dialogStore'
import { isInputLocked } from '../stores/inputLock'
import { useUiStore } from '../stores/uiStore'

const props = defineProps<{ initialRoute: AppRoute | null }>()
const emit = defineEmits<{ exit: [] }>()

const ui = useUiStore()
const campus = useCampusStore()
const dialog = useDialogStore()

const container = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null
/** True bila chunk mesin game gagal di-import (browser menyimpan kegagalan modul ES). */
let engineImportFailed = false
let pendingRoute: AppRoute | null = props.initialRoute

const ready = computed(() => ui.gameStatus === 'ready')
const locked = computed(isInputLocked)

useDeepLinkSync()

/** Tunggu font pixel agar label Phaser tidak dirender dengan font cadangan. */
async function waitForFonts(timeoutMs = 2500) {
  if (!('fonts' in document)) return
  await Promise.race([
    document.fonts.load('8px "Press Start 2P"').catch(() => undefined),
    new Promise((resolve) => window.setTimeout(resolve, timeoutMs))
  ])
}

async function startGame() {
  ui.setLoading(0, 'Memeriksa data kampus...')

  const problems = validateCampusData()
  if (problems.length > 0) {
    console.error('[STISMAP] Data kampus tidak valid:', problems)
    ui.setGameError('Data kampus tidak valid. Periksa file di src/game/data/.', problems)
    return
  }

  ui.setLoading(0.02, 'Memuat mesin game...')
  try {
    const [{ createGame }] = await Promise.all([import('../game/main'), waitForFonts()])
    if (!container.value) return
    game = createGame(container.value)
  } catch (error) {
    engineImportFailed = true
    console.error('[STISMAP] Gagal memulai game:', error)
    ui.setGameError('Unable to load campus map. Mesin game gagal dimuat — periksa koneksi lalu coba lagi.', [String(error)])
  }
}

function destroyGame() {
  game?.destroy(true)
  game = null
}

function resetOverlays() {
  dialog.hideDialog()
  campus.returnToCampus()
  campus.setNearby(null)
  ui.closeMenu()
}

function retry() {
  // Import modul yang gagal tidak bisa diulang di sesi yang sama -> muat ulang halaman.
  if (engineImportFailed) {
    window.location.reload()
    return
  }
  destroyGame()
  resetOverlays()
  void startGame()
}

// Setelah game siap: terapkan deep link awal (mis. /building/gedung-2/floor/4) & sapa pemain.
watch(ready, (isReady) => {
  if (!isReady) return
  if (pendingRoute) {
    applyRoute(pendingRoute)
    pendingRoute = null
  }
  ui.toast('👋 Selamat datang! Sapa Pemandu Kampus atau dekati gedung untuk mulai.', 'info', 4500)
})

// Kembalikan fokus ke area game saat semua overlay tertutup (agar keyboard langsung bisa dipakai).
watch(locked, (isLocked) => {
  if (!isLocked && ready.value && (document.activeElement === document.body || !document.activeElement)) {
    container.value?.focus({ preventScroll: true })
  }
})

/** ESC cadangan bila fokus berada di luar overlay. */
function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || !locked.value || !ready.value) return
  if (dialog.isVisible) dialog.hideDialog()
  else if (ui.activeMenu) ui.closeMenu()
  else if (campus.isAnyOpen) campus.closeModal()
  else return
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  void startGame()
  // Handle debug hanya saat `npm run dev` (memudahkan pengujian di console browser).
  if (import.meta.env.DEV) {
    ;(window as unknown as Record<string, unknown>).__stismap = { getGame: () => game, ui, campus, dialog }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  destroyGame()
  resetOverlays()
})
</script>

<template>
  <div class="game-wrapper">
    <div
      id="game-root"
      ref="container"
      class="game-container"
      tabindex="-1"
      role="application"
      aria-label="Peta kampus STIS. Gunakan WASD atau tombol panah untuk berjalan, E untuk berinteraksi."
    />

    <template v-if="ready">
      <GameHud />
      <MiniMap v-if="ui.minimapVisible" />
      <InteractionPrompt v-if="!locked" />
      <MobileControls v-if="ui.isTouch && !locked" />
    </template>
    <ToastStack />

    <DialogBox v-if="dialog.isVisible" />
    <BuildingModal v-if="campus.isBuildingModalOpen" />
    <BuildingExplorer v-if="campus.isFloorPlanOpen" />

    <CampusDirectory v-if="ui.activeMenu === 'directory'" />
    <ProfileModal v-else-if="ui.activeMenu === 'about'" />
    <ProjectModal v-else-if="ui.activeMenu === 'facilities'" />
    <SkillModal v-else-if="ui.activeMenu === 'guide'" />
    <GameMenu v-else-if="ui.activeMenu === 'menu'" @exit="emit('exit')" />

    <Transition name="fade">
      <LoadingScreen v-if="ui.gameStatus === 'loading' || ui.gameStatus === 'idle'" />
    </Transition>
    <ErrorState v-if="ui.gameStatus === 'error'" @retry="retry" @exit="emit('exit')" />
  </div>
</template>

<style scoped>
.game-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--navy-950);
}

.game-container {
  width: 100%;
  height: 100%;
  touch-action: none;
}
.game-container:focus {
  outline: none;
}
.game-container :deep(canvas) {
  display: block;
}
</style>
