import { useCampusStore } from './campusStore'
import { useDialogStore } from './dialogStore'
import { useUiStore } from './uiStore'

/**
 * True bila ada overlay Vue yang terbuka (dialog, modal gedung, denah, panel, loading).
 * Phaser memantau nilai ini (lewat `watch`, bukan setiap frame) untuk mengunci gerak pemain
 * dan melepas tangkapan keyboard agar input teks Vue (mis. pencarian) bisa diketik.
 */
export function isInputLocked(): boolean {
  const ui = useUiStore()
  const campus = useCampusStore()
  const dialog = useDialogStore()
  return ui.gameStatus !== 'ready' || ui.activeMenu !== null || dialog.isVisible || campus.isAnyOpen
}
