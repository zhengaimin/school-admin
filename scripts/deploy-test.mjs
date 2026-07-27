#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const uploadScript = "./scripts/upload_admin_dist_test_server.sh";
const gitResult = spawnSync("where.exe", ["git"], { encoding: "utf8", windowsHide: true });
const gitBashPaths =
  gitResult.status === 0
    ? gitResult.stdout
        .trim()
        .split(/\r?\n/)
        .flatMap(gitPath => {
          const gitRoot = resolve(dirname(gitPath), "..");
          return [resolve(gitRoot, "bin/bash.exe"), resolve(gitRoot, "usr/bin/bash.exe")];
        })
    : [];
const windowsBashPaths = [
  resolve(process.env.ProgramFiles || "C:/Program Files", "Git/bin/bash.exe"),
  resolve(process.env.LOCALAPPDATA || "", "Programs/Git/bin/bash.exe"),
  ...gitBashPaths
];
const bash = process.platform === "win32" ? windowsBashPaths.find(existsSync) || "bash" : "bash";
const result = spawnSync(bash, [uploadScript, "./dist"], {
  cwd: projectRoot,
  stdio: "inherit"
});

if (result.error) {
  console.error(`[deploy:test] ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
