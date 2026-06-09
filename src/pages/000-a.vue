<script setup lang="ts">
import { ref } from "vue";
import StatsPanel from "../components/StatsPanel.vue";
import LilGui from "../components/LilGui.vue";
import ResourcesList from "../components/ResourcesList.vue";

const scale = ref(1.5);
const color = ref("#10b981");

const guiControls = [
  { label: "Component Scale", ref: scale, min: 0.1, max: 5.0, step: 0.1 },
  { label: "Theme Color", ref: color, options: ["#10b981", "#6366f1", "#f43f5e", "#eab308"] }
];

const referenceLinks = [
  "https://github.com/mrdoob/stats.js",
  "https://github.com/georgealways/lil-gui",
  "https://threejs.org/docs/",
  "https://www.youtube.com/watch?v=UMqNHi1GDAE"
];
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
    <div class="space-y-6 text-center max-w-md">
      <h1 class="text-4xl font-black tracking-tight md:text-5xl" :style="{ color: color }">Page A</h1>
      <p class="text-zinc-500 text-sm">
        This is a fully modular layout. The Stats.js panel, lil-gui controls, and Reference links below are individual self-managing components that register/deregister dynamically.
      </p>
      
      <!-- Interactive preview of the binded state values -->
      <div 
        class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left space-y-3 shadow-xl backdrop-blur transition-transform duration-300"
        :style="{ transform: `scale(${scale})` }"
      >
        <p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Bound Parameters</p>
        <div class="space-y-1 text-sm">
          <p>Scale: <span class="font-mono font-bold text-emerald-400">{{ scale.toFixed(1) }}x</span></p>
          <p>Color: <span class="font-mono font-bold" :style="{ color: color }">{{ color }}</span></p>
        </div>
      </div>

      <div class="pt-4">
        <router-link to="/" class="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all cursor-pointer">
          ← Back to Dashboard
        </router-link>
      </div>
    </div>

    <!-- Self-contained Components -->
    <StatsPanel />
    <LilGui :controls="guiControls" />
    <ResourcesList :resources="referenceLinks" />
  </div>
</template>

<route lang="json">
{
  "meta": {
    "previewMode": "iframe"
  }
}
</route>