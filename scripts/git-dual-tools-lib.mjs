const SUPPORTED_IGNORE_TARGETS = new Set(["github", "gitlab"]);

export function parseCliArgs(argv = []) {
  if (!Array.isArray(argv) || argv.length === 0) {
    return { command: "help", options: {} };
  }

  const [command, ...rest] = argv;
  const options = {};

  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const next = rest[i + 1];

    if (typeof next === "string" && !next.startsWith("--")) {
      options[key] = next;
      i += 1;
      continue;
    }

    options[key] = true;
  }

  return { command, options };
}

export function getIgnoreTemplate(target) {
  if (!SUPPORTED_IGNORE_TARGETS.has(target)) {
    throw new Error(`Unsupported ignore target: ${target}`);
  }

  return `.gitignore.${target}`;
}

export function buildRemoteActions(config, existingRemotes = new Set()) {
  const {
    githubRemote = "github",
    githubUrl,
    gitlabRemote = "gitlab",
    gitlabUrl
  } = config ?? {};

  if (!githubUrl || !gitlabUrl) {
    throw new Error("Both --github-url and --gitlab-url are required.");
  }

  return [
    {
      remote: githubRemote,
      url: githubUrl,
      action: existingRemotes.has(githubRemote) ? "set" : "add"
    },
    {
      remote: gitlabRemote,
      url: gitlabUrl,
      action: existingRemotes.has(gitlabRemote) ? "set" : "add"
    }
  ];
}

export function buildPushTargets(config) {
  const { branch, githubRemote = "github", gitlabRemote = "gitlab" } = config ?? {};

  if (!branch) {
    throw new Error("Push branch is required.");
  }

  const candidates = [
    { remote: githubRemote, branch },
    { remote: gitlabRemote, branch }
  ];

  const seen = new Set();
  const result = [];

  for (const target of candidates) {
    const key = `${target.remote}:${target.branch}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(target);
  }

  return result;
}
