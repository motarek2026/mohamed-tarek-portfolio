# Design System Master — Mohamed Tarek Portfolio 2026

> **Generated via:** `ui-ux-pro-max` & `frontend-design` Skills (`UI_Category: Portfolio/Personal + Creative Agency`)
> **Detected Stack:** Next.js 14.2 (App Router, JavaScript) + React 18 + GSAP + Lenis (`1.3.27`)
> **Bilingual / RTL Level:** `full` (`en` LTR + `ar` RTL with `dir="rtl"` mirroring)

---

## 1. Visual Direction & Style Priority

- **Primary Style:** Motion-Driven + Glassmorphism + Dark Mode (`#0a0812`)
- **Recommended Pattern:** Storytelling-Driven Motion Presentation Portfolio
- **Brand Identity Palette:**
  - `--bg`: `#0a0812` (Dark) / `#ffffff` (Light)
  - `--card`: `#14101f` (Dark) / `#f4f2fa` (Light)
  - `--ink`: `#f4f3f8` (Dark) / `#121317` (Light)
  - `--mute`: `#a5a2b4` (Dark) / `#5b5f69` (Light)
  - `--pu` (Primary Violet): `#7C3AED` (`--pu2`: `#A78BFA`)
  - `--accent` (Electric Blue): `#0359D7`
  - `--pk` (Vivid Fuchsia): `#E879F9`

---

## 2. Typography & Hierarchy

- **Display Font (`--f-display`):** `'Bricolage Grotesque', 'Readex Pro', system-ui, sans-serif`
- **Body / Arabic Font (`--f-body` / `--f-ar`):** `'Readex Pro', 'Bricolage Grotesque', system-ui, sans-serif`
- **Type Scale Tokens:**
  - `--fs-meta`: `13px`
  - `--fs-ui`: `14px`
  - `--fs-sm`: `15px`
  - `--fs-body`: `17px` (`line-height: 1.7` EN / `1.9` AR)
  - `--fs-lead`: `20px`
  - `--fs-h3`: `clamp(24px, 2.8vw, 34px)`
  - `--fs-h2`: `clamp(32px, 4.6vw, 64px)`
  - `--fs-h1`: `clamp(40px, 7vw, 96px)`
- **Numeric Discipline:** `font-variant-numeric: tabular-nums` on all counters, indices, and live clocks.

---

## 3. Motion Architecture (`--motion 8`)

- **Inertial Scroll:** `Lenis` (`duration: 1.15`, `smoothWheel: true`) synced with `gsap.ticker`.
- **Easing Tokens:**
  - `--ease-smooth`: `cubic-bezier(.22, .8, .2, 1)`
  - `--ease-elastic`: `cubic-bezier(.34, 1.56, .64, 1)`
- **GPU Compositor Rule:** Animate `transform`, `translate`, and `opacity` only; never animate `width`, `height`, `top`, or `left`.
- **Magnetic Pull Clamping:** Clamped to `±14px` X / `±12px` Y via individual CSS `translate` property.
- **Offscreen & Hidden-Tab Hygiene:** Pause continuous timers/loops (`Process`, `Contact` clock, `Marquee` velocity) on `document.hidden` (`visibilitychange`) and when offscreen (`IntersectionObserver`).
- **Reduced Motion:** Full `@media (prefers-reduced-motion: reduce)` override disabling non-essential motion and rendering final readable states immediately.

---

## 4. Accessibility & RTL Checklist (`references/quick-reference.md`)

- **WCAG 2.2 AA `dragging-alternative`:** Every draggable track (`VisualVault`) includes single-pointer Prev/Next buttons (`.vault-nav-btn`) and keyboard `ArrowLeft` / `ArrowRight` support.
- **Touch Target Minimum (`touch-target-size`):** `44×44px` minimum hit area on coarse pointers (`@media (pointer: coarse)`) with `touch-action: manipulation`.
- **Live Status Updates (`contextual-live-badge-updates`):** Screen-reader polite status region (`role="status" aria-live="polite"`) announces filtered project counts without stealing focus.
- **RTL Parity:** Directional arrows, timelines, and horizontal scroll steps mirror automatically when `html[dir="rtl"]` is active.

---

## 5. `frontend-design` Editorial Restraint & Anti-Tell Rules

- **No Redundant Eyebrow Labels:** Do not stack a tracked-out ALL-CAPS eyebrow label above a section `<h2>` that repeats the same copy. Let the primary display heading (`Bricolage Grotesque` / `Readex Pro`) carry the hierarchy directly, paired with a natural sentence-case lead subtitle where helpful.
- **Sequence-Only Numbering:** Reserve `01 / 02 / 03` ordinal numbering strictly for true sequential content (`Process` 5-stage workflow and indexed `Projects` archives). Do not stamp ordinal numbers onto parallel capability grids (`Services`).
- **No Unmotivated Watermarks:** Avoid oversized background text watermarks (`"DESIGN"`) that compete with hero focal points.
- **Interaction-Driven Motion Over Self-Running Shimmers:** Button sheens (`.btn.primary::after`, `.wacta::after`) and card micro-previews (`.svc-fx`, `.folder-pocket` 3-layer fan) respond to user `:hover` / `:focus-visible` intent rather than running continuous unattended shimmer or hue-rotation loops.
