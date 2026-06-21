import type { ApplicationOptions } from 'pixi.js'
import type { ShallowRef, TemplateRef } from 'vue'
import { Application } from 'pixi.js'
import { onUnmounted, shallowRef } from 'vue'

/**
 * Manages the PixiJS Application lifecycle for a sketch component.
 *
 * Responsibilities owned by this composable:
 *  - Creating and initialising the Application instance
 *  - Appending the canvas to the container element
 *  - Tearing down (app.destroy) on component unmount — always with onUnmounted,
 *    eliminating the onBeforeUnmount vs onUnmounted inconsistency that existed
 *    across the two previous swiper sketches.
 *
 * Responsibilities left to the caller (sketch):
 *  - Loading assets
 *  - Creating sprites, filters, uniforms
 *  - Setting up interaction / animation loops
 *
 * Usage:
 *   const { app, mountApp } = usePixiApp(containerRef)
 *   tryOnMounted(async () => {
 *     await mountApp({ width: 800, height: 600, backgroundAlpha: 0 })
 *     if (!app.value) return
 *     // … sketch-specific setup using app.value …
 *   })
 */
export function usePixiApp(
  containerRef: TemplateRef<HTMLElement | null> | ShallowRef<HTMLElement | null>,
) {
  const app = shallowRef<Application | null>(null)

  /**
   * Creates a new Application, initialises it with the given options, and
   * appends its canvas to `containerRef`. If a previous instance exists it is
   * destroyed first (safe to call on hot-reload or re-initialisation).
   */
  async function mountApp(options: Partial<ApplicationOptions> = {}) {
    if (!containerRef.value)
      return

    // Tear down any previous instance (e.g. on hot-reload)
    if (app.value) {
      app.value.destroy(true, { children: true })
      app.value = null
    }

    const instance = new Application()
    await instance.init(options)
    containerRef.value.appendChild(instance.canvas)
    app.value = instance
  }

  // Single, consistent teardown — always onUnmounted (not onBeforeUnmount)
  onUnmounted(() => {
    if (app.value) {
      app.value.destroy(true, { children: true })
      app.value = null
    }
  })

  return { app, mountApp }
}
