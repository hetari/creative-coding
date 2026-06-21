/**
 * Converts a URL path segment (slug) to a human-readable display label.
 *
 * Examples:
 *   "001-webgl-earth"  → "001 Webgl Earth"
 *   "shaders"          → "Shaders"
 *   "my_sketch"        → "My Sketch"
 *
 * All label-formatting rules live here. To change capitalisation, strip
 * numeric prefixes, or handle acronyms, edit this one function.
 */
export function slugToLabel(slug: string): string {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
