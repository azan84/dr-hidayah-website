# Dr. Nur Hidayah — Website Redesign Plan (redesign-v2)

_Generated during the Phase 0 audit. This is a record of intent; implementation follows in commits 1–10._

## 1. Audit of current site

### Files in scope (Hidayah)
- `index.html` — Home: hero, about, research interests (6 cards), quick-links
- `academics.html` — Publications + grants
- `students.html` — Supervision + course resources (with kahoot-style quizzes)
- `blog.html` — Blog index (reads `blog-posts.js`)
- `blog-saf-microalgae.html`, `blog-microalgae-vs-astrophage.html` — Long-form posts
- `personal.html` — Gallery + contact
- `quiz-*.html` (4 files) — Kahoot-style quiz pages (own stylesheet `quiz-styles.css`)
- `dr-hidayah.html` — Self-contained single-page variant with inline styles, kept as-is (legacy/back-up)
- Shared: `styles.css`, `script.js`, `blog-posts.js`, `quiz-styles.css`, `quiz-engine.js`, `quiz-config.js`

### Files skipped (not Hidayah's)
- `3d-print-landing.html` — 3D printing service landing (Tailwind CDN, Exo font)
- `fund-tracker.html` — Portfolio dashboard with Chart.js
- `home-page.html` — WordPress-embed snippet scoped under `.mec-home`

### Current design tokens (informal, hardcoded)
| Concept | Value |
| --- | --- |
| Background base | `#FFF8F0` (warm off-white) |
| Primary | `#5BBFB5` teal, `#3a8f85` dark teal |
| Coral accent | `#F08080`, `#c46b6b` |
| Gold accent | `#D4A853` (used for citations) |
| Text | `#2D3436`, `#666`, `#888`, `#999` |
| Radius | 24px (clay cards), 20px (buttons), 16px, 14px, 12px, 10px (pills) |
| Shadow language | Claymorphism — dual cast + inset highlights |
| Fonts | Inter 300–700, Playfair Display 500–700 |

### Reusable components inventory
- `.clay`, `.clay-teal`, `.clay-coral`, `.clay-gold` — card surfaces
- `.keyword-tag`, `.grant-tag`, `.blog-tag`, `.sup-role` — pill badges
- `.stat-card` — stat cell
- `.section-header` + `.section-title` + `.section-subtitle` + `.underline-accent` — section heading
- `.reveal` — IntersectionObserver fade-in
- `.navbar` + `.nav-inner` + `.nav-links` + `.nav-toggle`
- `.research-card`, `.quick-card`, `.blog-card`, `.pub-item`, `.grant-card`, `.sup-card`, `.course-card`, `.gallery-item`

### Shared JS behaviors (`script.js`)
- Navbar scroll class toggle
- Mobile nav toggle
- Active-link highlight by filename
- IntersectionObserver reveal
- Contact form stub + course resource toggle

## 2. New design system (tokens → primitives → components → sections → pages)

### Color tokens (50–950 scales, dual-mode)

**Teal (ocean primary)** — generated from #0d4f4a
```
--teal-50 #eef9f7  --teal-100 #d6f1ec  --teal-200 #b0e3db  --teal-300 #7fcec1
--teal-400 #4eb5a5 --teal-500 #2f9989  --teal-600 #1f7c70  --teal-700 #195f56
--teal-800 #154a43 --teal-900 #0d4f4a  --teal-950 #062e2a
```

**Algae green** — living, slightly lime
```
--algae-50 #effaec  --algae-100 #dbf4d4 --algae-200 #b9e8ad --algae-300 #8fd77f
--algae-400 #71c860 --algae-500 #5fb85a --algae-600 #4a9846 --algae-700 #3b7838
--algae-800 #2f5e2d --algae-900 #254824 --algae-950 #112611
```

**Cyan (bioluminescent highlight)**
```
--cyan-50 #ecfeff   --cyan-100 #cffafe --cyan-200 #a5f3fc --cyan-300 #67e8f9
--cyan-400 #22d3ee  --cyan-500 #06b6d4 --cyan-600 #0891b2 --cyan-700 #0e7490
```

**Warm sand (light-mode neutral)**
```
--sand-50 #fafaf7 --sand-100 #f4f2ea --sand-200 #e9e4d4 --sand-300 #d6ceb8
--sand-400 #b8ab8a --sand-500 #96896a --sand-600 #766b52 --sand-700 #5b523e
```

