import { getFacility } from '../game/data/campus'
import { gameEvents } from '../game/EventBus'
import { useCampusStore } from '../stores/campusStore'
import { useUiStore } from '../stores/uiStore'

/** Navigasi lintas panel: ke gedung/fasilitas di peta, atau ke ruangan/lantai di denah. */
export function useCampusNavigation() {
  const ui = useUiStore()
  const campus = useCampusStore()

  /** Apakah fasilitas punya titik di peta (objek Tiled / gedung). */
  function isFacilityOnMap(id: string): boolean {
    return ui.minimap?.markers.some((m) => m.target.kind === 'facility' && m.target.id === id) ?? false
  }

  function travelToBuilding(id: string) {
    ui.closeMenu()
    gameEvents.emit('travel', { kind: 'building', id })
  }

  /**
   * Fasilitas di dalam ruangan -> sorot ruangan di denah; di lantai tertentu -> buka denah lantai;
   * punya lokasi di peta -> fast travel; selain itu -> tampilkan di panel Fasilitas.
   */
  function goToFacility(id: string) {
    const facility = getFacility(id)
    if (!facility) return
    if (facility.roomId) {
      ui.closeMenu()
      campus.focusRoom(facility.roomId)
    } else if (facility.floorId) {
      ui.closeMenu()
      campus.openFloor(facility.floorId)
    } else if (isFacilityOnMap(id) || facility.buildingId) {
      ui.closeMenu()
      gameEvents.emit('travel', { kind: 'facility', id })
    } else {
      ui.openMenu('facilities', { facilityId: id })
      ui.toast('Lokasi fasilitas ini belum dipetakan.', 'warning')
    }
  }

  function canNavigateToFacility(id: string): boolean {
    const facility = getFacility(id)
    return Boolean(facility && (facility.roomId || facility.floorId || facility.buildingId || isFacilityOnMap(id)))
  }

  function focusRoom(roomId: string) {
    ui.closeMenu()
    campus.focusRoom(roomId)
  }

  return { travelToBuilding, goToFacility, canNavigateToFacility, focusRoom, isFacilityOnMap }
}
