# Project Tracker — Kannan Portfolio (Awwwards Upgrade)

**Repo:** `CrzyKng26/Portfolio` · **Path:** `D:\Websites\webdev portfolio\Kannan main`
**Plan:** [`docs/AWWWARDS_UPGRADE_PLAN.md`](docs/AWWWARDS_UPGRADE_PLAN.md)
**Obsidian context:** `D:\Obsidian\06_AI\03_Context\Projects\Webdev-Portfolio\KANNAN_MAIN_CONTEXT.md`

> Update this file at the end of every work session: tick tasks, add a log entry at the top of the Work Log, and update the status table.
> The Obsidian memory watcher watches this folder, so changes to this file are picked up automatically.

---

## Status

| Phase | Status | Progress |
|---|---|---|
| P0 Foundation and cleanup | ⏳ Not started | 0 / 7 |
| P1 Identity and design system | ⏳ Not started | 0 / 6 |
| P2 Alias asset pipeline | 🟡 Ready, waiting for models (future) | 2 / 6 |
| P3 Garage MVP | ✅ Built (private, behind `PUBLIC_ALIAS_GARAGE`) | 8 / 8 |
| P4 Garage premium | 🟡 In progress | 6 / 10 |
| P5 Site experience | 🟡 In progress | 5 / 7 |
| P5b Credentials | ✅ Done | 8 certificates live |
| P6 Case studies | ⏳ Not started | 0 / 5 |
| P7 Performance, a11y, SEO | ⏳ Not started | 0 / 7 |
| P8 Launch and submit | ⏳ Not started | 0 / 5 |

**Current focus:** Motion layer and credentials are live on the public site. The Alias Garage is built as a private preview with placeholder forms, waiting for real models (future work). Next: P0 cleanup and P6 case studies.

**Garage visibility:** `/alias/` exists only in `npm run dev`, or when the build sets `PUBLIC_ALIAS_GARAGE=true`. To launch it, add models to `src/data/alias.ts`, set the env var on Vercel, and add a nav link.

---

## Tasks

### P0 — Foundation and cleanup
- [ ] Remove legacy Next.js/React code (`src/app/`, `src/components/*.tsx`, `next.config.ts`, `next-env.d.ts`, `.next-gptastra/`) and deps (`next`, `@react-three/*`, `eslint-config-next`, `lucide-react`)
- [ ] Rewrite `AGENTS.md` / `CLAUDE.md` for the Astro stack
- [ ] Rename the package (`gptastra-portfolio` → `kannan-portfolio`)
- [ ] Reformat `site.ts`, `world.ts` and `index.astro` into readable modules; add Prettier
- [ ] Build the shared WebGL engine (`src/scripts/engine/`): one renderer, scene manager, loaders, GPU tier
- [ ] Migrate the home world (`world.ts`) onto the engine (2 contexts → 1)
- [ ] Green `npm run build` and Playwright on CI (GitHub Actions)

### P1 — Identity and design system
- [ ] Mood board (Home and Garage)
- [ ] Choose the type pairing (display grotesk + mono) and license it
- [ ] Colour tokens (graphite, studio white, web accent, garage accent)
- [ ] Grid, spacing and motion tokens (`src/styles/tokens.css`)
- [ ] Highlight-line motif: shader prototype
- [ ] Key frames: Garage bay row, inspect view, preloader

### P2 — Alias asset pipeline
- [ ] Receive the model list and files from Kannan
- [ ] Pilot: Alias → FBX/OBJ → Blender cleanup → GLB
- [ ] `gltf-transform` optimisation script (`scripts/optimize-models.mjs`): meshopt, KTX2, LOD1
- [x] Material naming convention defined; the loader auto-binds `paint` (see `src/data/alias.ts` header)
- [x] `src/data/alias.ts` typed schema with 4 labelled placeholder entries; GLB + Meshopt loader ready
- [ ] Remaining models processed (each ≤ 6 MB hero, ≤ 1.5 MB LOD1)

### P3 — Garage MVP
- [x] `/alias/` route (private: dev or `PUBLIC_ALIAS_GARAGE=true`, noindex while placeholders); nav entry deferred until launch
- [x] Garage environment: concrete floor, ribbed wall, tube lights, one moving RectAreaLight, room environment, bays
- [x] Turntables with constant "watch-winder" auto-rotation (~24 s per revolution)
- [x] Bay navigation: scroll, ←/→ keys, swipe, Next/Prev buttons
- [x] Spec plaque UI plus `BAY 0X / 0N` counter
- [x] Enter → inspect (camera push, fade to studio); Esc → back
- [x] Drag-orbit with damping; rotation pauses while dragging and resumes after 2.8 s
- [x] List-view fallback (no-WebGL, screen readers)

### P4 — Garage premium
- [x] Roller-shutter intro plus tube-light flicker
- [x] Zebra-stripe shader mode
- [x] Wire and Clay modes (keys 1–4)
- [x] Car-paint material (clearcoat) plus swatches
- [x] Hotspots with notes (fly-to camera still to do)
- [ ] Process strip (sketch → curves → surfaces → render)
- [x] Light sweep on bay arrival (bay lights power up as the car arrives)
- [ ] Garage sound design
- [ ] Photo mode (PNG capture)
- [ ] GPU-tier fallback: turntable image sequence

