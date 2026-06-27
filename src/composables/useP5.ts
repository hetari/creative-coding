import type p5Type from 'p5'
import type { ShallowRef, TemplateRef } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import { shallowRef } from 'vue'

/**
 * Manages the p5.js sketch lifecycle for a sketch component.
 *
 * Responsibilities owned by this composable:
 *  - Dynamically importing the p5 library (tree-shaking friendly)
 *  - Creating a p5 instance in "instance mode" and binding it to the container
 *  - Tearing down (p5.remove) on component unmount — consistent with usePixiApp
 *
 * Responsibilities left to the caller (sketch):
 *  - Defining setup(), draw(), and any other p5 lifecycle methods
 *  - Loading assets, creating graphics, setting up interactions
 *
 * Usage:
 *   const { p5, mountSketch } = useP5(containerRef)
 *   tryOnMounted(() => {
 *     mountSketch((p) => {
 *       p.setup = () => {
 *         p.createCanvas(p.windowWidth, p.windowHeight)
 *       }
 *       p.draw = () => {
 *         p.background(0)
 *         // … sketch-specific drawing …
 *       }
 *     })
 *   })
 */
export function useP5(
  containerRef: TemplateRef<HTMLElement | null> | ShallowRef<HTMLElement | null>,
) {
  const p5 = shallowRef<p5Type | null>(null)

  /**
   * Dynamically imports p5, creates an instance in instance mode, and mounts
   * it to `containerRef`. If a previous instance exists it is removed first
   * (safe to call on hot-reload or re-initialisation).
   */
  async function mountSketch(sketch: (p: p5Type) => void) {
    if (!containerRef.value)
      return

    // Tear down any previous instance (e.g. on hot-reload)
    if (p5.value) {
      p5.value.remove()
      p5.value = null
    }

    const { default: P5 } = await import('p5')
    p5.value = new P5(sketch, containerRef.value)
  }

  // Single, consistent teardown — always onUnmounted (mirrors usePixiApp)
  tryOnUnmounted(() => {
    if (p5.value) {
      p5.value.remove()
      p5.value = null
    }
  })

  return { p5, mountSketch }
}
