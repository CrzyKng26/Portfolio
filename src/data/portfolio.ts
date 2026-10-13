// Verified against kannabuilds.vercel.app on 2026-09-21.
// Website screenshots refreshed on 2026-10-03. Archived projects live separately
// in portfolio-under-review.ts and are not imported by the public website.
export const profile = {
  name: 'Balachander Kannan',
  shortName: 'Kannan',
  location: 'Chennai, India',
  role: 'Independent developer',
  linkedin: 'https://www.linkedin.com/in/kannan-b-7bb4a223b/',
  original: 'https://kannabuilds.vercel.app',
  intro: 'Independent developer building AI-assisted web products and automation systems. Background in enterprise IT operations at TCS; now building tools that move faster, decide smarter, and ship with confidence.',
};

export const projects = [
  {
    slug: 'the-hooked-tales', title: 'The Hooked Tales', year: '2024', category: 'Web / Commerce',
    tags: ['HTML', 'CSS', 'JavaScript', 'Netlify'], status: 'Live business',
    role: 'Co-founder — operations, website, social media, retail strategy',
    description: 'A handmade crochet business — built and operated end-to-end on the commercial side: site, brand presence, pricing, marketing, and a live in-person retail launch.',
    focus: 'From a handmade product to a real business.',
    details: ['Product line planning, pricing strategy, digital presence, and retail execution.', 'A live in-person retail stall with physical marketing collateral and a social media giveaway.', 'An ongoing website and social media operation, built around real customers.'],
    image: '/images/projects/hooked-tales-site.webp', art: 'The Hooked Tales — live storefront', color: '#c2355d',
    screenshot: '/images/projects/hooked-tales-site.webp', screenshotAlt: 'The Hooked Tales storefront with its StitchVerse crochet collection',
    live: 'https://thehookedtales.netlify.app/',
  },
  {
    slug: 'hokkaido', title: 'Hokkaido', year: '2024', category: 'Web / Brand',
    tags: ['HTML', 'CSS', 'JavaScript', 'Netlify'], status: 'Live website', role: 'Designer and developer',
    description: 'A brand site for a restaurant client — built to carry the feeling of the dining experience, not just list a menu. The brief was atmosphere, not information.',
    focus: 'The dining experience starts before the first visit.',
    details: ['A restaurant website shaped around atmosphere and brand identity.', 'Visual storytelling that translates a physical dining experience into a browser.', 'An expression of Webperience: a website should feel like the business before it explains it.'],
    image: '/images/projects/hokkaido-site.webp', art: 'Hokkaido — live restaurant website', color: '#d7ac71',
    screenshot: '/images/projects/hokkaido-site.webp', screenshotAlt: 'Hokkaido restaurant homepage with its Japanese wordmark and reservation links',
    live: 'https://hokkaidojapres.netlify.app/',
  },
  {
    slug: 'v20-vr-cricket', title: 'V20 — VR Cricket', year: '2024', category: 'Web / Experience',
    tags: ['HTML', 'CSS', 'JavaScript'], status: 'Live website', role: 'Designer and developer',
    description: 'Built to translate a VR cricket experience into a 2D website — letting a visitor feel the immersive, first-person quality of the game through a standard browser, without a headset.',
    focus: 'A window into the game. No headset required.',
    details: ['A client website for a virtual-reality cricket product.', 'A visual experience informed by the immersive nature of the game.', 'Designed to communicate an unfamiliar product through an everyday browser.'],
    image: '/images/projects/v20-entry.webp', art: 'V20 — virtual arena entry screen', color: '#71c9fa', live: 'https://v20vrcricket.vercel.app/',
    screenshot: '/images/projects/v20-site.webp', screenshotAlt: 'V20 Cricket website showing Step In and its immersive sports experience introduction',
  },
  {
    slug: 'porca-vaca', title: 'Porca & Vaca', year: '2026', category: 'Web / Brand / Experience',
    tags: ['Web design', 'Interaction', 'Restaurant'], status: 'Live website', role: 'Designer and developer',
    description: 'A cinematic restaurant website built around meat, fire, storytelling, and interaction. An atmospheric entrance leads into a hands-on exploration of the kitchen, the menu, and the house in Alwarpet.',
    focus: 'Meat, fire, and a story you can explore.',
    details: ['A cinematic entrance and an editorial brand story for the Alwarpet restaurant.', 'Interactive meat-science tools: a pit calculator, cut compass, doneness guide, and wood-and-fire exploration.', 'A scroll-driven dry-aging journey, signature selections, a filterable menu, and direct WhatsApp reservations.'],
    image: '/images/projects/porca-vaca-site.webp', art: 'Porca & Vaca — live restaurant website', color: '#d39053',
    screenshot: '/images/projects/porca-vaca-site.webp', screenshotAlt: 'Porca & Vaca homepage with its oversized wordmark over the restaurant interior',
    live: 'https://pnv-kappa.vercel.app/',
  },
];

export const capabilities = [
  { title: 'Build', text: 'Web products and business sites. From a crochet business to a VR cricket brand.', tags: 'Websites · Products · Commerce' },
  { title: 'Automate', text: 'AI-agent systems and workflow automation. From enterprise VBA tooling to a three-model AI pipeline.', tags: 'AI agents · Python · Workflows' },
  { title: 'Analyze', text: 'Data tools and trading systems built around a specific user’s mental model.', tags: 'Data tools · Dashboards · Simulation' },
  { title: 'Design', text: 'Interfaces that carry the feeling and identity of a business before explaining it.', tags: 'Interaction · Brand · Webperience' },
];
