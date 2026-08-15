/* ============================================================
   NINKORO.COM — 首页动效（DeepSeek Harness 风格适配）
   粒子星空（canvas 2D + 鼠标连线）· 终端打字
   仅 index.html 加载；尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 实用代码演示（8 大 Agent CLI，每次刷新随机，4 条命令 + 注释行，纯英文） ---------- */
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
        "$ hermes whatsapp",
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

  /* ---------- 注释：命令级说明（功能 / 适用场景 / 跨 Agent 等价写法） ---------- */
  var AGENT_LABEL = {
    hermes: "Hermes", dsh: "DeepSeek Harness", codex: "Codex CLI", claude: "Claude Code",
    gemini: "Gemini CLI", openclaw: "OpenClaw", opencode: "OpenCode", aider: "Aider"
  };

  var CAT = {
    chat: { en: "Starts an interactive chat session with the agent.", zh: "启动与 Agent 的交互式对话会话。", use: { en: "Explore code, ask follow-ups, long tasks.", zh: "探索代码、连续追问、长任务。" }, eq: "universal" },
    oneShot: { en: "Runs the task once and exits after the reply.", zh: "一次性执行任务，得到结果后退出。", use: { en: "Scripts, CI/CD, quick questions.", zh: "脚本、CI/CD、快速提问。" }, eq: "oneShot" },
    resume: { en: "Continues a previous session from its history.", zh: "从历史记录继续之前的会话。", use: { en: "Pick up long tasks, keep context.", zh: "接续长任务、保持上下文。" }, eq: "resume" },
    model: { en: "Chooses the inference model for this run.", zh: "选择本次运行的推理模型。", use: { en: "Balance speed, cost and quality per task.", zh: "按任务权衡速度、成本与质量。" }, eq: "universal" },
    skills: { en: "Manages agent skills: list, install, search, update.", zh: "管理 Agent 技能：列出、安装、搜索、更新。", use: { en: "Add reusable workflows and knowledge.", zh: "添加可复用的工作流与知识。" }, eq: "skills" },
    mcp: { en: "Manages MCP servers that give the agent extra tools.", zh: "管理 MCP 服务器，为 Agent 提供额外工具。", use: { en: "Connect databases, APIs and editors.", zh: "连接数据库、API 与编辑器。" }, eq: "mcp" },
    doctor: { en: "Runs a health check on the installation and config.", zh: "对安装与配置执行健康检查。", use: { en: "Diagnose broken setups before debugging.", zh: "排查环境故障。" }, eq: "doctor" },
    status: { en: "Shows the running state of agent components.", zh: "显示 Agent 各组件的运行状态。", use: { en: "Check gateway, memory and services.", zh: "检查网关、记忆与服务。" }, eq: "status" },
    sessions: { en: "Lists, browses, exports or prunes conversation history.", zh: "列出、浏览、导出或清理会话历史。", use: { en: "Find old context, clean storage.", zh: "找回旧上下文、清理存储。" }, eq: "sessions" },
    config: { en: "Views or edits the agent configuration.", zh: "查看或修改 Agent 配置。", use: { en: "Set model, theme, keys and behavior.", zh: "设置模型、主题、密钥与行为。" }, eq: "universal" },
    auth: { en: "Signs in or out of the provider account.", zh: "登录或登出服务商账号。", use: { en: "First-time setup, switch accounts.", zh: "首次配置、切换账号。" }, eq: "universal" },
    update: { en: "Updates the CLI to the latest version.", zh: "将 CLI 更新到最新版本。", use: { en: "Get new features and fixes.", zh: "获取新功能与修复。" }, eq: "universal" },
    version: { en: "Prints the installed version.", zh: "打印已安装的版本号。", use: { en: "Check compatibility, report bugs.", zh: "确认兼容性、反馈问题。" }, eq: "universal" },
    help: { en: "Shows the command-line help and usage.", zh: "显示命令行帮助与用法。", use: { en: "Discover flags and subcommands.", zh: "查看参数与子命令。" }, eq: "universal" },
    install: { en: "Installs the CLI or its shell integration.", zh: "安装 CLI 或其 shell 集成。", use: { en: "First-time setup on a new machine.", zh: "新机器上的首次安装。" }, eq: "universal" },
    gateway: { en: "Manages the messaging gateway (Telegram, Discord, etc.).", zh: "管理消息网关（Telegram、Discord 等）。", use: { en: "Talk to the agent from chat apps.", zh: "通过聊天软件与 Agent 对话。" }, eq: "gateway" },
    cron: { en: "Schedules agent tasks to run on a timer.", zh: "按计划定时运行 Agent 任务。", use: { en: "Daily digests, reminders, recurring jobs.", zh: "每日摘要、提醒、定时任务。" }, eq: "cron" },
    permissions: { en: "Controls approvals and sandbox scope for the run.", zh: "控制本次运行的审批方式与沙箱范围。", use: { en: "Balance safety against automation speed.", zh: "在安全与自动化速度间取舍。" }, eq: "permissions" },
    worktree: { en: "Runs the task in an isolated git worktree.", zh: "在隔离的 git worktree 中运行任务。", use: { en: "Parallel agents, safe experiments.", zh: "并行 Agent、安全实验。" }, eq: "worktree" },
    memory: { en: "Reads or writes the agent long-term memory.", zh: "读写 Agent 的长期记忆。", use: { en: "Remember facts and preferences across sessions.", zh: "跨会话记住事实与偏好。" }, eq: "memory" },
    messaging: { en: "Sends a message through a connected channel.", zh: "通过已连接的频道发送消息。", use: { en: "Notify yourself when a task finishes.", zh: "任务完成时通知自己。" }, eq: "messaging" },
    tools: { en: "Enables or disables tools for the session.", zh: "启用或禁用会话工具。", use: { en: "Trim tool surface, fix conflicts.", zh: "精简工具面、解决冲突。" }, eq: "tools" },
    plugin: { en: "Manages plugins or extension bundles.", zh: "管理插件或扩展组合包。", use: { en: "Extend the agent with new capabilities.", zh: "为 Agent 扩展新能力。" }, eq: "plugin" }
  };

  var EQ = {
    oneShot: {
      lbl: { en: "Equivalent one-shot commands in other agents", zh: "其他 Agent 的一次性查询等价写法" },
      list: [
        ["Codex CLI", '$ codex exec "<q>"'],
        ["Claude Code", '$ claude -p "<q>"'],
        ["Gemini CLI", '$ gemini -p "<q>"'],
        ["OpenCode", '$ opencode run "<q>"'],
        ["Hermes", '$ hermes chat -q "<q>"']
      ]
    },
    resume: {
      lbl: { en: "Resume a previous session", zh: "恢复之前的会话" },
      list: [
        ["Codex CLI", "$ codex resume <session>"],
        ["Claude Code", "$ claude --resume <session>"],
        ["OpenCode", "$ opencode --session <session>"],
        ["Gemini CLI", "gemini（会话内 /resume）"]
      ]
    },
    skills: {
      lbl: { en: "Skill management in other agents", zh: "其他 Agent 的技能管理" },
      list: [
        ["Hermes", "$ hermes skills list"],
        ["Gemini CLI", "$ gemini skills list"],
        ["OpenClaw", "$ openclaw skills list"],
        ["Gemini CLI", "$ gemini skills install <src>"],
        ["OpenClaw", "$ openclaw skills install <name>"]
      ]
    },
    mcp: {
      lbl: { en: "MCP management in other agents", zh: "其他 Agent 的 MCP 管理" },
      list: [
        ["Codex CLI", "$ codex mcp list"],
        ["Claude Code", "$ claude mcp list"],
        ["Gemini CLI", "$ gemini mcp list"],
        ["OpenCode", "$ opencode mcp list"],
        ["OpenClaw", "$ openclaw mcp list"]
      ]
    },
    doctor: {
      lbl: { en: "Health checks in other agents", zh: "其他 Agent 的健康检查" },
      list: [
        ["Claude Code", "$ claude doctor"],
        ["Hermes", "$ hermes doctor"],
        ["OpenClaw", "$ openclaw doctor"]
      ]
    },
    status: {
      lbl: { en: "Status commands in other agents", zh: "其他 Agent 的状态命令" },
      list: [
        ["Hermes", "$ hermes status"],
        ["OpenClaw", "$ openclaw status"]
      ]
    },
    sessions: {
      lbl: { en: "Session history in other agents", zh: "其他 Agent 的会话历史" },
      list: [
        ["Hermes", "$ hermes sessions list"],
        ["OpenCode", "$ opencode sessions"],
        ["Codex CLI", "$ codex tasks"],
        ["Claude Code", "$ claude --resume"]
      ]
    },
    gateway: {
      lbl: { en: "Gateway management in other agents", zh: "其他 Agent 的网关管理" },
      list: [
        ["OpenClaw", "$ openclaw gateway status"],
        ["Hermes", "$ hermes gateway status"]
      ]
    },
    cron: {
      lbl: { en: "Other agents have no native cron - use the OS scheduler plus a one-shot command", zh: "其他 Agent 无原生定时命令，可用系统定时任务 + 一次性命令" },
      list: [
        ["crontab + Codex", '$ 0 9 * * * codex exec "<task>"'],
        ["crontab + Claude", '$ 0 9 * * * claude -p "<task>"'],
        ["crontab + Gemini", '$ 0 9 * * * gemini -p "<task>"']
      ]
    },
    permissions: {
      lbl: { en: "Approval / sandbox control in other agents", zh: "其他 Agent 的审批与沙箱控制" },
      list: [
        ["Codex CLI", '$ codex exec --sandbox read-only "<q>"'],
        ["Claude Code", "$ claude --permission-mode acceptEdits"],
        ["Aider", "$ aider --yes"],
        ["Hermes", "$ hermes chat --checkpoints"]
      ]
    },
    worktree: {
      lbl: { en: "Isolated worktree / fork in other agents", zh: "其他 Agent 的隔离工作区写法" },
      list: [
        ["Hermes", '$ hermes chat --worktree "<q>"'],
        ["OpenCode", '$ opencode --fork "<q>"']
      ]
    },
    memory: {
      lbl: { en: "Long-term memory equivalents", zh: "长期记忆的相近能力" },
      list: [
        ["Claude Code", "$ claude --continue"],
        ["Gemini CLI", "GEMINI.md 项目记忆文件"]
      ]
    },
    messaging: {
      lbl: { en: "Messaging in other agents", zh: "其他 Agent 的消息发送" },
      list: [
        ["OpenClaw", "$ openclaw gateway start"],
        ["OpenClaw", "$ openclaw channels add telegram"],
        ["Hermes", '$ hermes send --to telegram "<q>"']
      ]
    },
    tools: {
      lbl: { en: "Tool control in other agents", zh: "其他 Agent 的工具控制" },
      list: [
        ["Claude Code", "$ claude mcp list"],
        ["Gemini CLI", "$ gemini skills list"]
      ]
    },
    plugin: {
      lbl: { en: "Plugin / extension management in other agents", zh: "其他 Agent 的插件/扩展管理" },
      list: [
        ["Gemini CLI", "$ gemini extensions list"],
        ["OpenClaw", "$ openclaw skills list"]
      ]
    }
  };

  var GENERIC = [
    [/--help|\bhelp$/, "help"],
    [/--version|-V$|\bversion$/, "version"],
    [/\b(logout|login)$/, "auth"],
    [/\bupdate$/, "update"],
    [/\b(install|uninstall)\b/, "install"],
    [/\bconfig(ure)?\b/, "config"],
    [/\bhoncho\b/, "memory"],
    [/\bgateway\b/, "gateway"],
    [/\bdoctor\b/, "doctor"],
    [/\bstatus\b/, "status"],
    [/\bmcp\b/, "mcp"],
    [/\bsessions?\b/, "sessions"],
    [/(^|\s)skills\s/, "skills"],
    [/\bcron\b/, "cron"],
    [/\bsend\b/, "messaging"],
    [/\bchannels\b/, "messaging"],
    [/\btools\b/, "tools"],
    [/\b(plugin|extensions?)\b/, "plugin"],
    [/\bmodels?\b/, "model"],
    [/-q\s+"| -z\s+"| -p(\s|")|exec\s+"|run\s+"|headless\s+"|--message\s+"/, "oneShot"],
    [/\b(resume|continue|--session)\b/, "resume"],
    [/\bchat\b/, "chat"],
    [/^\$\s+\S+$/, "chat"]
  ];

  var DOCS = {
    hermes: {
      '$ hermes chat -q "Summarize the latest PRs"': ["Runs one chat turn non-interactively and exits after the reply.", "非交互执行一次对话，回复后退出。", "Scripts, CI/CD, quick questions.", "脚本、CI/CD、快速提问。", "oneShot"],
      '$ hermes chat --provider openrouter --model anthropic/claude-sonnet-4.6': ["Starts a session on a chosen provider and model.", "以指定服务商与模型启动会话。", "Route to a specific model or provider.", "指定模型或服务商路由。", "model"],
      '$ hermes -z "check disk usage and email the report"': ["Scripted one-shot run via the -z shortcut.", "通过 -z 快捷方式执行脚本化一次性任务。", "Automation and cron-friendly calls.", "自动化与定时任务友好调用。", "oneShot"],
      '$ hermes chat --resume cli_abc123': ["Resumes a session by its ID.", "按 ID 恢复会话。", "Pick up where a previous run stopped.", "接续上次中断的运行。", "resume"],
      '$ hermes chat --continue': ["Continues the most recent session.", "继续最近的会话。", "Keep context across multiple calls.", "多次调用间保持上下文。", "resume"],
      '$ hermes chat --worktree "fix the flaky test"': ["Runs the task in an isolated git worktree.", "在隔离的 git worktree 中运行任务。", "Parallel agents without conflicts.", "并行 Agent 且不冲突。", "worktree"],
      '$ hermes chat --checkpoints "refactor auth module"': ["Enables filesystem checkpoints before destructive operations.", "在破坏性操作前启用文件系统检查点。", "Safe refactors that can be rolled back.", "可回滚的安全重构。", "permissions"],
      '$ hermes chat --skills memory-recall,web-search "find my Supabase notes"': ["One-shot chat with preloaded skills.", "携带预载技能的一次性对话。", "Reuse specialized workflows in one call.", "一次调用复用专项工作流。", "oneShot"],
      '$ hermes chat -t web terminal "compare Next.js 16 vs 15"': ["One-shot chat with selected toolsets.", "携带指定工具集的一次性对话。", "Enable only the tools the task needs.", "只启用任务所需工具。", "oneShot"],
      '$ hermes setup model': ["Runs the setup wizard for one section.", "运行安装向导的单个配置项。", "Configure model and provider only.", "只配置模型与服务商。", "unique", [["Gemini CLI", "$ gemini config"], ["OpenClaw", "$ openclaw setup"]]],
      '$ hermes setup terminal': ["Configures the terminal backend.", "配置终端后端。", "Pick the terminal integration.", "选择终端集成方式。", "unique", [["Gemini CLI", "$ gemini config"], ["OpenClaw", "$ openclaw setup"]]],
      '$ hermes setup --non-interactive': ["Runs setup from defaults and environment variables.", "用默认值与环境变量非交互安装。", "Headless provisioning of a new machine.", "新机器的无头初始化。", "unique", [["Gemini CLI", "$ gemini config"], ["OpenClaw", "$ openclaw setup"]]],
      '$ hermes model': ["Interactively selects the default model.", "交互式选择默认模型。", "Switch provider or model once.", "一次性切换服务商或模型。", "model"],
      '$ hermes gateway run --replace': ["Runs the gateway in the foreground, replacing any instance.", "前台运行网关并替换现有实例。", "Debug gateway issues with live logs.", "用实时日志排查网关问题。", "gateway"],
      '$ hermes cron create "every 1h" "check email and summarize" --name hourly-email': ["Schedules a recurring agent task.", "安排周期性的 Agent 任务。", "Hourly digests, reminders, monitoring.", "每小时摘要、提醒、监控。", "cron"],
      '$ hermes cron create "0 9 * * *" "daily standup digest" --deliver telegram': ["Schedules a cron job and delivers the result to Telegram.", "安排定时任务并把结果发到 Telegram。", "Morning reports delivered to chat.", "早报推送到聊天软件。", "cron"],
      '$ hermes skills inspect weekly-report': ["Previews a skill without installing it.", "预览技能但不安装。", "Evaluate a skill before adding it.", "安装前评估技能。", "skills"],
      '$ hermes skills tap add https://github.com/ninkoro/skills': ["Adds a GitHub repo as a skill source.", "将 GitHub 仓库添加为技能源。", "Use your own skill collections.", "使用自己的技能集合。", "skills"],
      '$ hermes skills snapshot export skills.json': ["Exports installed skills to a file.", "将已安装技能导出到文件。", "Backup and share skill sets.", "备份与分享技能集。", "skills"],
      '$ hermes honcho status': ["Shows the Honcho cross-session memory connection.", "查看 Honcho 跨会话记忆连接状态。", "Verify long-term memory is online.", "确认长期记忆在线。", "memory"],
      '$ hermes honcho mode hybrid': ["Sets the memory mode (hybrid, honcho or local).", "设置记忆模式（hybrid、honcho 或 local）。", "Choose where memory is stored.", "选择记忆存储位置。", "memory"],
      '$ hermes insights --days 14': ["Analyzes token usage, cost and tool patterns.", "分析 Token 用量、成本与工具模式。", "Review agent activity and spending.", "复盘 Agent 活动与开销。", "unique"],
      '$ hermes pairing list': ["Shows pending and approved DM pairing codes.", "显示待处理与已批准的配对授权码。", "Review who can message the agent.", "查看谁可以与 Agent 对话。", "messaging"],
      '$ hermes pairing approve telegram 8841': ["Approves a DM pairing code for a messaging platform.", "批准消息平台的配对授权码。", "Authorize who can message the agent.", "授权可与 Agent 对话的人。", "messaging"],
      '$ hermes send --to telegram "deploy finished"': ["Sends a message through a connected channel.", "通过已连接频道发送消息。", "Notify yourself when a task finishes.", "任务完成时通知自己。", "messaging"],
      '$ hermes webhook list': ["Lists active event-driven webhook subscriptions.", "列出生效的事件驱动 Webhook 订阅。", "Review what external events trigger the agent.", "查看哪些外部事件会触发 Agent。", "unique"],
      '$ hermes webhook subscribe --url https://api.ninkoro.com/hook': ["Subscribes the agent to event-driven webhooks.", "订阅事件驱动的 Webhook。", "Trigger the agent from external events.", "由外部事件触发 Agent。", "unique"],
      '$ hermes kanban --board lifeos add "Ship v1.2"': ["Adds a card to a kanban board.", "在看板中添加卡片。", "Task boards with agent automation.", "带 Agent 自动化的任务看板。", "unique"],
      '$ hermes acp': ["Runs the agent as an ACP server for editor integration.", "以 ACP 服务器运行，供编辑器集成。", "VS Code / Zed / JetBrains extensions.", "VS Code / Zed / JetBrains 扩展。", "unique"],
      '$ hermes claw migrate --dry-run': ["Previews a migration from an OpenClaw installation.", "预览从 OpenClaw 安装的迁移。", "Switch from OpenClaw to Hermes safely.", "从 OpenClaw 安全迁移到 Hermes。", "unique", [["OpenClaw", "$ openclaw backup"]]],
      '$ hermes whatsapp': ["Pairs WhatsApp so you can chat with the agent.", "配对 WhatsApp 与 Agent 对话。", "Mobile messaging without a gateway.", "无需网关的手机消息。", "messaging"]
    },
    dsh: {
      '$ npx @deepseek-ai/dsh web': ["Launches the DeepSeek Harness Web UI.", "启动 DeepSeek Harness Web 界面。", "Full GUI sessions with plugins and profiles.", "带插件与 profile 的完整图形会话。", "unique", [["Codex CLI", "$ codex"], ["Claude Code", "$ claude"]]],
      '$ dsh web --port 8080': ["Starts the Web UI on a custom port.", "在自定义端口启动 Web 界面。", "Avoid port conflicts, run multiple instances.", "避免端口冲突、多实例运行。", "unique"],
      '$ dsh web --trusted-host api.ninkoro.com': ["Adds a trusted host to the /api security fence.", "为 /api 安全围栏添加受信主机。", "Let the browser reach your own API.", "允许浏览器访问自有 API。", "unique"],
      '$ dsh web --patch ./extra.cordis.yml': ["Overlays a patch file onto the merged config tree.", "将补丁文件叠加到合并配置树。", "Customize plugins without editing base config.", "不改基础配置即可定制插件。", "unique"],
      '$ dsh web --dump-config': ["Prints the merged config tree of a profile.", "打印 profile 的合并配置树。", "Inspect what a profile actually runs.", "查看 profile 实际运行的内容。", "unique"],
      '$ dsh --profile headless "run the tests"': ["Runs a one-shot task in the headless profile.", "在 headless profile 中执行一次性任务。", "CI/CD and scripted agent runs.", "CI/CD 与脚本化 Agent 运行。", "oneShot"],
      '$ dsh --profile headless "check disk usage and report"': ["Runs a one-shot task without a Web UI.", "无 Web 界面执行一次性任务。", "Automation and server-side jobs.", "自动化与服务器端任务。", "oneShot"],
      '$ dsh --profile web --dump-default-config': ["Prints the default bundle layers without overlays.", "打印不含覆盖层的默认组合包层。", "See the base config a profile ships with.", "查看 profile 自带的基线配置。", "unique"],
      '$ dsh --profile web --patch ./extra.yml --dump-config': ["Prints the config tree with a patch overlay applied.", "打印应用补丁后的配置树。", "Verify an overlay before running.", "运行前验证补丁效果。", "unique"],
      '$ dsh plugin --profile tui add github:deepseek-harness/turtle-ui': ["Installs a plugin bundle into a profile.", "向 profile 安装插件组合包。", "Add the TUI or other UI plugins.", "添加 TUI 等界面插件。", "plugin"],
      '$ dsh plugin --profile tui remove turtle-ui': ["Removes a plugin bundle from a profile.", "从 profile 移除插件组合包。", "Roll back an unwanted plugin.", "回滚不需要的插件。", "plugin"],
      '$ dsh plugin --profile lifeos add @deepseek-ai/dsh-headless': ["Adds the headless bundle to a custom profile.", "向自定义 profile 添加 headless 组合包。", "Build task-specific agent profiles.", "构建任务专属的 Agent profile。", "plugin"],
      '$ dsh --profile tui': ["Launches a profile composed of plugin bundles.", "启动由插件组合包构成的 profile。", "Prebuilt agent setups for different tasks.", "为不同任务预置的 Agent 组合。", "unique", [["Gemini CLI", "$ gemini agents"], ["OpenClaw", "$ openclaw chat"]]],
      '$ dsh --profile lifeos': ["Launches a custom profile for a specific job.", "启动面向特定任务的自定义 profile。", "Switch agent setups by context.", "按场景切换 Agent 组合。", "unique", [["Gemini CLI", "$ gemini agents"], ["OpenClaw", "$ openclaw chat"]]],
      '$ DSH_TOOLS_MODE=both dsh web': ["Selects native plus code tools for the session.", "为会话选择 native + code 工具。", "Mix terminal and coding capabilities.", "混合终端与代码能力。", "unique"]
    },
    codex: {
      '$ codex exec --full-auto "update dependencies"': ["Runs with automatic approval and sandbox handling.", "自动审批并处理沙箱后运行。", "Safe unattended automation.", "安全的无人值守自动化。", "permissions"],
      '$ codex exec --json "run tests"': ["Returns machine-readable JSON output.", "返回机器可读的 JSON 输出。", "Parse results in scripts and CI.", "脚本与 CI 中解析结果。", "unique", [["Claude Code", '$ claude -p --output-format json "<q>"']]],
      '$ codex exec --json --output-last-message summary.txt "run test suite"': ["Writes only the final summary to a file as JSON.", "仅将最终摘要以 JSON 写入文件。", "Lightweight CI artifacts.", "精简的 CI 产物。", "unique", [["Claude Code", '$ claude -p --output-format json "<q>"']]],
      '$ codex exec --debug --json "your task"': ["Runs with verbose debug logging plus JSON output.", "带详细调试日志与 JSON 输出运行。", "Troubleshoot agent behavior.", "排查 Agent 行为。", "unique"],
      '$ codex exec --sandbox read-only "review the diff"': ["Runs the task in a read-only sandbox.", "在只读沙箱中运行任务。", "Safe reviews and analysis.", "安全的审查与分析。", "permissions"],
      '$ codex exec --ask-for-approval "migrate the database"': ["Pauses before dangerous actions for approval.", "危险操作前暂停等待审批。", "Destructive operations with a human gate.", "带人工闸门的破坏性操作。", "permissions"],
      '$ codex resume cli_8f3a2c': ["Resumes a previous session by ID.", "按 ID 恢复之前的会话。", "Continue an interrupted task.", "接续被中断的任务。", "resume"],
      '$ codex chat': ["Starts an interactive chat with Codex.", "启动与 Codex 的交互式对话。", "Explore code and iterate on tasks.", "探索代码、迭代任务。", "chat"],
      '$ codex features': ["Toggles experimental feature flags.", "开关实验性功能标记。", "Try preview features safely.", "安全试用预览功能。", "unique"],
      '$ codex tasks': ["Lists recent agent tasks and sessions.", "列出最近的 Agent 任务与会话。", "Find and resume past work.", "找回并接续过往工作。", "sessions"],
      '$ codex approve': ["Approves a pending approval request.", "批准待处理的审批请求。", "Continue an interrupted task remotely.", "远程继续被中断的任务。", "permissions"],
      '$ codex reject': ["Rejects a pending approval request.", "拒绝待处理的审批请求。", "Stop a risky action in its tracks.", "及时叫停危险操作。", "permissions"]
    },
    claude: {
      '$ claude -p --output-format json "find the bug in auth.ts"': ["One-shot query with JSON output.", "一次性查询并输出 JSON。", "Scripts and tooling.", "脚本与工具集成。", "unique", [["Codex CLI", '$ codex exec --json "<q>"']]],
      '$ claude --continue': ["Continues the most recent conversation.", "继续最近的对话。", "Keep context across terminal sessions.", "跨终端会话保持上下文。", "resume"],
      '$ claude --resume 9f4b2c1e': ["Resumes a conversation by ID.", "按 ID 恢复对话。", "Reopen a long-running task.", "重新打开长任务。", "resume"],
      '$ claude --model sonnet': ["Selects the model for the session.", "选择会话使用的模型。", "Switch between speed and quality.", "在速度与质量间切换。", "model"],
      '$ claude --dangerously-skip-permissions': ["Runs without permission prompts.", "跳过所有权限提示运行。", "Unattended trusted automation.", "可信环境下的无人值守自动化。", "permissions"],
      '$ claude --permission-mode acceptEdits': ["Accepts file edits automatically, still prompts for risky actions.", "自动接受文件编辑，危险操作仍会提示。", "Fast edits with a safety net.", "快速编辑且保留安全网。", "permissions"],
      '$ claude --add-dir packages/api': ["Adds an extra directory to the agent scope.", "将额外目录加入 Agent 作用范围。", "Work across multiple folders.", "跨多目录工作。", "unique", [["Aider", "$ aider --read packages/api"], ["Codex CLI", "codex（在目标目录运行）"]]],
      '$ claude --append-system-prompt "Be concise and cite files."': ["Injects an extra system instruction for this run.", "为本次运行注入额外系统指令。", "Per-run rules without editing config.", "不改配置即可注入运行规则。", "unique", [["Gemini CLI", "GEMINI.md 项目指令"], ["Codex CLI", "AGENTS.md 项目指令"]]],
      '$ claude config set -g theme dark': ["Sets a global config value.", "设置全局配置项。", "Persist UI and behavior preferences.", "持久化界面与行为偏好。", "config"],
      '$ claude mcp add postgres -- npx @modelcontextprotocol/server-postgres': ["Adds an MCP server as a tool source.", "添加 MCP 服务器作为工具源。", "Give the agent database or API access.", "让 Agent 访问数据库或 API。", "mcp"],
      '$ claude doctor': ["Runs a health check on the installation.", "对安装执行健康检查。", "Diagnose broken setups.", "排查环境故障。", "doctor"]
    },
    gemini: {
      '$ gemini -p --skip-tools "summarize this RFC"': ["One-shot query without any tool use.", "不使用工具的一次性查询。", "Pure model answers, faster and cheaper.", "纯模型回答、更快更省。", "unique", [["Claude Code", '$ claude -p "<q>"'], ["Hermes", '$ hermes chat -q "<q>"']]],
      '$ gemini --model gemini-2.5-pro': ["Selects the model for the session.", "选择会话使用的模型。", "Pick the right model per task.", "按任务选择合适模型。", "model"],
      '$ gemini skills list': ["Lists installed agent skills.", "列出已安装的 Agent 技能。", "Discover what skills are available.", "查看可用的技能。", "skills"],
      '$ gemini skills install https://github.com/ninkoro/gemini-skills': ["Installs a skill from a Git source.", "从 Git 源安装技能。", "Add a custom workflow.", "添加自定义工作流。", "skills"],
      '$ gemini extensions install https://github.com/ninkoro/gemini-ext': ["Installs a CLI extension.", "安装 CLI 扩展。", "Extend the CLI with new commands.", "为 CLI 扩展新命令。", "plugin"],
      '$ gemini mcp list': ["Lists configured MCP servers.", "列出已配置的 MCP 服务器。", "Review connected tools.", "查看已连接的工具。", "mcp"],
      '$ gemini agents': ["Manages specialized agents for subtasks.", "管理用于子任务的专项 Agent。", "Split complex work across roles.", "将复杂工作拆给不同角色。", "unique", [["OpenCode", "$ opencode agents"]]]
    },
    openclaw: {
      '$ openclaw setup': ["First-time configuration wizard.", "首次配置向导。", "Set up channels, keys and the daemon.", "配置频道、密钥与守护进程。", "unique", [["Hermes", "$ hermes setup"], ["Gemini CLI", "$ gemini config"]]],
      '$ openclaw configure': ["Edits the config interactively.", "交互式编辑配置。", "Tune behavior without editing files.", "不改文件即可调整行为。", "config"],
      '$ openclaw gateway start': ["Starts the messaging gateway.", "启动消息网关。", "Connect Telegram, Discord, Slack and more.", "连接 Telegram、Discord、Slack 等。", "gateway"],
      '$ openclaw gateway status': ["Shows the gateway running state.", "显示网关运行状态。", "Check channels and connectivity.", "检查频道与连接。", "gateway"],
      '$ openclaw gateway restart': ["Restarts the gateway service.", "重启网关服务。", "Apply channel config changes.", "应用频道配置变更。", "gateway"],
      '$ openclaw channels add telegram': ["Connects a messaging channel.", "连接消息频道。", "Talk to the agent from chat apps.", "通过聊天软件与 Agent 对话。", "messaging"],
      '$ openclaw channels remove discord': ["Disconnects a messaging channel.", "断开消息频道。", "Remove an unused integration.", "移除不用的集成。", "messaging"],
      '$ openclaw skills install github-workflow': ["Installs a skill from the registry.", "从技能库安装技能。", "Add reusable workflows.", "添加可复用工作流。", "skills"],
      '$ openclaw browser start': ["Starts the built-in automation browser.", "启动内置自动化浏览器。", "Web scraping, form filling, UI tests.", "网页抓取、填表、UI 测试。", "unique"],
      '$ openclaw browser status': ["Shows the browser session state.", "显示浏览器会话状态。", "Check tabs before automation.", "自动化前检查标签页。", "unique"],
      '$ openclaw backup': ["Backs up config, memory and skills.", "备份配置、记忆与技能。", "Safe upgrades and migrations.", "安全升级与迁移。", "unique"]
    },
    opencode: {
      '$ opencode run --format json "list every TODO with file and line"': ["Runs a prompt and prints structured JSON.", "运行提示词并输出结构化 JSON。", "CI pipelines and tooling.", "CI 流水线与工具集成。", "unique", [["Codex CLI", '$ codex exec --json "<q>"'], ["Claude Code", '$ claude -p --output-format json "<q>"']]],
      '$ opencode run --model anthropic/claude-sonnet-4.6 "refactor this function"': ["Runs a prompt with a specific model.", "使用指定模型运行提示词。", "Route a task to the best model.", "把任务路由给最合适的模型。", "model"],
      '$ opencode run --attach http://localhost:4096 "explain async/await"': ["Attaches to a running OpenCode server.", "附加到正在运行的 OpenCode 服务。", "Drive a long-lived agent from scripts.", "用脚本驱动长驻 Agent。", "unique"],
      '$ opencode --continue': ["Continues the last session.", "继续上一个会话。", "Keep context between runs.", "多次运行间保持上下文。", "resume"],
      '$ opencode --session ses_7f3a91': ["Continues a specific session by ID.", "按 ID 继续指定会话。", "Resume a particular conversation.", "恢复特定对话。", "resume"],
      '$ opencode --fork "try a different approach"': ["Forks the session to explore an alternative.", "分叉会话以尝试另一种方案。", "Compare approaches without losing history.", "不丢历史地对比方案。", "worktree"],
      '$ opencode sessions': ["Lists and manages sessions.", "列出并管理会话。", "Find and resume past work.", "找回并接续过往工作。", "sessions"],
      '$ opencode agents': ["Lists and manages agents.", "列出并管理 Agent。", "Multi-agent workflows.", "多 Agent 工作流。", "unique", [["Gemini CLI", "$ gemini agents"]]],
      '$ opencode models': ["Lists available models.", "列出可用模型。", "Pick a model per task.", "按任务选择模型。", "unique", [["Aider", "$ aider --list-models"]]]
    },
    aider: {
      '$ aider --message "fix the failing test"': ["One-shot task without entering the chat.", "不进入对话的一次性任务。", "Quick fixes and scripted edits.", "快速修复与脚本化编辑。", "oneShot"],
      '$ aider --file utils.py --file api.py "add retry logic"': ["Adds files to the conversation for editing.", "将文件加入对话进行编辑。", "Scope a change to specific files.", "将改动限定在指定文件。", "unique", [["Claude Code", "$ claude --add-dir ."], ["Codex CLI", "codex（在仓库目录运行）"]]],
      '$ aider --model gpt-4o': ["Selects the model for the session.", "选择会话使用的模型。", "Choose the best model per task.", "按任务选择最佳模型。", "model"],
      '$ aider --sonnet': ["Shortcut for Claude Sonnet as the model.", "快捷指定 Claude Sonnet 模型。", "Fast, high-quality default.", "快速且高质量的默认值。", "model"],
      '$ aider --architect': ["Architect mode: one model plans, another edits.", "架构师模式：一个模型规划、另一个执行。", "Complex refactors with a review step.", "复杂重构与评审步骤。", "unique"],
      '$ aider --edit-format diff': ["Uses whole-file diff editing format.", "使用整体 diff 编辑格式。", "Cleaner git diffs for big edits.", "大改动下更干净的 git diff。", "unique"],
      '$ aider --watch-files': ["Auto-commits and updates when files change.", "文件变化时自动提交与更新。", "Continuous pair programming.", "持续结对编程。", "unique"],
      '$ aider --voice': ["Accepts voice input for prompts.", "支持语音输入提示词。", "Hands-free coding.", "免手输入编码。", "unique"],
      '$ aider --read README.md': ["Reads a file into context without editing it.", "将文件读入上下文（不编辑）。", "Reference docs and specs.", "引用文档与规范。", "unique", [["Claude Code", '$ claude -p "@README.md ..."'], ["Gemini CLI", '$ gemini -p "@README.md ..."']]],
      '$ aider --restore-chat-history': ["Restores the previous chat history.", "恢复上次的对话历史。", "Keep context across sessions.", "跨会话保持上下文。", "resume"],
      '$ aider --yes': ["Auto-accepts all edits without prompting.", "自动接受所有编辑不提示。", "Unattended batch edits.", "无人值守的批量修改。", "permissions"],
      '$ aider --lint': ["Runs the linter after each change.", "每次改动后运行代码检查。", "Keep the tree clean while editing.", "编辑时保持代码整洁。", "unique", [["Codex CLI", '$ codex exec "run lint"']]],
      '$ aider --test': ["Runs tests after each change.", "每次改动后运行测试。", "Catch regressions immediately.", "立即发现回归。", "unique", [["Codex CLI", '$ codex exec "run tests"']]],
      '$ aider --commit': ["Commits each change automatically.", "自动提交每次改动。", "A clean commit history.", "干净的提交历史。", "unique", [["Codex CLI", '$ codex exec "git commit"']]],
      '$ aider --list-models': ["Lists all available models.", "列出所有可用模型。", "Choose the right model.", "选择合适模型。", "unique", [["OpenCode", "$ opencode models"]]]
    }
  };

  function makeDemo() {
    var theme = pick(THEMES);
    var lines = [];
    var used = {};
    lines.push(mkLine("ln-cmd", "# " + pick(theme.comments)));
    used[lines[0].en] = true;
    while (lines.length < 5) {
      var t = pick(theme.lines);
      if (used[t]) continue;
      used[t] = true;
      lines.push(mkLine("ln-cmd", t));
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
  var terminalBox = typeLayer ? typeLayer.closest(".terminal") : null;
  var noteOpen = false;
  var NOTE_PAGE_SIZE = 3;
  var notePage = 0;
  function updateNoteToggle() {
    if (!noteToggle) return;
    var zh = window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh";
    noteToggle.textContent = noteOpen ? (zh ? "关闭注释" : "Close notes") : (zh ? "查看注释" : "View notes");
  }
  function lineDoc(theme, line) {
    var doc = (DOCS[theme.id] || {})[line] || null;
    var cat = null;
    if (!doc) {
      for (var g = 0; g < GENERIC.length; g++) {
        if (GENERIC[g][0].test(line)) { cat = GENERIC[g][1]; break; }
      }
    }
    if (doc) {
      return { en: doc[0], zh: doc[1], use: { en: doc[2], zh: doc[3] }, eq: doc[4] };
    }
    if (cat && CAT[cat]) {
      return { en: CAT[cat].en, zh: CAT[cat].zh, use: CAT[cat].use, eq: CAT[cat].eq };
    }
    return { en: theme.desc.en, zh: theme.desc.zh, use: theme.use, eq: null };
  }
  function fillEq(tpl, line) {
    var q1 = line.match(/"(.*?)"/);
    var q = q1 ? q1[1] : "prompt";
    var q2 = line.match(/"(?:.*?)"\s+"(.*?)"/);
    var task = q2 ? q2[1] : q;
    var m1 = line.match(/--model\s+(\S+)/);
    var m = m1 ? m1[1] : "model";
    return tpl.replace(/<q>/g, q).replace(/<task>/g, task).replace(/<m>/g, m);
  }
  function buildEqHtml(pattern, line, zh, self) {
    var out = "";
    var list = pattern.list.filter(function (e) { return e[0].indexOf(self) === -1; });
    if (!list.length) list = pattern.list;
    out += '<span class="ni-eq-lbl">' + (zh ? pattern.lbl.zh : pattern.lbl.en) + "</span> ";
    list.forEach(function (e, idx) {
      if (idx) out += " · ";
      out += "<code>" + esc(fillEq(e[1], line)) + "</code>";
    });
    return out;
  }
  function renderNote() {
    if (!noteBox || !CURRENT_META) return;
    var zh = window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh";
    var self = AGENT_LABEL[CURRENT_THEME.id] || "";
    var html = '<p class="note-lang"><b>' + (zh ? "语言" : "LANGUAGE") + "</b> " +
      (zh ? CURRENT_META.lang.zh : CURRENT_META.lang.en) +
      '<span class="note-sum">' + (zh ? CURRENT_META.desc.zh : CURRENT_META.desc.en) + "</span></p>";
    var cmds = [];
    CURRENT_DEMO.forEach(function (line) {
      if (line.c === "ln-cmd" && line.en.indexOf("# ") !== 0) cmds.push(line);
    });
    var pages = Math.max(1, Math.ceil(cmds.length / NOTE_PAGE_SIZE));
    if (notePage >= pages) notePage = pages - 1;
    if (notePage < 0) notePage = 0;
    var start = notePage * NOTE_PAGE_SIZE;
    cmds.slice(start, start + NOTE_PAGE_SIZE).forEach(function (line) {
      var d = lineDoc(CURRENT_THEME, line.en);
      var eqHtml;
      if (d.eq === "universal" || (d.eq && !EQ[d.eq] && d.eq !== "unique" && !Array.isArray(d.eq))) {
        eqHtml = '<span class="ni-unique">' + (zh ? "通用命令 —— 各 Agent CLI 写法基本相同" : "Universal — same pattern across agent CLIs") + "</span>";
      } else if (d.eq && EQ[d.eq]) {
        eqHtml = buildEqHtml(EQ[d.eq], line.en, zh, self);
      } else if (Array.isArray(d.eq) && d.eq[0] === "unique" && d.eq[1]) {
        var alts = d.eq[1];
        eqHtml = '<span class="ni-unique">' + (zh ? "其他 Agent 无完全等价命令" : "No direct equivalent in other agents") + "</span>" +
          '<span class="ni-eq-lbl"> ' + (zh ? "相近能力" : "Closest") + ": </span>" +
          alts.map(function (a) { return "<code>" + esc(a[1]) + "</code>"; }).join(" · ");
      } else {
        eqHtml = '<span class="ni-unique">' + (zh ? "其他 Agent 无完全等价命令" : "No direct equivalent in other agents") + "</span>";
      }
      html += '<p class="note-item"><code class="ni-cmd">' + esc(line.en) + "</code>" +
        '<span class="ni-line"><b>' + (zh ? "功能" : "WHAT") + "</b> " + (zh ? d.zh : d.en) + "</span>" +
        '<span class="ni-line"><b>' + (zh ? "适用场景" : "WHEN") + "</b> " + (zh ? d.use.zh : d.use.en) + "</span>" +
        '<span class="ni-line ni-other"><b>' + (zh ? "其他 Agent" : "OTHER AGENTS") + "</b> " + eqHtml + "</span></p>";
    });
    if (pages > 1) {
      html += '<div class="note-pager">' +
        (notePage > 0 ? '<button class="note-pg" data-note-pg="prev">' + (zh ? "上一页" : "Prev") + "</button>" : "") +
        '<span class="note-pg-info">' + (zh ? "第 " + (notePage + 1) + " / " + pages + " 页" : "Page " + (notePage + 1) + " / " + pages) + "</span>" +
        (notePage < pages - 1 ? '<button class="note-pg" data-note-pg="next">' + (zh ? "下一页" : "Next") + "</button>" : "") +
        "</div>";
    }
    noteBox.innerHTML = html;
    noteBox.querySelectorAll("[data-note-pg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        notePage += btn.getAttribute("data-note-pg") === "next" ? 1 : -1;
        renderNote();
      });
    });
  }
  if (noteToggle) {
    noteToggle.addEventListener("click", function () {
      noteOpen = !noteOpen;
      noteBox.classList.toggle("show", noteOpen);
      noteToggle.classList.toggle("is-open", noteOpen);
      if (terminalBox) terminalBox.classList.toggle("note-open", noteOpen);
      updateNoteToggle();
      if (noteOpen) { notePage = 0; renderNote(); }
    });
  }
  document.addEventListener("ninkoro:langchange", function () {
    if (!typeLayer) return;
    ++typeToken;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    typeLayer.innerHTML = "";
    typeStart();
    if (terminalBox) terminalBox.classList.toggle("note-open", noteOpen);
    updateNoteToggle();
    if (noteOpen) { notePage = 0; renderNote(); }
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
