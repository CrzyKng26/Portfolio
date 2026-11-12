# Kannan Portfolio — Awwwards Upgrade Plan

**Created:** 2026-11-12 · **Repo:** `CrzyKng26/Portfolio` · **Baseline commit:** `4e54679`
**Goal:** Turn the portfolio into an Awwwards Site-of-the-Day level experience, beyond the reference (alche.studio), and add a dedicated **Autodesk Alias** section that is presented as a premium, cinematic **garage**.

Progress is tracked in [`PROJECT_TRACKER.md`](../PROJECT_TRACKER.md).

---

## 1. Audit of the current site

### What already works (keep and build on)
| Area | Current state |
|---|---|
| Stack | Astro 7 static output, Three.js 0.185, GSAP + ScrollTrigger, Lenis, Swup page transitions. A good base for an award-level site. |
| Hero | The portrait and the KANNAN wordmark are pulled into the 3D "K" mark on scroll (`site.ts`), over a shader grid (`grid.frag.glsl`). This is the strongest moment on the site. |
| Works | A scroll-pinned 3D card rail with depth arrival, a light sweep, captions that animate as you scroll, and prev/next buttons. |
| Craft | Reduced-motion support, skip link, aria-live captions, chapter rail, self-hosted fonts, WebP, Playwright tests, and sound only after you opt in. |
| Content | Four real projects with real screenshots, an honest About and Experience section, and a clear "Webperience" positioning. |

### Gaps that stop it from reaching Awwwards level
| # | Gap | Why it matters |
|---|---|---|
| G1 | **Dead legacy code**: `src/app/`, `src/components/*.tsx`, `next`, `@react-three/*`, `eslint-config-next`, `.next-gptastra/`, and `AGENTS.md` describing Next.js. | It bloats installs and confuses every AI agent and contributor. The Obsidian note even lists the tech as "Next.js". |
| G2 | **Two WebGL renderers** (`bg` and `renderer` in `world.ts`). | Each one is a separate GPU context. The Alias garage would add a third. We need one shared renderer and scene manager. |
| G3 | **Minified one-line code** in `site.ts` and `index.astro`. | It is hard to extend, review or debug. A Garage module cannot be layered on top of it safely. |
| G4 | **No loader, no cursor, no transition choreography** in the Astro build (these exist only in the legacy React code). | Awwwards juries score "Creativity" and "Design" on the first 5 seconds, and page-to-page continuity matters. |
| G5 | **Thin case-study pages** (`work/[slug].astro`, 24 lines). | Judges and clients open a project. Right now the experience stops there. |
| G6 | **Sound is a raw sine chord.** | alche.studio gates sound on entry and uses designed audio. A real sound design layer is a differentiator. |
| G7 | **Identity**: Cormorant and Inter with a purple-and-white palette is elegant but generic. | It needs a signature: a type system, a grid, a colour system and motion rules that make the site recognisable at a glance. |
| G8 | **Performance and SEO polish**: no OG images or sitemap, no structured data, no KTX2/Draco pipeline, no GPU-tier fallback. | The Developer score: Lighthouse 90+ and smooth 60 fps on mid-range phones. |
| G9 | **No 3D/industrial-design work shown.** | Your Alias modelling is a rare skill for a web developer. It should be the site's showpiece. |

### Reference read: alche.studio (inspiration only, nothing copied)
A sound-consent gate on entry, a scroll-led key visual, oversized bilingual typography, mission and vision statements as full-screen moments, a tag-filtered works grid, and strong proof (metrics) on each project.
**How we go beyond it:** a real-time 3D world that persists across pages, an interactive product-design showroom (the Garage) that alche does not have, designed sound, and case studies that *demonstrate* the work instead of only describing it.

### More references, in the same spirit as alche (added 2026-11-12)
These are well-known award-winning sites to study for one technique each. Copy nothing.
| Site | Study it for |
|---|---|
| igloo.inc | A scroll-driven 3D world that feels like one continuous camera move, plus a strong sound design. Closest to the alche direction, pushed further. |
| lusion.co | Physics and WebGL interaction on a portfolio, and how a studio lab section earns Developer points. |
| Bruno Simon's portfolio (bruno-simon.com) | A playful 3D portfolio you *drive*. Directly relevant to the Garage. |
| Active Theory (activetheory.net) | A persistent WebGL scene across page transitions. |
| Locomotive (locomotive.ca) and Obys (obys.agency) | Typography-led motion, split-text reveals and smooth-scroll rhythm. |
| Car configurators (Porsche, Lucid, Rivian) | Turntable, paint swatch and hotspot conventions that visitors already understand. |
| Luxury watch pages (Rolex, A. Lange & Söhne) | The slow, endless rotation and lighting of a single precious object. This is the "watch collection" feel for the Garage. |

