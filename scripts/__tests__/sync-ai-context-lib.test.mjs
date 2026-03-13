import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, rm, writeFile, readFile, access } from "node:fs/promises";

import { syncAiContext } from "../sync-ai-context-lib.mjs";

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

test("syncAiContext copies .aimin-skill and AGENTS.md to target project folder", async () => {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "sync-ai-context-"));
  const sourceRoot = path.join(tmpRoot, "source");
  const aiRoot = path.join(tmpRoot, "ai-root");

  await mkdir(path.join(sourceRoot, ".aimin-skill", "context"), { recursive: true });
  await writeFile(path.join(sourceRoot, ".aimin-skill", "context", "memory.md"), "# memory\n", "utf8");
  await writeFile(path.join(sourceRoot, "AGENTS.md"), "# agents\n", "utf8");

  const result = await syncAiContext({
    sourceRoot,
    aiRoot,
    projectName: "school-admin"
  });

  const targetRoot = path.join(aiRoot, "school-admin");
  const copiedMemory = await readFile(
    path.join(targetRoot, ".aimin-skill", "context", "memory.md"),
    "utf8"
  );
  const copiedAgents = await readFile(path.join(targetRoot, "AGENTS.md"), "utf8");

  assert.equal(copiedMemory, "# memory\n");
  assert.equal(copiedAgents, "# agents\n");
  assert.equal(result.targetRoot, targetRoot);
  assert.equal(result.agentsHashMatch, true);
  assert.equal(result.sourceFileCount, 1);
  assert.equal(result.targetFileCount, 1);
  await rm(tmpRoot, { recursive: true, force: true });
});

test("syncAiContext mirrors destination and removes stale files", async () => {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "sync-ai-context-"));
  const sourceRoot = path.join(tmpRoot, "source");
  const aiRoot = path.join(tmpRoot, "ai-root");
  const stalePath = path.join(aiRoot, "school-admin", ".aimin-skill", "stale.md");

  await mkdir(path.join(sourceRoot, ".aimin-skill"), { recursive: true });
  await writeFile(path.join(sourceRoot, ".aimin-skill", "fresh.md"), "fresh", "utf8");
  await writeFile(path.join(sourceRoot, "AGENTS.md"), "agents", "utf8");

  await mkdir(path.dirname(stalePath), { recursive: true });
  await writeFile(stalePath, "stale", "utf8");

  await syncAiContext({
    sourceRoot,
    aiRoot,
    projectName: "school-admin"
  });

  assert.equal(await exists(stalePath), false);
  assert.equal(await exists(path.join(aiRoot, "school-admin", ".aimin-skill", "fresh.md")), true);
  await rm(tmpRoot, { recursive: true, force: true });
});

test("syncAiContext throws if required source files are missing", async () => {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "sync-ai-context-"));
  const sourceRoot = path.join(tmpRoot, "source");
  const aiRoot = path.join(tmpRoot, "ai-root");

  await mkdir(sourceRoot, { recursive: true });

  await assert.rejects(
    () =>
      syncAiContext({
        sourceRoot,
        aiRoot,
        projectName: "school-admin"
      }),
    /missing source .aimin-skill directory/i
  );
  await rm(tmpRoot, { recursive: true, force: true });
});