### P5 — Site experience
- [x] Preloader (counter tied to font and asset load, highlight-line sweep), once per session
- [x] Sound-consent gate plus a richer ambient sound (filtered, breathing chord)
- [x] Magnetic context cursor ("View", "Verify", "Say hi", "Enter")
- [ ] Full-screen menu with WebGL reveal
- [x] Page-transition curtain (Swup) — shared-element version still to do
- [ ] Works filters (hover video slot ready: `project.video`)
- [ ] About timeline and Contact redesign
- [x] Extras: split-text heading reveals, velocity marquee, scroll progress, hero letter entrance, portrait parallax, wordmark light sweep

### P6 — Case studies
- [ ] Case-study template (problem → approach → craft → result)
- [ ] The Hooked Tales
- [ ] Hokkaido
- [ ] V20 — VR Cricket
- [ ] Porca & Vaca

### P7 — Performance, a11y, SEO
- [ ] Lighthouse mobile ≥ 90 on all pages
- [ ] OG images per page
- [ ] Sitemap plus JSON-LD (Person, CreativeWork)
- [ ] axe audit clean
- [ ] Reduced-motion and keyboard paths verified
- [ ] Safari / iOS WebGL testing
- [ ] Bundle and model budgets enforced

### P8 — Launch and submit
- [ ] Custom domain plus analytics
- [ ] Final QA pass
- [ ] 30 s showcase video
- [ ] Submit to Awwwards, CSSDA and FWA
- [ ] LinkedIn and Behance launch posts

---

## Open questions / blockers
- Alias models are a future endeavour; the garage stays private until they exist
- Higgsfield: the connected workspace has 0 credits (free plan) and the connector cannot generate media. Generate clips in Higgsfield directly, then drop them into `public/videos/`
- Accent colour and font licensing decision (blocks P1)
- Custom domain? (blocks P8)

---

## Work Log
_Newest first. Format: `### [YYYY-MM-DD HH:MM] Title` → Done / Files / Decisions / Next._

### [2026-11-12 15:15] Motion layer, credentials section, private Alias Garage
- **Done:**
  - Preloader with a sound gate (once per session).
  - Magnetic cursor, page-transition curtain, split-text reveals, velocity marquee, scroll progress, hero entrance and parallax, richer ambient sound.
  - Credentials section with 8 certificates: Claude Certified Developer (Credly link), Azure AI Fundamentals, and 6 Udemy courses with `ude.my` verify links.
  - Alias Garage at `/alias/`: bays, watch-winder turntables, wheel/key/swipe navigation, inspect with orbit, Zebra/Wire/Clay modes, paints, hotspots, shutter intro, list view and adaptive resolution. It uses 4 labelled placeholder cars.
  - Project-card video slot for future Higgsfield clips.
- **Files:**
  - New: `src/scripts/motion.ts`, `src/scripts/garage/{garage,concept,materials}.ts`, `src/data/alias.ts`, `src/pages/alias/[...model].astro`, `src/styles/{motion,credentials,garage}.css`, `tests/upgrade.spec.ts`, `.claude/launch.json` (dev on port 3006).
  - Edited: `index.astro`, `Studio.astro`, `site.ts`, `portfolio.ts`, `ProjectArt.astro`, `env.d.ts`, `tests/portfolio.spec.ts`.
- **Verified:** `astro check` reports 0 errors. Playwright: 10/10 pass on the dev server. The production build has 6 pages and no `/alias/`. A build with `PUBLIC_ALIAS_GARAGE=true` includes `/alias/` (noindex). There is no horizontal overflow at 390 px.
- **Decisions:** The garage is hidden by build flag, not just unlinked. A single moving area light keeps the garage cheap on integrated GPUs. The shutter uses a CSS transition (wall-clock) so it never stalls. The preloader is a labelled dialog (accessible).
- **Not done / next:** P0 cleanup, full-screen menu, shared-element transitions, works filters, case studies, real Alias models, Higgsfield clips. Nothing committed yet.

### [2026-11-12 13:35] Obsidian project note refreshed
- **Done:** With Kannan's approval, replaced the stale "Next.js / Unknown" content in `D:\Obsidian\01_Projects\webdev-portfolio--Kannan-main-.md` with verified facts and the current plan status.
- **Next:** Recheck in the next session that the vault's discovery engine has not regenerated the note.

### [2026-11-12 13:25] Site audit + Awwwards upgrade plan + Alias Garage spec
- **Done:** Audited the codebase (Astro 7, Three.js, GSAP, Lenis, Swup; legacy Next.js code still present). Reviewed the alche.studio reference. Wrote the full upgrade plan, including the Alias Garage experience spec, asset pipeline, architecture and phases. Created this tracker. Connected the project to the Obsidian vault context.
- **Files:** `docs/AWWWARDS_UPGRADE_PLAN.md` (new), `PROJECT_TRACKER.md` (new). Obsidian: `06_AI/03_Context/Projects/Webdev-Portfolio/KANNAN_MAIN_CONTEXT.md` (new), ledger and Claude work log appended.
- **Decisions:** Stay on Astro and Three.js (no framework switch). One shared WebGL renderer before building the Garage. Zebra-stripe analysis as the signature Alias feature. Highlight-line motif as the site-wide identity.
- **Next:** Kannan supplies the Alias models and inputs. Start P0 cleanup.