---

## 2. Creative direction — "Studio & Garage"

The concept in one line: **A designer-developer's private studio. The upper floor is where websites are built. Below it is the garage where the cars are designed.**

- **Brand idea:** *Webperience*. Every surface should feel crafted, both the code and the curves.
- **Signature motif:** **The surface highlight line.** Zebra and reflection-line analysis is the most recognisable visual in Autodesk Alias. Light lines flowing across glossy surfaces become the site's motif: in the hero shader, in hover states, in section transitions, and literally on the cars.
- **Palette:** Midnight graphite `#07070a`, studio white `#f2f1ee`, one accent, either signal orange `#ff5a1f` (garage, automotive) or keep the existing violet as the "web" world. Two worlds, two accents, one system.
- **Type:** One sharp grotesk for display (variable, wide, for example a licensed Neue Machina, PP Neue Montreal or a free option such as Clash Display or Satoshi), one mono for specs and labels (JetBrains Mono or IBM Plex Mono). Retire Cormorant, or keep it only for italic accents.
- **Motion rules:** Ease `expo.out` for entrances and `power2.inOut` for camera moves. Nothing moves without a reason. Scroll always drives the camera, never pure decoration.
- **Sound:** An opt-in gate on first visit (as in alche, but designed): a low room tone, UI ticks, a roller-shutter and fluorescent-tube "clunk" in the garage, a soft turntable hum in the viewer. Muted by default for reduced-motion users.

---

## 3. The Alias Garage — experience spec (your idea, refined)

### 3.1 Narrative flow
1. **Approach (entry from the menu or home).** The screen goes dark. A single tube light flickers on with sound. A **roller shutter rises** as you scroll, revealing the garage.
2. **The Bay Row (browse).** A dim, premium garage: polished concrete with soft reflections, tube lights overhead, a back wall pegboard with tools and sketches. Each **car sits in its own bay on a turntable**, slowly rotating like a watch in a watch winder (about one revolution every 20–30 s).
   - **Scroll, arrow keys, swipe or Next/Prev** dolly the camera sideways to the next bay. The bay lights brighten as the car arrives. A **spec plaque** slides in: model name, year, category (concept, Class-A study, product), Alias tools used, surface count and modelling hours.
   - A progress indicator such as `BAY 02 / 06` in mono type.
3. **Enter (inspect).** Click "Enter" or press Enter. The camera pushes in and the garage walls fade into an **infinite studio cyclorama** (white or dark). The car sits on a **constantly rotating turntable**. This is the "watch collection" moment: slow, premium, endless rotation.
   - **Drag to orbit** with inertia. Rotation pauses while you drag and resumes smoothly after 3 s idle. Scroll to zoom within limits.
   - **Viewer modes**, Alias-authentic:
     - `SHADED`: the hero paint material (clearcoat, flakes).
     - `ZEBRA`: a live zebra-stripe shader for surface continuity analysis. This is the signature feature that tells judges *this person really models in Alias*.
     - `WIRE` / `CV`: wireframe or isoparm overlay that shows topology and surface layout.
     - `CLAY`: matte clay render.
   - **Paint swatches** (3–5 colours) with a smooth transition.
   - **Hotspots** (2–4 per model): click to fly the camera to a detail such as a headlight, a surface transition or a fillet, with a short note on the design decision.
   - **Process strip**: sketch, then curves, then surfaces, then render. A horizontal strip that tells the design story.
4. **Exit.** Esc or "Back to garage" plays the camera move in reverse back to the bay.

### 3.2 Beyond the brief (premium extras)
- **Light sweep on arrival:** a bright line passes across the car body when it arrives in a bay (the motif).
- **Turntable "watch winder" detail:** a brushed-metal turntable with a slow-ticking index ring and the model number engraved.
- **Ambient dust particles** in the light cones. Subtle.
- **Garage door outro:** leaving the section lowers the shutter.
- **Photo mode:** a "Capture" button saves a PNG of the current view (`renderer.domElement.toBlob`).
- **Night/Day toggle:** switches between the garage HDRI and the studio HDRI.

