// One unified project list. Every project renders as a collapsed card; clicking expands it.
// `tags` drive the filter bar, so keep them drawn from TAGS below rather than inventing new ones.
// Content here is kept in sync with the resume at public/resume.pdf. Numbers come from the
// project artifacts, do not round or embellish them.

export interface Metric {
  num: string;
  label: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface MetricGroup {
  heading: string;
  metrics: Metric[];
}

export interface Project {
  title: string;
  subtitle?: string;
  // One line, always visible on the collapsed card.
  summary: string;
  tags: string[];
  flagship?: boolean;
  // Everything below shows only when the card is expanded.
  description: string;
  metrics?: Metric[];
  metricGroups?: MetricGroup[];
  stack: string[];
  links: Link[];
}

// Filter bar order. 'All' is rendered by the page, not listed here.
export const TAGS = [
  'Machine learning',
  'LLM',
  'Research',
  'Evaluation',
  'Full-stack',
  'Data',
  'Systems',
  'Testing',
];

export const projects: Project[] = [
  {
    title: 'Identifying Knowledge Bottlenecks in Electrical Construction',
    subtitle:
      'ElectriAI · second author, submitted to the Journal of Management in Engineering (ASCE), July 2026',
    summary:
      'End-to-end LLM pipeline behind a manuscript under review, validated against a 26-annotator human consensus.',
    tags: ['Research', 'LLM', 'Machine learning', 'Evaluation'],
    flagship: true,
    description:
      'What do working electricians actually ask, and which of their questions never get answered? I built the end-to-end LLM pipeline behind the paper: scraping and screening YouTube videos and their comment threads, processing 794 transcripts and 66,899 threads into structured question-and-answer records under a 76-theme, ten-category taxonomy, validating the model against an independent 26-annotator human consensus, and shipping a deployed retrieval-augmented chatbot over the result. The headline finding is that only 25.8% of practitioner questions receive a substantive peer answer.',
    metricGroups: [
      {
        heading: 'Collected, before filtering',
        metrics: [
          { num: '4,959', label: 'candidate videos screened' },
          { num: '93,317', label: 'raw comments scraped' },
          { num: '66,899', label: 'eligible parent threads' },
        ],
      },
      {
        heading: 'Classification and human validation',
        metrics: [
          { num: '16,862', label: 'structured Q&A records' },
          { num: '12,933', label: 'questions typed, ten forms' },
          { num: '0.847', label: "Cohen's κ vs. human consensus" },
          { num: '86.6%', label: 'accuracy, 0.858 weighted F1' },
        ],
      },
      {
        heading: 'Deployed RAG chatbot',
        metrics: [
          { num: '288', label: 'knowledge-base pages generated' },
          { num: '297', label: 'chunks, 768-dim embeddings' },
          { num: 'top-8', label: 'hybrid retrieval, 4 rendered full' },
        ],
      },
    ],
    stack: [
      'Python',
      'GPT-5-mini / GPT-5.6',
      'scikit-learn',
      'gemini-embedding-001',
      'gemini-3.6-flash',
      'React',
      'Tailwind',
      'Cloudflare',
    ],
    links: [
      { label: 'Live site', href: 'https://youtube.electriai.com' },
      { label: 'Data and code (Zenodo)', href: 'https://doi.org/10.5281/zenodo.21679718' },
    ],
  },
  {
    title: 'Red Tide Reanalysis',
    subtitle: 'Senior capstone · sole developer of all code on a four-person team',
    summary:
      'Four uncertainty-quantification methods, including an Ensemble Kalman Filter written from scratch, feeding a red-tide bloom classifier.',
    tags: ['Research', 'Machine learning', 'Evaluation'],
    description:
      "How much does uncertainty in modeled river inputs distort a Karenia brevis bloom prediction for Florida's Peace River? I implemented four structurally different UQ methods to find out: residual bootstrap with a Durbin-Watson diagnostic that auto-routes IID versus AR(1) resampling, GLUE over 10,000 Monte-Carlo parameter draws filtered by a Nash-Sutcliffe threshold, an Ensemble Kalman Filter written from scratch in NumPy with covariance inflation and heteroscedastic observation error, and analytic Jacobian-covariance propagation with a condition-number check and pseudo-inverse fallback. Each 200-member ensemble was scored on probabilistic and deterministic metrics, then propagated through a pre-trained Random Forest to turn a deterministic bloom call into a distribution. The key result: EnKF-reanalyzed discharge substituted for real observations at 0.884 balanced accuracy against a 0.887 observed-data baseline, so the reanalysis can stand in for observations in periods where none exist. Two methods failed badly on total nitrogen (0.27 and 0.32 coverage against a nominal 0.90) and I diagnosed why rather than dropping them: a two-parameter linear forward model cannot generate spread when structural error dominates parameter uncertainty. I also trained a multivariate LSTM as a surrogate forward operator, because the source hydrological model emits a static trajectory and cannot be stepped inside a filter. Shipped as an installable package, not notebooks: plugin architecture, a seeded-RNG reproducibility contract enforced in tests, QA/QC checks, a CLI, and a property-based test suite.",
    metrics: [
      { num: '4', label: 'UQ methods, 200-member ensembles' },
      { num: '0.884', label: 'EnKF balanced accuracy (0.887 observed)' },
      { num: '22,726', label: 'parameter LSTM surrogate operator' },
      { num: '87%', label: 'test coverage, pytest + Hypothesis' },
      { num: '268', label: 'commits across five repositories' },
    ],
    stack: [
      'Python',
      'NumPy',
      'SciPy',
      'scikit-learn',
      'TensorFlow',
      'spotpy',
      'pytest + Hypothesis',
    ],
    links: [
      {
        label: 'Read the book',
        href: 'https://john-holik.github.io/redtide-reanalysis-book/intro.html',
      },
      { label: 'Poster', href: '/redtide-poster.pdf' },
    ],
  },
  {
    title: 'Credit-Risk ML',
    subtitle: 'Loan-default prediction · three-person team project, November 2025',
    summary:
      'Fourteen models benchmarked on 32,416 loans, selected on test ROC-AUC with an explicit overfit check.',
    tags: ['Machine learning', 'Evaluation'],
    description:
      'A full supervised-learning study on 32,416 loans with a 21.9% default rate: 11 raw features engineered up to 46 after encoding and scaling, then 14 models benchmarked from a dummy baseline through logistic regression, LDA/QDA, KNN, trees, bagging, random forests, AdaBoost, gradient boosting, SVMs, and an MLP. Selection ran on test ROC-AUC with an explicit train-vs-test overfit check, which is what disqualified bagging and random forests at roughly 1.0 train AUC. The work continues past accuracy into calibration, interpretability, and threshold analysis, and it names its own weak spot: the chosen model catches about 74% of true defaults.',
    metrics: [
      { num: '14', label: 'models benchmarked, 32,416 loans' },
      { num: '0.9514', label: 'test ROC-AUC, 0.036 train gap' },
      { num: '0.0499', label: 'Brier score, calibrated' },
    ],
    stack: ['Python', 'scikit-learn', 'pandas', 'NumPy', 'matplotlib'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/John-Holik/Credit-Risk-Machine-Learning-Project',
      },
    ],
  },
  {
    title: 'Reanalysis Dashboard',
    summary:
      'The capstone pipeline generalized into a self-serve tool: upload two CSVs, get an LSTM + EnKF reanalysis.',
    tags: ['Machine learning', 'Full-stack'],
    description:
      'Generalized the capstone pipeline into a tool anyone can point at their own data. Upload a model CSV and an observation CSV, pick the target column, and it runs an LSTM plus Ensemble Kalman Filter reanalysis locally, streaming training progress over server-sent events and returning downloadable outputs with confidence intervals.',
    stack: ['Python', 'FastAPI', 'TensorFlow', 'Alpine.js'],
    links: [],
  },
  {
    title: 'CapSight AI',
    summary:
      'Three-service LLM platform that grades pitch decks across six categories, with deterministic scoring.',
    tags: ['LLM', 'Full-stack'],
    description:
      'A multi-service LLM platform that grades uploaded pitch decks across six categories and persists a history view. React frontend, FastAPI/PostgreSQL persistence service, and a Node/TypeScript grading service with structured JSON-schema output, deterministic scoring at seed 42 and temperature 0, adaptive retry, score clamping, an unreadable-deck sentinel, and non-blocking DB writes so grading still returns if the database is down.',
    metrics: [
      { num: '3', label: 'service architecture' },
      { num: '6', label: 'scoring categories' },
      { num: 'REST', label: 'clean routes / services / schemas' },
    ],
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Node / TypeScript', 'OpenAI'],
    links: [{ label: 'GitHub', href: 'https://github.com/DevAudDom/capsight-ai' }],
  },
  {
    title: 'Vault Command Center',
    summary:
      'Electron control center that runs an entire AI-assisted workflow from one window. Live in-browser demo.',
    tags: ['Full-stack', 'Systems'],
    description:
      'An Electron desktop control center built to run an entire AI-assisted workflow from one window: parallel Claude Code sessions in embedded PTY terminal grids with saved workspace layouts, pop-out panes, and broadcast typing; a full file browser over an Obsidian vault with markdown editing, wikilink navigation, search, and share-to-phone; a 3D knowledge graph; live token-usage analytics; and a gamification layer (XP, levels, quests, pet companion, shop) that turns daily work into progression. The live demo is a faithful in-browser simulation on mock data.',
    metrics: [
      { num: '11', label: 'integrated tabs, one workflow hub' },
      { num: '2×2', label: 'terminal grids, saved layouts' },
      { num: '96 KB', label: 'in-browser demo, zero dependencies' },
    ],
    stack: ['Electron', 'Node.js', 'xterm.js', 'Canvas', 'JavaScript'],
    links: [{ label: 'Live demo', href: '/vcc-demo/' }],
  },
  {
    title: 'Pro-Code AI',
    summary:
      'LLM programming tutor that teaches through Socratic hints instead of handing over solutions.',
    tags: ['LLM', 'Full-stack'],
    description:
      'An LLM programming tutor built around a constraint: never give the answer. A modular system-prompt architecture adapts the hint level to the learner, so the model nudges toward the solution rather than writing it.',
    stack: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
    links: [{ label: 'GitHub', href: 'https://github.com/John-Holik/ProCodeAI' }],
  },
  {
    title: 'ElectriAI Learning Games',
    summary:
      "Five browser games that turn the research corpus into hands-on learning, including a 3D dungeon crawler.",
    tags: ['Full-stack'],
    description:
      "Browser games that turn ElectriAI's research into hands-on learning, from arcade quizzes to Arc Descent, a full 3D action dungeon crawler where questions are the loot economy. Every game is a dependency-light browser build with a question-driven economy, CSV/JSON question upload, and localStorage progress, mapping to the project's ten-category electrical-construction schema.",
    metrics: [
      { num: '5', label: 'games live in-browser' },
      { num: '515', label: 'bundled questions' },
    ],
    stack: ['HTML5', 'Canvas', 'Three.js', 'JavaScript', 'localStorage'],
    links: [
      { label: 'Arc Descent', href: 'https://john-holik.github.io/arc-descent/' },
      { label: 'Grid Defense', href: 'https://john-holik.github.io/grid-defense/' },
      { label: 'Site Runner', href: 'https://john-holik.github.io/site-runner/' },
      { label: 'Power Route', href: 'https://john-holik.github.io/power-route/' },
      { label: 'Circuit Duel', href: 'https://john-holik.github.io/circuit-duel/' },
    ],
  },
  {
    title: 'UFC Relational Database',
    summary: 'Normalized five-table PostgreSQL schema modeling fighters, fights, and per-bout stats.',
    tags: ['Data'],
    description:
      'A normalized five-table schema modeling fighters, fights, and their statistics, with aggregation queries for win/loss ratios and outcomes by weight class. DDL, seed data, and datasets included.',
    stack: ['PostgreSQL', 'SQL'],
    links: [],
  },
  {
    title: 'E2E Test Suite',
    summary: 'Eight Selenium + TestNG classes driving a live browser through Twitter/X user flows.',
    tags: ['Testing', 'Full-stack'],
    description:
      'Eight Selenium + TestNG UI test classes driving a real browser through login, posting, search, and recovery paths across eight areas of Twitter/X, built as a Maven project.',
    stack: ['Java', 'Selenium', 'TestNG', 'Maven'],
    links: [{ label: 'GitHub', href: 'https://github.com/John-Holik/Rated-X-Twitter-Testing-' }],
  },
  {
    title: 'Tetris',
    summary: 'Full Tetris recreation from scratch in C++ and SFML.',
    tags: ['Systems'],
    description:
      'Tetris rebuilt from nothing: rendering, piece rotation, collision detection, line-clearing, and scoring, written in C++ against SFML.',
    stack: ['C++', 'SFML'],
    links: [{ label: 'GitHub', href: 'https://github.com/John-Holik/Tetris' }],
  },
  {
    title: 'Ultrasonic Sensor',
    summary: 'Arduino security sensor written in raw AVR assembly on the ATmega328p.',
    tags: ['Systems'],
    description:
      'An ultrasonic ranging and alarm system written in AVR assembly for the ATmega328p, working directly against the hardware timers and I/O registers.',
    stack: ['Assembly', 'ATmega328p'],
    links: [{ label: 'GitHub', href: 'https://github.com/John-Holik/CDA3104' }],
  },
];
