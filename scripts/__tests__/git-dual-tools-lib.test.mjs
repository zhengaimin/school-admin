import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPushTargets,
  buildRemoteActions,
  getIgnoreTemplate,
  parseCliArgs
} from "../git-dual-tools-lib.mjs";

test("parseCliArgs parses command and --key value options", () => {
  const parsed = parseCliArgs([
    "setup",
    "--github-url",
    "https://github.com/acme/school-admin.git",
    "--gitlab-url",
    "https://gitlab.com/acme/school-admin.git",
    "--dry-run"
  ]);

  assert.equal(parsed.command, "setup");
  assert.equal(parsed.options["github-url"], "https://github.com/acme/school-admin.git");
  assert.equal(parsed.options["gitlab-url"], "https://gitlab.com/acme/school-admin.git");
  assert.equal(parsed.options["dry-run"], true);
});

test("buildRemoteActions plans add/set based on existing remotes", () => {
  const actions = buildRemoteActions(
    {
      githubRemote: "github",
      githubUrl: "https://github.com/acme/school-admin.git",
      gitlabRemote: "gitlab",
      gitlabUrl: "https://gitlab.com/acme/school-admin.git"
    },
    new Set(["origin", "gitlab"])
  );

  assert.deepEqual(actions, [
    {
      remote: "github",
      url: "https://github.com/acme/school-admin.git",
      action: "add"
    },
    {
      remote: "gitlab",
      url: "https://gitlab.com/acme/school-admin.git",
      action: "set"
    }
  ]);
});

test("getIgnoreTemplate returns target-specific template", () => {
  assert.equal(getIgnoreTemplate("github"), ".gitignore.github");
  assert.equal(getIgnoreTemplate("gitlab"), ".gitignore.gitlab");
});

test("getIgnoreTemplate rejects unsupported target", () => {
  assert.throws(() => getIgnoreTemplate("gitee"), /Unsupported ignore target/);
});

test("buildPushTargets deduplicates same remote and branch", () => {
  const targets = buildPushTargets({
    branch: "main",
    githubRemote: "origin",
    gitlabRemote: "origin"
  });

  assert.deepEqual(targets, [{ remote: "origin", branch: "main" }]);
});
