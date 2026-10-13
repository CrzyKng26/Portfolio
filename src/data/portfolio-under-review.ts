// #under-review — source archive only. Nothing in the public site imports this file.
// To publish a project again, review its content and add it to portfolio.ts.
export const underReviewProjects = [
  {
    slug: 'loanflow-ai', title: 'LoanFlow AI', year: '2024', category: 'AI / Automation',
    tags: ['FastAPI', 'Python', 'SQLite', 'LLM APIs'], status: 'Under review', role: 'Designer, architect, developer',
    description: 'A multi-agent loan-processing assistant built for a TCS internal hackathon. Three models, each assigned to the task it is strongest at — one for context, one for drafting, and one for auditing the other two.',
    focus: 'Three models. Three roles. One coherent system.',
    details: ['A broad-context model holds and reasons over the full loan application state.', 'A precision-drafting model authors documents and decision outputs.', 'A consistency-audit model cross-checks the other two for contradictions. A state machine governs application status.'],
    image: '/images/projects/loanflow.svg', art: 'Illustrative architecture study', color: '#b1a1ff', live: null,
  },
  {
    slug: 'arvind-wealth-builder', title: 'Arvind Wealth Builder', year: '2024', category: 'AI / Data',
    tags: ['Python', 'Streamlit', 'LLM APIs', 'Financial data APIs'], status: 'Under review', role: 'Designer and developer',
    description: 'A Streamlit application covering 467 stocks, with multi-model AI agents supporting analysis, plus a paper-trading mode for hypothesis testing without risk.',
    focus: 'Research, analysis, and a space to test ideas.',
    details: ['A stock-analysis application covering 467 stocks.', 'Multiple AI models supporting the research workflow.', 'Paper trading for testing hypotheses without committing real funds.'],
    image: '/images/projects/wealth.svg', art: 'Illustrative data study', color: '#83dbc2', live: null,
  },
  {
    slug: 'arvind-portfolio-app', title: 'Arvind Portfolio App', year: '2024', category: 'Product / Web',
    tags: ['React', 'JavaScript', 'Apify', 'CSS'], status: 'Under review', role: 'Designer and developer',
    description: 'A mobile-first portfolio-tracking web app — five-tab structure, stop-loss visualisation bars, an edit modal, and live news integration via Apify.',
    focus: 'A portfolio, shaped around its owner.',
    details: ['A mobile-first interface with five primary tabs.', 'Stop-loss visualisation and an edit modal for portfolio management.', 'Live news integration via Apify, designed around a specific user’s mental model.'],
    image: '/images/projects/portfolio.svg', art: 'Illustrative interface study', color: '#a7b7fc', live: null,
  },
  {
    slug: 'fo-paper-trading-terminal', title: 'F&O Paper Trading Terminal', year: '2024', category: 'Data / Product',
    tags: ['React', 'TypeScript', 'Black–Scholes', 'CSS'], status: 'Under review', role: 'Designer and developer',
    description: 'A React-based options trading simulator: Black-Scholes option-chain pricing, six preset strategies, a live Greeks panel, and interactive Theta/Vega sliders.',
    focus: 'A place to understand how options behave.',
    details: ['Black–Scholes option-chain pricing in a React interface.', 'Six preset strategies and a live Greeks panel.', 'Interactive Theta and Vega controls for exploring sensitivity in a simulation.'],
    image: '/images/projects/terminal.svg', art: 'Illustrative options study', color: '#f0b778', live: null,
  },
];
