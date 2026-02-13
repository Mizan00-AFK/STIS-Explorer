<script setup lang="ts">
import { useUiStore } from '../stores/uiStore'
const ui = useUiStore()
</script>

<template>
  <div class="backdrop">
    <div class="rpg-box">
      <h2>PROJECT</h2>

      <p>
        📁 Sistem Informasi  
        <br />
        📊 Analisis Data  
        <br />
        🎮 Web RPG Portfolio
      </p>

      <button @click="ui.closeMenu()">CLOSE</button>
    </div>
  </div>
</template>

<style scoped>
@import './rpg-style.css';
</style>
