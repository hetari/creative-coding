<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ResourcesList from '../components/ResourcesList.vue'
import Default from '../layouts/default.vue'

defineOptions({
  name: 'IndexPage',
})

defineProps<{
  resourcesList?: string[]
}>()

const router = useRouter()

const isSubCategory = computed(() => {
  return router.currentRoute.value.path.replace(/\/$/, '') !== ''
})

const currentCategoryName = computed(() => {
  const path = router.currentRoute.value.path.replace(/\/$/, '')
  if (!path)
    return ''
  const name = path.split('/').filter(Boolean)[0]
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
})

const displayItems = computed(() => {
  const allRoutes = router
    .getRoutes()
    .filter(route => route.path !== '/' && route.path !== '/:all(.*)')

  const path = router.currentRoute.value.path.replace(/\/$/, '') // e.g. "" or "/shaders"

  // 1. Identify all categories (any first segment of paths with > 1 segments)
  const catNames = new Set<string>()
  for (const route of allRoutes) {
    const segments = route.path.split('/').filter(Boolean)
    if (segments.length > 1) {
      catNames.add(segments[0])
    }
  }

  if (path === '') {
    // ROOT index: Show category cards and top-level pages
    const items: any[] = []

    // Add Category cards
    for (const cat of catNames) {
      items.push({
        name: cat,
        path: `/${cat}`,
        label: cat
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase()),
        icon: '📁',
        isCategory: true,
        previewMode: 'image',
      })
    }

    // Add Top-level Page cards
    for (const route of allRoutes) {
      const segments = route.path.split('/').filter(Boolean)
      if (segments.length === 1 && !catNames.has(segments[0])) {
        const slug = segments[0]

        // Priority 1: Check dynamic Route Meta.
        // Priority 2: Fallback to Approach A Folder Conventions ('image' for root level).
        const metaPreviewMode = route.meta?.previewMode as 'image' | 'iframe' | undefined
        const previewMode = metaPreviewMode || 'image'

        items.push({
          name: slug,
          path: route.path,
          label: slug
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase()),
          icon: '✦',
          isCategory: false,
          previewMode,
        })
      }
    }

    return items.sort((a, b) => a.label.localeCompare(b.label))
  }
  else {
    // Sub-category index: Show pages inside this category folder
    const catName = path.split('/').filter(Boolean)[0] // e.g. "shaders"
    const items: any[] = []

    for (const route of allRoutes) {
      const segments = route.path.split('/').filter(Boolean)
      // It belongs to this category if segments[0] matches and length > 1
      if (segments.length > 1 && segments[0] === catName) {
        const slug = segments.slice(1).join('-')
        // Don't show the category index itself as a sub-page card
        if (segments[1] === 'index')
          continue

        // Priority 1: Check dynamic Route Meta.
        // Priority 2: Fallback to Approach A Folder Conventions ('iframe' for subfolders).
        const metaPreviewMode = route.meta?.previewMode as 'image' | 'iframe' | undefined
        const previewMode = metaPreviewMode || 'iframe'

        items.push({
          name: slug,
          path: route.path,
          label: segments
            .slice(1)
            .join(' ')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase()),
          icon: '✦',
          isCategory: false,
          previewMode,
        })
      }
    }

    return items.sort((a, b) => a.label.localeCompare(b.label))
  }
})

function getPreviewSrc(slug: string) {
  return `${import.meta.env.BASE_URL}previews/${slug}.png`
}

const previewFailed = reactive<Record<string, boolean>>({})

function handlePreviewError(slug: string) {
  previewFailed[slug] = true
}
</script>

