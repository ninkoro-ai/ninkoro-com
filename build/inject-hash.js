#!/usr/bin/env node
/**
 * build/inject-hash.js — 构建时把静态资源引用的 __BUILD_HASH__ 占位符
 * 替换为当前部署的 git 短哈希，实现「改版即自动失效旧缓存」。
 *
 * 用法：node build/inject-hash.js
 * 由 Cloudflare Pages 的 Build command 调用（在部署前修改待发布的 HTML）。
 *
 * 哈希来源优先级：
 *   1. CF_PAGES_COMMIT_SHA  —— Cloudflare Pages 构建环境内置环境变量（最可靠）
 *   2. git rev-parse --short HEAD —— 本地或自建 CI 回退
 *   3. 时间戳回退 —— 极端无 git 环境下也不致报错
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PLACEHOLDER = "__BUILD_HASH__";

function resolveHash() {
  const env = process.env.CF_PAGES_COMMIT_SHA;
  if (env && env.length >= 7) return env.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch (_) {
    return String(Date.now());
  }
}

function walk(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, onFile);
    else if (entry.isFile() && entry.name.endsWith(".html")) onFile(full);
  }
}

const HASH = resolveHash();
const root = process.cwd();
let count = 0;

walk(root, (file) => {
  const raw = fs.readFileSync(file, "utf8");
  if (!raw.includes(PLACEHOLDER)) return;
  const next = raw.split(PLACEHOLDER).join(HASH);
  fs.writeFileSync(file, next);
  count += 1;
  console.log(`[inject-hash] ${path.relative(root, file)} -> ?v=${HASH}`);
});

console.log(`[inject-hash] done. replaced __BUILD_HASH__ in ${count} file(s) with "${HASH}"`);
