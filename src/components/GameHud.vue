<script setup lang="ts">
// HUD minimal di atas layar: identitas + tombol Cari, Direktori, Mini-map, Menu.
import { useUiStore } from '../stores/uiStore'

const ui = useUiStore()
</script>

<template>
  <header class="hud" aria-label="HUD STIS Campus">
    <div class="hud__brand">
      <img src="/images/favicon-64.png" alt="" width="28" height="28" />
      <div>
        <p class="hud__title pixel">STIS CAMPUS</p>
        <p class="hud__sub">Virtual Campus Explorer</p>
      </div>
    </div>

    <nav class="hud__actions" aria-label="Menu permainan">
      <button
        type="button"
        class="hud-btn"
        aria-label="Cari lokasi kampus"
        title="Cari (/)"
        @click="ui.openMenu('directory', { query: '' })"
      >
        <span aria-hidden="true">🔍</span><span class="hud-btn__label">Cari</span>
      </button>
      <button type="button" class="hud-btn" aria-label="Buka Campus Directory" title="Campus Directory" @click="ui.openMenu('directory')">
        <span aria-hidden="true">🧭</span><span class="hud-btn__label">Direktori</span>
      </button>
      <button
        type="button"
        class="hud-btn"
        :aria-pressed="ui.minimapVisible"
        aria-label="Tampilkan atau sembunyikan mini-map"
        title="Mini-map (M)"
        @click="ui.toggleMinimap()"
      >
        <span aria-hidden="true">🗺️</span><span class="hud-btn__label">Peta</span>
      </button>
      <button type="button" class="hud-btn hud-btn--menu" aria-label="Buka menu" title="Menu (ESC)" @click="ui.openMenu('menu')">
        <span aria-hidden="true">☰</span><span class="hud-btn__label">Menu</span>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--hud-height);
  padding: 8px 14px;
  padding-top: max(8px, env(safe-area-inset-top));
  background: linear-gradient(180deg, rgba(7, 13, 26, 0.88), rgba(7, 13, 26, 0));
  pointer-events: none;
}
.hud > * {
  pointer-events: auto;
}
.hud__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 8px;
  background: rgba(11, 26, 51, 0.8);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.hud__brand img {
  image-rendering: pixelated;
}
.hud__title {
  margin: 0;
  font-size: 10px;
  color: var(--text);
}
.hud__sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--orange-400);
}
.hud__actions {
  display: flex;
  gap: 6px;
}
.hud-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 44px;
  min-height: 40px;
  padding: 6px 10px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text);
  text-transform: uppercase;
  background: rgba(11, 26, 51, 0.85);
  border: 2px solid var(--panel-border);
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--panel-shadow);
}
.hud-btn span[aria-hidden] {
  font-family: var(--font-body);
  font-size: 16px;
}
.hud-btn:hover {
  border-color: var(--orange-500);
}
.hud-btn[aria-pressed='false'] {
  opacity: 0.6;
}
.hud-btn--menu {
  background: var(--blue-500);
}

@media (max-width: 720px) {
  .hud__sub,
  .hud-btn__label {
    display: none;
  }
  .hud-btn {
    justify-content: center;
    padding: 6px;
  }
}
@media (max-width: 380px) {
  .hud__title {
    font-size: 8px;
  }
}
</style>
