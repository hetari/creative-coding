<script setup lang="ts">
import Stats from 'stats.js'
import { onMounted, onUnmounted } from 'vue'

let stats: Stats | null = null
let frameId: number | null = null

onMounted(() => {
  // Prevent initialization if loaded inside an iframe (e.g., as a card preview)
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return
  }

  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.dom.style.position = 'fixed'
  stats.dom.style.top = '10px'
  stats.dom.style.right = '10px'
  stats.dom.style.left = 'auto'
  stats.dom.style.zIndex = '99999'
  document.body.appendChild(stats.dom)

  const tick = () => {
    if (stats) {
      stats.update()
    }
    frameId = requestAnimationFrame(tick)
  }
  tick()
})

onUnmounted(() => {
  if (frameId) {
    cancelAnimationFrame(frameId)
  }
  if (stats && stats.dom && stats.dom.parentNode) {
    stats.dom.parentNode.removeChild(stats.dom)
  }
  stats = null
})
</script>

<template>
  <div />
</template>
