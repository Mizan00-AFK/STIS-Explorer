<script setup lang="ts">
// Alur aplikasi: Layar Pembuka (/) -> ENTER CAMPUS -> GameView (/campus).
// Deep link /building/... langsung membuka game lalu panel gedung terkait.
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { navigateTo, parseRoute, type AppRoute } from './composables/useDeepLink'
import { useUiStore } from './stores/uiStore'
import GameView from './views/GameView.vue'
import IntroScreen from './views/IntroScreen.vue'

const ui = useUiStore()

const firstRoute = parseRoute(window.location.pathname)
const initialRoute = shallowRef<AppRoute | null>(firstRoute.name === 'intro' ? null : firstRoute)
if (firstRoute.name !== 'intro') ui.startGame()

function enterCampus() {
  initialRoute.value = null
  ui.startGame()
  navigateTo({ name: 'campus' })
}

function exitToTitle() {
  ui.returnToTitle()
  navigateTo({ name: 'intro' })
}

function onPopState() {
  const route = parseRoute(window.location.pathname)
  if (route.name === 'intro' && ui.screen === 'game') ui.returnToTitle()
  else if (route.name !== 'intro' && ui.screen === 'intro') {
    initialRoute.value = route
    ui.startGame()
  }
}

onMounted(() => window.addEventListener('popstate', onPopState))
onBeforeUnmount(() => window.removeEventListener('popstate', onPopState))
</script>

<template>
  <IntroScreen v-if="ui.screen === 'intro'" @enter="enterCampus" />
  <GameView v-else :initial-route="initialRoute" @exit="exitToTitle" />
</template>