### 3.3 Accessibility and fallbacks
- A **list view** toggle with static renders and text for every model (screen readers, no-WebGL, judges in a hurry).
- `prefers-reduced-motion`: no shutter animation and no auto-rotation. Instant camera cuts.
- **GPU tiering** (`detect-gpu`): low-tier devices get a pre-rendered **turntable image sequence** (36–72 frames, AVIF) instead of real-time 3D. Same look, no lag.
- Full keyboard support: ←/→ bays, Enter inspect, Esc exit, 1–4 view modes.

### 3.4 Asset pipeline (Alias to web)
| Step | Tool | Output / target |
|---|---|---|
| 1. Export | Alias: **tessellate** the NURBS, export **FBX** or **OBJ** (or via VRED or Blender) | A clean mesh per material group: body, glass, tyres, trim, lights |
| 2. Clean | **Blender**: merge, fix normals, name materials consistently, bake AO, set the origin at the floor centre and the scale in metres | `model.blend` |
| 3. Export | Blender, glTF 2.0 (`.glb`) | Raw GLB |
| 4. Optimise | `@gltf-transform/cli`: `meshopt` or `draco` compression, KTX2/Basis textures, `weld`, `simplify` for a LOD1 | **Hero model ≤ 6 MB, LOD1 ≤ 1.5 MB** |
| 5. Renders | Alias or VRED or Blender renders, plus turntable frames for the fallback | AVIF and WebP |
| 6. Data | `src/data/alias.ts` entry | Name, year, specs, colours, hotspots, process images |

Material naming convention (so the code can bind materials automatically): `paint`, `glass`, `tyre`, `rim`, `chrome`, `trim`, `light_front`, `light_rear`, `interior`.

### 3.5 Technical architecture
```
src/pages/alias/index.astro         → Garage route (bay row)
src/pages/alias/[slug].astro        → Deep-linkable inspect view (shares the same canvas)
src/data/alias.ts                   → Model catalogue (typed)
src/scripts/engine/                 → NEW shared WebGL engine (one renderer for the whole site)
  ├─ renderer.ts                    → Single WebGLRenderer, DPR cap, resize, visibility pause
  ├─ sceneManager.ts                → Swaps scenes (home world ↔ garage) across Swup transitions
  ├─ loaders.ts                     → GLTF + Meshopt/Draco + KTX2, cached, with progress events
  └─ gpuTier.ts                     → Quality presets and fallback decisions
src/scripts/garage/
  ├─ garageScene.ts                 → Environment, floor reflector, tube RectAreaLights, bays
  ├─ bayController.ts               → Scroll/keys/swipe → camera dolly; lazy-loads neighbouring bays
  ├─ turntable.ts                   → Constant rotation + drag-orbit with inertia + idle resume
  ├─ inspectController.ts           → Enter/exit camera choreography (GSAP), hotspots
  ├─ materials/zebra.ts             → Zebra-stripe ShaderMaterial (view-space reflection stripes)
  ├─ materials/carPaint.ts          → MeshPhysicalMaterial clearcoat + flake normal
  └─ ui.ts                          → Plaque, bay counter, mode switcher, paint swatches
```
Libraries to add: `postprocessing` (subtle bloom, SMAA, vignette), `detect-gpu`, `@gltf-transform/cli` (dev only), Draco/Meshopt decoders in `public/decoders/`, CC0 HDRIs (Poly Haven) at 1–2k.
Performance budget for the Garage: **≤ 120 draw calls, ≤ 1.5 M triangles on screen, 60 fps on a mid-range laptop, 30+ fps on mobile**, and only the current bay plus its neighbours loaded.

---

## 4. Whole-site upgrades

