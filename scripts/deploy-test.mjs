#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const uploadScript = "./scripts/upload_admin_dist_test_server.sh";
const windowsBashPaths = [
  resolve(process.env.ProgramFiles || "C:/Program Files", "Git/bin/bash.exe"),
  resolve(process.env.LOCALAPPDATA || "", "Programs/Git/bin/bash.exe")
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
