#!/usr/bin/env node
import { DEFAULT_AI_ROOT, parseCliArgs, syncAiContext } from "./sync-ai-context-lib.mjs";

function printSummary(result) {
  console.log(`[sync-ai-context] Source: ${result.sourceRoot}`);
  console.log(`[sync-ai-context] Target: ${result.targetRoot}`);
  console.log(`[sync-ai-context] Source files: ${result.sourceFileCount}`);
  console.log(`[sync-ai-context] Target files: ${result.targetFileCount}`);
  console.log(`[sync-ai-context] AGENTS hash match: ${result.agentsHashMatch}`);
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const result = await syncAiContext({
    sourceRoot: options["source-root"] || process.cwd(),
    aiRoot: options["ai-root"] || DEFAULT_AI_ROOT,
    projectName: options["project-name"],
    targetRoot: options["target-root"],
    dryRun: Boolean(options["dry-run"])
  });

  printSummary(result);
  if (!result.dryRun && !result.agentsHashMatch) {
    throw new Error("AGENTS.md hash mismatch after sync.");
  }
}

main().catch(error => {
  console.error(`[sync-ai-context] Failed: ${error.message}`);
  process.exit(1);
});