<template>
  <Default>
    <section class="relative mx-auto max-w-7xl px-6 py-14 md:px-10">
      <!-- subcategory breadcrumb back button -->
      <div v-if="isSubCategory" class="mb-10">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:border-zinc-700 hover:text-zinc-100 hover:shadow-lg hover:shadow-zinc-950/50 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          ← Back to Dashboard
        </router-link>
      </div>

      <!-- header -->
      <header class="mb-14 flex flex-col gap-5">
        <div
          class="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 backdrop-blur"
        >
          <span class="h-2 w-2 rounded-full bg-emerald-400" />
          {{ isSubCategory ? currentCategoryName : "Playground" }}
        </div>

        <div
          class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-end gap-4">
              <h1
                class="text-4xl font-black tracking-[-0.08em] text-zinc-50 md:text-6xl"
              >
                {{
                  isSubCategory
                    ? `${currentCategoryName} Category`
                    : "Experiments"
                }}
              </h1>

              <a
                v-if="!isSubCategory"
                href="https://github.com/hetari/yuri-stream"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/70 text-zinc-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-600 hover:text-zinc-100 hover:shadow-lg hover:shadow-zinc-900/50"
                title="View on GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
              </a>
            </div>

            <p class="max-w-xl text-sm leading-7 text-zinc-500 md:text-base">
              {{
                isSubCategory
                  ? `Browsing all interactive components grouped under ${currentCategoryName}.`
                  : "Interactive route previews and creative coding shaders following yuri-stream tutorials, live streams, and experiments."
              }}
            </p>
          </div>
        </div>
      </header>

      <!-- grid -->
      <section
        v-if="displayItems.length"
        class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <router-link
          v-for="item in displayItems"
          :key="item.path"
          :to="item.path"
          class="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700"
        >
          <!-- top -->
          <div
            class="relative flex items-center justify-between border-b border-zinc-800 px-5 py-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-sm font-bold text-zinc-200"
              >
                {{ item.icon }}
              </div>

              <div class="flex flex-col">
                <span class="text-sm font-semibold text-zinc-100">
                  {{ item.label }}
                </span>

                <span class="text-xs text-zinc-500">
                  {{ item.path }}
                </span>
              </div>
            </div>

            <div
              class="text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zinc-300"
            >
              →
            </div>
          </div>

          <!-- preview -->
          <div class="relative aspect-[16/10] overflow-hidden bg-black">
            <!-- Category folder card -->
            <template v-if="item.isCategory">
              <div
                class="flex h-full w-full flex-col items-center justify-center border-t border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%),linear-gradient(180deg,rgba(24,24,27,0.9),rgba(9,9,11,1))] px-6 text-center"
              >
                <div class="space-y-2">
                  <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900/80 text-3xl"
                  >
                    📁
                  </div>
                  <p class="text-sm font-semibold tracking-wide text-zinc-300">
                    Browse {{ item.label }}
                  </p>
                  <p class="text-xs text-zinc-500">
                    Sub-category folder
                  </p>
                </div>
              </div>
            </template>

            <!-- Regular page card -->
            <template v-else>
              <!-- Image mode -->
              <template v-if="item.previewMode === 'image'">
                <img
                  v-if="!previewFailed[item.name]"
                  :src="getPreviewSrc(item.name)"
                  :alt="`${item.label} preview`"
                  loading="lazy"
                  class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  @error="handlePreviewError(item.name)"
                >

                <div
                  v-else
                  class="flex h-full w-full items-center justify-center border-t border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%),linear-gradient(180deg,rgba(24,24,27,0.9),rgba(9,9,11,1))] px-6 text-center"
                >
                  <div class="space-y-2">
                    <div
                      class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900/80 text-xl font-black text-zinc-200"
                    >
                      {{ item.icon }}
                    </div>

                    <p
                      class="text-sm font-semibold tracking-wide text-zinc-100"
                    >
                      {{ item.label }}
                    </p>

                    <p class="text-xs text-zinc-500">
                      Drop a screenshot at
                      <span class="text-zinc-300">{{
                        getPreviewSrc(item.name)
                      }}</span>
                    </p>
                  </div>
                </div>
              </template>

              <!-- Iframe mode -->
              <template v-else-if="item.previewMode === 'iframe'">
                <iframe
                  :src="`#${item.path}`"
                  class="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
                  style="width: 400%; height: 400%; transform: scale(0.25);"
                  scrolling="no"
                  loading="lazy"
                />
              </template>
            </template>

            <div
              class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(9,9,11,0.72),rgba(9,9,11,0.1)_55%,transparent)]"
            />
          </div>
        </router-link>
      </section>

      <!-- empty -->
      <div
        v-else
        class="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 text-sm text-zinc-500"
      >
        No components found in this section
      </div>
    </section>

    <ResourcesList v-if="resourcesList" :resources="resourcesList" />
  </Default>
</template>
