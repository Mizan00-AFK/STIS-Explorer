// State bersama yang SENGAJA tidak reaktif.
// Data per-frame (posisi pemain, input joystick) tidak boleh disimpan di Pinia agar
// Vue tidak re-render setiap frame. Komponen membacanya lewat requestAnimationFrame.

/** Input analog dari joystick virtual (mobile). Nilai -1..1. */
export const virtualInput = {
  x: 0,
  y: 0,
  run: false
}

/** Posisi pemain & area pandang kamera (koordinat dunia, px). Ditulis Phaser tiap frame. */
export const playerTracker = {
  x: 0,
  y: 0,
  viewX: 0,
  viewY: 0,
  viewWidth: 0,
  viewHeight: 0
}
