<script setup lang="ts">
import Stats from 'stats.js'
import { onMounted, onUnmounted } from 'vue'

const statsInstances: Stats[] = []
let frameId: number | null = null

onMounted(() => {
  if (typeof window !== 'undefined' && window.self !== window.top)
    return

  const panels = [
    { panel: 0, top: '10px', right: '10px' }, // FPS
    { panel: 1, top: '10px', right: '92.5px' }, // MS
    { panel: 2, top: '10px', right: '175px' }, // MB
  ]

  panels.forEach(({ panel, top, right }) => {
    const stats = new Stats()

    stats.showPanel(panel)

    Object.assign(stats.dom.style, {
      position: 'fixed',
      top,
      right,
      left: 'auto',
      zIndex: '99999',
      pointerEvents: 'none',
    })

    document.body.appendChild(stats.dom)
    statsInstances.push(stats)
  })

  const tick = () => {
    for (const stats of statsInstances)
      stats.update()

    frameId = requestAnimationFrame(tick)
  }

  tick()
})

onUnmounted(() => {
  if (frameId)
    cancelAnimationFrame(frameId)

  for (const stats of statsInstances) {
    stats.dom.remove()
  }

  statsInstances.length = 0
})
</script>

<template>
  <div />
</template>
