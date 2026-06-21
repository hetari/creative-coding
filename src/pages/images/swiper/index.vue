<script setup lang="ts">
import { tryOnMounted, useEventListener, useTemplateRefsList, useWindowSize } from '@vueuse/core'
import gsap from 'gsap'
import { Assets, Filter, GlProgram, Sprite, UniformGroup } from 'pixi.js'
import { ref, useTemplateRef, watch } from 'vue'
import LilGui from '@/components/LilGui.vue'
import ResourcesList from '@/components/ResourcesList.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import { usePixiApp } from '@/composables/usePixiApp'
import Default from '@/layouts/default.vue'
// Import GLSL shader code as raw text using Vite's "?raw" suffix https://vite.dev/guide/assets#importing-asset-as-string
import swiperFrag from './swiper.frag?raw'
import swiperVert from './swiper.vert?raw'

const pixiRef = useTemplateRef<HTMLDivElement>('pixiRef')
const secRefs = useTemplateRefsList<HTMLElement>()
const duration = ref(0.5)
const guiControls = [
  { label: 'Transition Duration', ref: duration, min: 0.1, max: 5.0, step: 0.1 },
]

const { height: windowHeight, width: windowWidth } = useWindowSize()

const { app, mountApp } = usePixiApp(pixiRef)
let sprite: Sprite | null = null
let customFilter: Filter | null = null
let imageAspect = 1.0

function updatePixiJSLayout() {
  if (!app.value || !sprite || !customFilter)
    return

  // get the current screen width and height
  const width = windowWidth.value
  const height = windowHeight.value

  // 1. Resize the PixiJS renderer to match current window size.
  app.value.renderer.resize(width, height)

  // 2. Scale the sprite to cover the entire canvas/renderer.
  sprite.width = width
  sprite.height = height

  // 3. Recalculate aspect ratio correction (cover behavior).
  const windowAspect = width / height
  const targetUniforms = customFilter.resources.aspectUniforms.uniforms

  // Window is wider than the image: scale down Y to crop top/bottom.
  if (windowAspect > imageAspect) {
    targetUniforms.uvAspect = { x: 1.0, y: imageAspect / windowAspect }
  }
  // Window is taller than the image: scale down X to crop left/right.
  else {
    targetUniforms.uvAspect = { x: windowAspect / imageAspect, y: 1.0 }
  }

  // 4. Calculate dynamic grid divisions and angle based on window width.
  let gridDivs = 50.0
  let angle = Math.PI / 4.0

  if (width < 640) {
    // Small screens (phone) -> 10 slices, smaller angle (Math.PI / 10)
    gridDivs = 10.0
    angle = Math.PI / 10.0
  }
  else if (width < 1024) {
    // Medium screens (tablet) -> 25 slices, medium angle (Math.PI / 6)
    gridDivs = 25.0
    angle = Math.PI / 6.0
  }

  // set the GLSL uniforms
  targetUniforms.uGridDivs = gridDivs
  targetUniforms.uAngle = angle
}

async function initApp() {
  // mountApp handles: cleanup of any previous instance, create, init, canvas append.
  // Teardown on unmount is also registered inside usePixiApp.
  await mountApp({
    width: windowWidth.value,
    height: windowHeight.value,
    backgroundAlpha: 0,
  })
  if (!app.value)
    return

  // 3. Asset Management
  if (!Assets.resolver.hasBundle('gallery')) {
    Assets.addBundle('gallery', {
      img1: '/images/7.webp',
      img2: '/images/6.webp',
      img3: '/images/5.webp',
    })
  }
  const assets = await Assets.loadBundle('gallery')

  // 4. Custom Filter Creation
  customFilter = new Filter({
    glProgram: GlProgram.from({
      vertex: swiperVert,
      fragment: swiperFrag,
    }),
    resources: {
      uTextureOne: assets.img1.source,
      uTextureTow: assets.img2.source,
      aspectUniforms: new UniformGroup({
        uvAspect: { value: { x: 1.0, y: 1.0 }, type: 'vec2<f32>' },
        uTime: { value: 0.0, type: 'f32' },
        uProgress: { value: 0.0, type: 'f32' },
        uGridDivs: { value: 50.0, type: 'f32' },
        uAngle: { value: Math.PI / 4.0, type: 'f32' },
      }),
    },
  })

  imageAspect = assets.img1.width / assets.img1.height

  // 6. Build the Sprite & Apply Shader Filter
  sprite = new Sprite(assets.img1)
  sprite.filters = [customFilter]

  app.value.stage.addChild(sprite)

  // 7. Update dimensions, sprite sizing, and aspect ratio correction uniforms.
  updatePixiJSLayout()

  // 8. Handle Swiping Interaction Animation with Gsap
  const targetUniforms = customFilter.resources.aspectUniforms.uniforms
  let activeIndex = 0
  secRefs.value.forEach((sec, index) => {
    // mouseenter event listener for each section
    useEventListener(sec, 'mouseenter', () => {
      if (activeIndex === index)
        return

      activeIndex = index

      if (customFilter) {
        const currentProgress = targetUniforms.uProgress
        // eslint-disable-next-line no-console
        console.log('[currentProgress]:', currentProgress)
        // eslint-disable-next-line no-console
        console.log('[index]:', index)

        if (currentProgress >= 0.5) {
          customFilter.resources.uTextureOne = customFilter.resources.uTextureTow
          targetUniforms.uProgress = 1 - currentProgress
        }
        customFilter.resources.uTextureTow = assets[`img${index + 1}`].source

        gsap.killTweensOf(targetUniforms)
        gsap.to(targetUniforms, {
          uProgress: 1,
          duration: duration.value,
          ease: 'power3.out',
        })
      }
    })
  })
}

watch([windowWidth, windowHeight], () => {
  updatePixiJSLayout()
})

tryOnMounted(async () => {
  await initApp()
})
</script>

<template>
  <Default>
    <div ref="pixiRef" />
    <div class="fixed inset-0 w-screen h-screen flex">
      <p
        v-for="num in [1, 2, 3]"
        :ref="secRefs.set"
        :key="num"
        class="block h-full w-1/3"
      />
    </div>

    <StatsPanel />
    <LilGui :controls="guiControls" />
    <ResourcesList
      :resources="[
        'https://www.youtube.com/watch?v=Q1uNf54jjgU',
        'https://github.com/pixijs/pixijs',
        'https://pixijs.download/dev/docs/filters.html',
      ]"
    />
  </Default>
</template>

<route lang="json">
 { "meta": { "previewMode": "iframe" } }
</route>
