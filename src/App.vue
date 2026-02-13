<script setup lang="ts">
import { onMounted } from 'vue'
import './game/Game' // PENTING: import saja, jangan destructuring

onMounted(() => {
  console.log('Game mounted')
})
</script>

<template>
  <div id="game"></div>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#game {
  width: 100%;
  height: 100%;
  background: black;
}
</style>
