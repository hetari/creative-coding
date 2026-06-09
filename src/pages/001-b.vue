<script setup lang="ts">
import { ref } from "vue";
import StatsPanel from "../components/StatsPanel.vue";
import LilGui from "../components/LilGui.vue";
import ResourcesList from "../components/ResourcesList.vue";

const rotationSpeed = ref(0.02);
const renderWireframe = ref(false);

const guiControls = [
  { label: "Rotation Speed", ref: rotationSpeed, min: 0.0, max: 0.1, step: 0.005 },
  { label: "Wireframe Mode", ref: renderWireframe }
];

const referenceLinks = [
  "https://github.com/mrdoob/stats.js",
  "https://github.com/georgealways/lil-gui",
  "https://threejs.org/docs/",
  "https://www.youtube.com/watch?v=KM64t3pA4fs"
];
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6">
    <div class="space-y-6 text-center max-w-md">
      <h1 class="text-4xl font-black tracking-tight md:text-5xl">Page B</h1>
      <p class="text-zinc-500 text-sm">
        This page demonstrates dynamic reactive binding with a toggle parameter (boolean) and numeric sliders. Try changing them in the controls panel on the right.
      </p>
      
      <!-- Interactive preview of the binded state values -->
      <div 
        class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left space-y-3 shadow-xl backdrop-blur transition-all duration-350"
        :class="{ 'border-emerald-500/40 bg-emerald-950/10': renderWireframe }"
      >
        <p class="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Controls State</p>
        <div class="space-y-1 text-sm">
          <p>Speed: <span class="font-mono font-bold text-amber-400">{{ rotationSpeed.toFixed(3) }} rad/s</span></p>
          <p>Wireframe: <span class="font-mono font-bold" :class="renderWireframe ? 'text-emerald-400' : 'text-zinc-500'">{{ renderWireframe ? 'ON' : 'OFF' }}</span></p>
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
