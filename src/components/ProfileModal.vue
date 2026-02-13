<script setup lang="ts">
import { useUiStore } from '../stores/uiStore'
import RpgText from './RpgText.vue'
const ui = useUiStore()
</script>

<template>
  <div class="backdrop">
    <div class="rpg-box">
      <h2>PROFILE</h2>

      <RpgText
        text="Selamat datang di Kampus STIS.
Ini adalah area profil.
Berisi cerita, data diri,
dan perjalanan akademik."
      />

      <button @click="ui.closeMenu()">CLOSE</button>
    </div>
  </div>
</template>


<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Kotak RPG */
.rpg-box {
  background: #f4f1de;
  color: #1b1b1b;
  border: 4px solid #000;
  box-shadow: 6px 6px 0 #000;
  padding: 20px;
  width: 360px;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  line-height: 1.8;
}

/* Judul */
.rpg-box h2 {
  margin-bottom: 12px;
  text-align: center;
}

/* Tombol RPG */
.rpg-box button {
  margin-top: 16px;
  width: 100%;
  padding: 10px;
  background: #3a86ff;
  color: white;
  border: 3px solid #000;
  font-family: inherit;
  cursor: pointer;
}

.rpg-box button:hover {
  background: #264bcc;
}
</style>
