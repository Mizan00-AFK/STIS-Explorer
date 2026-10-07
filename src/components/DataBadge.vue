<script setup lang="ts">
import { computed } from 'vue'
import type { DataStatus } from '../game/data/types'

const props = defineProps<{ status: DataStatus }>()

const INFO: Record<DataStatus, { label: string; title: string }> = {
  public: { label: 'Info Publik', title: 'Berdasarkan sumber publik; perlu verifikasi pihak kampus.' },
  osm: { label: 'OpenStreetMap', title: 'Posisi/bentuk berdasarkan data OpenStreetMap.' },
  demo: { label: 'Data Demo', title: 'Data contoh — bukan informasi resmi STIS.' }
}

const info = computed(() => INFO[props.status])
</script>

<template>
  <span class="badge" :class="`badge--${status}`" :title="info.title">
    <span aria-hidden="true">{{ status === 'demo' ? '⚠' : 'ⓘ' }}</span>{{ info.label }}
  </span>
</template>
