# Kannan portfolio / GPTASTRA

An Astro portfolio inspired by the spatial grid, oversized typography, reflective form and scroll-driven presentation of https://alche.studio/. Content is adapted from https://kannabuilds.vercel.app/. The models, shaders and illustrated project covers in this build are original.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3004/. Astro manages the development server in the background; use `npx astro dev status`, `npx astro dev logs` or `npx astro dev stop` to manage it.

```sh
npm run build     # Type-check and create the static site in dist/
npm start         # Preview the production build on port 3004
npm run assets    # Recreate the original GLB model and illustrated covers
npm run test:e2e  # Browser checks using installed Google Chrome
```

Stop the development server before starting the production preview on the same port. If Windows holds Vite's dependency cache during a local check, set `VITE_CACHE_DIR` to a writable temporary directory; Vercel uses its normal cache automatically.

For production browser verification, preview on another port and set `PLAYWRIGHT_BASE_URL` to that URL before running `npm run test:e2e`.

## Editing

- `src/data/portfolio.ts`: profile, four visible projects and capabilities.
- `src/data/portfolio-under-review.ts`: four preserved projects tagged `#under-review`; not imported by the public website.
- `src/pages/`: home, work index and generated project detail pages.
- `src/layouts/Studio.astro`: shared header, footer and metadata.
- `src/styles/studio.css`, `portfolio-media.css` and `identity.css`: existing layouts, media, and the hero/works sequence.
- `src/scripts/site.ts`: Swup navigation, Lenis scrolling and GSAP gallery.
- `src/scripts/world.ts` and `src/shaders/`: Three.js scene and curved grid.
- `public/models/`, `public/images/projects/` and `public/fonts/`: local assets.
- `tests/portfolio.spec.ts`: navigation, project assets, mobile and reduced-motion checks. Screenshots are written to `artifacts/`.

The current site uses Astro static output, Swup page transitions, Three.js, GSAP and Lenis. The copied Next.js source remains in `src/app/` and can be run using `npm run legacy:dev`; it is excluded from the Astro build.

All four public project covers and detail-page previews use real screenshots captured from their live websites on 2026-10-03. V20 links to https://v20vrcricket.vercel.app/. The About section uses a compact passport-proportion portrait prepared from the user's supplied photo. Optimized WebP assets are hosted locally; source information and the portrait edit prompt are in `artifacts/source-media/README.md`. Run `node scripts/prepare-portfolio-media.mjs` to regenerate the earlier assets. The older covers remain available for future use.

Four projects remain in the separate `underReviewProjects` source archive for a future update; their routes and descriptions are excluded from the public build. The self-hosted Inter font license is in `public/fonts/OFL.txt`.

The hero uses `public/images/profile/kannan-original.jpg`, copied byte-for-byte from the supplied photo, with resized WebP derivatives. It is styled with opacity and soft CSS masks; no face generation or retouching is used. `node scripts/prepare-hero-media.mjs` regenerates the optimized hero and Porca & Vaca images. The existing `k-mark.glb` geometry is reused with revised lighting and placement.

GSAP scrubs the portrait and wordmark into the K, then brings in the spatial gallery. The K recedes in depth through the same transition. The four public projects are The Hooked Tales, Hokkaido, V20 — VR Cricket, and Porca & Vaca (https://pnv-kappa.vercel.app/). The new project's preview is an actual browser capture from its live site. About, Experience, Capabilities, Contact, navigation, and footer content retain their existing implementation. Reduced motion presents the hero and projects without pinning or collapse animation.

## Deployment

Use the included `vercel.json` configuration, which selects the Astro preset, runs `npm run build`, and publishes `dist`. No server runtime or secret environment variables are required. The canonical site URL is configured in `astro.config.mjs`; update it for the final deployment destination.
