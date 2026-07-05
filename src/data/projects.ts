// Add or edit projects here. Featured projects render as large cards; "more" as the compact grid.
// Links resolved to real public repos. UFC Relational DB has no public repo, so it renders
// without a link. Push a public repo and add the URL here to make it clickable.

export interface Metric {
  num: string;
  label: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface FeaturedProject {
  title: string;
  tag: string;
  flagship?: boolean;
  description: string;
  metrics: Metric[];
  stack: string[];
  links: Link[];
}

export interface MiniProject {
  title: string;
  description: string;
  stack: string;
  href?: string;
}

export const featured: FeaturedProject[] = [
  {
    title: 'ElectriAI',
    tag: 'RESEARCH · LIVE',
    flagship: true,
    description:
      'An end-to-end LLM pipeline analyzing an electrical-construction media corpus: data collection, GPT-based classification, human expert annotation, and rigorous evaluation, plus a deployed retrieval-augmented chatbot. Flagship research, journal manuscript in progress.',
    metrics: [
      { num: '0.897', label: "Cohen's κ, human vs. model" },
      { num: '330K+', label: 'comments processed' },
      { num: '10', label: 'class category schema' },
    ],
    stack: ['Python', 'GPT / Claude', 'scikit-learn', 'React', 'Tailwind', 'Cloudflare'],
    links: [
      { label: 'Live site', href: 'https://youtube.electriai.com' },
      { label: 'Grid Defense', href: 'https://john-holik.github.io/grid-defense/' },
      { label: 'Site Runner', href: 'https://john-holik.github.io/site-runner/' },
    ],
  },
  {
    title: 'Red Tide Reanalysis',
    tag: 'SENIOR CAPSTONE · PACKAGE',
    description:
      "Ensemble-based uncertainty quantification for red-tide bloom prediction on Florida's coast. Four UQ methods (Bootstrap, GLUE, EnKF from scratch, LPU) propagate input uncertainty through a Random Forest classifier to produce calibrated probabilistic forecasts. Grew from notebooks into a tested, packaged Python library.",
    metrics: [
      { num: '4', label: 'UQ methods, 200-member ensembles' },
      { num: '0.963', label: 'NSE (EnKF discharge)' },
      { num: '142+', label: 'passing tests' },
    ],
    stack: ['Python', 'NumPy', 'scikit-learn', 'SciPy', 'pytest + Hypothesis'],
    links: [{ label: 'Read the book', href: 'https://john-holik.github.io/redtide-reanalysis-book/intro.html' }],
  },
  {
    title: 'CapSight AI',
    tag: 'FULL-STACK · LLM',
    description:
      'A multi-service LLM platform that grades uploaded pitch decks across six categories and persists a history view. React frontend, FastAPI/PostgreSQL persistence service, and a Node/TypeScript grading service with structured JSON-schema output, adaptive retry, and non-blocking DB writes so the API stays up if the database is down.',
    metrics: [
      { num: '3', label: 'service architecture' },
      { num: '6', label: 'scoring categories' },
      { num: 'REST', label: 'clean routes / services / schemas' },
    ],
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Node / TypeScript', 'OpenAI'],
    links: [{ label: 'GitHub', href: 'https://github.com/DevAudDom/capsight-ai' }],
  },
];

export const more: MiniProject[] = [
  {
    title: 'Pro-Code AI',
    description:
      'LLM programming tutor that teaches through Socratic hints, not solutions. Modular system-prompt architecture adapts to skill level.',
    stack: 'Python · FastAPI · React · PostgreSQL',
    href: 'https://github.com/John-Holik/ProCodeAI',
  },
  {
    title: 'Credit-Risk ML',
    description:
      '14-model scikit-learn benchmark on 32,416 loans. Full preprocessing, tuning, and evaluation pipeline; 0.95 test ROC-AUC.',
    stack: 'Python · scikit-learn · pandas',
    href: 'https://github.com/John-Holik/Credit-Risk-Machine-Learning-Project',
  },
  {
    title: 'UFC Relational DB',
    description:
      'Normalized five-table schema modeling fighters, fights, and stats. Aggregation queries for win/loss ratios and outcomes by class.',
    stack: 'PostgreSQL · SQL',
  },
  {
    title: 'E2E Test Suite',
    description:
      'Eight Selenium + TestNG UI test classes driving a live browser through login, posting, search, and recovery paths.',
    stack: 'Java · Selenium · TestNG · Maven',
    href: 'https://github.com/John-Holik/Rated-X-Twitter-Testing-',
  },
  {
    title: 'Tetris',
    description:
      'Full Tetris recreation from scratch: rendering, collision, line-clearing, and scoring in C++ with SFML.',
    stack: 'C++ · SFML',
    href: 'https://github.com/John-Holik/Tetris',
  },
  {
    title: 'Ultrasonic Sensor',
    description:
      'Arduino security sensor written in AVR assembly on the ATmega328p: ultrasonic ranging and alarm logic.',
    stack: 'Assembly · ATmega328p',
    href: 'https://github.com/John-Holik/CDA3104',
  },
];
