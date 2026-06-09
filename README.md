# yuri-stream Practice & Playground

A structured, high-performance creative coding playground built with **Vue 3**, **Vite**, **TypeScript**, and **Three.js** / **TresJS** to practice and implement advanced shader/WebGL techniques.

This workspace is dedicated to reproducing and experimenting with concepts learned during creative coding live streams—specifically following the teaching videos of **Yuri Artyukh** (Yuri Stream).

## 📺 Active Learning Resources

Our active stream series & primary learning sources:

- **First Stream Followed:** [Yuri Artyukh - Creative Coding Live Stream #1](https://www.youtube.com/watch?v=Q1uNf54jjgU&t=71s) — focusing on shader fundamentals, math-driven visual effects, and WebGL setups.
- **Repo Topic:** Practicing WebGL, GLSL Shaders, and creative procedural animations.

---

## 🛠️ Key Project Features

### 1. Zero-Configuration Sketch Adding

Adding new pages and custom experiments is completely automatic!

- To add a new experiment, simply **create a `.vue` file** inside `src/pages/` or any subdirectory.
- The router automatically discovers your page, labels it nicely on the landing page, and assigns the premium bullet icon (`✦`) automatically.
- No imports, list registration, icon mapping, or menu updates required!

### 2. Automatic Folder-Based Previews & Categorizations

The playground dashboard automatically maps routes based on directory rules:

- **Top-level pages** (e.g. `src/pages/001-b.vue`): Automatically grouped on the root playground dashboard, defaulting to **Image Preview Mode** (falls back to a text card pointing to drop screenshots in `previews/`).
- **Subfolders / Categories** (e.g. `src/pages/shaders/`): Any folder you create inside `pages/` automatically turns into a **Category Folder Card** (`📁 Browse [Category]`) on the root dashboard.
- **Category Sketches** (e.g. `src/pages/shaders/fire.vue`): Instantly discovered and rendered with a high-resolution live **Iframe Preview Mode** when browsing that folder.

#### 💡 Custom Route Previews

If you want to manually override these defaults (for example, force a root-level page like `000-a.vue` to render as a live `iframe`), simply add a `<route>` custom block to the end of your page's `.vue` file:

```html
<route lang="json"> { "meta": { "previewMode": "iframe" } } </route>
```

---

## 📦 Custom Reusable Components

We have abstracted all auxiliary scene utilities into self-managing, modular components located under `src/components/`.

### 📊 `StatsPanel.vue`

A renderless wrapper around `stats.js` that tracks real-time performance (FPS, millisecond overhead).

- **Auto-mounting:** Spawns a floating panel on the top-right upon page mount.
- **Iframe-Aware:** Automatically hides itself completely if loaded inside an iframe card preview on the dashboard, keeping previews perfectly clean.

### 🎛️ `LilGui.vue`

A reactive properties controller wrapper for `lil-gui` to dynamically tune shader variables or model configurations.

- **Closed by Default:** Panel is neatly collapsed on load to keep visual scenes clutter-free.
- **Iframe-Aware:** Instantly detects if running inside card previews and skips initialization.
- **Ref-Synced:** Directly synchronizes and updates Vue `ref` objects reactively as you drag sliders.

### 📖 `ResourcesList.vue`

A highly polished bottom-center floating reference button.

- **Collapsible UI:** Appears as a sleek, compact action pill (e.g., `📖 References [3] ▲`).
- **Iframe-Aware:** Hides itself completely when viewed as a card preview.
- **Popup Over:** Hovering/clicking dynamically slides up a glassmorphic reference panel showing link titles for documentation, assets, or tutorial streams that helped build the page.

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
