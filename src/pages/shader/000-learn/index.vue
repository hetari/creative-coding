<script setup lang="ts">
import type p5Type from 'p5'
import { tryOnMounted } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import LilGui from '@/components/LilGui.vue'
import ResourcesList from '@/components/ResourcesList.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import { useP5 } from '@/composables/useP5'
import Default from '@/layouts/default.vue'

import fragmentShader from './shader.frag?raw'
import vertexShader from './shader.vert?raw'

const containerRef = useTemplateRef<HTMLElement>('container')
const { mountSketch } = useP5(containerRef)
let myShader: p5Type.Shader

// Hex → normalized RGB (0–1)
function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    Number.parseInt(h.slice(0, 2), 16) / 255,
    Number.parseInt(h.slice(2, 4), 16) / 255,
    Number.parseInt(h.slice(4, 6), 16) / 255,
  ]
}

// Reactive state exposed to LilGui
const speed = ref(1.0)
const glow = ref(0.25)

// Palette colors as hex strings — LilGui renders color pickers
const paletteA = ref('#803333') // ~(0.5, 0.2, 0.2)
const paletteB = ref('#804D4D') // ~(0.5, 0.3, 0.3)
const paletteD = ref('#001A33') // ~(0.0, 0.1, 0.2)

// Compute normalized vec3 arrays from the hex refs
const paletteAVec = computed(() => hexToVec3(paletteA.value))
const paletteBVec = computed(() => hexToVec3(paletteB.value))
const paletteDVec = computed(() => hexToVec3(paletteD.value))

// LilGui controls
const guiControls = [
  { label: 'Speed', ref: speed, min: 0.1, max: 5.0, step: 0.1 },
  { label: 'Glow', ref: glow, min: 0.01, max: 1.0, step: 0.01 },
  { label: 'Palette A', ref: paletteA, type: 'color' as const },
  { label: 'Palette B', ref: paletteB, type: 'color' as const },
  { label: 'Palette D', ref: paletteD, type: 'color' as const },
]

tryOnMounted(() => {
  mountSketch((p) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
      p.colorMode(p.HSB, 360, 100, 100, 100)

      myShader = p.createShader(vertexShader, fragmentShader)
      p.pixelDensity(1)
    }

    p.draw = () => {
      p.background(100)
      p.shader(myShader)

      // Core uniforms
      myShader.setUniform('uTime', p.millis() / 2000.0)
      myShader.setUniform('uResolution', [p.width, p.height])
      myShader.setUniform('PI', Math.PI)

      // GUI-controlled uniforms
      myShader.setUniform('uSpeed', speed.value)
      myShader.setUniform('uGlow', glow.value)
      myShader.setUniform('uPaletteA', paletteAVec.value)
      myShader.setUniform('uPaletteB', paletteBVec.value)
      myShader.setUniform('uPaletteD', paletteDVec.value)

      p.rect(-p.width / 2, -p.height / 2, p.width, p.height)
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  })
})
</script>

<template>
  <Default>
    <div ref="container" class="fixed inset-0 size-full overflow-hidden [&>canvas]:block" />

    <StatsPanel />
    <LilGui :controls="guiControls" />
    <ResourcesList
      :resources="[
        'https://www.youtube.com/watch?v=q1xzpZu1KTc',
        'https://www.youtube.com/watch?v=345Okku4qBA',
        'https://www.youtube.com/watch?v=n7No2HiUUGc',
        'https://www.youtube.com/watch?v=zSmNeJEom7s',
      ]"
    />
  </Default>
</template>

<route lang="json">
  { "meta": { "previewMode": "image" } }
</route>
