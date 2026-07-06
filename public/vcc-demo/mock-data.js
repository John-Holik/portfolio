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
    "00_About/Templates/Templates.md": {
      props: { type: "hub", updated: "2026-06-30" },
      links: ["Codex"],
      body: `# Templates

Reusable note scaffolds so every note starts with the right frontmatter and shape.

## Available
- **_note** — default frontmatter (\`type\`, \`updated\`, \`tags\`)
- **_project** — adds \`status\` and a Status / Next section
- **_study** — a learning note with a "the core" + "open questions" split
- **_memory** — durable-fact schema (\`name\` / \`description\` / \`metadata.type\`)

New notes copy the matching template so the graph and search stay consistent. Linked from [[Codex]].`,
    },
    "00_About/Capabilities/Capabilities.md": {
      props: { type: "hub", updated: "2026-07-01" },
      links: ["skills-index", "agents-index", "Codex"],
      body: `# Capabilities

The durable index of what I've taught the assistant to do.

- [[skills-index]] — authored skills (\`~/.claude/skills/*\`)
- [[agents-index]] — authored subagents (\`~/.claude/agents/*\`)

Skills and agents are user-level, so they work across every project. When a manual workflow repeats, it graduates into one of these. Rolled up under [[Codex]].`,
    },
    "00_About/Memory/MEMORY.md": {
      props: { type: "index", entries: 18, updated: "2026-07-05" },
      links: ["Codex"],
      body: `# Memory index

One line per durable memory — loaded at session start so a fresh assistant has context.

- **how-i-work** — environment, code style, writing rules
- **working-rules** — terse / verify / push back
- **verdant-baseline** — the 88.4% GBT number and why it's the floor
- **deploy-path** — portfolio ships via git push, not wrangler

> Facts here reflect what was true when written. Verify names against the repo before acting. Hub: [[Codex]].`,
    },
    "01_Games/Emberfall/Emberfall.md": {
      props: { type: "game", status: "active", updated: "2026-07-03" },
      links: ["build-log", "mechanics"],
      body: `# Emberfall

Notes and theorycraft for my current action-RPG character.

## Current build
Ember Sorcerer — ignite-stacking, crit-scaled. Clears well; a little squishy into hard-hitting bosses.

## Focus
- Convert more spell damage to fire for the ignite multiplier
- Cap chaos resistance before the next boss tier

See the [[build-log]] for session-by-session progress and [[mechanics]] for the damage math.`,
    },
    "01_Games/Emberfall/build-log.md": {
      props: { type: "log", updated: "2026-07-03" },
      links: ["Emberfall", "mechanics"],
      body: `# Build log

Session-by-session progress on the [[Emberfall]] character.

- **Lvl 74** — swapped to the ignite cluster; single-target damage roughly doubled
- **Lvl 78** — capped chaos res, dropped a life roll to do it; survivability up
- **Lvl 82** — respec'd the crit wheel per [[mechanics]]; still tuning

## Next
Farm the tier-3 map set for a better weapon base, then re-evaluate the crit vs. ignite split.`,
    },
    "01_Games/Emberfall/mechanics.md": {
      props: { type: "note", updated: "2026-07-02" },
      links: ["Emberfall"],
      body: `# Mechanics

The damage math behind the [[Emberfall]] build.

## Ignite
Ignite deals a fraction of the base hit as fire damage over time. Bigger hits mean bigger ignites, so crit and hit-damage both feed it.

## Crit
\`effective = base × (1 + critChance × (critMulti − 1))\`

Past ~70% crit chance the returns flatten — that's when hit-damage nodes start to win.`,
    },
    "02_Research/Research.md": {
      props: { type: "hub", updated: "2026-07-02" },
      links: ["Verdant", "harvest-index"],
      body: `# Research

The research hub. Flagship project plus supporting notes.

- [[Verdant]] — crop-yield forecasting from satellite imagery (active)
- [[harvest-index]] — the domain background the yield target rests on

Everything here feeds toward a publishable draft this cycle.`,
    },
    "02_Research/Verdant/satellite-data.md": {
      props: { type: "dataset", source: "Sentinel-2", updated: "2026-06-27" },
      links: ["Verdant", "ndvi-priors"],
      body: `# Satellite data

The imagery pipeline that feeds [[Verdant]].

## Source
- **Sentinel-2** L2A surface reflectance, 10 m bands (B2/B3/B4/B8)
- Revisit ~5 days; clouds masked with the scene classification layer

## Processing
- Clip to field boundaries, resample to a common grid
- Stack per-field time series → input to the temporal model

Missing acquisitions (cloudy weeks) are the main robustness risk. [[ndvi-priors]] help fill the gaps.`,
    },
    "02_Research/Verdant/yield-model.md": {
      props: { type: "model", status: "training", updated: "2026-07-01" },
      links: ["Verdant", "canopy-features"],
      body: `# Yield model

The temporal CNN at the core of [[Verdant]].

## Architecture
1D conv over the NDVI time-axis → global pool → MLP head to a scalar yield.

## Results
- Baseline GBT: **88.4%** within ±5%
- Temporal CNN: **93.1%**, and steadier in cloudy weeks

Inputs come from [[canopy-features]]. Next: the ablation that isolates their contribution vs. raw bands.`,
    },
    "02_Research/Verdant/ndvi-priors.md": {
      props: { type: "note", updated: "2026-06-26" },
      links: ["canopy-features", "satellite-data"],
      body: `# NDVI priors

Seasonal shape priors that regularize sparse [[satellite-data]].

## Idea
A field's NDVI follows a smooth green-up → peak → senescence curve. Fitting a double-logistic to the observed points lets us interpolate missing dates and denoise noisy ones.

Feeds cleaner sequences into [[canopy-features]] before they hit the model.`,
    },
    "02_Research/harvest-index.md": {
      props: { type: "note", updated: "2026-06-24" },
      links: ["Research", "Verdant"],
      body: `# Harvest index

Domain background: the ratio of grain mass to total above-ground biomass.

Why it matters for [[Verdant]]: the model predicts yield, but biomass is what the canopy signal actually tracks. The harvest index is the (crop- and season-dependent) bridge between the two, and part of why per-crop calibration helps. Rolls up to [[Research]].`,
    },
    "03_Learning/Learning.md": {
      props: { type: "hub", updated: "2026-07-04" },
      links: ["diffusion", "vector-search", "graph-nets"],
      body: `# Learning

Study hub. The retrieval-systems track is the live one.

- [[vector-search]] · [[retrieval]] · [[embeddings]] — the retrieval track
- [[diffusion]] · [[transformers]] — generative fundamentals
- [[graph-nets]] — for interview breadth

Notes here double as interview prep.`,
    },
    "03_Learning/transformers.md": {
      props: { type: "study", updated: "2026-07-03" },
      links: ["diffusion"],
      body: `# Transformers

Attention, from the ground up.

## The core
\`Attention(Q, K, V) = softmax(QKᵀ / √d) · V\`

Each token builds a query, compares it to every key, and takes a weighted sum of values. Multi-head runs several of these in parallel subspaces.

## Why it stuck
No recurrence → fully parallel over sequence length, and long-range dependencies are one hop away. Shares the embedding backbone with [[diffusion]] and the retrieval track.`,
    },
    "03_Learning/retrieval.md": {
      props: { type: "study", updated: "2026-07-02" },
      links: ["vector-search", "embeddings"],
      body: `# Retrieval

The R in RAG: fetch the right context before generating.

## Pipeline
1. Embed the query ([[embeddings]])
2. Nearest-neighbour search over the index ([[vector-search]])
3. Optionally re-rank the top-k with a cross-encoder

> Debug the stages separately: a bad answer from perfect context is a generation bug, not a retrieval one.`,
    },
    "03_Learning/embeddings.md": {
      props: { type: "study", updated: "2026-07-01" },
      links: ["retrieval", "vector-search"],
      body: `# Embeddings

Dense vectors where distance ≈ semantic similarity.

## Notes
- Normalize before cosine similarity, or use dot-product on unit vectors
- Chunk size matters as much as the model: too big dilutes, too small fragments
- Cache aggressively — embedding is the cheap-to-reuse part

Consumed by [[retrieval]] and [[vector-search]].`,
    },
    "03_Learning/graph-nets.md": {
      props: { type: "study", updated: "2026-06-29" },
      links: ["Learning", "interview-prep"],
      body: `# Graph neural networks

Message passing over graph structure.

## The core
Each node updates its state by aggregating (sum/mean/max) transformed messages from its neighbours, repeated for K layers so information travels K hops.

On the list for [[interview-prep]] breadth; part of the [[Learning]] track.`,
    },
    "04_Work/interview-prep.md": {
      props: { type: "note", status: "in-progress", updated: "2026-07-04" },
      links: ["northwind", "system-design", "graph-nets"],
      body: `# Interview prep

Prep tracker for the [[northwind]] loop.

## DSA
- Arrays / two-pointer, hashing — solid
- Graphs / BFS-DFS — reviewing (see [[graph-nets]] for the ML side)
- DP — the weak spot, daily reps

## ML depth
Bias/variance, regularization, the metrics from my retrieval notes.

Pairs with [[system-design]] for the architecture round.`,
    },
    "04_Work/system-design.md": {
      props: { type: "note", updated: "2026-07-03" },
      links: ["northwind", "interview-prep"],
      body: `# System design

Notes for the design round of the [[northwind]] loop.

## Framework
Requirements → estimates → API → data model → scale → tradeoffs.

## ML-flavoured prompts
- Design a feature store
- Serve a model at low latency (batching, caching, quantization)
- An online eval / monitoring pipeline

Sibling to [[interview-prep]].`,
    },
    "04_Work/comp-research.md": {
      props: { type: "note", updated: "2026-06-28" },
      links: ["Work"],
      body: `# Comp research

Notes to negotiate from data, not vibes.

- Level the role first (title inflation is real), then band it
- Total comp = base + bonus + equity; discount equity by stage/liquidity
- Always get a range before naming a number

Feeds the [[Work]] pipeline.`,
    },
    "05_Tools/vault-dash/vault-dash.md": {
      props: { type: "tool", status: "active", stack: "Electron", updated: "2026-07-05" },
      links: ["skills-index", "agents-index"],
      body: `# vault-dash

A desktop control center for the vault and the assistant setup. (This demo is a static replica of it.)

## Features
- Embedded terminals running the CLI, side by side
- A file browser with a markdown preview and backlinks
- This knowledge graph
- A gamification layer (XP, coins, activity heatmap)

Indexes what I've built in [[skills-index]] and [[agents-index]].`,
    },
    "05_Tools/vault-dash/skills-index.md": {
      props: { type: "index", updated: "2026-07-05" },
      links: ["vault-dash", "Capabilities"],
      body: `# Skills index

Authored skills surfaced to the CLI.

- **build-loot-filter** — generate a loot filter from a build
- **job-search** — pull and score postings into a sheet
- **save-session** — write a session summary into the vault
- **tree-path** — optimal passive-tree routing

Surfaced by [[vault-dash]]; catalogued under [[Capabilities]].`,
    },
    "05_Tools/vault-dash/agents-index.md": {
      props: { type: "index", updated: "2026-07-05" },
      links: ["vault-dash", "Capabilities"],
      body: `# Agents index

Authored subagents.

- **repo-audit** — multi-agent codebase review
- **academic-researcher** — cited literature search
- **code-optimizer** — profile-first performance passes

Composed from [[vault-dash]] and tracked in [[Capabilities]].`,
    },
  };

  // graph node name -> the note that opens when you click it
  const NODE_PATHS = {
    Codex: "00_About/Codex.md", "current-notes": "00_About/current-notes.md",
    Templates: "00_About/Templates/Templates.md", Capabilities: "00_About/Capabilities/Capabilities.md",
    Memory: "00_About/Memory/MEMORY.md",
    Research: "02_Research/Research.md", Verdant: "02_Research/Verdant/Verdant.md",
    "canopy-features": "02_Research/Verdant/canopy-features.md", "satellite-data": "02_Research/Verdant/satellite-data.md",
    "harvest-index": "02_Research/harvest-index.md", "yield-model": "02_Research/Verdant/yield-model.md",
    "ndvi-priors": "02_Research/Verdant/ndvi-priors.md",
    Learning: "03_Learning/Learning.md", diffusion: "03_Learning/diffusion-models.md",
    "vector-search": "03_Learning/vector-search-notes.md", transformers: "03_Learning/transformers.md",
    retrieval: "03_Learning/retrieval.md", embeddings: "03_Learning/embeddings.md",
    "graph-nets": "03_Learning/graph-nets.md",
    Work: "04_Work/Work.md", northwind: "04_Work/northwind-application.md",
    "interview-prep": "04_Work/interview-prep.md", "system-design": "04_Work/system-design.md",
    "comp-research": "04_Work/comp-research.md",
    Emberfall: "01_Games/Emberfall/Emberfall.md", "build-log": "01_Games/Emberfall/build-log.md",
    mechanics: "01_Games/Emberfall/mechanics.md",
    "vault-dash": "05_Tools/vault-dash/vault-dash.md", "skills-index": "05_Tools/vault-dash/skills-index.md",
    "agents-index": "05_Tools/vault-dash/agents-index.md",
  };

  // folder tree (dirs + files) built from every note path so the Files tab shows the
  // whole fictional vault and graph "Open in Files →" always resolves
  function makeTree(paths) {
    const root = [], dirIndex = new Map([["", root]]);
    paths.slice().sort().forEach((p) => {
      const parts = p.split("/");
      let prefix = "", parent = root;
      parts.forEach((part, i) => {
        if (i === parts.length - 1) { parent.push({ type: "file", name: part, rel: p }); return; }
        const np = prefix ? prefix + "/" + part : part;
        if (!dirIndex.has(np)) { const arr = []; parent.push({ type: "dir", name: part, children: arr }); dirIndex.set(np, arr); }
        parent = dirIndex.get(np); prefix = np;
      });
    });
    return root;
  }
  const tree = makeTree(Object.keys(notes));

  // ---- graph: ~30 nodes across folders with wikilink edges ----
  // colors lifted from the real graph.js DOMAIN_COLORS (as used by the Nebula preset);
  // About brightened from #7C83FF — the original indigo sat too close to the bg hue
  const FOLDERS = {
    About: "#9AA3FF", Research: "#34E89E", Learning: "#3FD0EE", Work: "#FF6FB0", Games: "#FFB23E", Tools: "#FF7A5C",
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

  return { home, todos, mstar, caps, tokens, game, RARITY, heatmap, notes, tree, NODE_PATHS, FOLDERS, GRAPH_BG, gnodes, gedges, termSessions,
    DOMAIN_LABELS: { "00_About": "About", "01_Games": "Games", "02_Research": "Research", "03_Learning": "Learning", "04_Work": "Work", "05_Tools": "Tools" } };
})();
