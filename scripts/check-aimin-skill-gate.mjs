#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ITEM_ID_RE = /ITEM-\d{8}-\d{3}/g;
const SESSION_FILE_RE = /^\.aimin-skill\/doc\/changes\/sessions\/\d{4}-\d{2}-\d{2}\.md$/;
const MONTHLY_FILE_RE = /^\.aimin-skill\/doc\/changes\/\d{4}-\d{2}\.md$/;

function run(command) {
  return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function normalizePath(filePath) {
  return filePath.trim().replace(/\\/g, "/");
}

function parseFileList(raw) {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map(normalizePath)
    .filter(Boolean);
}

function getStagedFiles() {
  const output = run("git diff --cached --name-only --diff-filter=ACMR");
  return parseFileList(output);
}

function getDiffFiles(base, head) {
  if (!base || !head) return [];

  const commands = [
    `git diff --name-only --diff-filter=ACMR ${base}...${head}`,
    `git diff --name-only --diff-filter=ACMR ${base} ${head}`
  ];

  for (const command of commands) {
    try {
      const output = run(command);
      const files = parseFileList(output);
      if (files.length > 0) return files;
    } catch {
      // Try next command shape.
    }
  }

  return [];
}

function getCiFiles() {
  const head = process.env.CI_COMMIT_SHA || "HEAD";
  const bases = [
    process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA,
    process.env.CI_MERGE_REQUEST_TARGET_BRANCH_SHA,
    process.env.CI_COMMIT_BEFORE_SHA
  ];

  for (const base of bases) {
    if (!base || /^0+$/.test(base)) continue;
    const files = getDiffFiles(base, head);
    if (files.length > 0) return files;
  }

  try {
    const output = run(`git show --pretty="" --name-only ${head}`);
    return parseFileList(output);
  } catch {
    return [];
  }
}

function getChangedFiles() {
  if (process.env.AIMIN_GATE_FILES) {
    const manual = process.env.AIMIN_GATE_FILES.replace(/,/g, "\n");
    return parseFileList(manual);
  }

  if (process.env.CI) return getCiFiles();
  return getStagedFiles();
}

function isCodeChange(filePath) {
  if (filePath.startsWith(".aimin-skill/")) return false;
  if (filePath.startsWith("dist/")) return false;
  if (filePath.startsWith("node_modules/")) return false;
  if (filePath.endsWith(".md")) return false;
  return true;
}

function collectItemIds(files) {
  const ids = new Set();

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf8");
      const matches = content.match(ITEM_ID_RE);
      if (!matches) continue;
      for (const id of matches) ids.add(id);
    } catch {
      // File may be deleted/renamed mid-check; skip and let structural checks fail if needed.
    }
  }

  return ids;
}

function failWithMissing(missingRules) {
  console.error("[aimin-gate] Blocked: detected code changes, but required aimin-skill docs are incomplete.");
  for (const rule of missingRules) {
    console.error(`- Missing: ${rule}`);
  }
  console.error("Required for code changes:");
  console.error("1) .aimin-skill/doc/pages/* or .aimin-skill/doc/design/*");
  console.error("2) .aimin-skill/doc/changes/pages/* or .aimin-skill/doc/changes/design/*");
  console.error("3) .aimin-skill/doc/changes/sessions/YYYY-MM-DD.md");
  console.error("4) .aimin-skill/doc/changes/YYYY-MM.md");
  process.exit(1);
}

function failWithItemId(message) {
  console.error("[aimin-gate] Blocked:", message);
  console.error("Requirement: same ITEM-ID must appear in changed session log and changed pages/design change log.");
  process.exit(1);
}

const changedFiles = getChangedFiles();

if (changedFiles.length === 0) {
  console.log("[aimin-gate] No changed files detected, skip.");
  process.exit(0);
}

const hasCodeChange = changedFiles.some(isCodeChange);

if (!hasCodeChange) {
  console.log("[aimin-gate] No code change detected, skip.");
  process.exit(0);
}

const hasMainDoc = changedFiles.some(
  filePath =>
    filePath.startsWith(".aimin-skill/doc/pages/") || filePath.startsWith(".aimin-skill/doc/design/")
);
const hasDetailChange = changedFiles.some(
  filePath =>
    filePath.startsWith(".aimin-skill/doc/changes/pages/") ||
    filePath.startsWith(".aimin-skill/doc/changes/design/")
);
const hasSessionChange = changedFiles.some(filePath => SESSION_FILE_RE.test(filePath));
const hasMonthlyChange = changedFiles.some(filePath => MONTHLY_FILE_RE.test(filePath));

const missingRules = [];
if (!hasMainDoc) missingRules.push("main doc update (.aimin-skill/doc/pages|design)");
if (!hasDetailChange) missingRules.push("detail change log update (.aimin-skill/doc/changes/pages|design)");
if (!hasSessionChange) missingRules.push("session log update (.aimin-skill/doc/changes/sessions/YYYY-MM-DD.md)");
if (!hasMonthlyChange) missingRules.push("monthly index update (.aimin-skill/doc/changes/YYYY-MM.md)");

if (missingRules.length > 0) {
  failWithMissing(missingRules);
}

const changedSessionFiles = changedFiles.filter(filePath => SESSION_FILE_RE.test(filePath));
const changedDetailFiles = changedFiles.filter(
  filePath =>
    filePath.startsWith(".aimin-skill/doc/changes/pages/") ||
    filePath.startsWith(".aimin-skill/doc/changes/design/")
);

const sessionIds = collectItemIds(changedSessionFiles);
const detailIds = collectItemIds(changedDetailFiles);

if (sessionIds.size === 0) {
  failWithItemId("no ITEM-ID found in changed session log files.");
}

if (detailIds.size === 0) {
  failWithItemId("no ITEM-ID found in changed pages/design change log files.");
}

const sharedIds = [...sessionIds].filter(id => detailIds.has(id));

if (sharedIds.length === 0) {
  failWithItemId("session log and pages/design change log do not share the same ITEM-ID.");
}

console.log(`[aimin-gate] OK (${sharedIds.join(", ")})`);
