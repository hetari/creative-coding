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
  optimizeDeps: { include: [
    'lil-gui',
    'stats.js',
  ] },
})
