/**
 * Strips a leading numeric-sort prefix from a slug segment.
 *
 * Convention: prefix a folder/file name with digits and a hyphen to control
 * ordering on the filesystem (e.g. `000-learn`, `010-basics`, `100-advanced`).
 * This function removes the prefix so it never appears in the UI.
 *
 * Examples:
 *   "000-learn"      → "learn"
 *   "010-basics"     → "basics"
 *   "99-advanced"    → "advanced"
 *   "shaders"        → "shaders"   (no prefix — returned as-is)
 *   "123"            → "123"       (digits only, no hyphen — returned as-is)
 */
export function stripSortPrefix(slug: string): string {
  return slug.replace(/^\d+-/, '')
}

/**
 * Converts a URL path segment (slug) to a human-readable display label.
 *
 * Numeric sort-prefixes (e.g. `000-`, `01-`) are stripped before formatting
 * so they never appear in the UI.
 *
 * Examples:
 *   "000-learn"       → "Learn"
 *   "010-webgl-earth" → "Webgl Earth"
 *   "shaders"         → "Shaders"
 *   "my_sketch"       → "My Sketch"
 *
 * All label-formatting rules live here. To change capitalisation, strip
 * numeric prefixes, or handle acronyms, edit this one function.
 */
export function slugToLabel(slug: string): string {
  return stripSortPrefix(slug)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
