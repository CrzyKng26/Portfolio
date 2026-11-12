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

// Credentials verified from the certificate PDFs supplied on 2026-11-12.
// `featured` entries get the large card; the rest render as an index list.
export type Credential = {
  title: string; issuer: string; date: string; year: string; group: 'AI' | 'Cloud & Security' | 'IT Operations';
  detail: string; url?: string; featured?: boolean; expires?: string;
};

export const credentials: Credential[] = [
  { title: 'Claude Certified Developer — Foundations', issuer: 'Anthropic', date: 'Aug 2026', year: '2026', expires: 'Aug 2027', group: 'AI', featured: true,
    detail: 'Building with Claude: prompting, tool use, agents and the API, applied to real automation systems.', url: 'https://www.credly.com/badges/4454d4ef-855a-4596-be5d-5e60fdfaed18' },
  { title: 'Azure AI Fundamentals', issuer: 'Microsoft', date: 'AI-900', year: '—', group: 'AI', featured: true,
    detail: 'Foundational cloud-AI literacy, applied to real agent and automation systems.' },
  { title: 'Introduction to Machine Learning for Data Science', issuer: 'Udemy · David Valentine', date: 'Oct 2026', year: '2026', group: 'AI',
    detail: '5.5 hours', url: 'https://ude.my/UC-452ccaea-c93c-459d-bc8d-289e2344d439' },
  { title: 'AI Literacy Basics: Applying Generative AI in the Workplace', issuer: 'Udemy · Nicolle Merrill', date: 'Oct 2026', year: '2026', group: 'AI',
    detail: '5 hours', url: 'https://ude.my/UC-5e7cc2c0-d129-41ef-b557-55f4078dc253' },
  { title: 'Cloud Computing Fundamentals', issuer: 'Udemy · Mohamed Rhim', date: 'Oct 2026', year: '2026', group: 'Cloud & Security',
    detail: '3 hours', url: 'https://ude.my/UC-8c65aef7-320d-440c-a4c3-470948cb267c' },
  { title: 'Cyber Security Awareness Training', issuer: 'Udemy · Learnsector LLP', date: 'Oct 2026', year: '2026', group: 'Cloud & Security',
    detail: '1.5 hours', url: 'https://ude.my/UC-13b56baa-5123-4989-ae39-b1acced82246' },
  { title: 'Introduction to Service Management with ITIL 4', issuer: 'Udemy · Jason Dion', date: 'Nov 2024', year: '2024', group: 'IT Operations',
    detail: '2 hours', url: 'https://ude.my/UC-60bda2a8-ae3f-4b72-8018-b7f47caa564a' },
  { title: 'PowerShell for Active Directory Administrators', issuer: 'Udemy · Kevin Brown', date: 'Nov 2024', year: '2024', group: 'IT Operations',
    detail: '3 hours', url: 'https://ude.my/UC-255b81e7-0641-4948-ae8e-5b0fd89c27ec' },
];

export const capabilities = [
  { title: 'Build', text: 'Web products and business sites. From a crochet business to a VR cricket brand.', tags: 'Websites · Products · Commerce' },
  { title: 'Automate', text: 'AI-agent systems and workflow automation. From enterprise VBA tooling to a three-model AI pipeline.', tags: 'AI agents · Python · Workflows' },
  { title: 'Analyze', text: 'Data tools and trading systems built around a specific user’s mental model.', tags: 'Data tools · Dashboards · Simulation' },
  { title: 'Design', text: 'Interfaces that carry the feeling and identity of a business before explaining it.', tags: 'Interaction · Brand · Webperience' },
];
