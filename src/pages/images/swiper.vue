<script setup lang="ts">
import { tryOnMounted, useEventListener, useWindowSize } from '@vueuse/core'
import { Application, Assets, Filter, GlProgram, Sprite } from 'pixi.js'
import { onUnmounted, useTemplateRef, watch } from 'vue'
import LilGui from '../../components/LilGui.vue'
import ResourcesList from '../../components/ResourcesList.vue'
import StatsPanel from '../../components/StatsPanel.vue'
import Default from '../../layouts/default.vue'

const pixiRef = useTemplateRef<HTMLDivElement>('pixiRef')
const { height: windowHeight, width: windowWidth } = useWindowSize()

let app: Application | null = null
let sprite1: Sprite | null = null

async function initApp() {
  if (!pixiRef.value)
    return

  // Destroy existing app if it exists
  if (app) {
    app.destroy(true, {
      children: true,
      texture: true,
      textureSource: true,
    })
    app = null
  }

  // Create new app with current window dimensions
  app = new Application()
  await app.init({
    width: windowWidth.value,
    height: windowHeight.value,
    backgroundAlpha: 0,
    resizeTo: pixiRef.value, // This makes PIXI auto-resize to container
  })

  pixiRef.value.appendChild(app.canvas)

  Assets.addBundle('gallery', {
    img1: '/images/2.webp',
    img2: '/images/3.webp',
  })
  const assets = await Assets.loadBundle('gallery')
  sprite1 = new Sprite(assets.img1)

  const customFilter = new Filter({
    glProgram: GlProgram.from({
      vertex: `
        in vec2 aPosition;
        out vec2 vTextureCoord;
        
        uniform vec4 uInputSize;
        uniform vec4 uOutputFrame;
        uniform vec4 uOutputTexture;

        vec4 filterVertexPosition( void ) {
            // 1. Scale and Offset local coordinates to Match Object Frame
            vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
        
            // 2. Convert X coordinate from pixels to Clip Space (-1 to 1)
            position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
            
            // 3. Convert Y coordinate from pixels to Clip Space (-1 to 1)
            position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
            
            return vec4(position, 0.0, 1.0);
        }

        vec2 filterTextureCoord( void ) {
            return aPosition * (uOutputFrame.zw * uInputSize.zw);
        }

        void main(void) {
            gl_Position = filterVertexPosition();
            vTextureCoord = filterTextureCoord();
        }
      `,
      fragment: `
        precision highp float;
        varying vec2 vTextureCoord;
        uniform sampler2D uTexture;

        void main() {
          // 1. Calculate the distorted texture coordinates
          vec2 uv = vec2(vTextureCoord.x + sin(vTextureCoord.y * 10.0) / 10., vTextureCoord.y);

          gl_FragColor = texture2D(uTexture, uv);
        }
      `,
    }),
    resources: {
      uTexture: assets.img2,
    },
  })

  sprite1.anchor.set(0.5)
  sprite1.position.set(
    app.screen.width / 2,
    app.screen.height / 2,
  )
  sprite1.filters = [customFilter]

  app.stage.addChild(sprite1)
}

// Handle window resize
watch([windowWidth, windowHeight], () => {
  if (app && sprite1) {
    // Resize the renderer
    app.renderer.resize(windowWidth.value, windowHeight.value)

    // Update sprite position
    sprite1.position.set(
      app.screen.width / 2,
      app.screen.height / 2,
    )
  }
})

// Alternative approach using event listener (choose one method)
useEventListener('resize', () => {
  if (app && sprite1) {
    app.renderer.resize(windowWidth.value, windowHeight.value)
    sprite1.position.set(
      app.screen.width / 2,
      app.screen.height / 2,
    )
  }
})

tryOnMounted(async () => {
  await initApp()
})

onUnmounted(() => {
  if (app) {
    app.destroy(true, {
      children: true,
      texture: true,
      textureSource: true,
    })
    app = null
  }
})
</script>

<template>
  <Default>
    <div ref="pixiRef" />
    <StatsPanel />
    <LilGui :controls="[]" />
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
