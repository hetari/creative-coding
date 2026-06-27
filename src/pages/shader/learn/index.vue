<script setup lang="ts">
import type p5Type from 'p5'
import { tryOnMounted } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { useP5 } from '@/composables/useP5'
import Default from '@/layouts/default.vue'

import fragmentShader from './shader.frag?raw'
import vertexShader from './shader.vert?raw'

const containerRef = useTemplateRef<HTMLElement>('container')
const { mountSketch } = useP5(containerRef)
let myShader: p5Type.Shader

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
      myShader.setUniform('uTime', p.millis() / 2000.0)
      myShader.setUniform('uResolution', [p.width, p.height])
      p.rect(-p.width / 2, -p.height / 2, p.width, p.height)
      // p.ellipse(0, 0, p.width, p.height, 100)
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  })
})
</script>

<template>
  <Default>
    <!-- https://www.youtube.com/watch?v=q1xzpZu1KTc, https://www.youtube.com/watch?v=345Okku4qBA -->
    <div ref="container" class="fixed inset-0 size-full overflow-hidden [&>canvas]:block" />
  </Default>
</template>

<route lang="json">
  { "meta": { "previewMode": "image" } }
</route>
