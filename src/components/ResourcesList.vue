<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps<{
  resources: string[]
}>()

const isOpen = ref(false)

const isIframe = computed(() => {
  return typeof window !== 'undefined' && window.self !== window.top
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div v-if="!isIframe" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center max-w-sm w-full px-4">
    <!-- Links card container (visible when isOpen is true) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div
        v-if="isOpen && resources.length"
        class="mb-3 w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-md space-y-3"
      >
        <div class="flex items-center justify-between border-b border-zinc-900 pb-2">
          <div class="flex items-center gap-1.5">
            <span class="flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <span class="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500">References Used</span>
          </div>
          <button
            class="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer text-xs p-1"
            @click="isOpen = false"
          >
            ✕
          </button>
        </div>

        <div class="flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
          <a
            v-for="(link, i) in resources"
            :key="i"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/20 px-3 py-2 text-xs font-semibold text-zinc-400 hover:border-zinc-800 hover:text-zinc-50 hover:bg-zinc-900/60 transition-all cursor-pointer group"
          >
            <span class="truncate pr-4">
              {{ link.replace(/https?:\/\/(www\.)?/, "") }}
            </span>
            <span class="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[10px]">↗</span>
          </a>
        </div>
      </div>
    </Transition>

    <!-- Compact pill action button -->
    <button
      type="button"
      class="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-900 px-4 py-2.5 shadow-lg backdrop-blur hover:border-zinc-700 hover:text-zinc-100 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-zinc-400 font-semibold text-xs whitespace-nowrap"
      :class="{ 'border-zinc-700 text-zinc-200 bg-zinc-900': isOpen }"
      @click="toggleOpen"
    >
      <span class="text-sm">📖</span>
      <span>References</span>
      <span class="rounded bg-zinc-850 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 font-mono">
        {{ resources.length }}
      </span>
      <span
        class="transition-transform duration-300 text-[10px]"
        :class="{ 'rotate-180': isOpen }"
      >
        ▲
      </span>
    </button>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
