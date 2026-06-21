import { computed } from 'vue'

/**
 * Returns a computed boolean that is `true` when the current page is running
 * inside an iframe (i.e. as a card preview on the dashboard).
 *
 * All overlay tool-components (StatsPanel, LilGui, ResourcesList, …) should
 * use this composable instead of duplicating the inline guard expression.
 *
 * The check is SSR-safe: the `typeof window` guard prevents crashes in
 * server-side or non-browser environments.
 */
export function useIsPreview() {
  return computed(() => typeof window !== 'undefined' && window.self !== window.top)
}