**Ink (dark-mode neutral)**
```
--ink-50 #eef2f3  --ink-100 #d0d8da  --ink-300 #7d8e92 --ink-500 #3c5155
--ink-700 #1d3034 --ink-800 #122023 --ink-900 #0a1214 --ink-950 #050a0b
```

**Amber (grants/citations only)**
```
--amber-300 #fcd34d --amber-500 #d4a853 --amber-700 #92660a
```

### Semantic tokens (light mode default, dark overrides)
```
--color-bg          --sand-50
--color-surface     #ffffff
--color-surface-2   --sand-100
--color-text        --ink-900
--color-text-muted  --ink-500
--color-border      rgba(13,79,74,0.08)
--color-primary     --teal-700
--color-primary-ink --teal-900
--color-accent      --algae-500
--color-glow        --cyan-400
--color-amber       --amber-500
```

### Spacing (4px grid)
`--space-1 4px … --space-24 96px` (1,2,3,4,5,6,8,10,12,16,20,24).

### Type scale (1.25 ratio, base 16px)
`--fs-xs .75 / --fs-sm .875 / --fs-base 1 / --fs-md 1.125 / --fs-lg 1.25 / --fs-xl 1.563 / --fs-2xl 1.953 / --fs-3xl 2.441 / --fs-4xl 3.052 / --fs-5xl 3.815rem`.

### Radius
`--r-sm 8 / --r-md 12 / --r-lg 16 / --r-xl 20 / --r-2xl 24 / --r-3xl 32 / --r-full 9999`.

### Shadow scale
- `--shadow-1` subtle float
- `--shadow-2` card at rest (clay dual-cast)
- `--shadow-3` card hover
- `--shadow-glow-cyan` bioluminescent halo
- `--shadow-glow-algae`

### Motion tokens
- `--ease-out-quart cubic-bezier(.25,1,.5,1)`
- `--ease-spring cubic-bezier(.5,1.2,.3,1)`
- `--dur-fast 160ms / --dur-base 260ms / --dur-slow 520ms / --dur-slower 900ms`

### Font stack
- Body: `Inter` (300–700)
- Display: `Playfair Display` (600–700) — reserved for hero H1 + section titles
- Mono: `JetBrains Mono` (400–600) — stat counters, equations, `.pub-citations`

## 3. Build order (one commit per feature)

1. **feat: design tokens + primitives foundation** — `:root` token block, primitives layer (buttons, tags, card shells), JetBrains Mono load.
2. **feat: animated microalgae hero background** — SVG sprite of Chlorella/Spirulina/diatom silhouettes, drifting + bubble rise CSS animations, gradient mesh. `prefers-reduced-motion` static.
3. **feat: animated stat counters + progress arc** — IntersectionObserver + rAF, JetBrains Mono digits.
4. **feat: scientific iconography** — 6 custom inline SVGs for research cards; hover animation per icon.
5. **feat: scroll-driven reveals upgraded** — staggered children, gentle parallax on hero.
6. **feat: hero photo treatment** — blob clip-path, rotating text ring, ambient glow.
7. **feat: Research Impact band section** — horizontal timeline + sparkline + pull-quote.
8. **feat: navigation upgrade** — scroll progress bar, active-link slider, mobile drawer.
9. **feat: dark mode toggle** — sun/moon button, localStorage + `prefers-color-scheme`, view-transition smoothing.
10. **feat: apply design system across all pages + micro-interactions polish** — propagate tokens to every Hidayah HTML file; button lift+glow, underline draw-in, focus ring, card lift.

## 4. Non-negotiables reminder
- Vanilla only. No framework.
- Lighthouse ≥ 90 mobile (not runnable in sandbox — noted).
- WCAG AA. Every motion under `prefers-reduced-motion` respects user.
- SEO: no tag removed. Canonical + OG + JSON-LD preserved.
- Content verbatim. Only the frame changes.
- Don't rename HTML files.

## 5. Aesthetic guardrails (anti-slop)
- No purple-pink gradient backgrounds.
- No glassy orbs, no neural-network imagery.
- Glassmorphism limited to navbar blur + subtle surface tint.
- Amber reserved for grants/citations.
- Hero illustrations = scientific silhouettes, not marketing fluff.
