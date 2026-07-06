/* VCC portfolio demo — all interactivity. Pure vanilla JS, in-memory state, no external calls. */
(function () {
  "use strict";
  const M = window.MOCK;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- demo banner ----------
  $("#demobarX").onclick = () => $("#demobar").classList.add("hidden");

  // ---------- tabs ----------
  let activeTab = "home";
  function activateTab(id) {
    activeTab = id;
    $$(".seg .tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === id));
    $$(".panel").forEach((p) => p.classList.toggle("on", p.id === id));
    if (id === "terminal") startTerminal();
    if (id === "graph") startGraph();
    if (id === "profile") renderProfile();
  }
  window.activateTab = activateTab;
  $$(".seg .tab").forEach((t) => (t.onclick = () => { activateTab(t.dataset.tab); history.replaceState(null, "", "#" + t.dataset.tab); }));
  setTimeout(() => {
    const hashTab = location.hash.slice(1);
    if (hashTab && hashTab !== "home" && document.getElementById(hashTab)) activateTab(hashTab);
  }, 0);

  // ---------- header: clock, 5H pill, gamestrip ----------
  function greeting() { const h = new Date().getHours(); return h < 5 ? "Late night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }
  function fmtTok(n) { n = +n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(0) + "k" : "" + n; }
  function fmtBytes(b) { const u = ["B", "KB", "MB", "GB"]; let i = 0; while (b >= 1024 && i < 3) { b /= 1024; i++; } return b.toFixed(i ? 1 : 0) + " " + u[i]; }
  function timeAgo(min) { if (min < 60) return min + "m ago"; const h = Math.floor(min / 60); if (h < 24) return h + "h ago"; return Math.floor(h / 24) + "d ago"; }

  function renderHeaderPills() {
    const t = M.tokens, cls = t.fivePct >= 85 ? "crit" : t.fivePct >= 60 ? "warn" : "";
    $("#fhval").textContent = t.fivePct + "%";
    const bar = $("#fhbar"); bar.style.width = t.fivePct + "%"; bar.className = cls;
    $("#fhsub").textContent = "· " + t.fiveReset;
    const g = M.game;
    $("#gamestrip").innerHTML =
      `<span class="gs-lv">L${g.level}</span>` +
      `<span class="gs-bar"><i style="width:${g.xpPct}%"></i></span>` +
      `<span class="gs-cur" title="Coins">${coinIco()}${g.coins.toLocaleString()}</span>` +
      `<span class="gs-cur" title="Gems">${gemIco()}${g.gems}</span>`;
    $("#gamestrip").onclick = () => activateTab("profile");
  }
  function coinIco() { return `<span class="coin" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFE49A,#E8B23A)"></span>`; }
  function gemIco() { return `<span class="gem" style="display:inline-block;width:11px;height:11px;background:radial-gradient(circle at 35% 30%,#9EE6FF,#4FA8E8);transform:rotate(45deg)"></span>`; }

  // live-ish 5H drift so the pill feels alive
  setInterval(() => {
    M.tokens.fivePct = Math.max(8, Math.min(96, M.tokens.fivePct + (Math.random() * 4 - 1.6)));
    M.tokens.fivePct = Math.round(M.tokens.fivePct);
    renderHeaderPills();
  }, 4000);

  // ---------- HOME ----------
  const state = { todos: JSON.parse(JSON.stringify(M.todos)), mstar: JSON.parse(JSON.stringify(M.mstar)) };
  let todoLineSeq = 100;

  function homeHeader() {
    const now = new Date();
    const sub = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) +
      `  ·  <span id="homeclock">${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>`;
    return `<div class="home-hd"><div><h1>${greeting()}, John</h1><div class="home-sub">${sub}</div></div>
      <div class="home-tools"><button class="btn sm" id="homerescan">Rescan</button></div></div>`;
  }
  // masonry columns size cards by content height; `span` is ignored (kept for call-site clarity)
  function card(id, title, span, bodyHtml, link) {
    return `<div class="hcard"><div class="hc-hd"><span class="hc-title">${title}</span>${link || ""}</div><div class="hc-body" data-w="${id}">${bodyHtml}</div></div>`;
  }
  function goLink(tab) { return `<span class="hc-link" data-go="${tab}">view →</span>`; }

  function todoBody() {
    const items = state.todos.open.length
      ? `<div class="todolist">` + state.todos.open.map((t) => `<div class="todo" data-line="${t.line}" title="click to complete"><span class="tck"></span><span class="ttext">${esc(t.text)}</span></div>`).join("") + `</div>`
      : `<p class="muted small">No open tasks.</p>`;
    return items + `<div class="todoadd"><input id="todoinput" placeholder="add a task…" maxlength="120" /><button class="btn sm" id="todoaddbtn">Add</button></div>`;
  }
  function doneBody() {
    if (!state.todos.done.length) return `<p class="muted small">Nothing checked off yet.</p>`;
    return `<div class="donelist">` + state.todos.done.slice(0, 6).map((t) => `<div class="doneitem" data-line="${t.line}" title="click to reopen"><span class="dck">✓</span><span class="dtext">${esc(t.text)}</span><span class="ri-time">${esc(t.date || "")}</span></div>`).join("") + `</div>`;
  }
  function vaultBody() {
    const s = M.home.stats, dmax = Math.max(...s.domains.map((d) => d.md));
    return `<div class="hc-vault"><div class="hc-bignum">${s.totalMd.toLocaleString()}<span>notes</span></div>
      <div class="hc-5lab">${s.totalFiles.toLocaleString()} files · ${fmtBytes(s.totalBytes)}</div></div>
      <div class="domains">` + s.domains.map((d) => `<div class="drow"><span class="dn">${esc(M.DOMAIN_LABELS[d.name] || d.name)}</span>
        <div class="dbar"><i style="width:${(d.md / dmax) * 100}%"></i></div><span class="dc">${d.md}</span></div>`).join("") + `</div>`;
  }
  function usageBody() {
    const t = M.tokens, pct = t.fivePct, cls = pct >= 85 ? "crit" : pct >= 60 ? "warn" : "ok";
    const wcls = t.weekPct >= 85 ? "crit" : t.weekPct >= 60 ? "warn" : "ok";
    return `<div class="hc-5h"><div class="hc-big ${cls}">${pct}%</div>
      <div class="hc-5lab">of 5-hour limit · resets in ${t.fiveReset}</div>
      <div class="hbar"><i class="${cls}" style="width:${pct}%"></i></div></div>
      <div class="hc-5h hc-week"><div class="hc-big ${wcls}" style="font-size:22px">${t.weekPct}%</div>
      <div class="hc-5lab">of weekly limit · resets in ${t.weekReset}</div>
      <div class="hbar"><i class="${wcls}" style="width:${t.weekPct}%"></i></div></div>
      <div class="hc-rows"><div class="hrow"><span>Today</span><b>${fmtTok(t.today)}</b></div>
      <div class="hrow"><span>Last 7 days</span><b>${fmtTok(t.last7)}</b></div>
      <div class="hrow"><span>All time</span><b>${fmtTok(t.allTime)}</b></div></div>`;
  }
  function capBody() {
    const c = M.caps;
    return `<div class="hc-caps"><div class="capstat ok"><b>${c.ok}</b><span>healthy</span></div>
      <div class="capstat warn"><b>${c.warn}</b><span>warnings</span></div>
      <div class="capstat err"><b>${c.err}</b><span>errors</span></div></div>
      <div class="hc-rows"><div class="hrow"><span>Skills</span><b>${c.skills}</b></div>
      <div class="hrow"><span>Agents</span><b>${c.agents}</b></div></div>`;
  }
  function notesBody() {
    return M.home.recentFiles.map((f) => {
      const dir = f.rel.split("/").slice(0, -1).join(" / ");
      return `<div class="ritem" data-rel="${esc(f.rel)}"><div class="ri-main"><span class="ri-name">${esc(f.name)}</span><span class="ri-sub">${esc(dir)}</span></div><span class="ri-time">${timeAgo(f.agoMin)}</span></div>`;
    }).join("");
  }
  function sessBody() {
    return M.home.recentSessions.map((x) => `<div class="ritem rsession"><div class="ri-main"><span class="ri-name">${esc(x.title)}</span><span class="ri-sub">${esc(x.label)} · ${x.msgs} msg</span></div><span class="ri-time">${timeAgo(x.agoMin)}</span></div>`).join("");
  }
  function hubsBody() {
    return `<div class="hubs">` + M.home.hubs.map((h) => `<a class="hub" data-rel="${esc(h.rel)}">${esc(h.label)}</a>`).join("") + `</div>`;
  }
  function mstarBody() {
    const m = state.mstar;
    let html = `<div class="mstar-top"><div class="mstar-bar"><i style="width:${m.pct}%"></i></div><span class="mstar-count">${m.done}/${m.total}</span></div>`;
    let grp = "";
    m.tasks.forEach((t, i) => {
      if (t.g !== grp) { grp = t.g; html += `<div class="mstar-grp">${esc(grp)}</div>`; }
      html += `<div class="mstar-item${t.done ? " done" : ""}" data-mi="${i}" title="click to toggle"><span class="mstar-ck">${t.done ? "✓" : ""}</span><span class="mstar-t">${esc(t.t)}</span></div>`;
    });
    return html;
  }
  function petBody() {
    const p = M.game.pet;
    return `<div class="g-pethome">${petSvg(52)}<div class="g-pethome-info"><div class="g-pethome-name">${esc(p.name)}</div>
      <div class="g-pethome-lv">Lv ${p.level}/${p.maxLevel} · ${p.mood}</div>
      <div class="g-petbar"><i style="width:${p.xpPct}%"></i></div></div></div>`;
  }
  function usageTrendBody() {
    const s = M.tokens.series, max = Math.max(...s.map((x) => x.total));
    return `<div class="sparkline">` + s.map((x) => `<div class="spk" style="height:${Math.max(8, (x.total / max) * 100)}%" title="${x.day}: ${fmtTok(x.total)}"></div>`).join("") + `</div>
      <div class="hc-rows"><div class="hrow"><span>Peak day</span><b>${fmtTok(max)}</b></div>
      <div class="hrow"><span>Opus share</span><b>${M.tokens.byModel[0].pct}%</b></div></div>`;
  }

  function renderHome() {
    const wrap = $("#homewrap");
    // order = reading priority; CSS column-fill balances the three columns' heights.
    // tall card (interview prep) leads column 1; the rest interleave medium/small.
    wrap.innerHTML = homeHeader() + `<div class="homegrid">` + [
      card("mstar", "Northwind interview prep", 10, mstarBody(), `<span class="hc-link" data-rel="04_Work/northwind-application.md">open →</span>`),
      card("todo", "Todo", 8, todoBody()),
      card("usage", "5-hour usage", 6, usageBody(), goLink("profile")),
      card("notes", "Recent notes", 8, notesBody(), goLink("files")),
      card("vault", "Vault snapshot", 8, vaultBody(), goLink("files")),
      card("pet", "Companion", 8, petBody(), goLink("profile")),
      card("sessions", "Recent sessions", 10, sessBody(), goLink("history")),
      card("caps", "Capabilities", 6, capBody(), goLink("capabilities")),
      card("done", "Recently completed", 8, doneBody()),
      card("trend", "7-day tokens", 8, usageTrendBody(), goLink("profile")),
      card("hubs", "Hubs", 8, hubsBody()),
    ].join("") + `</div>`;
    wireHome();
  }
  function wireHome() {
    $("#homerescan").onclick = () => renderHome();
    $$(".hc-link[data-go]").forEach((e) => (e.onclick = (ev) => { ev.stopPropagation(); activateTab(e.dataset.go); }));
    $$(".hc-link[data-rel], .ritem[data-rel], .hub[data-rel]").forEach((e) => (e.onclick = (ev) => { ev.stopPropagation(); openFile(e.dataset.rel); activateTab("files"); }));
    $$(".rsession").forEach((e) => (e.onclick = () => activateTab("history")));
    $$(".todo").forEach((e) => (e.onclick = () => completeTodo(+e.dataset.line)));
    $$(".doneitem").forEach((e) => (e.onclick = () => reopenTodo(+e.dataset.line)));
    $$(".mstar-item").forEach((e) => (e.onclick = () => toggleMstar(+e.dataset.mi)));
    const ti = $("#todoinput"), tb = $("#todoaddbtn");
    if (tb) tb.onclick = () => addTodo(ti);
    if (ti) ti.onkeydown = (ev) => { if (ev.key === "Enter") addTodo(ti); };
  }
  // update only the Todo + Recently-completed card bodies in place — never rebuild the
  // whole grid, so no other card can move when a task is checked off.
  function refreshTodos() {
    const tb = $('.hc-body[data-w="todo"]'), db = $('.hc-body[data-w="done"]');
    if (tb) tb.innerHTML = todoBody();
    if (db) db.innerHTML = doneBody();
    $$(".todo").forEach((e) => (e.onclick = () => completeTodo(+e.dataset.line)));
    $$(".doneitem").forEach((e) => (e.onclick = () => reopenTodo(+e.dataset.line)));
    const ti = $("#todoinput"), tbtn = $("#todoaddbtn");
    if (tbtn) tbtn.onclick = () => addTodo(ti);
    if (ti) ti.onkeydown = (ev) => { if (ev.key === "Enter") addTodo(ti); };
  }
  function completeTodo(line) {
    const i = state.todos.open.findIndex((t) => t.line === line); if (i < 0) return;
    const [t] = state.todos.open.splice(i, 1);
    t.date = new Date().toLocaleDateString([], { month: "2-digit", day: "2-digit" });
    state.todos.done.unshift(t); refreshTodos();
  }
  function reopenTodo(line) {
    const i = state.todos.done.findIndex((t) => t.line === line); if (i < 0) return;
    const [t] = state.todos.done.splice(i, 1); state.todos.open.push(t); refreshTodos();
  }
  function addTodo(input) { const v = (input.value || "").trim(); if (!v) return; state.todos.open.push({ line: ++todoLineSeq, text: v }); refreshTodos(); const n = $("#todoinput"); if (n) n.focus(); }
  function toggleMstar(i) {
    const m = state.mstar; m.tasks[i].done = !m.tasks[i].done;
    m.done = m.tasks.filter((t) => t.done).length; m.pct = Math.round((m.done / m.total) * 100); renderHome();
  }
  // live clock
  setInterval(() => { const c = $("#homeclock"); if (c && activeTab === "home") c.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }, 1000);

  // simple companion SVG (data-sprite)
  function petSvg(sz) {
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 64 64" fill="none">
      <rect x="12" y="14" width="40" height="36" rx="10" fill="#1A1A1F" stroke="#8B95F0" stroke-width="2"/>
      <circle cx="24" cy="30" r="4.5" fill="#8B95F0"/><circle cx="40" cy="30" r="4.5" fill="#8B95F0"/>
      <circle cx="24" cy="30" r="1.6" fill="#0E0E11"/><circle cx="40" cy="30" r="1.6" fill="#0E0E11"/>
      <path d="M24 40 q8 6 16 0" stroke="#6E79E6" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="32" y1="14" x2="32" y2="6" stroke="#8B95F0" stroke-width="2"/><circle cx="32" cy="5" r="3" fill="#6E79E6"/>
      <rect x="6" y="26" width="4" height="10" rx="2" fill="#6E79E6"/><rect x="54" y="26" width="4" height="10" rx="2" fill="#6E79E6"/>
    </svg>`;
  }

  // ---------- TERMINAL ----------
  let termStarted = false;
  let termTimers = [];
  const NEON = ["#6E79E6", "#3FB950", "#E2A33B", "#F7768E"];
  function clearTermTimers() { termTimers.forEach(clearTimeout); termTimers = []; }
  function buildTerminal() {
    const wrap = $("#gridwrap");
    wrap.innerHTML = M.termSessions.map((s, i) => `
      <div class="cell" data-pane="${i}" style="--neon:${NEON[i]}">
        <div class="cellhead">
          <span class="cdot2" data-dot="${i}"></span>
          <span class="cname">${esc(s.name)}</span>
          <span class="muted small" style="font-family:var(--mono)">${esc(s.cwd)}</span>
          <button class="hbtn" data-replay="${i}" title="Restart replay">⟳</button>
        </div>
        <div class="cellbody" data-body="${i}"></div>
      </div>`).join("");
    $$("[data-replay]").forEach((b) => (b.onclick = () => playPane(+b.dataset.replay)));
    updateNeonToggle();
  }
  function updateNeonToggle() { $("#gridhost").classList.toggle("neon", $("#btneon").classList.contains("on")); }
  $("#btneon").onclick = function () { this.classList.toggle("on"); updateNeonToggle(); };
  let chimeOn = true;
  $("#btmute").onclick = function () { chimeOn = !chimeOn; this.classList.toggle("on", chimeOn); };
  $("#btmute").classList.add("on");
  $("#btreplayall").onclick = () => { M.termSessions.forEach((_, i) => playPane(i)); };

  function setDot(i, cls) {
    const d = $(`[data-dot="${i}"]`); if (d) d.className = "cdot2 " + cls;
    const cell = $(`[data-pane="${i}"]`); if (cell) cell.classList.toggle("running", cls === "running" || cls === "typing");
    renderTermStatus();
  }
  function renderTermStatus() {
    const chips = M.termSessions.map((s, i) => {
      const d = $(`[data-dot="${i}"]`); const cls = d ? (d.className.split(" ")[1] || "idle") : "idle";
      return `<span class="tstatus-chip"><span class="tstatus-dot ${cls}"></span><span class="tstatus-name">${esc(s.name)}</span></span>`;
    }).join("");
    $("#termstatus").innerHTML = activeTab === "terminal" ? chips : "";
  }

  function playPane(i) {
    const body = $(`[data-body="${i}"]`); if (!body) return;
    body.innerHTML = ""; setDot(i, "running");
    const lines = M.termSessions[i].lines;
    let idx = 0;
    function next() {
      if (idx >= lines.length) { setDot(i, "idle"); if (chimeOn) chime(); return; }
      const ln = lines[idx++];
      if (ln.k === "prompt") { next(); return; } // prompt is drawn as the prefix of the user line
      const div = document.createElement("div");
      div.className = "ln t-" + ln.k;
      body.appendChild(div);
      if (ln.k === "user") {
        // draw the "› " prompt, then typewriter the command after it
        const pr = document.createElement("span"); pr.className = "t-prompt"; pr.textContent = "› "; div.appendChild(pr);
        setDot(i, "typing");
        typeInto(div, ln.t, "t-user", () => { body.scrollTop = body.scrollHeight; termTimers.push(setTimeout(next, ln.d || 260)); });
      } else if (ln.type) {
        setDot(i, "running");
        typeInto(div, ln.t, "t-asst", () => { body.scrollTop = body.scrollHeight; termTimers.push(setTimeout(next, ln.d || 260)); });
      } else {
        div.textContent = ln.t; body.scrollTop = body.scrollHeight;
        setDot(i, "running");
        termTimers.push(setTimeout(next, ln.d || 200));
      }
    }
    next();
  }
  function typeInto(div, text, cls, done) {
    const span = document.createElement("span"); span.className = cls;
    const cur = document.createElement("span"); cur.className = "t-cursor";
    div.appendChild(span); div.appendChild(cur);
    let j = 0;
    (function step() {
      if (j >= text.length) { cur.remove(); done && done(); return; }
      span.textContent += text[j++];
      termTimers.push(setTimeout(step, 12 + Math.random() * 22));
    })();
  }
  // WebAudio done-chime
  let audioCtx;
  function chime() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      [660, 880].forEach((f, k) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0, now + k * 0.09); g.gain.linearRampToValueAtTime(0.08, now + k * 0.09 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + k * 0.09 + 0.28);
        o.connect(g); g.connect(audioCtx.destination); o.start(now + k * 0.09); o.stop(now + k * 0.09 + 0.3);
      });
    } catch (e) {}
  }
  function startTerminal() {
    if (!termStarted) { termStarted = true; buildTerminal(); }
    renderTermStatus();
    clearTermTimers();
    // stagger the four panes so it reads as a live workspace
    M.termSessions.forEach((_, i) => termTimers.push(setTimeout(() => playPane(i), i * 900)));
  }

  // ---------- FILES ----------
  let filesBuilt = false;
  function buildTree() {
    const host = $("#tree");
    host.innerHTML = `<div class="row hd" style="cursor:default;color:var(--ft)">00_The_Vault</div>` + renderNodes(M.tree, 0);
    wireTree();
    filesBuilt = true;
  }
  function renderNodes(nodes, depth) {
    return nodes.map((n) => {
      if (n.type === "dir") {
        const open = depth === 0;
        return `<div class="row dir${open ? " open" : ""}" data-dir="1"><span class="chev">▸</span><span class="ico diricon">📁</span><span class="rowname">${esc(n.name)}</span></div>
          <div class="children${open ? "" : " collapsed"}">${renderNodes(n.children, depth + 1)}</div>`;
      }
      const disabled = !n.rel;
      return `<div class="row${disabled ? " muted" : ""}" ${n.rel ? `data-rel="${esc(n.rel)}"` : ""} title="${disabled ? "app project (opens in the real desktop app)" : ""}"><span class="chev" style="visibility:hidden">▸</span><span class="ico">📄</span><span class="rowname">${esc(n.name)}</span></div>`;
    }).join("");
  }
  function wireTree() {
    $$("#tree .row.dir").forEach((r) => (r.onclick = () => {
      r.classList.toggle("open");
      const kids = r.nextElementSibling;
      if (kids && kids.classList.contains("children")) kids.classList.toggle("collapsed");
    }));
    $$("#tree .row[data-rel]").forEach((r) => (r.onclick = () => openFile(r.dataset.rel)));
  }
  function openFile(rel) {
    if (!rel || !M.notes[rel]) return;
    if (!filesBuilt) buildTree();
    $$("#tree .row").forEach((r) => r.classList.toggle("sel", r.dataset.rel === rel));
    // ensure containing folders are open
    let el = $(`#tree .row[data-rel="${cssEsc(rel)}"]`);
    let p = el && el.previousElementSibling;
    let node = el;
    while (node) { const par = node.closest(".children"); if (par) { par.classList.remove("collapsed"); const dir = par.previousElementSibling; if (dir) dir.classList.add("open"); node = dir; } else break; }
    const n = M.notes[rel];
    const name = rel.split("/").pop().replace(/\.md$/, "");
    $("#note").innerHTML = `<div class="crumb">${esc(rel.split("/").join("  /  "))}</div><div class="doc">${mdToHtml(n.body)}</div>`;
    $$("#note .wikilink").forEach((w) => (w.onclick = () => { const target = resolveLink(w.dataset.link); if (target) openFile(target); }));
    renderInfo(rel, n);
  }
  function cssEsc(s) { return s.replace(/["\\]/g, "\\$&"); }
  function resolveLink(name) {
    // find a note whose filename (sans .md) matches the wikilink target
    const key = Object.keys(M.notes).find((k) => k.split("/").pop().replace(/\.md$/, "").toLowerCase() === name.toLowerCase());
    return key || null;
  }
  function renderInfo(rel, n) {
    const backlinks = Object.entries(M.notes).filter(([k, v]) => k !== rel && (v.links || []).some((l) => resolveLink(l) === rel)).map(([k]) => k);
    let html = `<div class="grp">Properties</div>`;
    Object.entries(n.props || {}).forEach(([k, v]) => { html += `<div class="item"><span class="k">${esc(k)}</span><span>${esc(v)}</span></div>`; });
    html += `<div class="grp">Outgoing links</div>`;
    (n.links || []).forEach((l) => { const t = resolveLink(l); html += `<a class="linkrow"${t ? ` data-rel="${esc(t)}"` : ""} style="${t ? "" : "opacity:.5;cursor:default"}">🔗 ${esc(l)}</a>`; });
    html += `<div class="grp">Backlinks</div>`;
    html += backlinks.length ? backlinks.map((b) => `<a class="linkrow" data-rel="${esc(b)}">← ${esc(b.split("/").pop().replace(/\.md$/, ""))}</a>`).join("") : `<div class="item muted">none</div>`;
    $("#info").innerHTML = html;
    $$("#info a.linkrow[data-rel]").forEach((a) => (a.onclick = () => openFile(a.dataset.rel)));
  }

  // tiny markdown renderer (headings, bold, code, lists, blockquote, fenced code, wikilinks)
  function mdToHtml(md) {
    const lines = md.split("\n");
    let out = [], i = 0;
    function inline(s) {
      s = esc(s);
      s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/\[\[([^\]]+)\]\]/g, (_, l) => `<span class="wikilink" data-link="${esc(l)}">${esc(l)}</span>`);
      return s;
    }
    while (i < lines.length) {
      let l = lines[i];
      if (l.startsWith("```")) { const code = []; i++; while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]); i++; out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`); continue; }
      if (/^### /.test(l)) { out.push(`<h3>${inline(l.slice(4))}</h3>`); i++; continue; }
      if (/^## /.test(l)) { out.push(`<h2>${inline(l.slice(3))}</h2>`); i++; continue; }
      if (/^# /.test(l)) { out.push(`<h1>${inline(l.slice(2))}</h1>`); i++; continue; }
      if (/^> /.test(l)) { const q = []; while (i < lines.length && /^> /.test(lines[i])) q.push(lines[i++].slice(2)); out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`); continue; }
      if (/^(\s*)[-*] /.test(l)) { const items = []; while (i < lines.length && /^\s*[-*] /.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*] /, "")); out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ul>`); continue; }
      if (/^\d+\. /.test(l)) { const items = []; while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, "")); out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ol>`); continue; }
      if (l.trim() === "") { i++; continue; }
      out.push(`<p>${inline(l)}</p>`); i++;
    }
    return out.join("\n");
  }
  // file search
  $("#fsearch").oninput = function () {
    const q = this.value.trim().toLowerCase();
    if (!q) { $$("#tree .row").forEach((r) => (r.style.display = "")); return; }
    $$("#tree .row").forEach((r) => {
      const name = (r.querySelector(".rowname") || {}).textContent || "";
      const rel = r.dataset.rel || "";
      const body = rel && M.notes[rel] ? M.notes[rel].body.toLowerCase() : "";
      const hit = name.toLowerCase().includes(q) || body.includes(q);
      r.style.display = r.classList.contains("dir") || r.classList.contains("hd") ? "" : hit ? "" : "none";
    });
  };

  // ---------- GRAPH (pseudo-3D force-directed, plain canvas 2D) ----------
  // 3D force sim (x/y/z centered on origin) + perspective projection + painter's sort + depth fog.
  // Visual language borrowed from the real app's Nebula preset (graph.js / graph-presets/nebula.js):
  //   deep-purple background (#0d0b28), domain-colored nodes with a radial glow halo, thin links
  //   tinted by their source node's color, persistent labels on hub nodes, slow idle rotation.
  const BG = M.GRAPH_BG, BG_RGB = [13, 11, 40];
  const FOCAL = 620;                       // perspective focal length
  let graphStarted = false, gnodes, gedges, graphRAF, hoverNode = null, selNode = null;
  let yaw = 0.5, pitch = -0.25, dist = 620; // camera orbit + zoom
  let orbiting = false, lastPx = 0, lastPy = 0, lastInteract = 0;
  let pressX = 0, pressY = 0, dragged = false, downNode = null; // click-vs-drag tracking

  function startGraph() {
    const legend = $("#glegend");
    legend.innerHTML = Object.entries(M.FOLDERS).map(([k, c]) => `<span class="gl"><i style="background:${c}"></i>${k}</span>`).join("");
    $("#gcount").textContent = `${M.gnodes.length} nodes · ${M.gedges.length} links`;
    if (!graphStarted) { graphStarted = true; initGraph(); }
    else resizeGraph();
    $("#grefresh").onclick = () => { initGraph(); };
  }
  const canvas = $("#graphcanvas"), ctx = canvas.getContext("2d");
  function resizeGraph() {
    const host = $("#graphhost"); const r = host.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvas._w = r.width; canvas._h = r.height;
  }
  function initGraph() {
    resizeGraph();
    selNode = null;
    if (gnodePanel) gnodePanel.style.display = "none";
    const nameIdx = {};
    gnodes = M.gnodes.map(([name, folder], i) => {
      nameIdx[name] = i;
      // seed on a rough sphere so the sim untangles in 3D
      return { name, folder, deg: 0,
        x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 220, z: (Math.random() - 0.5) * 220,
        vx: 0, vy: 0, vz: 0 };
    });
    gedges = M.gedges.filter((e) => nameIdx[e[0]] != null && nameIdx[e[1]] != null).map((e) => ({ a: nameIdx[e[0]], b: nameIdx[e[1]] }));
    gedges.forEach((e) => { gnodes[e.a].deg++; gnodes[e.b].deg++; });
    if (graphRAF) cancelAnimationFrame(graphRAF);
    tickGraph();
  }
  function physics() {
    for (let i = 0; i < gnodes.length; i++) {
      const a = gnodes[i];
      for (let j = i + 1; j < gnodes.length; j++) {
        const b = gnodes[j];
        let dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        let d2 = dx * dx + dy * dy + dz * dz || 0.01, d = Math.sqrt(d2);
        const rep = 4200 / d2, fx = (dx / d) * rep, fy = (dy / d) * rep, fz = (dz / d) * rep;
        a.vx += fx; a.vy += fy; a.vz += fz; b.vx -= fx; b.vy -= fy; b.vz -= fz;
      }
    }
    gedges.forEach((e) => {
      const a = gnodes[e.a], b = gnodes[e.b];
      let dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
      let d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;
      const f = (d - 78) * 0.006, fx = (dx / d) * f, fy = (dy / d) * f, fz = (dz / d) * f;
      a.vx += fx; a.vy += fy; a.vz += fz; b.vx -= fx; b.vy -= fy; b.vz -= fz;
    });
    gnodes.forEach((n) => {
      n.vx += -n.x * 0.0022; n.vy += -n.y * 0.0022; n.vz += -n.z * 0.0022; // centering to origin
      n.vx *= 0.86; n.vy *= 0.86; n.vz *= 0.86;
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
    });
  }
  // rotate a world point by the camera orbit (yaw around Y, then pitch around X)
  function toView(n) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = n.x * cy + n.z * sy;
    const z1 = -n.x * sy + n.z * cy;
    const y2 = n.y * cp - z1 * sp;
    const z2 = n.y * sp + z1 * cp;
    return { x: x1, y: y2, z: z2 };
  }
  function project(n, W, H) {
    const v = toView(n);
    const zEff = v.z + dist;
    if (zEff < 40) return null;                 // behind / too close to camera
    const s = FOCAL / zEff;
    // fog: 0 at the near plane, ->1 far away (blend toward background)
    const fog = Math.max(0, Math.min(1, (zEff - (dist - 200)) / 420));
    return { sx: W / 2 + v.x * s, sy: H / 2 + v.y * s, scale: s, fog, zEff };
  }
  function fogColor(hex, fog) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    const t = fog * 0.68;
    return `rgb(${Math.round(r + (BG_RGB[0] - r) * t)},${Math.round(g + (BG_RGB[1] - g) * t)},${Math.round(b + (BG_RGB[2] - b) * t)})`;
  }
  // domain color lightened toward white by t, with alpha a — used for edge strokes
  function edgeTint(hex, t, a) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${Math.round(r + (255 - r) * t)},${Math.round(g + (255 - g) * t)},${Math.round(b + (255 - b) * t)},${a})`;
  }
  function tickGraph() {
    physics();
    // idle auto-rotation, paused while interacting and for ~2.5s after
    if (!orbiting && Date.now() - lastInteract > 2500) yaw += 0.0016;
    drawGraph();
    graphRAF = requestAnimationFrame(tickGraph);
  }
  let proj = []; // cached projections for hit-testing
  function drawGraph() {
    const W = canvas._w, H = canvas._h;
    ctx.clearRect(0, 0, W, H);
    // subtle radial vignette so the nebula reads as depth, not a flat fill
    const vg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    vg.addColorStop(0, "rgba(36,28,84,.25)"); vg.addColorStop(1, "rgba(13,11,40,0)");
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

    proj = gnodes.map((n) => project(n, W, H));
    // edges (drawn first, additive so they stay readable against the dark bg and node glows);
    // each edge is a gradient between its endpoints' lightened domain colors, faded by depth
    ctx.globalCompositeOperation = "lighter";
    const active = hoverNode || selNode;   // clicked node stays lit even when not hovered
    gedges.forEach((e) => {
      const pa = proj[e.a], pb = proj[e.b]; if (!pa || !pb) return;
      const lit = active && (gnodes[e.a] === active || gnodes[e.b] === active);
      const dim = active && !lit;
      const fog = (pa.fog + pb.fog) / 2;
      const a = (lit ? 0.95 : dim ? 0.1 : 0.5) * (1 - fog * 0.6);
      if (a < 0.02) return;
      const grad = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
      grad.addColorStop(0, edgeTint(M.FOLDERS[gnodes[e.a].folder], 0.35, a));
      grad.addColorStop(1, edgeTint(M.FOLDERS[gnodes[e.b].folder], 0.35, a));
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.6, (lit ? 1.8 : 1.1) * ((pa.scale + pb.scale) / 2));
      ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.stroke();
    });
    ctx.globalCompositeOperation = "source-over";

    // nodes: painter-sort far -> near
    const order = gnodes.map((n, i) => i).filter((i) => proj[i]).sort((a, b) => proj[b].zEff - proj[a].zEff);
    order.forEach((i) => {
      const n = gnodes[i], p = proj[i], c = M.FOLDERS[n.folder];
      const base = 3.4 + Math.min(6, n.deg * 1.0);
      const r = Math.max(1.2, base * p.scale);
      const lit = n === hoverNode || n === selNode;
      const col = fogColor(c, p.fog);
      // glow halo (radial gradient) — brighter for near nodes, per Nebula's emissive orbs
      const glowR = r * (lit ? 5.5 : 3.0);
      const glowA = (lit ? 0.55 : 0.26) * (1 - p.fog * 0.7);
      if (glowA > 0.02) {
        const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowR);
        g.addColorStop(0, hexA(c, glowA)); g.addColorStop(0.5, hexA(c, glowA * 0.35)); g.addColorStop(1, hexA(c, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2); ctx.fill();
      }
      // core orb
      ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
      ctx.lineWidth = Math.max(0.5, 1.1 * p.scale); ctx.strokeStyle = fogColor("#ffffff", 1 - (1 - p.fog) * 0.5); ctx.globalAlpha = 0.25; ctx.stroke(); ctx.globalAlpha = 1;
    });

    // labels: hovered node + hubs (deg>=4), near ones only, drawn last so they sit on top
    ctx.font = "11px 'JetBrains Mono', ui-monospace, monospace"; ctx.textAlign = "center";
    order.forEach((i) => {
      const n = gnodes[i], p = proj[i];
      const show = n === hoverNode || n === selNode || (n.deg >= 4 && p.fog < 0.6);
      if (!show) return;
      const em = n === hoverNode || n === selNode;
      const r = Math.max(1.2, (3.4 + Math.min(6, n.deg)) * p.scale);
      const a = em ? 1 : (1 - p.fog) * 0.85;
      if (em) { const w = ctx.measureText(n.name).width + 12; ctx.fillStyle = "rgba(20,17,48,.9)"; ctx.fillRect(p.sx - w / 2, p.sy - r - 22, w, 16); }
      ctx.globalAlpha = a; ctx.fillStyle = em ? "#EDEDEF" : "rgba(200,204,224,.9)";
      ctx.fillText(n.name, p.sx, p.sy - r - 9); ctx.globalAlpha = 1;
    });
  }
  function hexA(hex, a) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgba(${r},${g},${b},${a})`; }

  function pickNode(x, y) {
    let best = null, bestD = Infinity;
    for (let i = 0; i < gnodes.length; i++) {
      const p = proj[i]; if (!p) continue;
      const r = Math.max(3, (3.4 + Math.min(6, gnodes[i].deg)) * p.scale) + 5;
      const d = (p.sx - x) ** 2 + (p.sy - y) ** 2;
      if (d <= r * r && d < bestD) { bestD = d; best = gnodes[i]; }
    }
    return best;
  }
  function evtPos(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener("mousedown", (e) => { const p = evtPos(e); orbiting = true; lastPx = p.x; lastPy = p.y; pressX = p.x; pressY = p.y; dragged = false; downNode = pickNode(p.x, p.y); lastInteract = Date.now(); canvas.classList.add("grabbing"); });
  canvas.addEventListener("mousemove", (e) => {
    const p = evtPos(e); lastInteract = Date.now();
    if (orbiting) {
      if (Math.hypot(p.x - pressX, p.y - pressY) > 4) dragged = true;   // real drag, not a click
      yaw += (p.x - lastPx) * 0.006;
      pitch += (p.y - lastPy) * 0.006;
      pitch = Math.max(-1.35, Math.min(1.35, pitch));
      lastPx = p.x; lastPy = p.y;
    } else {
      hoverNode = pickNode(p.x, p.y);
      canvas.style.cursor = hoverNode ? "pointer" : "grab";
    }
  });
  window.addEventListener("mouseup", () => {
    orbiting = false; lastInteract = Date.now(); canvas.classList.remove("grabbing");
    if (!dragged && downNode) showGraphNode(downNode);   // a click (no drag) on a node opens its info
    downNode = null;
  });
  canvas.addEventListener("wheel", (e) => { e.preventDefault(); dist = Math.max(300, Math.min(1150, dist + e.deltaY * 0.5)); lastInteract = Date.now(); }, { passive: false });
  window.addEventListener("resize", () => { if (graphStarted && activeTab === "graph") resizeGraph(); });

  // ---------- graph node info panel (mirrors the real app's snapshot panel) ----------
  let gnodePanel = null;
  function graphPanel() {
    if (gnodePanel) return gnodePanel;
    const p = document.createElement("div");
    p.className = "gnode"; p.style.display = "none";
    p.innerHTML =
      `<div class="gnode-hd"><span class="gnode-dom"><i></i><span class="gnode-domlab"></span></span><button class="gnode-close" title="Close">✕</button></div>
       <div class="gnode-title"></div>
       <div class="gnode-meta"></div>
       <div class="gnode-body"></div>
       <button class="gnode-open">Open in Files →</button>`;
    $("#graphhost").appendChild(p);
    p.querySelector(".gnode-close").onclick = () => { p.style.display = "none"; selNode = null; };
    gnodePanel = p;
    return p;
  }
  // resolve a [[wikilink]] to a graph node — by node name, else by note filename
  function resolveGraphLink(name) {
    const q = String(name).trim().toLowerCase();
    let key = Object.keys(M.NODE_PATHS).find((k) => k.toLowerCase() === q);
    if (!key) {
      const hit = Object.entries(M.NODE_PATHS).find(([, path]) => path.split("/").pop().replace(/\.md$/, "").toLowerCase() === q);
      key = hit && hit[0];
    }
    return key ? gnodes.find((n) => n.name === key) || null : null;
  }
  function showGraphNode(node) {
    const p = graphPanel();
    const path = M.NODE_PATHS[node.name];
    const note = path ? M.notes[path] : null;
    const col = M.FOLDERS[node.folder];
    selNode = node;
    p.querySelector(".gnode-dom i").style.background = col;
    p.querySelector(".gnode-domlab").textContent = node.folder;
    const title = p.querySelector(".gnode-title");
    title.textContent = node.name; title.style.color = col;
    p.querySelector(".gnode-meta").textContent = `${node.deg} link${node.deg === 1 ? "" : "s"} · ${path || node.name}`;
    const body = p.querySelector(".gnode-body");
    if (note) {
      let props = "";
      if (note.props && Object.keys(note.props).length) {
        props = `<div class="gnode-props">` + Object.entries(note.props)
          .map(([k, v]) => `<div class="p"><span class="k">${esc(k)}</span><span class="v">${esc(String(v))}</span></div>`).join("") + `</div>`;
      }
      body.innerHTML = props + `<div class="doc gnode-doc">${mdToHtml(note.body)}</div>`;
      $$(".wikilink", body).forEach((w) => (w.onclick = () => {
        const t = resolveGraphLink(w.dataset.link);
        if (t) showGraphNode(t);   // re-point the panel to the linked node, staying in the graph
      }));
    } else {
      body.innerHTML = `<p class="gnode-note">No preview for this node.</p>`;
    }
    const openBtn = p.querySelector(".gnode-open");
    if (note) { openBtn.style.display = ""; openBtn.onclick = () => { activateTab("files"); openFile(path); history.replaceState(null, "", "#files"); }; }
    else openBtn.style.display = "none";
    body.scrollTop = 0;
    p.style.display = "flex";
  }

  // ---------- PROFILE ----------
  let profileBuilt = false;
  function renderProfile() {
    const g = M.game, wrap = $("#profilewrap");
    const rarColor = M.RARITY[g.pet.rarity] || "#9A9AA6";
    wrap.innerHTML = `
      <div class="g-grid">
        <div class="hcard g-hero">
          <div class="g-petbox">${petSvg(72)}
            <div class="g-petinfo">
              <span class="g-petname">${esc(g.pet.name)} <span class="g-rar" style="color:${rarColor}">${esc(g.pet.rarity)}</span></span>
              <span class="g-petlv">Lv ${g.pet.level}/${g.pet.maxLevel} · T${g.pet.tier} · ${esc(g.pet.mood)}</span>
              <div class="g-petbar"><i style="width:${g.pet.xpPct}%"></i></div>
              <span class="g-petlore">${esc(g.pet.lore)}</span>
            </div>
          </div>
          <div class="g-herostat">
            <div class="g-lvrow"><span class="g-lvbig">Level ${g.level}</span><span class="g-pbadge" title="Prestige rank">${esc(g.rankLabel)} +${g.boost}%</span><span class="g-streak" title="${g.streakLongest}-day record">🔥 ${g.streak}d</span></div>
            <div class="g-xpbar"><i style="width:${g.xpPct}%"></i></div>
            <div class="g-xpsub">${g.xpInto.toLocaleString()} / ${g.xpNeed.toLocaleString()} XP · ${g.totalXp.toLocaleString()} this prestige</div>
            <div class="g-cur2"><span class="coin"></span><b>${g.coins.toLocaleString()}</b> coins &nbsp; <span class="gem"></span><b>${g.gems}</b> gems</div>
            <div class="g-badges">${g.badges.map((b) => `<div class="g-badge"><span class="bic">${b.ic}</span><span class="btx"><span class="bt">${esc(b.t)}</span><span class="bs">${esc(b.s)}</span></span></div>`).join("")}</div>
          </div>
        </div>
        <div class="hcard g-src">
          <div class="g-cardh">Global stats <span class="muted">lifetime totals</span></div>
          <div class="g-srcrow"><span>Input tokens</span><b>${g.stats.inputTokens.toLocaleString()}</b></div>
          <div class="g-srcrow"><span>Output tokens</span><b>${g.stats.outputTokens.toLocaleString()}</b></div>
          <div class="g-srcrow"><span>Focus time</span><b>${Math.round(g.stats.devMinutes / 60)}h</b></div>
          <div class="g-srcrow"><span>Sessions</span><b>${g.stats.sessions.toLocaleString()}</b></div>
          <div class="g-srcrow"><span>Skills/agents run</span><b>${g.stats.skillSuccess.toLocaleString()}</b></div>
          <div class="g-srcrow"><span>Vault notes</span><b>${g.stats.mdFiles.toLocaleString()}</b></div>
          <div class="g-srcrow"><span>Domains touched</span><b>${g.stats.domainsTouched} / ${g.stats.domainsTotal}</b></div>
        </div>
      </div>`;
    renderHeatmap();
    renderUsageChart();
    profileBuilt = true;
  }
  function renderHeatmap() {
    const hm = M.heatmap();
    // group into weeks (columns)
    const cells = hm.cells;
    // pad to start on Sunday
    const first = cells[0].date.getDay();
    const padded = Array(first).fill(null).concat(cells);
    const weeks = [];
    for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
    const wds = ["", "Mon", "", "Wed", "", "Fri", ""];
    const months = [];
    let lastMon = -1;
    weeks.forEach((w) => {
      const firstReal = w.find((c) => c);
      const mo = firstReal ? firstReal.date.getMonth() : lastMon;
      if (mo !== lastMon) { months.push(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][mo]); lastMon = mo; }
      else months.push("");
    });
    const colsHtml = weeks.map((w) => `<div class="hm-col">` + w.map((c) => {
      if (!c) return `<div class="hm-cell pad"></div>`;
      return `<div class="hm-cell" data-l="${c.lvl}" title="${c.date.toLocaleDateString()} · level ${c.lvl}"></div>`;
    }).join("") + `</div>`).join("");
    $("#heatmap").innerHTML = `<div class="hm-card">
      <div class="hm-bar"><span class="hm-title">Activity</span><span class="hm-sub">${hm.active} active days in the last year</span></div>
      <div class="hm-cal">
        <div class="hm-months">${months.map((m) => `<span class="hm-mon" style="width:15px">${m}</span>`).join("")}</div>
        <div class="hm-body"><div class="hm-wds">${wds.map((w) => `<div class="hm-wd">${w}</div>`).join("")}</div>
          <div class="hm-cols">${colsHtml}</div></div>
      </div>
      <div class="hm-foot">Simulated commit-style activity.<span class="hm-scale">Less ${[0,1,2,3,4].map((l) => `<span class="hm-cell" data-l="${l}"></span>`).join("")} More</span></div>
    </div>`;
  }
  function renderUsageChart() {
    const s = M.tokens.series, max = Math.max(...s.map((d) => d.total));
    const bars = s.map((d) => {
      const inH = (d.input / max) * 100, outH = (d.output / max) * 100;
      return `<div class="daybar" title="${d.day}: ${fmtTok(d.total)} (${fmtTok(d.input)} in / ${fmtTok(d.output)} out)">
        <div class="seg-out" style="height:${outH}%"></div><div class="seg-in" style="height:${inH}%"></div>
        <span class="dlab">${d.day}</span></div>`;
    }).join("");
    $("#chartwrap").innerHTML = `<div class="charthead"><span class="ct">Daily tokens</span>
      <span class="legend"><span><i style="background:var(--acc)"></i>input</span><span><i style="background:var(--acc-d);opacity:.55"></i>output</span></span></div>
      <div class="daychart-wrap"><div class="daychart">${bars}</div></div>`;
  }

  // ---------- placeholders ----------
  function placeholder(el, ic, title, body) {
    el.innerHTML = `<div class="ph-card"><div class="ph-ic">${ic}</div><h2>${title}</h2>${body}<div class="ph-tag">desktop-only in the real app</div></div>`;
  }
  placeholder($("#capsph"), "🧩", "Capabilities health dashboard",
    `<p>Scans <code>~/.claude/agents</code> + <code>skills</code>, classifies each by source (authored / gsd / plugin), and runs static health checks: frontmatter parses, name + description present, non-empty body, referenced scripts exist.</p>
     <p>Adds an on-demand <b>deep check</b> (<code>py_compile</code> / <code>node --check</code> / <code>bash -n</code>) and last-used / error counts parsed from Claude Code session logs.</p>`);
  placeholder($("#histph"), "🕘", "Session history",
    `<p>Browses <code>~/.claude/projects/*.jsonl</code> — every past Claude Code session grouped by project, searchable, with message counts and titles.</p>
     <p>Requires reading local files, so it lives only in the desktop build.</p>`);

  // ---------- boot ----------
  renderHeaderPills();
  renderHome();
  buildTree();
})();
