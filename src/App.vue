<script setup lang="ts">
import { KeepAlive, provide, onMounted, onUnmounted, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import Stats from "stats.js";

const router = useRouter();
let stats = new Stats();

function setupStats(s: Stats) {
  s.dom.style.pointerEvents = 'none';
  s.dom.style.left = 'auto';
  s.dom.style.right = '0px';
  Array.from(s.dom.children).forEach((child) => {
    (child as HTMLElement).style.display = 'inline-block';
  });
  document.body.appendChild(s.dom);
  updateStatsVisibility(router.currentRoute.value.path);
}

function updateStatsVisibility(path: string) {
  if (stats.dom) {
    if (path === "/") {
      stats.dom.style.display = 'none';
    } else {
      stats.dom.style.display = 'block';
    }
  }
}

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    updateStatsVisibility(newPath);
  }
);

const statsWrapper = {
  begin: () => stats.begin(),
  end: () => stats.end(),
  update: () => stats.update(),
  reset: () => {
    if (stats.dom.parentNode) {
      document.body.removeChild(stats.dom);
    }
    stats = new Stats();
    setupStats(stats);
  }
};

provide('stats', statsWrapper);

onMounted(() => {
  setupStats(stats);
});

onUnmounted(() => {
  if (stats.dom.parentNode) {
    document.body.removeChild(stats.dom);
  }
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive include="IndexPage">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
