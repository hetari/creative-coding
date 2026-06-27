# Creative Coding Playground

A structured, high-performance creative coding playground built with **Vue 3**, **Vite**, **TypeScript**, and libraries like **PixiJS**, **p5.js**, **Three.js / TresJS**, and **GLSL shaders**.

This workspace is for reproducing, experimenting with, and learning from concepts picked up across creative coding tutorials, live streams, and personal experiments — not limited to any single source.

## 📺 Learning Resources & Inspirations

This playground grows organically as new tutorials and techniques are explored:

- **Yuri Artyukh (Yuri Stream)** — shader fundamentals, math-driven visual effects, WebGL setups ([first stream followed](https://www.youtube.com/watch?v=Q1uNf54jjgU&t=71s))
- **Any tutorial, stream, or experiment** — if it involves creative code, it belongs here

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

Sub-category pages default to `iframe` previews and root-level pages default to `image` previews. To override either direction, add a `<route>` custom block to your `.vue` file:

```html
<!-- Force a page to use an iframe live preview -->
<route lang="json"> { "meta": { "previewMode": "iframe" } } </route>

<!-- Force a sub-category page to use a static image preview -->
<route lang="json"> { "meta": { "previewMode": "image" } } </route>
```

### 3. Composable-Based Sketch Architecture

Each rendering library gets its own lifecycle composable under `src/composables/`:

| Composable   | Library | Pattern                            |
| ------------ | ------- | ---------------------------------- |
| `usePixiApp` | PixiJS  | `mountApp(options)` → `app.value`  |
| `useP5`      | p5.js   | `mountSketch(sketch)` → `p5.value` |

All composables share the same design:

- Dynamic import of the library (lazy, tree-shaking friendly)
- Hot-reload safe (tears down + recreates on re-mount)
- Consistent `tryOnUnmounted` teardown

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

---

## 🎨 Code Linting & Style

This project implements professional style guidelines configured using **[@antfu/eslint-config](https://github.com/antfu/eslint-config)**.

### Automated Checks (Git Hooks)

- **Husky & nano-staged:** On every `git commit`, our pre-commit hook automatically scans all staged JavaScript, TypeScript, and Vue files.
- **Auto-fixing:** Staged files are run through `eslint --fix` to auto-format files to maintain clean, beautiful, and consistent quality standards across the workspace.
- **Commitlint Conventional Commits:** On every commit, our `commit-msg` hook verifies that commit messages follow Conventional Commit guidelines (e.g. `feat: add stats panel`, `fix: hide gui in preview`).

### Manual commands

- **Run Linter:** Check your entire project for style or script issues:
  ```bash
  bun run lint
  ```
- **Fix Linter:** Automatically resolve all formatting/linter errors:
  ```bash
  bun run lint:fix
  ```
