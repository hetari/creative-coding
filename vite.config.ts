import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
  // base: "/yuri-stream/",
  plugins: [
    VueRouter(),
    vue(templateCompilerOptions),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: { include: [
    'lil-gui',
    'stats.js',
  ] },
})
