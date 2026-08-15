/* ============================================================
   NINKORO.COM — 首页动效（DeepSeek Harness 风格适配）
   粒子星空（canvas 2D + 鼠标连线）· 终端打字
   仅 index.html 加载；尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 实用代码演示（CMD / PowerShell / Agent Skill，每次刷新随机，6-8 行，纯英文） ---------- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mkLine(c, en) { return { c: c, en: en }; }

  var THEMES = [
    {
      id: "hermes",
      name: { en: "Hermes Agent CLI", zh: "Hermes Agent CLI 命令行" },
      desc: {
        en: "A practical Hermes Agent CLI workflow: chat with the agent, manage skills and cron jobs, check the gateway, and browse sessions.",
        zh: "实用的 Hermes Agent CLI 工作流：与 Agent 对话、管理技能与定时任务、查看网关状态、浏览会话记录。"
      },
      use: {
        en: "AI-powered personal ops: research, reminders, automation, and multi-platform messaging.",
        zh: "AI 驱动的个人事务：调研、提醒、自动化与多平台消息。"
      },
      comments: [
        "Hermes Agent CLI · daily ops",
        "hermes · session & skills",
        "Hermes CLI · cron + gateway",
        "hermes agent · one-shot chat",
        "Hermes CLI · memory & insights"
      ],
      lines: [
        "$ hermes chat -q \"Summarize the latest PRs\"",
        "$ hermes chat --provider openrouter --model anthropic/claude-sonnet-4.6",
        "$ hermes -z \"check disk usage and email the report\"",
        "$ hermes chat --resume cli_abc123",
        "$ hermes chat --continue",
        "$ hermes chat --worktree \"fix the flaky test\"",
        "$ hermes chat --checkpoints \"refactor auth module\"",
        "$ hermes chat --skills memory-recall,web-search \"find my Supabase notes\"",
        "$ hermes chat -t web terminal \"compare Next.js 16 vs 15\"",
        "$ hermes setup model",
        "$ hermes setup terminal",
        "$ hermes setup --non-interactive",
        "$ hermes model",
        "$ hermes tools list --platform cli",
        "$ hermes tools enable web terminal",
        "$ hermes tools disable browser --platform cli",
        "$ hermes tools list --summary",
        "$ hermes gateway status",
        "$ hermes gateway restart",
        "$ hermes gateway run --replace",
        "$ hermes gateway status --deep",
        "$ hermes config show",
        "$ hermes config set model default nous",
        "$ hermes config check",
        "$ hermes config path",
        "$ hermes login --provider nous",
        "$ hermes login --no-browser",
        "$ hermes logout",
        "$ hermes status --all",
        "$ hermes doctor",
        "$ hermes doctor --fix",
        "$ hermes update",
        "$ hermes version",
        "$ hermes sessions list --limit 10",
        "$ hermes sessions browse",
        "$ hermes sessions rename cli_abc123 \"Weekly planning\"",
        "$ hermes sessions export sessions.jsonl",
        "$ hermes sessions prune --older-than 30 --yes",
        "$ hermes sessions stats",
        "$ hermes cron list",
        "$ hermes cron create \"every 1h\" \"check email and summarize\" --name hourly-email",
        "$ hermes cron create \"0 9 * * *\" \"daily standup digest\" --deliver telegram",
        "$ hermes cron pause job_42",
        "$ hermes cron resume job_42",
        "$ hermes cron run job_07",
        "$ hermes cron status",
        "$ hermes skills list",
        "$ hermes skills search \"github workflow\"",
        "$ hermes skills install memory-recall",
        "$ hermes skills inspect weekly-report",
        "$ hermes skills check",
        "$ hermes skills update",
        "$ hermes skills tap add https://github.com/ninkoro/skills",
        "$ hermes skills snapshot export skills.json",
        "$ hermes honcho status",
        "$ hermes honcho map lifeos",
        "$ hermes honcho mode hybrid",
        "$ hermes honcho peer --user ninkoro --ai hermes",
        "$ hermes insights --days 14",
        "$ hermes pairing list",
        "$ hermes pairing approve telegram 8841",
        "$ hermes send --to telegram \"deploy finished\"",
        "$ hermes webhook list",
        "$ hermes webhook subscribe --url https://api.ninkoro.com/hook",
        "$ hermes kanban --board lifeos add \"Ship v1.2\"",
        "$ hermes acp",
        "$ hermes claw migrate --dry-run"
      ],
      outs: [
        "→ 3 PRs summarized · top: #142 merge-safe",
        "→ 200 OK · session cli_abc123 resumed",
        "✓ 12 skills loaded · 3 toolsets enabled",
        "→ 5 sessions · latest: Weekly planning",
        "✓ cron job created · next run in 58m",
        "→ gateway running · telegram + discord connected",
        "✓ config migrated · ~/.hermes/config.yaml",
        "→ 4 tools disabled · browser off (cli)",
        "✓ memory-recall installed · 1 new skill",
        "→ 18 skills · 3 outdated",
        "✓ sessions pruned · 41 removed (>30 days)",
        "→ 200 OK · 42ms · claude-sonnet-4.6",
        "✓ doctor: no issues found",
        "→ hermes v1.4.2 · release 2026-08-12",
        "✓ deploy finished · telegram delivered",
        "→ webhook subscribed · 1 active",
        "✓ kanban updated · 3 cards on lifeos",
        "→ insights: 8.4k tokens · $0.12 · 76 tool calls",
        "✓ honcho connected · memory mode: hybrid",
        "→ pairing approved · telegram user 8841",
        "→ 7 crons · 2 paused · 1 due now",
        "✓ snapshot exported · skills.json",
        "→ 200 OK · 1.2s · 3 tool calls",
        "✓ update complete · hermes 1.4.3"
      ]
    },
    {
      id: "dsh",
      name: { en: "DeepSeek Harness (dsh)", zh: "DeepSeek Harness（dsh）" },
      desc: {
        en: "A practical DeepSeek Harness workflow: launch web or headless profiles, install plugin bundles, and inspect the merged config tree.",
        zh: "实用的 DeepSeek Harness 工作流：启动 web 或 headless profile、安装插件组合包、查看合并后的配置树。"
      },
      use: {
        en: "Plugin-based agent runs: Web UI sessions, headless one-shot tasks, custom profiles.",
        zh: "基于插件的 Agent 运行：Web 界面会话、无头一次性任务、自定义 profile。"
      },
      comments: [
        "DeepSeek Harness · dsh profile",
        "dsh · plugin bundles",
        "DeepSeek Harness · headless run"
      ],
      lines: [
        "$ npx @deepseek-ai/dsh web",
        "$ dsh web --port 8080",
        "$ dsh web --trusted-host api.ninkoro.com",
        "$ dsh web --patch ./extra.cordis.yml",
        "$ dsh web --dump-config",
        "$ dsh web --help",
        "$ dsh --profile headless \"run the tests\"",
        "$ dsh --profile headless \"check disk usage and report\"",
        "$ dsh --profile web --dump-default-config",
        "$ dsh --profile web --patch ./extra.yml --dump-config",
        "$ dsh plugin --profile tui add github:deepseek-harness/turtle-ui",
        "$ dsh plugin --profile tui remove turtle-ui",
        "$ dsh plugin --profile lifeos add @deepseek-ai/dsh-headless",
        "$ dsh plugin --profile lifeos update",
        "$ dsh --profile tui",
        "$ dsh --profile lifeos",
        "$ DSH_TOOLS_MODE=both dsh web",
        "$ dsh --version",
        "$ dsh --help"
      ],
      outs: [
        "→ web UI ready · http://127.0.0.1:3080",
        "✓ headless run completed · exit 0",
        "✓ turtle-ui installed · profile tui",
        "→ 3 bundles · base + web-app",
        "✓ patch applied · ./extra.cordis.yml",
        "→ headless: tests passed · 42 assertions",
        "✓ config dumped · 18 lines · 2 overrides",
        "→ plugin removed · tui reset to base"
      ]
    },
    {
      id: "codex",
      name: { en: "OpenAI Codex CLI", zh: "OpenAI Codex CLI" },
      desc: {
        en: "A practical Codex CLI workflow: one-shot coding tasks, session resume, MCP servers, and sandbox approval control.",
        zh: "实用的 Codex CLI 工作流：一次性编码任务、会话恢复、MCP 服务器与沙箱审批控制。"
      },
      use: {
        en: "Automated coding tasks, CI/CD scripting, repo exploration, agent tooling.",
        zh: "自动化编码任务、CI/CD 脚本、仓库探索与 Agent 工具链。"
      },
      comments: [
        "OpenAI Codex · exec mode",
        "codex · one-shot task",
        "Codex CLI · sandbox & MCP"
      ],
      lines: [
        "$ codex",
        "$ codex exec \"explain this codebase\"",
        "$ codex exec \"add error handling to utils.ts\"",
        "$ codex exec --full-auto \"update dependencies\"",
        "$ codex exec --json \"run tests\"",
        "$ codex exec --json --output-last-message summary.txt \"run test suite\"",
        "$ codex exec --debug --json \"your task\"",
        "$ codex exec --sandbox read-only \"review the diff\"",
        "$ codex exec --ask-for-approval \"migrate the database\"",
        "$ codex resume cli_8f3a2c",
        "$ codex chat",
        "$ codex login",
        "$ codex logout",
        "$ codex install",
        "$ codex features",
        "$ codex mcp add github -- npx @github/mcp-server",
        "$ codex mcp list",
        "$ codex mcp remove github",
        "$ codex tasks",
        "$ codex approve",
        "$ codex reject",
        "$ codex --version"
      ],
      outs: [
        "→ 6 files changed · tests green",
        "✓ task completed · exit 0 · 42s",
        "→ 3 approvals pending",
        "✓ MCP github connected · 8 tools",
        "→ resumed session cli_8f3a2c",
        "✓ 12 features · 2 enabled",
        "→ 200 OK · model gpt-5-codex",
        "✓ shell integration installed"
      ]
    },
    {
      id: "claude",
      name: { en: "Claude Code (Anthropic)", zh: "Claude Code（Anthropic）" },
      desc: {
        en: "A practical Claude Code workflow: print-mode queries, session resume, MCP tooling, and permission profiles.",
        zh: "实用的 Claude Code 工作流：打印模式查询、会话恢复、MCP 工具与权限配置。"
      },
      use: {
        en: "Repo-level coding, multi-file edits, and long-running agent sessions.",
        zh: "仓库级编码、多文件修改与长时 Agent 会话。"
      },
      comments: [
        "Claude Code · print mode",
        "claude · session ops",
        "Anthropic Claude · MCP"
      ],
      lines: [
        "$ claude",
        "$ claude -p \"explain this codebase\"",
        "$ claude -p --output-format json \"find the bug in auth.ts\"",
        "$ claude --continue",
        "$ claude --resume 9f4b2c1e",
        "$ claude --model sonnet",
        "$ claude --dangerously-skip-permissions",
        "$ claude --permission-mode acceptEdits",
        "$ claude --add-dir packages/api",
        "$ claude --append-system-prompt \"Be concise and cite files.\"",
        "$ claude config set -g theme dark",
        "$ claude mcp add postgres -- npx @modelcontextprotocol/server-postgres",
        "$ claude mcp list",
        "$ claude doctor",
        "$ claude update",
        "$ claude install",
        "$ claude login",
        "$ claude logout"
      ],
      outs: [
        "→ 3 files edited · diff applied",
        "✓ session 9f4b2c1e resumed",
        "→ 12 MCP tools · 3 enabled",
        "✓ doctor: all systems ok",
        "→ 200 OK · 1.8s · 24 tool calls",
        "✓ update complete · claude 2.x",
        "→ 5 permissions accepted",
        "✓ config saved · theme dark"
      ]
    },
    {
      id: "gemini",
      name: { en: "Gemini CLI (Google)", zh: "Gemini CLI（Google）" },
      desc: {
        en: "A practical Gemini CLI workflow: print-mode queries, model selection, skills and extensions, and MCP servers.",
        zh: "实用的 Gemini CLI 工作流：打印模式查询、模型选择、技能与扩展、MCP 服务器。"
      },
      use: {
        en: "Quick research queries, multi-model experiments, and Google-ecosystem agent skills.",
        zh: "快速调研查询、多模型实验与 Google 生态 Agent 技能。"
      },
      comments: [
        "Gemini CLI · print mode",
        "gemini · skills & extensions",
        "Gemini CLI · model routing"
      ],
      lines: [
        "$ gemini",
        "$ gemini -p \"explain the git rebase flow\"",
        "$ gemini -p --skip-tools \"summarize this RFC\"",
        "$ gemini --model gemini-2.5-pro",
        "$ gemini login",
        "$ gemini logout",
        "$ gemini config",
        "$ gemini skills list",
        "$ gemini skills install https://github.com/ninkoro/gemini-skills",
        "$ gemini extensions install https://github.com/ninkoro/gemini-ext",
        "$ gemini mcp list",
        "$ gemini agents",
        "$ gemini update",
        "$ gemini install",
        "$ gemini --version"
      ],
      outs: [
        "→ 200 OK · gemini-2.5-pro · 1.1s",
        "✓ 3 skills installed · 1 updated",
        "→ 2 extensions enabled",
        "✓ login ok · @ninkoro",
        "→ 4 MCP servers · 2 active",
        "✓ config updated · model default",
        "→ agents: 2 ready · 1 running",
        "✓ update complete · gemini 1.x"
      ]
    },
    {
      id: "openclaw",
      name: { en: "OpenClaw", zh: "OpenClaw" },
      desc: {
        en: "A practical OpenClaw workflow: chat with the agent, run the gateway, manage channels and skills, and check status.",
        zh: "实用的 OpenClaw 工作流：与 Agent 对话、运行网关、管理频道与技能、查看状态。"
      },
      use: {
        en: "Always-on personal agent: messaging channels, skills, memory, and browser automation.",
        zh: "常驻个人 Agent：消息频道、技能、记忆与浏览器自动化。"
      },
      comments: [
        "OpenClaw · gateway",
        "openclaw · skills & channels",
        "OpenClaw · always-on agent"
      ],
      lines: [
        "$ openclaw chat",
        "$ openclaw setup",
        "$ openclaw configure",
        "$ openclaw gateway start",
        "$ openclaw gateway status",
        "$ openclaw gateway restart",
        "$ openclaw channels list",
        "$ openclaw channels add telegram",
        "$ openclaw channels remove discord",
        "$ openclaw skills list",
        "$ openclaw skills install github-workflow",
        "$ openclaw skills search \"web research\"",
        "$ openclaw browser status",
        "$ openclaw browser start",
        "$ openclaw mcp list",
        "$ openclaw doctor",
        "$ openclaw status",
        "$ openclaw update",
        "$ openclaw backup",
        "$ openclaw version"
      ],
      outs: [
        "→ gateway running · 3 channels connected",
        "✓ telegram linked · pairing code 8841",
        "→ 14 skills · 2 updates available",
        "✓ browser ready · 2 tabs open",
        "→ status: healthy · memory 84%",
        "✓ backup written · ~/.openclaw/backup",
        "→ channel removed · discord offline",
        "✓ doctor: no issues found"
      ]
    },
    {
      id: "opencode",
      name: { en: "OpenCode", zh: "OpenCode" },
      desc: {
        en: "A practical OpenCode workflow: non-interactive runs, session continuation, model routing, and MCP integration.",
        zh: "实用的 OpenCode 工作流：非交互运行、会话延续、模型路由与 MCP 集成。"
      },
      use: {
        en: "Open-source agent CLI for scripting, multi-model runs, and team-friendly sessions.",
        zh: "开源 Agent CLI：脚本化、多模型运行与团队协作会话。"
      },
      comments: [
        "OpenCode · run mode",
        "opencode · sessions & models",
        "OpenCode · MCP tools"
      ],
      lines: [
        "$ opencode",
        "$ opencode run \"summarize the last 5 commits\"",
        "$ opencode run --format json \"list every TODO with file and line\"",
        "$ opencode run --model anthropic/claude-sonnet-4.6 \"refactor this function\"",
        "$ opencode run --attach http://localhost:4096 \"explain async/await\"",
        "$ opencode --continue",
        "$ opencode --session ses_7f3a91",
        "$ opencode --fork \"try a different approach\"",
        "$ opencode sessions",
        "$ opencode auth login",
        "$ opencode auth logout",
        "$ opencode mcp add github -- npx @github/mcp-server",
        "$ opencode mcp list",
        "$ opencode agents",
        "$ opencode models",
        "$ opencode --help"
      ],
      outs: [
        "→ 14 TODOs · 3 files · top: api/auth.ts",
        "✓ run completed · 0 errors · 31s",
        "→ session ses_7f3a91 continued",
        "✓ 2 agents · 5 models configured",
        "→ MCP github connected · 8 tools",
        "✓ auth ok · opencode@ninkoro",
        "→ 6 commits summarized · 1 breaking",
        "✓ fork created · session ses_91b2c4"
      ]
    },
    {
      id: "aider",
      name: { en: "Aider (pair programming)", zh: "Aider（结对编程）" },
      desc: {
        en: "A practical Aider workflow: pair-programming sessions, architect mode, voice input, and watch-mode edits.",
        zh: "实用的 Aider 工作流：结对编程会话、架构师模式、语音输入与监听模式编辑。"
      },
      use: {
        en: "Git-native pair programming, refactors, and multi-file edits with diffs.",
        zh: "Git 原生结对编程、重构与基于 diff 的多文件修改。"
      },
      comments: [
        "Aider · architect mode",
        "aider · pair programming",
        "Aider · watch + voice"
      ],
      lines: [
        "$ aider",
        "$ aider --message \"fix the failing test\"",
        "$ aider --file utils.py --file api.py \"add retry logic\"",
        "$ aider --model gpt-4o",
        "$ aider --sonnet",
        "$ aider --architect",
        "$ aider --edit-format diff",
        "$ aider --watch-files",
        "$ aider --voice",
        "$ aider --read README.md",
        "$ aider --restore-chat-history",
        "$ aider --yes",
        "$ aider --lint",
        "$ aider --test",
        "$ aider --commit",
        "$ aider --list-models",
        "$ aider --version"
      ],
      outs: [
        "✓ 3 files changed · 2 commits",
        "→ diff applied · 42 insertions · 7 deletions",
        "✓ tests pass · 18 passed",
        "→ voice input heard · prompt saved",
        "✓ watch mode active · 4 files monitored",
        "→ architect plan · 5 steps",
        "✓ lint clean · 0 warnings",
        "→ 214 models available"
      ]
    }
  ];

  function makeDemo() {
    var theme = pick(THEMES);
    var n = 6 + Math.floor(Math.random() * 3);
    var lines = [];
    var used = {};
    lines.push(mkLine("ln-cmd", "# " + pick(theme.comments)));
    used[lines[0].en] = true;
    while (lines.length < n) {
      var isOut = Math.random() < 0.24;
      var pool = isOut ? theme.outs : theme.lines;
      var t = pick(pool);
      if (used[t]) continue;
      used[t] = true;
      var c = isOut ? (t.indexOf("✓") === 0 ? "ln-ok" : "ln-out") : "ln-cmd";
      lines.push(mkLine(c, t));
    }
    return { lines: lines, theme: theme };
  }

  var DEMO_POOL = [];
  var seen = {};
  while (DEMO_POOL.length < 1000) {
    var d = makeDemo();
    var key = d.lines.map(function (l) { return l.en; }).join("|");
    if (!seen[key]) { seen[key] = 1; DEMO_POOL.push(d); }
  }
  var picked = DEMO_POOL[Math.floor(Math.random() * DEMO_POOL.length)];
  var CURRENT_DEMO = picked.lines;
  var CURRENT_THEME = picked.theme;
  var CURRENT_META = { lang: CURRENT_THEME.name, desc: CURRENT_THEME.desc, use: CURRENT_THEME.use };
  var termTitle = document.querySelector(".terminal-title");
  if (termTitle) termTitle.textContent = "ninkoro.com — " + CURRENT_THEME.id;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildTypeHTML(lines, uptoLine, uptoChar) {
    var html = "";
    for (var i = 0; i < lines.length; i++) {
      var text = i < uptoLine ? lines[i].en : (i === uptoLine ? lines[i].en.slice(0, uptoChar) : "");
      html += '<span class="' + lines[i].c + '">' + esc(text) + "</span>";
      var isLast = (i === lines.length - 1);
      if (!isLast && (i < uptoLine || (i === uptoLine && uptoChar >= lines[i].en.length))) html += "\n";
    }
    return html;
  }

  var typeLayer = document.getElementById("typeLayer");
  var typeToken = 0, typeTimer = null;
  function typeStart() {
    if (!typeLayer) return;
    var lines = CURRENT_DEMO;
    var token = ++typeToken;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    var body = typeLayer.parentElement;
    function paint(uptoLine, uptoChar, typing) {
      typeLayer.innerHTML = buildTypeHTML(lines, uptoLine, uptoChar) + '<span class="cursor" aria-hidden="true"></span>';
      if (body) body.classList.toggle("is-typing", typing);
    }
    if (reduceMotion) { paint(lines.length, 0, false); return; }
    var li = 0, ci = 0;
    function tick() {
      if (token !== typeToken) return;
      if (li >= lines.length) { paint(lines.length, 0, false); return; }
      paint(li, ci, true);
      ci++;
      if (ci > lines[li].en.length) { li++; ci = 0; typeTimer = setTimeout(tick, 300); return; }
      typeTimer = setTimeout(tick, 30 + Math.random() * 26);
    }
    typeTimer = setTimeout(tick, 500);
  }

  typeStart();
  /* ---------- 查看注释：终端右下角按钮 + 框内展开 ---------- */
  var noteToggle = document.getElementById("noteToggle");
  var noteBox = document.getElementById("demoNote");
  var noteOpen = false;
  function renderNote() {
    if (!noteBox || !CURRENT_META) return;
    var zh = window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh";
    noteBox.innerHTML =
      '<p class="note-lang"><b>' + (zh ? "语言" : "LANGUAGE") + " / </b>" + (zh ? CURRENT_META.lang.zh : CURRENT_META.lang.en) + "</p>" +
      '<p class="note-desc"><b>' + (zh ? "功能" : "WHAT IT DOES") + " / </b>" + (zh ? CURRENT_META.desc.zh : CURRENT_META.desc.en) + "</p>" +
      '<p class="note-use"><b>' + (zh ? "适用场景" : "WHEN TO USE") + " / </b>" + (zh ? CURRENT_META.use.zh : CURRENT_META.use.en) + "</p>";
  }
  if (noteToggle) {
    noteToggle.addEventListener("click", function () {
      noteOpen = !noteOpen;
      noteBox.classList.toggle("show", noteOpen);
      noteToggle.classList.toggle("is-open", noteOpen);
      if (noteOpen) renderNote();
    });
  }
  document.addEventListener("ninkoro:langchange", function () {
    if (!typeLayer) return;
    ++typeToken;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    typeLayer.innerHTML = "";
    typeStart();
    if (noteOpen) renderNote();
  });

  /* ---------- 磁吸按钮 + 入口卡 3D 倾斜（精细指针设备） ---------- */
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".entry-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * 8).toFixed(2) + "deg");
        card.classList.add("tilt-in", "tilt-active");
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilt-active");
        card.classList.remove("tilt-in");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  /* ---------- 彩蛋：CTA「联系我」按钮在框内闪躲鼠标 ---------- */
  var ctaContact = document.getElementById("ctaContact");
  if (ctaContact && finePointer && !reduceMotion) {
    var ctaInner = ctaContact.closest(".cta-inner");
    function dodge() {
      if (!ctaContact.classList.contains("cta-dodge-active")) ctaContact.classList.add("cta-dodge-active");
      var box = ctaInner || ctaContact.parentElement;
      var br = box.getBoundingClientRect();
      var bw = ctaContact.offsetWidth || 130;
      var bh = ctaContact.offsetHeight || 44;
      var pad = 14;
      var maxX = Math.max(pad, br.width - bw - pad);
      var maxY = Math.max(pad, br.height - bh - pad);
      ctaContact.style.left = (pad + Math.random() * Math.max(1, maxX - pad)) + "px";
      ctaContact.style.top = (pad + Math.random() * Math.max(1, maxY - pad)) + "px";
      ctaContact.style.transform = "rotate(" + (Math.random() * 10 - 5).toFixed(1) + "deg)";
    }
    ctaContact.addEventListener("pointerover", dodge);
    if (ctaInner) {
      ctaInner.addEventListener("mousemove", function (e) {
        var r = ctaContact.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        if (dx * dx + dy * dy < 90 * 90) dodge();
      });
    }
  }

  /* ---------- 彩蛋：PC 首屏底部地球弧线 + 访客坐标（IP 定位） ---------- */
  var earthArc = document.getElementById("earthArc");
  if (earthArc) {
    var earthDot = document.getElementById("earthDot");
    var earthRing = document.getElementById("earthDotRing");
    var earthCoords = document.getElementById("earthCoords");
    var COUNTRY = [
      { c: "CN", name: "China", lat: 35.86, lon: 104.19 }, { c: "US", name: "United States", lat: 39.83, lon: -98.58 },
      { c: "JP", name: "Japan", lat: 36.20, lon: 138.25 }, { c: "SG", name: "Singapore", lat: 1.35, lon: 103.82 },
      { c: "HK", name: "Hong Kong", lat: 22.32, lon: 114.17 }, { c: "TW", name: "Taiwan", lat: 23.70, lon: 121.00 },
      { c: "KR", name: "South Korea", lat: 36.50, lon: 127.90 }, { c: "DE", name: "Germany", lat: 51.10, lon: 10.40 },
      { c: "GB", name: "United Kingdom", lat: 55.40, lon: -3.40 }, { c: "FR", name: "France", lat: 46.20, lon: 2.20 },
      { c: "NL", name: "Netherlands", lat: 52.10, lon: 5.30 }, { c: "RU", name: "Russia", lat: 61.50, lon: 105.30 },
      { c: "AU", name: "Australia", lat: -25.30, lon: 133.80 }, { c: "CA", name: "Canada", lat: 56.10, lon: -106.30 },
      { c: "IN", name: "India", lat: 20.60, lon: 78.90 }, { c: "BR", name: "Brazil", lat: -14.20, lon: -51.90 },
      { c: "ID", name: "Indonesia", lat: -0.80, lon: 113.90 }, { c: "IT", name: "Italy", lat: 42.80, lon: 12.80 },
      { c: "ES", name: "Spain", lat: 40.50, lon: -3.70 }, { c: "SE", name: "Sweden", lat: 60.10, lon: 18.60 },
      { c: "CH", name: "Switzerland", lat: 46.80, lon: 8.20 }, { c: "UA", name: "Ukraine", lat: 48.40, lon: 31.20 },
      { c: "PL", name: "Poland", lat: 52.10, lon: 19.40 }, { c: "TR", name: "Turkey", lat: 38.96, lon: 35.24 },
      { c: "TH", name: "Thailand", lat: 15.87, lon: 100.99 }, { c: "VN", name: "Vietnam", lat: 16.00, lon: 108.00 },
      { c: "MY", name: "Malaysia", lat: 4.20, lon: 101.90 }, { c: "PH", name: "Philippines", lat: 12.90, lon: 121.90 },
      { c: "NZ", name: "New Zealand", lat: -40.90, lon: 174.90 }, { c: "MX", name: "Mexico", lat: 23.60, lon: -102.50 },
      { c: "AR", name: "Argentina", lat: -34.00, lon: -64.00 }, { c: "ZA", name: "South Africa", lat: -29.00, lon: 24.00 },
      { c: "EG", name: "Egypt", lat: 26.80, lon: 30.80 }, { c: "SA", name: "Saudi Arabia", lat: 23.90, lon: 45.10 },
      { c: "AE", name: "United Arab Emirates", lat: 24.00, lon: 54.00 }, { c: "IL", name: "Israel", lat: 31.40, lon: 35.20 },
      { c: "FI", name: "Finland", lat: 61.90, lon: 25.70 }, { c: "NO", name: "Norway", lat: 60.50, lon: 8.50 },
      { c: "DK", name: "Denmark", lat: 56.26, lon: 9.50 }, { c: "BE", name: "Belgium", lat: 50.50, lon: 4.50 },
      { c: "AT", name: "Austria", lat: 47.50, lon: 14.50 }, { c: "PT", name: "Portugal", lat: 39.50, lon: -8.00 },
      { c: "GR", name: "Greece", lat: 39.00, lon: 22.00 }, { c: "IE", name: "Ireland", lat: 53.40, lon: -8.20 },
      { c: "CZ", name: "Czechia", lat: 49.80, lon: 15.50 }, { c: "RO", name: "Romania", lat: 45.90, lon: 25.00 }
    ];
    /* Cloudflare 边缘节点 → 城市（访客 IP 就近的 PoP） */
    var COLO = {
      SIN: { name: "Singapore", lat: 1.3521, lon: 103.8198 }, HKG: { name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
      TPE: { name: "Taipei", lat: 25.0330, lon: 121.5654 }, ICN: { name: "Seoul", lat: 37.5665, lon: 126.9780 },
      NRT: { name: "Tokyo", lat: 35.6762, lon: 139.6503 }, HND: { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      KIX: { name: "Osaka", lat: 34.6937, lon: 135.5023 }, BKK: { name: "Bangkok", lat: 13.7563, lon: 100.5018 },
      KUL: { name: "Kuala Lumpur", lat: 3.1390, lon: 101.6869 }, SGN: { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297 },
      CGK: { name: "Jakarta", lat: -6.2088, lon: 106.8456 }, BOM: { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
      DEL: { name: "Delhi", lat: 28.6139, lon: 77.2090 }, MAA: { name: "Chennai", lat: 13.0827, lon: 80.2707 },
      BLR: { name: "Bengaluru", lat: 12.9716, lon: 77.5946 }, DXB: { name: "Dubai", lat: 25.2048, lon: 55.2708 },
      AUH: { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773 }, JED: { name: "Jeddah", lat: 21.4858, lon: 39.1925 },
      IST: { name: "Istanbul", lat: 41.0082, lon: 28.9784 }, WAW: { name: "Warsaw", lat: 52.2297, lon: 21.0122 },
      PRG: { name: "Prague", lat: 50.0755, lon: 14.4378 }, VIE: { name: "Vienna", lat: 48.2082, lon: 16.3738 },
      FRA: { name: "Frankfurt", lat: 50.1109, lon: 8.6821 }, AMS: { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
      BRU: { name: "Brussels", lat: 50.8503, lon: 4.3517 }, LHR: { name: "London", lat: 51.5074, lon: -0.1278 },
      MAN: { name: "Manchester", lat: 53.4808, lon: -2.2426 }, CDG: { name: "Paris", lat: 48.8566, lon: 2.3522 },
      MAD: { name: "Madrid", lat: 40.4168, lon: -3.7038 }, BCN: { name: "Barcelona", lat: 41.3874, lon: 2.1686 },
      MXP: { name: "Milan", lat: 45.4642, lon: 9.1900 }, FCO: { name: "Rome", lat: 41.9028, lon: 12.4964 },
      ZRH: { name: "Zurich", lat: 47.3769, lon: 8.5417 }, CPH: { name: "Copenhagen", lat: 55.6761, lon: 12.5683 },
      ARN: { name: "Stockholm", lat: 59.3293, lon: 18.0686 }, HEL: { name: "Helsinki", lat: 60.1699, lon: 24.9384 },
      GRU: { name: "São Paulo", lat: -23.5505, lon: -46.6333 }, GIG: { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
      EZE: { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 }, MEX: { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
      YYZ: { name: "Toronto", lat: 43.6532, lon: -79.3832 }, YVR: { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
      SEA: { name: "Seattle", lat: 47.6062, lon: -122.3321 }, SJC: { name: "San Jose", lat: 37.3382, lon: -121.8863 },
      LAX: { name: "Los Angeles", lat: 34.0522, lon: -118.2437 }, PHX: { name: "Phoenix", lat: 33.4484, lon: -112.0740 },
      DEN: { name: "Denver", lat: 39.7392, lon: -104.9903 }, DFW: { name: "Dallas", lat: 32.7767, lon: -96.7970 },
      ORD: { name: "Chicago", lat: 41.8781, lon: -87.6298 }, MSP: { name: "Minneapolis", lat: 44.9778, lon: -93.2650 },
      IAD: { name: "Ashburn", lat: 39.0438, lon: -77.4874 }, JFK: { name: "New York", lat: 40.7128, lon: -74.0060 },
      BOS: { name: "Boston", lat: 42.3601, lon: -71.0589 }, ATL: { name: "Atlanta", lat: 33.7490, lon: -84.3880 },
      MIA: { name: "Miami", lat: 25.7617, lon: -80.1918 }, SYD: { name: "Sydney", lat: -33.8688, lon: 151.2093 },
      MEL: { name: "Melbourne", lat: -37.8136, lon: 144.9631 }, PER: { name: "Perth", lat: -31.9505, lon: 115.8605 },
      AKL: { name: "Auckland", lat: -36.8509, lon: 174.7645 }, JNB: { name: "Johannesburg", lat: -26.2041, lon: 28.0473 }
    };
    function findCountry(code) {
      for (var i = 0; i < COUNTRY.length; i++) {
        if (COUNTRY[i].c === code) return COUNTRY[i];
      }
      return null;
    }
    function fmt(lat, lon) {
      var ns = lat >= 0 ? "N" : "S", ew = lon >= 0 ? "E" : "W";
      var la = (+Math.abs(lat).toFixed(4)).toString();
      var lo = (+Math.abs(lon).toFixed(4)).toString();
      return la + "° " + ns + ", " + lo + "° " + ew;
    }
    function place(lat, lon, ip, placeName) {
      var t = (lon + 180) / 360;
      var x = 1200 * t;
      var y = 220 - 520 * t + 520 * t * t;
      earthDot.setAttribute("cx", x);
      earthDot.setAttribute("cy", y);
      earthRing.setAttribute("cx", x);
      earthRing.setAttribute("cy", y);
      var hit = document.getElementById("earthDotHit");
      if (hit) { hit.setAttribute("cx", x); hit.setAttribute("cy", y); }
      var txt = placeName ? placeName + " · " : "";
      txt += "≈ " + fmt(lat, lon);
      if (ip) txt += " · IP " + ip;
      earthCoords.textContent = txt;
    }
    function randomCoord() {
      return {
        lat: Math.round((Math.random() * 130 - 60) * 100) / 100,
        lon: Math.round((Math.random() * 360 - 180) * 100) / 100
      };
    }
    var zhInit = window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh";
    earthCoords.textContent = zhInit ? "定位中…" : "locating…";
    var settled = false;
    function fallback() {
      if (settled) return;
      settled = true;
      var rc = randomCoord();
      place(rc.lat, rc.lon, null, null);
    }
    if (window.fetch && /^https?:$/.test(location.protocol)) {
      fetch("/cdn-cgi/trace", { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (txt) {
        if (settled) return;
        settled = true;
        var m = /^ip=(.*)$/m.exec(txt);
        var ip = m ? m[1] : null;
        m = /^colo=(.*)$/m.exec(txt);
        var colo = m ? m[1] : null;
        m = /^loc=(.*)$/m.exec(txt);
        var loc = m ? m[1] : null;
        var city = colo ? COLO[colo] : null;
        var cc = loc ? findCountry(loc) : null;
        if (city) place(city.lat, city.lon, ip, city.name);
        else if (cc) place(cc.lat, cc.lon, ip, cc.name);
        else {
          var rc = randomCoord();
          place(rc.lat, rc.lon, ip, null);
        }
      }).catch(fallback);
      window.setTimeout(fallback, 4000);
    } else {
      fallback();
    }
    /* 点击发光点 → 显示 I'm watching you */
    var earthHit = document.getElementById("earthDotHit");
    var earthInfo = earthArc.querySelector(".earth-info");
    if (earthHit && earthInfo) {
      earthHit.addEventListener("click", function () {
        earthInfo.classList.toggle("is-active");
      });
    }
    /* 首屏内随滚动逐渐淡化消失（回到顶部恢复） */
    function fadeEarthOnScroll() {
      var hero = earthArc.closest(".hero");
      var heroH = hero ? hero.offsetHeight : window.innerHeight;
      var y = window.scrollY;
      var t = heroH > 0 ? y / (heroH * 0.6) : 1;
      t = Math.max(0, Math.min(1, t));
      earthArc.style.opacity = (1 - t).toFixed(3);
      earthArc.style.transform = "translateY(" + (t * 36).toFixed(1) + "px)";
      earthArc.style.pointerEvents = t >= 1 ? "none" : "";
    }
    window.addEventListener("scroll", fadeEarthOnScroll, { passive: true });
    fadeEarthOnScroll();
  }
})();
