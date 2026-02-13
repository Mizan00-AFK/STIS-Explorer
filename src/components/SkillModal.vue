<script setup lang="ts">
import { useUiStore } from '../stores/uiStore'
const ui = useUiStore()
</script>

<template>
  <div class="backdrop">
    <div class="rpg-box">
      <h2>SKILL</h2>

      <ul>
        <li>📊 Statistik</li>
        <li>💻 Programming</li>
        <li>🗄 Database</li>
        <li>📈 Data Analysis</li>
      </ul>

      <button @click="ui.closeMenu()">CLOSE</button>
    </div>
  </div>
</template>

<style scoped>
@import './rpg-style.css';
</style>
