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
      { label: "Brain", rel: "00_About/Brain.md" },
      { label: "Research", rel: "02_Research/Research.md" },
      { label: "ElectriAI", rel: "02_Research/ElectriAI/ElectriAI.md" },
      { label: "Learning", rel: "03_Learning/Learning.md" },
      { label: "Work", rel: "04_Work/Work.md" },
    ],
    recentFiles: [
      { name: "attention-mechanisms", rel: "03_Learning/attention-mechanisms.md", agoMin: 14 },
      { name: "morningstar-application", rel: "04_Work/morningstar-application.md", agoMin: 52 },
      { name: "grid-topology-features", rel: "02_Research/ElectriAI/grid-topology-features.md", agoMin: 128 },
      { name: "rag-eval-notes", rel: "03_Learning/rag-eval-notes.md", agoMin: 300 },
      { name: "current-focus", rel: "00_About/current-focus.md", agoMin: 540 },
    ],
    recentSessions: [
      { title: "Wire the Terminal PTY bridge", label: "vault-command-center", msgs: 84, agoMin: 22 },
      { title: "ElectriAI feature ablation", label: "ElectriAI", msgs: 141, agoMin: 190 },
      { title: "RAG retriever eval harness", label: "rag-track-a", msgs: 63, agoMin: 610 },
    ],
  };

  const todos = {
    open: [
      { line: 1, text: "Finish Terminal PTY bridge over IPC" },
      { line: 2, text: "Draft ElectriAI ablation section" },
      { line: 3, text: "Prep Morningstar system-design round" },
      { line: 4, text: "Review RAG eval metrics with advisor" },
    ],
    done: [
      { line: 20, text: "Ship Files backlinks scan", date: "07-03" },
      { line: 21, text: "Add weekly usage window gauge", date: "07-02" },
      { line: 22, text: "Refactor graph presets", date: "07-01" },
    ],
  };

  const mstar = {
    done: 7, total: 11, pct: 64, note: "04_Work/morningstar-application.md",
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
      { g: "Follow-up", t: "Salary research", done: false },
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
    "00_About/Brain.md": {
      props: { type: "hub", updated: "2026-07-03" },
      links: ["Research", "Learning", "Work", "current-focus"],
      body: `# Brain — master index

The hub of the vault. Everything reachable from here in one or two hops.

## Active domains
- [[Research]] — flagship [[ElectriAI]], plus grid-reanalysis work
- [[Learning]] — Track A RAG build is live
- [[Work]] — the job search, anchored by [[morningstar-application]]

## Now
See [[current-focus]] for the single "what am I doing today" page.

> Index-first: reach specific notes on demand by following wikilinks. Keeps token use low while preserving memory.`,
    },
    "00_About/current-focus.md": {
      props: { type: "note", updated: "2026-07-04" },
      links: ["ElectriAI", "morningstar-application", "attention-mechanisms"],
      body: `# Current focus

Three things, in priority order:

1. **[[morningstar-application]]** — the Associate AI Engineer role. All-in.
2. **[[ElectriAI]]** — push the ablation study toward a publishable draft.
3. **[[attention-mechanisms]]** — solidify the fundamentals for interviews.

Everything else is on hold until the application closes.`,
    },
    "02_Research/ElectriAI/ElectriAI.md": {
      props: { type: "project", status: "active", updated: "2026-07-02" },
      links: ["grid-topology-features", "Research"],
      body: `# ElectriAI

A machine-learning approach to **power-grid fault localization** from PMU time-series.

## Idea
Learn a mapping from synchrophasor measurements to the faulted line, using [[grid-topology-features]] as structural priors instead of a flat feature vector.

## Status
- Baseline GBDT: **91.2%** top-1 line accuracy
- GNN over the bus-admittance graph: **94.7%** top-1, better under noise
- Writing the ablation section now

## Next
- Ablate topology features vs. raw measurements
- Robustness under missing PMUs`,
    },
    "02_Research/ElectriAI/grid-topology-features.md": {
      props: { type: "note", updated: "2026-06-28" },
      links: ["ElectriAI"],
      body: `# Grid topology features

Structural features derived from the network, not the measurements.

## Feature groups
- **Bus admittance** — the \`Y\` matrix as a weighted adjacency
- **Electrical distance** — effective impedance between bus pairs
- **Betweenness** on the line graph (captures critical corridors)

\`\`\`python
import networkx as nx
G = nx.from_numpy_array(np.abs(Y))
bc = nx.betweenness_centrality(G, weight="weight")
\`\`\`

These plug into [[ElectriAI]] as node features for the GNN.`,
    },
    "03_Learning/attention-mechanisms.md": {
      props: { type: "study", updated: "2026-07-04" },
      links: ["rag-eval-notes"],
      body: `# Attention mechanisms

Scaled dot-product attention, from scratch.

## The core
Given queries \`Q\`, keys \`K\`, values \`V\`:

\`\`\`
Attention(Q, K, V) = softmax(QKᵀ / √d_k) V
\`\`\`

The \`√d_k\` scaling keeps the softmax out of saturated regions as dimensionality grows.

## Multi-head
Run \`h\` attention functions in parallel on projected subspaces, then concat + project. Each head can specialize (syntax, coreference, position).

Feeds into my [[rag-eval-notes]] — retrieval is just attention over a document store.`,
    },
    "03_Learning/rag-eval-notes.md": {
      props: { type: "study", updated: "2026-07-01" },
      links: ["attention-mechanisms", "Learning"],
      body: `# RAG evaluation notes

How to actually measure a retrieval-augmented pipeline.

## Retrieval metrics
- **Recall@k** — did we fetch the gold passage?
- **MRR** — how high did it rank?
- **nDCG** — graded relevance, position-discounted

## Generation metrics
- Faithfulness (is the answer grounded in the context?)
- Answer relevance

> Separate the two stages when you debug: a bad answer from perfect context is a generation bug, not a retrieval bug.

Part of [[Learning]] Track A.`,
    },
    "04_Work/morningstar-application.md": {
      props: { type: "job", status: "in-progress", updated: "2026-07-04" },
      links: ["current-focus", "Work"],
      body: `# Morningstar — Associate AI Engineer

The role I'm all-in on.

## Why it fits
- ML + data engineering, applied to real financial data
- Chicago-based (where I am now)
- Room to grow into LLM/agent work

## Prep tracker
See the **Morningstar application** widget on Home — task state is shared with my phone.

## Loop
1. Recruiter screen ✅
2. Technical (DSA + ML depth) — prepping
3. System design — prepping
4. Onsite / behavioral

Linked from [[Work]] and [[current-focus]].`,
    },
    "04_Work/Work.md": {
      props: { type: "hub" },
      links: ["morningstar-application"],
      body: `# Work — job search hub

Career notes and the active pipeline.

- [[morningstar-application]] — primary target (Associate AI Engineer)
- Networking log, salary research, and interview retros live here.`,
    },
  };

  // folder tree structure (dirs + files, referencing notes above)
  const tree = [
    { type: "dir", name: "00_About", children: [
      { type: "file", name: "Brain.md", rel: "00_About/Brain.md" },
      { type: "file", name: "current-focus.md", rel: "00_About/current-focus.md" },
    ]},
    { type: "dir", name: "02_Research", children: [
      { type: "dir", name: "ElectriAI", children: [
        { type: "file", name: "ElectriAI.md", rel: "02_Research/ElectriAI/ElectriAI.md" },
        { type: "file", name: "grid-topology-features.md", rel: "02_Research/ElectriAI/grid-topology-features.md" },
      ]},
    ]},
    { type: "dir", name: "03_Learning", children: [
      { type: "file", name: "attention-mechanisms.md", rel: "03_Learning/attention-mechanisms.md" },
      { type: "file", name: "rag-eval-notes.md", rel: "03_Learning/rag-eval-notes.md" },
    ]},
    { type: "dir", name: "04_Work", children: [
      { type: "file", name: "Work.md", rel: "04_Work/Work.md" },
      { type: "file", name: "morningstar-application.md", rel: "04_Work/morningstar-application.md" },
    ]},
    { type: "dir", name: "05_Tools", children: [
      { type: "file", name: "vault-command-center", rel: null },
    ]},
  ];

  // ---- graph: ~30 nodes across folders with wikilink edges ----
  // colors lifted from the real graph.js DOMAIN_COLORS (as used by the Nebula preset)
  const FOLDERS = {
    About: "#7C83FF", Research: "#34E89E", Learning: "#3FD0EE", Work: "#FF6FB0", Games: "#FFB23E", Tools: "#FF7A5C",
  };
  const GRAPH_BG = "#0d0b28"; // Nebula preset background
  const gnodes = [
    ["Brain", "About"], ["current-focus", "About"], ["Templates", "About"], ["Capabilities", "About"], ["Memory", "About"],
    ["Research", "Research"], ["ElectriAI", "Research"], ["grid-topology", "Research"], ["PMU-data", "Research"], ["Redtide", "Research"], ["fault-loc", "Research"], ["GNN-priors", "Research"],
    ["Learning", "Learning"], ["attention", "Learning"], ["rag-eval", "Learning"], ["transformers", "Learning"], ["retrieval", "Learning"], ["embeddings", "Learning"], ["DSA-graphs", "Learning"],
    ["Work", "Work"], ["morningstar", "Work"], ["interview-prep", "Work"], ["system-design", "Work"], ["salary", "Work"],
    ["POE2", "Games"], ["build-log", "Games"], ["mechanics", "Games"],
    ["VCC", "Tools"], ["skills-index", "Tools"], ["agents-index", "Tools"],
  ];
  const gedges = [
    ["Brain","Research"],["Brain","Learning"],["Brain","Work"],["Brain","current-focus"],["Brain","Capabilities"],["Brain","Memory"],
    ["Research","ElectriAI"],["Research","Redtide"],["ElectriAI","grid-topology"],["ElectriAI","PMU-data"],["ElectriAI","fault-loc"],["ElectriAI","GNN-priors"],["grid-topology","GNN-priors"],
    ["Learning","attention"],["Learning","rag-eval"],["attention","transformers"],["rag-eval","retrieval"],["rag-eval","attention"],["retrieval","embeddings"],["Learning","DSA-graphs"],
    ["Work","morningstar"],["morningstar","interview-prep"],["morningstar","system-design"],["interview-prep","DSA-graphs"],["Work","salary"],["current-focus","morningstar"],["current-focus","ElectriAI"],
    ["POE2","build-log"],["POE2","mechanics"],["Brain","POE2"],
    ["Capabilities","skills-index"],["Capabilities","agents-index"],["VCC","skills-index"],["Tools","VCC"] && ["skills-index","VCC"],
    ["current-focus","attention"],["Templates","Brain"],["Capabilities","Brain"],
  ].filter(Boolean);

  // ---- terminal: 4 scripted Claude Code sessions (typewriter replay) ----
  // kinds: prompt, user, asst, tool, toolok, dim, done  · d = ms delay after line
  const termSessions = [
    { name: "vault-command-center", cwd: "~/05_Tools/vault-command-center", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "wire the terminal PTY bridge so panes survive a renderer reload" },
      { k: "asst", t: "I'll route the pty through IPC and keep the process in main.js so an F5 only", type: true },
      { k: "asst", t: "re-attaches xterm to the existing session.", type: true },
      { k: "tool", t: "● Read(main.js)", d: 350 },
      { k: "toolok", t: "  ⎿ read 3153 lines", d: 200 },
      { k: "tool", t: "● Edit(preload.js) — expose pty-attach", d: 500 },
      { k: "toolok", t: "  ⎿ +1 method on window.api", d: 250 },
      { k: "tool", t: "● Bash(node --check terminal.js)", d: 600 },
      { k: "toolok", t: "  ⎿ ok — no syntax errors", d: 300 },
      { k: "asst", t: "Done. Panes now reattach on reload; PTY survives F5.", type: true },
      { k: "done", t: "✔ finished · 4 tool calls · 18.2k tokens", d: 300 },
    ]},
    { name: "ElectriAI", cwd: "~/02_Research/ElectriAI", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "run the topology-feature ablation and summarize" },
      { k: "asst", t: "Running the ablation over {raw, +admittance, +distance, +betweenness}.", type: true },
      { k: "tool", t: "● Bash(python ablate.py --folds 5)", d: 500 },
      { k: "dim", t: "  fold 1/5  acc=0.918", d: 260 },
      { k: "dim", t: "  fold 3/5  acc=0.941", d: 260 },
      { k: "dim", t: "  fold 5/5  acc=0.947", d: 260 },
      { k: "toolok", t: "  ⎿ mean top-1: 0.947 ± 0.006", d: 250 },
      { k: "asst", t: "Topology features add +5.5pts over raw PMU; betweenness carries most", type: true },
      { k: "asst", t: "of the lift under missing-sensor noise.", type: true },
      { k: "done", t: "✔ finished · 1 tool call · 22.4k tokens", d: 300 },
    ]},
    { name: "rag-track-a", cwd: "~/03_Learning/rag", lines: [
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
    { name: "notes-agent", cwd: "~/00_The_Vault", lines: [
      { k: "prompt", t: "› ", inline: true },
      { k: "user", t: "scan the vault for notes that link to attention-mechanisms" },
      { k: "asst", t: "Scanning for [[attention-mechanisms]] backlinks.", type: true },
      { k: "tool", t: "● Grep([[attention-mechanisms]])", d: 400 },
      { k: "toolok", t: "  ⎿ 3 files", d: 220 },
      { k: "dim", t: "  rag-eval-notes.md", d: 180 },
      { k: "dim", t: "  current-focus.md", d: 180 },
      { k: "dim", t: "  transformers.md", d: 180 },
      { k: "asst", t: "3 notes link here — added them to the Files backlinks panel.", type: true },
      { k: "done", t: "✔ finished · 1 tool call · 4.1k tokens", d: 300 },
    ]},
  ];

  return { home, todos, mstar, caps, tokens, game, RARITY, heatmap, notes, tree, FOLDERS, GRAPH_BG, gnodes, gedges, termSessions,
    DOMAIN_LABELS: { "00_About": "About", "01_Games": "Games", "02_Research": "Research", "03_Learning": "Learning", "04_Work": "Work", "05_Tools": "Tools" } };
})();
