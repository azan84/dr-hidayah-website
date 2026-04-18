# Changelog — redesign-v2

All feature changes are grouped by the 10 numbered steps from the autonomous redesign prompt. Dates use ISO format.

## [redesign-v2] — 2026-04-18 (branch)

### Foundation — design tokens & primitives
- New `:root` token system in `styles.css`: teal / algae / cyan / sand / ink / amber scales (50–950), spacing (4 px grid), type scale (1.25 ratio), radius, shadow, motion, and font tokens.
- Dark-mode tokens exposed via `[data-theme="dark"]` and a `@media (prefers-color-scheme: dark)` fallback that applies automatically until the user sets an explicit theme.
- Semantic tokens (`--color-bg`, `--color-surface`, `--color-primary`, `--color-accent`, `--color-glow`, etc.) driving every component.
- Added **JetBrains Mono** to the Google Fonts call on every Hidayah page — used for stat digits, year tags, grant labels, and scientific metadata.
- Refactored `.clay / .clay-teal / .clay-coral / .clay-gold` to consume tokens; light & dark variants defined.

### Feature 1 — Animated microalgae hero background
- New `.hero-bg` layer with an SVG gradient mesh (teal → algae → cyan radial stops) sitting behind the hero content.
- Three custom-drawn silhouette symbols in an inline SVG sprite: `#alga-chlorella`, `#alga-spirulina`, `#alga-diatom`. Six drifting instances per hero.
- Bubble stream generated at runtime (14 bubbles, randomized size / delay / duration) — CSS-only `bubble-rise` keyframes.
- `@media (prefers-reduced-motion: reduce)` hides bubbles and stops drift animations; the gradient mesh remains as a static fallback.
- All SVG + animations are under ~12 KB including the icon sprite.

### Feature 2 — Animated stat counters
- Stat cards now carry `data-target` and render `0` → target with `rAF` and an easeOutQuart curve (1 400 ms).
- Digits switch to JetBrains Mono with tabular numerals.
- Each card adds a thin horizontal progress bar (`.stat-arc` / `.stat-arc-fill`) that fills to a `data-pct` value in sync with the count.
- Trigger via `IntersectionObserver` at 35 % visibility. Reduced-motion users see the final value immediately.

### Feature 3 — Scientific iconography
- Emojis (🌱 🔥 💧 ⚗️ 🧬 🍇) on the six research cards replaced with custom inline SVG icons stored in an SVG sprite:
  - `#icon-chlorella` — Chlorella cluster (Microalgae Biotechnology)
  - `#icon-pyrolysis` — flame + molecule (Catalytic Pyrolysis)
  - `#icon-extraction` — droplet + pressure waves (Sub/Supercritical Extraction)
  - `#icon-enzyme` — enzyme cleaving chain (Enzymatic Saccharification)
  - `#icon-collagen` — triple helix (Green Collagen)
  - `#icon-biocosm` — leaf + droplet fusion (Bio-based Cosmetics)
- On card hover, the icon rotates `−6°` and scales 1.06, while subclass groups (`anim-pulse`, `anim-spin`, `anim-wave`) play tiny keyframed animations.
- Quick-links icons and contact-detail icons upgraded from emojis to Lucide-style inline SVGs as well.

### Feature 4 — Scroll-driven reveals upgraded
- `.reveal` kept; added `.reveal-child` which staggers direct children by `i × 90 ms` via CSS custom property `--i-delay`.
- IntersectionObserver now uses `rootMargin: 0 0 -40 0` so reveals fire slightly before entering.
- Applied on research-grid, quick-grid, and impact timeline for the staggered cascade.
- Parallax: any element with `data-parallax="0.06"` receives a rAF-free scroll-handler translation via `--parallax-y`. Used on the hero photo wrapper. Disabled under reduced motion.

### Feature 5 — Hero photo treatment
- Hero photo wrapped in `.hero-photo-blob` with a shared `<clipPath id="blobClip">` organic shape.
- Slowly rotating SVG text ring ("• Microalgae • Biofuel • Green Technology • Sustainable Bioprocessing") orbits the portrait (`ring-spin 38 s` linear).
- Ambient radial glow (`.hero-photo-glow`) pulses at 6 s ease-in-out. Colors adapt to theme.

