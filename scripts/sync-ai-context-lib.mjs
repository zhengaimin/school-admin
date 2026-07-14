import path from "node:path";
import crypto from "node:crypto";
import {
  access,
  copyFile,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat
} from "node:fs/promises";

export const DEFAULT_AI_ROOT = "D:\\Code\\ai";

export function parseCliArgs(argv = []) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const raw = token.slice(2);
    const [key, inlineValue] = raw.split("=");
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    i += 1;
  }
  return options;
}

export function resolveTargetRoot({
  sourceRoot = process.cwd(),
  aiRoot = DEFAULT_AI_ROOT,
  projectName,
  targetRoot
} = {}) {
  if (targetRoot) return path.resolve(targetRoot);
  const resolvedSourceRoot = path.resolve(sourceRoot);
  const finalProjectName = projectName || path.basename(resolvedSourceRoot);
  return path.resolve(aiRoot, finalProjectName);
}

async function ensurePathExists(targetPath, message) {
  try {
    await access(targetPath);
  } catch {
    throw new Error(message);
  }
}

async function countFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      total += await countFiles(fullPath);
      continue;
    }
    if (entry.isFile()) total += 1;
  }
  return total;
}

async function fileHash(filePath) {
  const content = await readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function syncAiContext({
  sourceRoot = process.cwd(),
  aiRoot = DEFAULT_AI_ROOT,
  projectName,
  targetRoot,
  dryRun = false
} = {}) {
  const resolvedSourceRoot = path.resolve(sourceRoot);
  const sourceSkillDir = path.join(resolvedSourceRoot, ".aimin-skill");
  const sourceAgents = path.join(resolvedSourceRoot, "AGENTS.md");
  const resolvedTargetRoot = resolveTargetRoot({
    sourceRoot: resolvedSourceRoot,
    aiRoot,
    projectName,
    targetRoot
  });
  const targetSkillDir = path.join(resolvedTargetRoot, ".aimin-skill");
  const targetAgents = path.join(resolvedTargetRoot, "AGENTS.md");

  await ensurePathExists(sourceSkillDir, "Missing source .aimin-skill directory.");
  await ensurePathExists(sourceAgents, "Missing source AGENTS.md.");

  const sourceSkillStat = await stat(sourceSkillDir);
  if (!sourceSkillStat.isDirectory()) {
    throw new Error("Source .aimin-skill is not a directory.");
  }

  if (!dryRun) {
    await mkdir(resolvedTargetRoot, { recursive: true });
    await rm(targetSkillDir, { recursive: true, force: true });
    await cp(sourceSkillDir, targetSkillDir, {
      recursive: true,
      force: true,
      errorOnExist: false,
      preserveTimestamps: true
    });
    await copyFile(sourceAgents, targetAgents);
  }

  const sourceFileCount = await countFiles(sourceSkillDir);
  const targetSkillExists = await stat(targetSkillDir).then(
    stats => stats.isDirectory(),
    () => false
  );
  const targetFileCount = targetSkillExists ? await countFiles(targetSkillDir) : 0;
  const sourceAgentsHash = await fileHash(sourceAgents);
  const targetAgentsHash = await fileHash(targetAgents).catch(() => "");

  return {
    sourceRoot: resolvedSourceRoot,
    targetRoot: resolvedTargetRoot,
    sourceSkillDir,
    targetSkillDir,
    sourceFileCount,
    targetFileCount,
    sourceAgentsHash,
    targetAgentsHash,
    agentsHashMatch: sourceAgentsHash === targetAgentsHash,
    dryRun: Boolean(dryRun)
  };
}
