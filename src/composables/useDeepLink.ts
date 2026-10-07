// Deep link ringan berbasis History API (tanpa vue-router):
//   /                                         -> layar pembuka
//   /campus                                   -> peta kampus
//   /building/:buildingId                     -> info gedung
//   /building/:buildingId/floor/:level        -> denah lantai
//   /building/:buildingId/floor/:level/room/:roomId -> detail ruangan
// Gameplay utama tetap di /campus; rute gedung adalah overlay di atas peta.
import { computed, onBeforeUnmount, watch } from 'vue'
import { findFloorByLevel, getBuilding, getFloor, getRoom } from '../game/data/campus'
import { useCampusStore } from '../stores/campusStore'

export type AppRoute =
  | { name: 'intro' }
  | { name: 'campus' }
  | { name: 'building'; buildingId: string; level?: number; roomId?: string }

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function stripBase(pathname: string): string {
  return BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname
}

export function parseRoute(pathname: string): AppRoute {
  const parts = stripBase(pathname)
    .split('/')
    .filter(Boolean)
    .map((p) => decodeURIComponent(p))
  if (parts.length === 0) return { name: 'intro' }
  if (parts[0] === 'campus') return { name: 'campus' }
  if (parts[0] === 'building' && parts[1] && getBuilding(parts[1])) {
    const route: AppRoute = { name: 'building', buildingId: parts[1] }
    if (parts[2] === 'floor' && parts[3] && Number.isFinite(Number(parts[3]))) {
      route.level = Number(parts[3])
      if (parts[4] === 'room' && parts[5] && getRoom(parts[5])) route.roomId = parts[5]
    }
    return route
  }
  return { name: 'campus' }
}

export function buildPath(route: AppRoute): string {
  if (route.name === 'intro') return `${BASE}/`
  if (route.name === 'campus') return `${BASE}/campus`
  let path = `${BASE}/building/${encodeURIComponent(route.buildingId)}`
  if (route.level !== undefined) {
    path += `/floor/${route.level}`
    if (route.roomId) path += `/room/${encodeURIComponent(route.roomId)}`
  }
  return path
}

export function navigateTo(route: AppRoute, replace = false): void {
  const path = buildPath(route)
  if (path === window.location.pathname) return
  if (replace) window.history.replaceState(null, '', path)
  else window.history.pushState(null, '', path)
}

/** Terapkan rute ke state campusStore (dipakai saat load awal & tombol back/forward). */
export function applyRoute(route: AppRoute): void {
  const campus = useCampusStore()
  if (route.name !== 'building') {
    campus.returnToCampus()
    return
  }
  if (route.roomId) campus.focusRoom(route.roomId)
  else if (route.level !== undefined) {
    const floor = findFloorByLevel(route.buildingId, route.level)
    if (floor) campus.openFloor(floor.id)
    else campus.exploreBuilding(route.buildingId)
  } else campus.openBuilding(route.buildingId)
}

/** Sinkronkan state gedung/lantai/ruangan <-> URL selama berada di GameView. */
export function useDeepLinkSync(): void {
  const campus = useCampusStore()
  let applyingFromHistory = false

  const routeFromState = computed<AppRoute>(() => {
    const buildingId = campus.selectedBuildingId
    if (buildingId && campus.isFloorPlanOpen) {
      const floor = getFloor(campus.currentFloorId)
      return {
        name: 'building',
        buildingId,
        level: floor?.level,
        roomId: campus.isRoomModalOpen ? (campus.selectedRoomId ?? undefined) : undefined
      }
    }
    if (buildingId && campus.isBuildingModalOpen) return { name: 'building', buildingId }
    return { name: 'campus' }
  })

  watch(routeFromState, (route) => {
    if (applyingFromHistory) return
    navigateTo(route)
  })

  const onPopState = () => {
    const route = parseRoute(window.location.pathname)
    if (route.name === 'intro') return // ditangani App.vue (kembali ke layar pembuka)
    applyingFromHistory = true
    applyRoute(route)
    // Lepas flag setelah watcher sempat berjalan.
    queueMicrotask(() => {
      applyingFromHistory = false
    })
  }
  window.addEventListener('popstate', onPopState)
  onBeforeUnmount(() => window.removeEventListener('popstate', onPopState))
}