### Feature 6 — Research Impact band
- New `<section class="impact">` inserted between About and Research Interests on `index.html`.
- Horizontal snap-scroll timeline with 7 milestone nodes (dot + year + title + meta). Vertical stacked on mobile.
- Sparkline SVG for citations-per-year (plausible placeholder curve) with a big current count (`394`) in JetBrains Mono.
- Editorial pull-quote card alongside.
- `TODO(azan):` markers left for real milestone copy and real per-year citation values (see below).

### Feature 7 — Navigation upgrade
- Sticky navbar uses `backdrop-filter: blur(12px) saturate(180%)` with a `color-mix()` background that tints against the current theme.
- `.scroll-progress` thin bar (2 px, teal→algae→cyan gradient) slides along the top edge as the user scrolls.
- `.nav-indicator` — a 2 px pill that slides under the active nav link on hover/focus and resets to the active page on `mouseleave`. Hidden on mobile.
- Mobile: drawer slides from the right with a blurred `.nav-overlay`; body scroll locked while open.

### Feature 8 — Dark mode
- Sun/moon toggle in the navbar (accessible `<button>` with labeled SVG icons).
- Theme order: `localStorage('hidayah-theme')` → `prefers-color-scheme` → light default.
- Tiny inline `<script>` in every page `<head>` prevents flash-of-unstyled-theme by setting `data-theme` before paint.
- Uses the View Transitions API (`document.startViewTransition`) when supported for a smooth fade between themes; gracefully falls back elsewhere.

### Feature 9 — Consistency across all pages
- Every Hidayah HTML file (`index`, `academics`, `students`, `blog`, `personal`, `blog-saf-microalgae`, `blog-microalgae-vs-astrophage`) now carries the upgraded navbar + scroll progress bar + nav overlay + theme toggle + FOUT-blocking theme script, and loads `styles.css?v=5` + `script.js?v=5`.
- Quiz pages (`quiz-*.html`) intentionally left on their own `quiz-styles.css` — they are stand-alone game experiences with their own visual language.
- `dr-hidayah.html` (legacy single-page inline variant) left as-is; it is not linked from navigation.
- `3d-print-landing.html`, `fund-tracker.html`, `home-page.html` are not Hidayah's sites and were excluded.

### Feature 10 — Micro-interactions polish
- `.btn`, `.btn-primary` primitive with translateY(−2 px) lift and cyan glow on hover.
- `.link` primitive with left-to-right underline draw-in (background-size transition).
- All cards (research, grant, supervision, blog, quick, stat, gallery, impact, pub-item) now animate with `cubic-bezier(.5,1.2,.3,1)` spring easing and add a tinted glow shadow on hover.
- Global `:focus-visible` amber ring (`--shadow-focus`) for keyboard accessibility.
- Button underlines, link draw-ins, card lifts, and icon hovers all respect `prefers-reduced-motion`.

## Files changed
- `styles.css` — rewritten as a token-driven design system (~36 KB).
- `script.js` — rewritten with theme toggle, scroll progress, parallax, staggered reveal, stat counters, nav drawer, hero background mount.
- `index.html` — new SVG sprite, hero background markup, hero photo blob + ring, Research Impact band, scientific research icons, quick-link Lucide icons, stat-card arcs, upgraded navbar.
- `academics.html`, `students.html`, `blog.html`, `personal.html`, `blog-saf-microalgae.html`, `blog-microalgae-vs-astrophage.html` — upgraded navbar (scroll progress, theme toggle, overlay, indicator), FOUT-blocker, JetBrains Mono, `?v=5` cache-bust.
- `personal.html` — contact-detail emojis replaced with Lucide SVGs.
- `DESIGN_PLAN.md` — Phase-0 audit & roadmap (new).
- `CHANGELOG.md` — this file (new).

## Outstanding TODOs
- `index.html` Research Impact section timeline — placeholder milestone copy pending real CV items. `<!-- TODO(azan): replace placeholder milestone copy with verified CV items when ready -->`
- `index.html` sparkline — illustrative per-year values. `<!-- TODO(azan): replace these plausible per-year values with a real export from Scholar -->`

## Notes
- **Lighthouse not run in sandbox** — no local Chromium available; see final report for browser-compat notes.
- **No framework migration** — still vanilla HTML + CSS + a single `script.js`.
- **Content verbatim** — bio, research descriptions, publications, grants, supervision rosters are unchanged.
- `styles.css?v=5` and `script.js?v=5` are used everywhere to defeat CDN / service-worker caches from the v4 baseline.
