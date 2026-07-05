/* Mock data for the VCC portfolio demo. All fabricated but plausible — mirrors the shape of
   the real app's IPC payloads (vault tree, home stats, tokens, gamification view, graph). */
window.MOCK = (function () {
  "use strict";

  // ---- home / vault snapshot ----
  const home = {
    stats: {
      totalMd: 486, totalFiles: 612, totalBytes: 24_310_000,
      domains: [
        { name: "00_About", md: 94 },
        { name: "02_Research", md: 128 },
        { name: "03_Learning", md: 141 },
        { name: "04_Work", md: 63 },
        { name: "01_Games", md: 41 },
        { name: "05_Tools", md: 19 },
      ],
    },
    hubs: [
      { label: "Codex", rel: "00_About/Codex.md" },
      { label: "Research", rel: "02_Research/Research.md" },
      { label: "Verdant", rel: "02_Research/Verdant/Verdant.md" },
      { label: "Learning", rel: "03_Learning/Learning.md" },
      { label: "Work", rel: "04_Work/Work.md" },
    ],
    recentFiles: [
      { name: "diffusion-models", rel: "03_Learning/diffusion-models.md", agoMin: 14 },
      { name: "northwind-application", rel: "04_Work/northwind-application.md", agoMin: 52 },
      { name: "canopy-features", rel: "02_Research/Verdant/canopy-features.md", agoMin: 128 },
      { name: "vector-search-notes", rel: "03_Learning/vector-search-notes.md", agoMin: 300 },
      { name: "current-notes", rel: "00_About/current-notes.md", agoMin: 540 },
    ],
    recentSessions: [
      { title: "Add live status strip to vault-dash", label: "vault-dash", msgs: 84, agoMin: 22 },
      { title: "Verdant canopy-feature ablation", label: "Verdant", msgs: 141, agoMin: 190 },
      { title: "Vector-search eval harness", label: "retrieval-track", msgs: 63, agoMin: 610 },
    ],
  };

  const todos = {
    open: [
      { line: 1, text: "Finish live status strip in vault-dash" },
      { line: 2, text: "Draft Verdant canopy-ablation section" },
      { line: 3, text: "Prep Northwind system-design round" },
      { line: 4, text: "Compare vector-search recall metrics" },
    ],
    done: [
      { line: 20, text: "Ship note backlinks scan", date: "07-03" },
      { line: 21, text: "Add weekly usage window gauge", date: "07-02" },
      { line: 22, text: "Refactor graph render presets", date: "07-01" },
    ],
  };

  const mstar = {
    done: 7, total: 11, pct: 64, note: "04_Work/northwind-application.md",
    tasks: [
      { g: "Application", t: "Tailor resume to JD", done: true },
      { g: "Application", t: "Cover letter draft", done: true },
      { g: "Application", t: "Referral outreach", done: true },
      { g: "Prep", t: "Grind DSA (arrays/graphs)", done: true },
      { g: "Prep", t: "System design: feed ranking", done: true },
      { g: "Prep", t: "ML depth: transformers", done: true },
      { g: "Prep", t: "Behavioral STAR stories", done: true },
      { g: "Prep", t: "Mock interview #1", done: false },
      { g: "Prep", t: "Mock interview #2", done: false },
      { g: "Follow-up", t: "Thank-you notes", done: false },
      { g: "Follow-up", t: "Comp research", done: false },
    ],
  };

  const caps = { ok: 23, warn: 3, err: 1, skills: 18, agents: 9 };

  // ---- usage / tokens ----
  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const series = [
    { day: "Sat", input: 210_000, output: 88_000 },
    { day: "Sun", input: 95_000, output: 41_000 },
    { day: "Mon", input: 340_000, output: 128_000 },
    { day: "Tue", input: 412_000, output: 156_000 },
    { day: "Wed", input: 388_000, output: 141_000 },
    { day: "Thu", input: 456_000, output: 172_000 },
    { day: "Fri", input: 298_000, output: 110_000 },
  ].map((d) => ({ ...d, total: d.input + d.output }));
  const tokens = {
    fivePct: 47, fiveReset: "2h 41m",
    weekPct: 63, weekReset: "3d 6h",
    today: 408_000, last7: series.reduce((a, d) => a + d.total, 0), allTime: 51_400_000,
    series, days,
    byModel: [ { m: "Opus", pct: 71 }, { m: "Sonnet", pct: 26 }, { m: "Haiku", pct: 3 } ],
  };

  // ---- gamification / profile ----
  const game = {
    level: 42, xpPct: 68, xpInto: 8_420, xpNeed: 12_400, totalXp: 486_300,
    coins: 18_640, gems: 74, streak: 23, streakLongest: 41,
    rankLabel: "Gold II", boost: 18,
    pet: { name: "Byte", rarity: "Epic", level: 27, maxLevel: 30, tier: 4, mood: "happy",
      xpPct: 82, lore: "A curious data-sprite that hums when the vault grows." },
    badges: [
      { ic: "🔥", t: "On Fire", s: "23-day streak" },
      { ic: "🧠", t: "Deep Diver", s: "500+ notes" },
      { ic: "⚡", t: "Token Titan", s: "50M tokens" },
      { ic: "🛠", t: "Toolsmith", s: "18 skills built" },
    ],
    stats: {
      inputTokens: 38_200_000, outputTokens: 13_200_000, devMinutes: 41_820,
      sessions: 1_284, skillSuccess: 3_940, mdFiles: 486, domainsTouched: 6, domainsTotal: 6,
    },
  };
  // rarity color map (from gamification.js RARITY table, approximated)
  const RARITY = { Common: "#9A9AA6", Uncommon: "#3FB950", Rare: "#4FA8E8", Epic: "#B06CF0", Legendary: "#E8B23A" };

  // deterministic pseudo-random activity for the heatmap (52 weeks)
  function heatmap() {
    let seed = 1337; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const today = new Date();
    const cells = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const dow = d.getDay();
      let v = rnd();
      if (dow === 0 || dow === 6) v *= 0.5;            // quieter weekends
      if (i < 30) v = Math.min(1, v + 0.25);           // busier recently
      const lvl = v < 0.18 ? 0 : v < 0.42 ? 1 : v < 0.66 ? 2 : v < 0.85 ? 3 : 4;
      cells.push({ date: d, lvl });
    }
    const active = cells.filter((c) => c.lvl > 0).length;
    return { cells, active };
  }

  // ---- files: vault tree + note contents ----
  const notes = {
    "00_About/Codex.md": {
      props: { type: "hub", updated: "2026-07-03" },
      links: ["Research", "Learning", "Work", "current-notes"],
      body: `# Codex — master index

The hub of the vault. Everything reachable from here in one or two hops.

## Active domains
- [[Research]] — flagship [[Verdant]], plus satellite-imagery work
- [[Learning]] — the retrieval-systems track is live
- [[Work]] — the job search, anchored by [[northwind-application]]

## Now
See [[current-notes]] for the single "what am I doing today" page.

> Index-first: reach specific notes on demand by following wikilinks. Keeps the graph tidy while preserving memory.`,
    },
    "00_About/current-notes.md": {
      props: { type: "note", updated: "2026-07-04" },
      links: ["Verdant", "northwind-application", "diffusion-models"],
      body: `# Current notes

Three things, in priority order:

1. **[[northwind-application]]** — the ML Engineer role. All-in.
2. **[[Verdant]]** — push the canopy-ablation study toward a publishable draft.
3. **[[diffusion-models]]** — solidify the fundamentals for interviews.

Everything else is on hold until the application closes.`,
    },
    "02_Research/Verdant/Verdant.md": {
      props: { type: "project", status: "active", updated: "2026-07-02" },
      links: ["canopy-features", "Research"],
      body: `# Verdant

A machine-learning approach to **crop-yield forecasting** from multispectral satellite imagery.

## Idea
Learn a mapping from a field's image time-series to end-of-season yield, using [[canopy-features]] as structural priors instead of raw pixels alone.

## Status
- Baseline gradient-boosted trees: **88.4%** within-±5% yield accuracy
- Temporal CNN over the NDVI stack: **93.1%**, better in cloudy weeks
- Writing the ablation section now

## Next
- Ablate canopy features vs. raw bands
- Robustness under missing acquisition dates`,
    },
    "02_Research/Verdant/canopy-features.md": {
      props: { type: "note", updated: "2026-06-28" },
      links: ["Verdant"],
      body: `# Canopy features

Structural features derived from the vegetation signal, not the raw bands.

## Feature groups
- **NDVI** — normalized difference vegetation index per acquisition
- **Green-up rate** — slope of the seasonal growth curve
- **Canopy cover** — fraction of the field above a greenness threshold

\`\`\`python
import numpy as np
ndvi = (nir - red) / (nir + red + 1e-6)
green_up = np.gradient(ndvi.mean(axis=(1, 2)))
\`\`\`

These plug into [[Verdant]] as engineered inputs for the temporal model.`,
    },
    "03_Learning/diffusion-models.md": {
      props: { type: "study", updated: "2026-07-04" },
      links: ["vector-search-notes"],
      body: `# Diffusion models

Denoising diffusion, from scratch.

## The core
Forward process gradually adds Gaussian noise over \`T\` steps; the model learns to reverse it:

\`\`\`
x_{t-1} = 1/√α_t · (x_t − (1−α_t)/√(1−ᾱ_t) · ε_θ(x_t, t)) + σ_t z
\`\`\`

Training just regresses the added noise \`ε\` at a random timestep — a surprisingly simple objective.

## Sampling
Start from pure noise and iteratively denoise. DDIM lets you skip steps for faster sampling.

Feeds into my [[vector-search-notes]] — learned embeddings are the bridge between the two.`,
    },
    "03_Learning/vector-search-notes.md": {
      props: { type: "study", updated: "2026-07-01" },
      links: ["diffusion-models", "Learning"],
      body: `# Vector-search notes

How to actually measure a retrieval pipeline over embeddings.

## Retrieval metrics
- **Recall@k** — did we fetch the gold passage?
- **MRR** — how high did it rank?
- **nDCG** — graded relevance, position-discounted

## Index choices
- Flat (exact) vs. HNSW (approximate) — recall vs. latency tradeoff
- Re-ranking the top-k with a cross-encoder

> Separate the stages when you debug: a bad answer from perfect context is a generation bug, not a retrieval bug.

Part of the [[Learning]] retrieval track.`,
    },
    "04_Work/northwind-application.md": {
      props: { type: "job", status: "in-progress", updated: "2026-07-04" },
      links: ["current-notes", "Work"],
      body: `# Northwind Analytics — ML Engineer

The role I'm all-in on.

## Why it fits
- ML + data engineering, applied to real product data
- Remote-friendly team
- Room to grow into LLM / agent work

## Prep tracker
See the **Northwind interview prep** widget on Home — task state syncs across devices.

## Loop
1. Recruiter screen ✅
2. Technical (DSA + ML depth) — prepping
3. System design — prepping
4. Onsite / behavioral

Linked from [[Work]] and [[current-notes]].`,
    },
    "04_Work/Work.md": {
      props: { type: "hub" },
      links: ["northwind-application"],
      body: `# Work — job search hub

Career notes and the active pipeline.

- [[northwind-application]] — primary target (ML Engineer)
- Networking log, comp research, and interview retros live here.`,
    },
  };

  // folder tree structure (dirs + files, referencing notes above)
  const tree = [
    { type: "dir", name: "00_About", children: [
      { type: "file", name: "Codex.md", rel: "00_About/Codex.md" },
      { type: "file", name: "current-notes.md", rel: "00_About/current-notes.md" },
    ]},
    { type: "dir", name: "02_Research", children: [
      { type: "dir", name: "Verdant", children: [
        { type: "file", name: "Verdant.md", rel: "02_Research/Verdant/Verdant.md" },
        { type: "file", name: "canopy-features.md", rel: "02_Research/Verdant/canopy-features.md" },
      ]},
    ]},
    { type: "dir", name: "03_Learning", children: [
      { type: "file", name: "diffusion-models.md", rel: "03_Learning/diffusion-models.md" },
      { type: "file", name: "vector-search-notes.md", rel: "03_Learning/vector-search-notes.md" },
    ]},
    { type: "dir", name: "04_Work", children: [
      { type: "file", name: "Work.md", rel: "04_Work/Work.md" },
      { type: "file", name: "northwind-application.md", rel: "04_Work/northwind-application.md" },
    ]},
    { type: "dir", name: "05_Tools", children: [
      { type: "file", name: "vault-dash", rel: null },
    ]},
  ];

  // ---- graph: ~30 nodes across folders with wikilink edges ----
  // colors lifted from the real graph.js DOMAIN_COLORS (as used by the Nebula preset)
  const FOLDERS = {
    About: "#7C83FF", Research: "#34E89E", Learning: "#3FD0EE", Work: "#FF6FB0", Games: "#FFB23E", Tools: "#FF7A5C",
  };
  const GRAPH_BG = "#0d0b28"; // Nebula preset background
  const gnodes = [
    ["Codex", "About"], ["current-notes", "About"], ["Templates", "About"], ["Capabilities", "About"], ["Memory", "About"],
    ["Research", "Research"], ["Verdant", "Research"], ["canopy-features", "Research"], ["satellite-data", "Research"], ["harvest-index", "Research"], ["yield-model", "Research"], ["ndvi-priors", "Research"],
    ["Learning", "Learning"], ["diffusion", "Learning"], ["vector-search", "Learning"], ["transformers", "Learning"], ["retrieval", "Learning"], ["embeddings", "Learning"], ["graph-nets", "Learning"],
    ["Work", "Work"], ["northwind", "Work"], ["interview-prep", "Work"], ["system-design", "Work"], ["comp-research", "Work"],
    ["Emberfall", "Games"], ["build-log", "Games"], ["mechanics", "Games"],
    ["vault-dash", "Tools"], ["skills-index", "Tools"], ["agents-index", "Tools"],
  ];
  const gedges = [
    ["Codex","Research"],["Codex","Learning"],["Codex","Work"],["Codex","current-notes"],["Codex","Capabilities"],["Codex","Memory"],
    ["Research","Verdant"],["Research","harvest-index"],["Verdant","canopy-features"],["Verdant","satellite-data"],["Verdant","yield-model"],["Verdant","ndvi-priors"],["canopy-features","ndvi-priors"],
    ["Learning","diffusion"],["Learning","vector-search"],["diffusion","transformers"],["vector-search","retrieval"],["vector-search","diffusion"],["retrieval","embeddings"],["Learning","graph-nets"],
    ["Work","northwind"],["northwind","interview-prep"],["northwind","system-design"],["interview-prep","graph-nets"],["Work","comp-research"],["current-notes","northwind"],["current-notes","Verdant"],
    ["Emberfall","build-log"],["Emberfall","mechanics"],["Codex","Emberfall"],
    ["Capabilities","skills-index"],["Capabilities","agents-index"],["vault-dash","skills-index"],["vault-dash","agents-index"],
    ["current-notes","diffusion"],["Templates","Codex"],["Capabilities","Codex"],
  ];

  // ---- terminal: 4 scripted Claude Code sessions (typewriter replay) ----
  // kinds: prompt, user, asst, tool, toolok, dim, done  · d = ms delay after line
  const termSessions = [
    { name: "vault-dash", cwd: "~/05_Tools/vault-dash", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "add a live status strip so panes survive a renderer reload" },
      { k: "asst", t: "I'll route the pty through IPC and keep the process in main.js so an F5 only", type: true },
      { k: "asst", t: "re-attaches the terminal to the existing session.", type: true },
      { k: "tool", t: "● Read(main.js)", d: 350 },
      { k: "toolok", t: "  ⎿ read 2840 lines", d: 200 },
      { k: "tool", t: "● Edit(preload.js) — expose pty-attach", d: 500 },
      { k: "toolok", t: "  ⎿ +1 bridge method", d: 250 },
      { k: "tool", t: "● Bash(node --check terminal.js)", d: 600 },
      { k: "toolok", t: "  ⎿ ok — no syntax errors", d: 300 },
      { k: "asst", t: "Done. Panes now reattach on reload; the pty survives F5.", type: true },
      { k: "done", t: "✔ finished · 4 tool calls · 18.2k tokens", d: 300 },
    ]},
    { name: "Verdant", cwd: "~/02_Research/Verdant", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "run the canopy-feature ablation and summarize" },
      { k: "asst", t: "Running the ablation over {raw bands, +NDVI, +green-up, +canopy-cover}.", type: true },
      { k: "tool", t: "● Bash(python ablate.py --folds 5)", d: 500 },
      { k: "dim", t: "  fold 1/5  acc=0.884", d: 260 },
      { k: "dim", t: "  fold 3/5  acc=0.921", d: 260 },
      { k: "dim", t: "  fold 5/5  acc=0.931", d: 260 },
      { k: "toolok", t: "  ⎿ mean within-±5%: 0.931 ± 0.008", d: 250 },
      { k: "asst", t: "Canopy features add +4.7pts over raw bands; green-up carries most", type: true },
      { k: "asst", t: "of the lift in cloudy weeks.", type: true },
      { k: "done", t: "✔ finished · 1 tool call · 22.4k tokens", d: 300 },
    ]},
    { name: "retrieval-track", cwd: "~/03_Learning/retrieval", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "add Recall@k + nDCG to the eval harness" },
      { k: "asst", t: "Adding graded-relevance nDCG alongside the existing MRR.", type: true },
      { k: "tool", t: "● Write(eval/metrics.py)", d: 450 },
      { k: "toolok", t: "  ⎿ +48 lines", d: 220 },
      { k: "tool", t: "● Bash(pytest eval/ -q)", d: 550 },
      { k: "toolok", t: "  ⎿ 11 passed in 2.3s", d: 300 },
      { k: "asst", t: "Recall@5 = 0.86, nDCG@10 = 0.79 on the dev set.", type: true },
      { k: "done", t: "✔ finished · 2 tool calls · 9.7k tokens", d: 300 },
    ]},
    { name: "codex-agent", cwd: "~/vault", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "scan the vault for notes that link to diffusion-models" },
      { k: "asst", t: "Scanning for [[diffusion-models]] backlinks.", type: true },
      { k: "tool", t: "● Grep([[diffusion-models]])", d: 400 },
      { k: "toolok", t: "  ⎿ 3 files", d: 220 },
      { k: "dim", t: "  vector-search-notes.md", d: 180 },
      { k: "dim", t: "  current-notes.md", d: 180 },
      { k: "dim", t: "  transformers.md", d: 180 },
      { k: "asst", t: "3 notes link here — added them to the Files backlinks panel.", type: true },
      { k: "done", t: "✔ finished · 1 tool call · 4.1k tokens", d: 300 },
    ]},
  ];

  return { home, todos, mstar, caps, tokens, game, RARITY, heatmap, notes, tree, FOLDERS, GRAPH_BG, gnodes, gedges, termSessions,
    DOMAIN_LABELS: { "00_About": "About", "01_Games": "Games", "02_Research": "Research", "03_Learning": "Learning", "04_Work": "Work", "05_Tools": "Tools" } };
})();
