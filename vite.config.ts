import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Phaser (~1,2 MB) memang besar dan sudah dipisah ke chunk tersendiri yang
    // di-lazy-load setelah tombol ENTER CAMPUS, jadi batas peringatan dinaikkan.
    chunkSizeWarningLimit: 1400
  }
})
