import type { RouteRecordNormalized } from 'vue-router'
import { slugToLabel, stripSortPrefix } from './slug'

export type PreviewMode = 'image' | 'iframe'

export interface DashboardItem {
  name: string
  path: string
  label: string
  icon: string
  isCategory: boolean
  previewMode: PreviewMode
  /** Raw sort key — the original slug with numeric prefix intact. */
  sortKey: string
}

/**
 * Resolves the preview mode for a route.
 *
 * Priority:
 *  1. Route meta (`<route lang="json">{ "meta": { "previewMode": "iframe" } }</route>`)
 *  2. Folder-convention fallback supplied by the caller
 *     - root-level pages   → 'image'
 *     - sub-category pages → 'iframe'
 */
export function resolvePreviewMode(
  route: RouteRecordNormalized,
  fallback: PreviewMode,
): PreviewMode {
  return (route.meta?.previewMode as PreviewMode | undefined) ?? fallback
}

/**
 * Builds the list of cards shown on the dashboard for the given `currentPath`.
 *
 * - `currentPath === ''`  → root view: category folder cards + top-level pages
 * - `currentPath !== ''`  → sub-category view: pages inside that category
 *
 * ## Ordering convention
 *
 * Folders/files may be prefixed with digits and a hyphen to control display
 * order (e.g. `000-learn`, `010-basics`, `100-advanced`). The numeric prefix
 * is used for sorting but **stripped from the display label** so the UI stays
 * clean. Items without a prefix sort after prefixed ones (standard string
 * comparison).
 *
 * This is a pure function: it does not touch Vue Router reactivity, so it can
 * be called from a `computed` with only the values extracted beforehand, and
 * tested with plain arrays without mounting any component.
 */
export function buildDashboardItems(
  allRoutes: RouteRecordNormalized[],
  currentPath: string,
): DashboardItem[] {
  const filteredRoutes = allRoutes.filter(
    route => route.path !== '/' && route.path !== '/:all(.*)',
  )

  // Identify all categories: any first path-segment that appears together with
  // at least one more segment (e.g. "/images/swiper" → category "images").
  // We match by the stripped name so that `000-shader` and `shader` both
  // resolve to category "shader".
  const catNames = new Set<string>()
  const catRawNames = new Map<string, string>() // stripped → raw (first seen)
  for (const route of filteredRoutes) {
    const segments = route.path.split('/').filter(Boolean)
    if (segments.length > 1) {
      const raw = segments[0]
      const stripped = stripSortPrefix(raw)
      catNames.add(stripped)
      if (!catRawNames.has(stripped)) {
        catRawNames.set(stripped, raw)
      }
    }
  }

  const items: DashboardItem[] = []

  if (currentPath === '') {
    // ── Root view ────────────────────────────────────────────────────────────

    // Category folder cards
    for (const [stripped, raw] of catRawNames) {
      items.push({
        name: stripped,
        path: `/${raw}`,
        label: slugToLabel(stripped),
        icon: '📁',
        isCategory: true,
        previewMode: 'image',
        sortKey: raw,
      })
    }

    // Top-level page cards
    for (const route of filteredRoutes) {
      const segments = route.path.split('/').filter(Boolean)
      const stripped = stripSortPrefix(segments[0])
      if (segments.length === 1 && !catNames.has(stripped)) {
        items.push({
          name: stripped,
          path: route.path,
          label: slugToLabel(segments[0]),
          icon: '✦',
          isCategory: false,
          previewMode: resolvePreviewMode(route, 'image'),
          sortKey: segments[0],
        })
      }
    }
  }
  else {
    // ── Sub-category view ─────────────────────────────────────────────────────
    const catSegment = currentPath.split('/').filter(Boolean)[0]
    const catStripped = stripSortPrefix(catSegment)

    for (const route of filteredRoutes) {
      const segments = route.path.split('/').filter(Boolean)
      const routeCatStripped = stripSortPrefix(segments[0])

      if (segments.length > 1 && routeCatStripped === catStripped) {
        // Skip the category's own index page
        if (segments[1] === 'index')
          continue

        const rawSlug = segments.slice(1).join('-')
        const displaySlug = segments.slice(1).map(stripSortPrefix).join(' ')
        items.push({
          name: stripSortPrefix(rawSlug),
          path: route.path,
          label: slugToLabel(displaySlug),
          icon: '✦',
          isCategory: false,
          previewMode: resolvePreviewMode(route, 'iframe'),
          sortKey: rawSlug,
        })
      }
    }
  }

  // Sort by raw slug so numeric prefixes control the order:
  //   "000-learn" < "010-basics" < "swiper" (no prefix sorts after digits)
  return items.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
}
