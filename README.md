# yuri-stream Practice & Playground

A structured, high-performance creative coding playground built with **Vue 3**, **Vite**, **TypeScript**, and **Three.js** / **TresJS** to practice and implement advanced shader/WebGL techniques.

This workspace is dedicated to reproducing and experimenting with concepts learned during creative coding live streams—specifically following the teaching videos of **Yuri Artyukh** (Yuri Stream).

## 📺 Active Learning Resources

Our active stream series & primary learning sources:
*   **First Stream Followed:** [Yuri Artyukh - Creative Coding Live Stream #1](https://www.youtube.com/watch?v=Q1uNf54jjgU&t=71s) — focusing on shader fundamentals, math-driven visual effects, and WebGL setups.
*   **Repo Topic:** Practicing WebGL, GLSL Shaders, and creative procedural animations.

---

## 🛠️ Key Project Features

### 1. Dynamic Categorization & Sub-folders
The playground dashboard automatically discovers routing paths. Single components live in the root of `src/pages/`, but you can group related creative sketches under dedicated subdirectory folders (e.g., `src/pages/shaders/`).
*   **Root Dashboard:** Automatically displays nested folders as high-aesthetic **Category Folder Cards** (e.g., *📁 Browse Shaders*).
*   **Sub-Category Dashboard:** Reuses the landing page layout dynamically, adding back navigations and showcasing only the sketches inside that specific sub-group.

### 2. Page-Level Custom Previews
Sketches declare their own preferred preview rendering mode directly in their `.vue` files using file-based route blocks.
*   **Iframe Mode:** Embeds a live interactive `<iframe>` directly onto the card.
*   **Image Mode:** Uses a fallback static preview screenshot of the sketch.

To specify, add a `<route>` block to the end of your page:
```html
<route lang="json">
{
  "meta": {
    "previewMode": "iframe"
  }
}
</route>
```

---

## 📦 Custom Reusable Components

We have abstracted all auxiliary scene utilities into self-managing, modular components located under `src/components/`.

### 📊 `StatsPanel.vue`
A renderless wrapper around `stats.js` that tracks real-time performance (FPS, millisecond overhead).
*   **Auto-mounting:** Spawns a floating panel on the top-right upon page mount.
*   **Auto-cleaning:** Cleans up frames and removes itself from the document tree on unmount.

### 🎛️ `LilGui.vue`
A reactive properties controller wrapper for `lil-gui` to dynamically tune shader variables or model configurations.
*   **Closed by Default:** Panel is neatly collapsed on load to keep visual scenes clutter-free.
*   **Ref-Synced:** Directly synchronizes and updates Vue `ref` objects reactively as you drag sliders.
*   **Usage:**
    ```html
    <script setup lang="ts">
    import { ref } from "vue";
    import LilGui from "../components/LilGui.vue";

    const scale = ref(1.0);
    const controls = [
      { label: "Scale factor", ref: scale, min: 0.1, max: 3.0, step: 0.1 }
    ];
    </script>

    <template>
      <LilGui :controls="controls" />
    </template>
    ```

### 📖 `ResourcesList.vue`
A highly polished bottom-center floating reference button.
*   **Collapsible UI:** Appears as a sleek, compact action pill (e.g., `📖 References [3] ▲`).
*   **Popup Over:** Hovering/clicking dynamically slides up a glassmorphic reference panel showing link titles for documentation, assets, or tutorial streams that helped build the page.

---

## 🚀 Getting Started

### Installation
Make sure you have [Bun](https://bun.sh/) installed:
```bash
bun install
```

### Development Server
Run the local live-reload preview server:
```bash
bun run dev
```

### Build for Production
Compile, type-check, and optimize static production files:
```bash
bun run build
```
