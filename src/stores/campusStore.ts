import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { findFloorByLevel, floorsOf, getBuilding, getFacility, getFloor, getRoom, roomsOf } from '../game/data/campus'

/** Objek di dekat pemain yang bisa diinteraksikan (ditulis Phaser hanya saat berubah). */
export interface NearbyTarget {
  kind: 'npc' | 'building' | 'facility' | 'info'
  id: string
  label: string
  icon: string
  actionLabel: string
}

export const useCampusStore = defineStore('campus', () => {
  const nearby = ref<NearbyTarget | null>(null)

  const selectedBuildingId = ref<string | null>(null)
  const currentFloorId = ref<string | null>(null)
  const selectedRoomId = ref<string | null>(null)
  const highlightedRoomId = ref<string | null>(null)
  const selectedFacilityId = ref<string | null>(null)

  const isBuildingModalOpen = ref(false)
  const isFloorPlanOpen = ref(false)
  const isRoomModalOpen = ref(false)

  // Alias sesuai istilah spesifikasi.
  const currentBuilding = computed(() => getBuilding(selectedBuildingId.value))
  const selectedBuilding = currentBuilding
  const currentFloor = computed(() => getFloor(currentFloorId.value))
  const selectedRoom = computed(() => getRoom(selectedRoomId.value))
  const selectedFacility = computed(() => getFacility(selectedFacilityId.value))
  const buildingFloors = computed(() => (selectedBuildingId.value ? floorsOf(selectedBuildingId.value) : []))
  const floorRooms = computed(() => (currentFloorId.value ? roomsOf(currentFloorId.value) : []))
  const isAnyOpen = computed(() => isBuildingModalOpen.value || isFloorPlanOpen.value || isRoomModalOpen.value)

  function setNearby(target: NearbyTarget | null) {
    const current = nearby.value
    if (current?.kind === target?.kind && current?.id === target?.id) return
    nearby.value = target
  }

  /** Buka panel informasi gedung. */
  function openBuilding(buildingId: string): boolean {
    if (!getBuilding(buildingId)) return false
    selectedBuildingId.value = buildingId
    isBuildingModalOpen.value = true
    isFloorPlanOpen.value = false
    isRoomModalOpen.value = false
    return true
  }

  /** Masuk ke gedung: tampilkan pemilih lantai + denah (default lantai terendah). */
  function exploreBuilding(buildingId?: string, level?: number): boolean {
    const id = buildingId ?? selectedBuildingId.value
    if (!id || !getBuilding(id)) return false
    const floor = (level !== undefined ? findFloorByLevel(id, level) : undefined) ?? floorsOf(id)[0]
    selectedBuildingId.value = id
    currentFloorId.value = floor?.id ?? null
    selectedRoomId.value = null
    highlightedRoomId.value = null
    isBuildingModalOpen.value = false
    isRoomModalOpen.value = false
    isFloorPlanOpen.value = true
    return true
  }

  function openFloor(floorId: string): boolean {
    const floor = getFloor(floorId)
    if (!floor) return false
    if (!isFloorPlanOpen.value || floor.buildingId !== selectedBuildingId.value) exploreBuilding(floor.buildingId, floor.level)
    currentFloorId.value = floor.id
    selectedRoomId.value = null
    highlightedRoomId.value = null
    isRoomModalOpen.value = false
    return true
  }

  function openRoom(roomId: string): boolean {
    const room = getRoom(roomId)
    if (!room) return false
    if (!isFloorPlanOpen.value || currentFloorId.value !== room.floorId) {
      const floor = getFloor(room.floorId)
      exploreBuilding(room.buildingId, floor?.level)
    }
    selectedRoomId.value = room.id
    isRoomModalOpen.value = true
    return true
  }

  /** Dari hasil pencarian: buka gedung -> lantai -> sorot & buka ruangan. */
  function focusRoom(roomId: string): boolean {
    if (!openRoom(roomId)) return false
    highlightedRoomId.value = roomId
    return true
  }

  function closeRoom() {
    isRoomModalOpen.value = false
    selectedRoomId.value = null
  }

  /** Tutup lapisan teratas (dipakai tombol ESC). */
  function closeModal() {
    if (isRoomModalOpen.value) closeRoom()
    else if (isFloorPlanOpen.value) returnToCampus()
    else if (isBuildingModalOpen.value) isBuildingModalOpen.value = false
  }

  /** Tutup semua panel gedung dan kembali ke peta kampus. */
  function returnToCampus() {
    isBuildingModalOpen.value = false
    isFloorPlanOpen.value = false
    isRoomModalOpen.value = false
    selectedRoomId.value = null
    highlightedRoomId.value = null
  }

  function selectFacility(facilityId: string | null) {
    selectedFacilityId.value = facilityId
  }

  return {
    nearby,
    selectedBuildingId,
    currentFloorId,
    selectedRoomId,
    highlightedRoomId,
    selectedFacilityId,
    isBuildingModalOpen,
    isFloorPlanOpen,
    isRoomModalOpen,
    currentBuilding,
    selectedBuilding,
    currentFloor,
    selectedRoom,
    selectedFacility,
    buildingFloors,
    floorRooms,
    isAnyOpen,
    setNearby,
    openBuilding,
    exploreBuilding,
    openFloor,
    openRoom,
    focusRoom,
    closeRoom,
    closeModal,
    returnToCampus,
    selectFacility
  }
})
