#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildPushTargets,
  buildRemoteActions,
  getIgnoreTemplate,
  parseCliArgs
} from "./git-dual-tools-lib.mjs";

const HELP = `
Usage:
  node scripts/git-dual-tools.mjs setup --github-url <url> --gitlab-url <url> [--github-remote github] [--gitlab-remote gitlab] [--dry-run]
  node scripts/git-dual-tools.mjs push-all [--branch <branch>] [--github-remote github] [--gitlab-remote gitlab] [--dry-run]
  node scripts/git-dual-tools.mjs use-ignore --target <github|gitlab>
`;

function runGit(args, { capture = false, dryRun = false } = {}) {
  const shown = `git ${args.join(" ")}`;
  if (dryRun) {
    console.log(`[git-dual] DRY-RUN ${shown}`);
    return "";
  }

  if (capture) {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  }

  execFileSync("git", args, { stdio: "inherit" });
  return "";
}

function listRemotes() {
  const output = runGit(["remote"], { capture: true });
  return new Set(
    output
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean)
  );
}

function getCurrentBranch() {
  return runGit(["rev-parse", "--abbrev-ref", "HEAD"], { capture: true });
}

function ensureRemotesExist(remotes, required) {
  for (const remote of required) {
    if (!remotes.has(remote)) {
      throw new Error(`Remote '${remote}' not found. Run setup first.`);
    }
  }
}

function runSetup(options) {
  const githubRemote = options["github-remote"] || "github";
  const gitlabRemote = options["gitlab-remote"] || "gitlab";
  const githubUrl = options["github-url"];
  const gitlabUrl = options["gitlab-url"];
  const dryRun = Boolean(options["dry-run"]);

  const actions = buildRemoteActions(
    { githubRemote, githubUrl, gitlabRemote, gitlabUrl },
    listRemotes()
  );

  for (const action of actions) {
    if (action.action === "add") {
      runGit(["remote", "add", action.remote, action.url], { dryRun });
      continue;
    }
    runGit(["remote", "set-url", action.remote, action.url], { dryRun });
  }

  console.log(`[git-dual] Setup finished. github=${githubRemote}, gitlab=${gitlabRemote}`);
}

function runPushAll(options) {
  const githubRemote = options["github-remote"] || "github";
  const gitlabRemote = options["gitlab-remote"] || "gitlab";
  const branch = options.branch || getCurrentBranch();
  const dryRun = Boolean(options["dry-run"]);

  const remotes = listRemotes();
  ensureRemotesExist(remotes, [githubRemote, gitlabRemote]);

  const targets = buildPushTargets({ branch, githubRemote, gitlabRemote });

  for (const target of targets) {
    runGit(["push", target.remote, target.branch], { dryRun });
  }

  console.log(`[git-dual] Push finished. branch=${branch}`);
}

function runUseIgnore(options) {
  const target = options.target;
  if (!target || typeof target !== "string") {
    throw new Error("Missing --target <github|gitlab>.");
  }

  const template = getIgnoreTemplate(target);
  const templatePath = resolve(template);
  const targetPath = resolve(".gitignore");

  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${template}`);
  }

  copyFileSync(templatePath, targetPath);
  console.log(`[git-dual] Applied ${template} -> .gitignore`);
}

function main() {
  const { command, options } = parseCliArgs(process.argv.slice(2));

  switch (command) {
    case "setup":
      runSetup(options);
      return;
    case "push-all":
      runPushAll(options);
      return;
    case "use-ignore":
      runUseIgnore(options);
      return;
    case "help":
    default:
      console.log(HELP.trim());
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[git-dual] ${message}`);
  process.exit(1);
}
