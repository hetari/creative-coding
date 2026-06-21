import type { RouteRecordNormalized } from 'vue-router'
import { slugToLabel } from './slug'

export type PreviewMode = 'image' | 'iframe'

export interface DashboardItem {
  name: string
  path: string
  label: string
  icon: string
  isCategory: boolean
  previewMode: PreviewMode
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
 * The returned array is already sorted alphabetically by label.
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
  const catNames = new Set<string>()
  for (const route of filteredRoutes) {
    const segments = route.path.split('/').filter(Boolean)
    if (segments.length > 1) {
      catNames.add(segments[0])
    }
  }

  const items: DashboardItem[] = []

  if (currentPath === '') {
    // ── Root view ────────────────────────────────────────────────────────────

    // Category folder cards
    for (const cat of catNames) {
      items.push({
        name: cat,
        path: `/${cat}`,
        label: slugToLabel(cat),
        icon: '📁',
        isCategory: true,
        previewMode: 'image',
      })
    }

    // Top-level page cards
    for (const route of filteredRoutes) {
      const segments = route.path.split('/').filter(Boolean)
      if (segments.length === 1 && !catNames.has(segments[0])) {
        const slug = segments[0]
        items.push({
          name: slug,
          path: route.path,
          label: slugToLabel(slug),
          icon: '✦',
          isCategory: false,
          previewMode: resolvePreviewMode(route, 'image'),
        })
      }
    }
  }
  else {
    // ── Sub-category view ─────────────────────────────────────────────────────
    const catName = currentPath.split('/').filter(Boolean)[0]

    for (const route of filteredRoutes) {
      const segments = route.path.split('/').filter(Boolean)

      if (segments.length > 1 && segments[0] === catName) {
        // Skip the category's own index page
        if (segments[1] === 'index')
          continue

        const slug = segments.slice(1).join('-')
        items.push({
          name: slug,
          path: route.path,
          label: slugToLabel(segments.slice(1).join(' ')),
          icon: '✦',
          isCategory: false,
          previewMode: resolvePreviewMode(route, 'iframe'),
        })
      }
    }
  }

  return items.sort((a, b) => a.label.localeCompare(b.label))
}
