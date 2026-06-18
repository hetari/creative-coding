<script setup lang="ts">
</script>

<template>
  <main class="min-h-dvh overflow-hidden bg-zinc-950 text-zinc-100">
    <!-- background -->
    <div
      class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]"
    />

    <slot />
  </main>
</template>
