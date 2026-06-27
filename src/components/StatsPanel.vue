<script setup lang="ts">
import Stats from 'stats.js'
import { onMounted, onUnmounted } from 'vue'
import { useIsPreview } from '@/composables/useIsPreview'

const isPreview = useIsPreview()

const statsInstances: Stats[] = []
let frameId: number | null = null

onMounted(() => {
  if (isPreview.value)
    return

  const panels = [
    { panel: 0, top: '10px', left: '10px' }, // FPS
    { panel: 1, top: '10px', left: '92.5px' }, // MS
    { panel: 2, top: '10px', left: '175px' }, // MB
  ]

  panels.forEach(({ panel, top, left }) => {
    const stats = new Stats()

    stats.showPanel(panel)

    Object.assign(stats.dom.style, {
      position: 'fixed',
      top,
      left,
      right: 'auto',
      zIndex: '99999',
      pointerEvents: 'none',
    })

    document.body.appendChild(stats.dom)
    statsInstances.push(stats)
  })

  const tick = () => {
    for (const stats of statsInstances) {
      const canvas = stats.dom.querySelector('canvas')

      if (canvas && canvas.width && canvas.height) {
        stats.update()
      }
    }

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
