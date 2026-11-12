// Autodesk Alias garage: catalogue and visibility switch.
//
// The garage is NOT public yet. It is built only when:
//   - running `npm run dev`, or
//   - the build sets PUBLIC_ALIAS_GARAGE=true (e.g. a Vercel preview env var).
// To launch it: add real models to `aliasModels`, set PUBLIC_ALIAS_GARAGE=true in
// production, and add the nav link in src/layouts/Studio.astro.
//
// Model pipeline (see docs/AWWWARDS_UPGRADE_PLAN.md §3.4):
//   Alias → FBX/OBJ → Blender cleanup → .glb → `npx gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp`
//   Name materials: paint, glass, tyre, rim, chrome, trim, light_front, light_rear, interior.
//   Put files in public/models/alias/<slug>.glb (target ≤ 6 MB each).

export type Vec3 = [number, number, number];

export type AliasModel = {
  slug: string;
  name: string;
  year: string;
  category: 'Concept' | 'Class-A study' | 'Product' | 'Study';
  summary: string;
  tools: string[];
  surfaces?: number;
  hours?: number;
  /** Optimised glTF in /public. When absent, the garage builds a placeholder form. */
  glb?: string;
  /** Static render for the list view, social cards and no-WebGL fallback. */
  poster?: string;
  paints: { name: string; color: string }[];
  hotspots: { label: string; note: string; position: Vec3 }[];
  process?: { label: string; image: string }[];
  /** Procedural stand-in silhouette used only until the real model exists. */
  placeholder?: 'coupe' | 'gt' | 'roadster' | 'hyper';
};

export const garageEnabled = import.meta.env.DEV || import.meta.env.PUBLIC_ALIAS_GARAGE === 'true';

/** Real Alias work. Empty until the models are supplied. */
export const aliasModels: AliasModel[] = [];

/** Clearly-labelled stand-ins so the experience can be designed and tested now. */
export const previewModels: AliasModel[] = [
  {
    slug: 'study-01', name: 'Study 01 — Coupé', year: '20XX', category: 'Concept', placeholder: 'coupe',
    summary: 'Placeholder form. Replace with the first Alias model: a two-door coupé surface study.',
    tools: ['Autodesk Alias', 'VRED'], surfaces: 0, hours: 0,
    paints: [{ name: 'Graphite', color: '#24252b' }, { name: 'Signal', color: '#ff5a1f' }, { name: 'Glacier', color: '#d9dde3' }, { name: 'Violet', color: '#5a4fd6' }],
    hotspots: [
      { label: 'Shoulder line', note: 'Where the highlight should run unbroken from headlamp to tail — checked with zebra analysis.', position: [0.4, 0.95, 0.9] },
      { label: 'Front fascia', note: 'Placeholder note for a G2-continuous transition around the intake.', position: [2.1, 0.55, 0] },
    ],
  },
  {
    slug: 'study-02', name: 'Study 02 — Grand Tourer', year: '20XX', category: 'Class-A study', placeholder: 'gt',
    summary: 'Placeholder form. Replace with a long-bonnet grand tourer.',
    tools: ['Autodesk Alias', 'Blender'], surfaces: 0, hours: 0,
    paints: [{ name: 'Racing green', color: '#1d3b2f' }, { name: 'Pearl', color: '#ecebe6' }, { name: 'Midnight', color: '#14182b' }],
    hotspots: [{ label: 'Bonnet crown', note: 'Placeholder: crown and reflection control on the long bonnet.', position: [1.4, 1.0, 0] }],
  },
  {
    slug: 'study-03', name: 'Study 03 — Roadster', year: '20XX', category: 'Study', placeholder: 'roadster',
    summary: 'Placeholder form. Replace with an open two-seater.',
    tools: ['Autodesk Alias'], surfaces: 0, hours: 0,
    paints: [{ name: 'Rosso', color: '#a3161f' }, { name: 'Silver', color: '#a9adb4' }, { name: 'Ink', color: '#101114' }],
    hotspots: [{ label: 'Cockpit opening', note: 'Placeholder: trimmed surfaces around the open cockpit.', position: [-0.2, 0.9, 0.6] }],
  },
  {
    slug: 'study-04', name: 'Study 04 — Hyper', year: '20XX', category: 'Concept', placeholder: 'hyper',
    summary: 'Placeholder form. Replace with a low, wide hypercar concept.',
    tools: ['Autodesk Alias', 'VRED'], surfaces: 0, hours: 0,
    paints: [{ name: 'Volt', color: '#c6f432' }, { name: 'Carbon', color: '#1a1b1f' }, { name: 'White', color: '#f2f1ee' }],
    hotspots: [{ label: 'Rear diffuser', note: 'Placeholder: aero surfaces at the rear.', position: [-2.2, 0.4, 0] }],
  },
];

export const garageModels = aliasModels.length ? aliasModels : previewModels;
export const garageIsPreview = aliasModels.length === 0;
