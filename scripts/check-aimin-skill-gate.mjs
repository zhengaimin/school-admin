#!/usr/bin/env node
import { execSync } from "node:child_process";

const CHANGELOG_FILE_RE = /^\.aimin-skill\/docs\/changes\/(?:by-date\/\d{4}-\d{2}-\d{2}|\d{4}-\d{2})\.md$/;

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

function isAiminSkillIgnored() {
  try {
    run("git check-ignore .aimin-skill");
    return true;
  } catch {
    return false;
  }
}

function isCodeChange(filePath) {
  if (filePath.startsWith(".aimin-skill/")) return false;
  if (filePath.startsWith("dist/")) return false;
  if (filePath.startsWith("node_modules/")) return false;
  if (filePath.endsWith(".md")) return false;
  return true;
}

function isArchiveDocChange(filePath) {
  return (
    filePath.startsWith(".aimin-skill/docs/pages/") || filePath.startsWith(".aimin-skill/docs/design/")
  );
}

function isIndexDocChange(filePath) {
  if (filePath === ".aimin-skill/docs/index.md") return true;
  if (filePath === ".aimin-skill/docs/indexes/pages.md") return true;
  if (filePath === ".aimin-skill/docs/indexes/design.md") return true;
  if (CHANGELOG_FILE_RE.test(filePath)) return true;
  return false;
}

function failWithMissing(missingRules) {
  console.error("[aimin-gate] Blocked: detected code changes, but required archive docs are incomplete.");
  for (const rule of missingRules) {
    console.error(`- Missing: ${rule}`);
  }
  console.error("Required for code changes:");
  console.error("1) archive doc update (.aimin-skill/docs/pages/* or .aimin-skill/docs/design/*)");
  console.error(
    "2) fast index update (.aimin-skill/docs/index.md or .aimin-skill/docs/indexes/pages.md or .aimin-skill/docs/indexes/design.md)"
  );
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

const hasArchiveDoc = changedFiles.some(isArchiveDocChange);
const hasFastIndex = changedFiles.some(isIndexDocChange);
const aiminSkillIgnored = isAiminSkillIgnored();

const missingRules = [];
if (!hasArchiveDoc) missingRules.push("archive doc update (.aimin-skill/docs/pages|design)");
if (!hasFastIndex) {
  missingRules.push(
    "fast index update (.aimin-skill/docs/index.md or .aimin-skill/docs/indexes/pages.md or .aimin-skill/docs/indexes/design.md)"
  );
}

if (missingRules.length > 0) {
  if (aiminSkillIgnored) {
    console.log("[aimin-gate] .aimin-skill is gitignored in this repo; skip hard doc enforcement.");
    process.exit(0);
  }
  failWithMissing(missingRules);
}

console.log("[aimin-gate] OK (lightweight archive mode)");