| Area | Upgrade |
|---|---|
| **Preloader** | A loader built from the highlight-line motif: lines sweep across a black canvas and resolve into the K. Real asset progress from the engine loaders. Then the sound gate. |
| **Cursor** | A magnetic cursor with context labels ("View", "Drag", "Enter"). In the Garage it becomes a crosshair or orbit icon. Off on touch devices. |
| **Navigation** | A full-screen menu with a WebGL distortion reveal. Five items: Works, **Garage**, About, Lab, Contact. A persistent "Garage" call to action with a small rotating car icon. |
| **Page transitions** | Swup combined with the shared WebGL canvas: the clicked card's image becomes a plane that flies to fill the screen, then the case-study page takes over (a shared-element transition). |
| **Home hero** | Keep the K absorption. Add the highlight-line shader on the K mark and a chapter that teases the Garage ("Below the studio, there's a garage ↓"). |
| **Works** | Keep the 3D rail. Add a filter row (Web / Brand / Experience / 3D), hover video previews (short MP4/WebM loops) and metrics per project. |
| **Case studies** | Rebuild `work/[slug]`: hero video, problem → approach → craft → result, live-site embed frame, before/after, credits, a "Next project" pull-through. |
| **About** | Swap in an interactive timeline: the TCS → independent → Hooked Tales → Alias story told through scroll. |
| **Lab (optional)** | Small experiments (shaders, AI tools), the kind of section that earns Developer Award points. |
| **Contact** | An oversized closing statement, a copy-email button, a live local time (Chennai), availability status, socials. |

---

## 5. Phased work plan

| Phase | Scope | Est. | Exit criteria |
|---|---|---|---|
| **P0 — Foundation** | Remove legacy Next/React code and deps, rewrite `AGENTS.md` for Astro, reformat the minified code into modules, add lint and prettier, set up the shared WebGL engine (one renderer), CI build with Playwright. | 3–4 days | `npm run build` clean, one WebGL context, tests green, no Next deps |
| **P1 — Identity & design system** | Type, colour, grid, spacing and motion tokens. Highlight-line motif. Sound design brief. Mood board and key frames for Home and Garage (Figma). | 4–5 days | Approved style tiles and Garage key frames |
| **P2 — Alias asset pipeline** | Export 1 pilot car from Alias, then Blender, then glTF, then gltf-transform. Validate size and fidelity. Write `alias.ts` schema. Then the remaining models. | 3–5 days (pilot) | Pilot GLB ≤ 6 MB that looks right in a three.js test page |
| **P3 — Garage MVP** | Garage scene, bays, turntable auto-rotate, scroll/keys/swipe navigation, plaque UI, Enter/Exit inspect with drag-orbit and idle resume, list-view fallback. | 7–10 days | All models browsable and inspectable at 60 fps on desktop |
| **P4 — Garage premium** | Roller shutter intro, tube flicker, zebra/wire/clay modes, paint swatches, hotspots, process strip, sound, light sweep, photo mode, GPU-tier image-sequence fallback. | 6–8 days | Feature-complete Garage, mobile 30+ fps or fallback |
| **P5 — Site experience** | Preloader with sound gate, cursor, full-screen menu, shared-element transitions, works filters and hover video, About timeline, Contact. | 7–9 days | Seamless flow Home → Work → Garage → Contact |
| **P6 — Case studies** | Rebuild the 4 project pages with real process content and media. | 4–5 days | Every project has a full story |
| **P7 — Performance, a11y, SEO** | Lighthouse 90+ on mobile, OG images per page, sitemap, JSON-LD, axe audit, reduced motion, keyboard paths, cross-browser (Safari WebGL!). | 3–4 days | Budgets met, axe clean |
| **P8 — Launch & submit** | Custom domain, analytics, final QA, record a 30 s showcase video, submit to Awwwards, CSSDA, FWA, and post on LinkedIn and Behance. | 2 days | Live and submitted |

**Total:** about 7–9 weeks part-time. Garage-first ordering (P0, then P2 and P3 in parallel with P1) lets the showpiece land early.

---

## 6. Inputs needed from Kannan
1. **Alias models:** how many, which ones, and the source files (`.wire`) or exports (FBX, OBJ or STEP).
2. Per model: name, year, brief or purpose, modelling hours, tools used (Alias, VRED, Blender, KeyShot), and 2–4 design decisions to highlight as hotspots.
3. **Process media:** sketches, curve-network screenshots, renders, and zebra-analysis screenshots.
4. **Accent colour and type choice:** orange garage accent, or keep violet. A licensed font or a free one.
5. **Domain:** stay on `kannabuilds.vercel.app` or move to a custom domain.
6. **Sound:** design it ourselves (synth and foley) or license a pack.
