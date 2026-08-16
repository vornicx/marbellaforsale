const originalFetch = globalThis.fetch;
const githubToken = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const controlUrl = process.env.CONTROL_URL;
const baseRef = process.env.BASE_REF || "main";
let taskInput = {};
try {
  taskInput = JSON.parse(process.env.TASK_INPUT || "{}");
} catch {
  taskInput = {};
}

function isAutofixPublish(url) {
  if (!controlUrl) return false;
  try {
    const target = new URL(url);
    const control = new URL(controlUrl);
    return target.origin === control.origin && /\/api\/agents\/tasks\/[^/]+\/autofix-publish$/.test(target.pathname);
  } catch {
    return false;
  }
}

async function github(path, init = {}) {
  if (!githubToken || !repository) throw new Error("GitHub Actions repository token is unavailable");
  const response = await originalFetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "archic-control-worker/1.0",
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(30_000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${payload.message || "request failed"}`);
  return payload;
}

async function ensureDraftPullRequest(payload) {
  if (!repository) throw new Error("GITHUB_REPOSITORY is unavailable");
  const owner = repository.split("/")[0];
  const branch = String(payload.gitRef || "");
  const summary = String(payload.summary || "Bounded Archic Control autofix.").slice(0, 1_000);
  const changedFiles = Array.isArray(payload.changedFiles) ? payload.changedFiles.map(String).slice(0, 4) : [];
  const gitSha = String(payload.gitSha || "");

  if (!/^archic\/autofix-[A-Za-z0-9._-]+$/.test(branch)) throw new Error("Invalid autofix branch");
  if (!/^[a-f0-9]{40}$/i.test(gitSha)) throw new Error("Invalid autofix commit");
  if (!changedFiles.length) throw new Error("Autofix publication has no changed files");

  const existing = await github(
    `/repos/${repository}/pulls?state=open&head=${encodeURIComponent(`${owner}:${branch}`)}&base=${encodeURIComponent(baseRef)}`,
  );
  if (Array.isArray(existing) && existing[0]?.html_url) {
    return { url: existing[0].html_url, number: existing[0].number };
  }

  const titleSource = String(taskInput.summary || taskInput.finding?.id || "quality finding").slice(0, 180);
  const body = [
    "## Archic Control autofix",
    "",
    `Commit: \`${gitSha}\``,
    "",
    summary,
    "",
    "### Changed files",
    ...changedFiles.map((path) => `- \`${path}\``),
    "",
    "### Safety boundary",
    "This draft PR was generated from one verified quality finding. The planner was limited to repository-provided file contents, blocked from secrets, CI, deployment configuration, dependencies and database files, and capped at four changed files.",
    "",
    "The finding remains in `fixing` until a later benchmark run independently verifies that the defect disappeared.",
  ].join("\n");

  const pull = await github(`/repos/${repository}/pulls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `fix: ${titleSource}`,
      body,
      head: branch,
      base: baseRef,
      draft: true,
      maintainer_can_modify: true,
    }),
  });
  if (!pull?.html_url) throw new Error("GitHub did not return a pull request URL");
  return { url: pull.html_url, number: pull.number };
}

if (typeof originalFetch === "function") {
  globalThis.fetch = async (input, init = {}) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!isAutofixPublish(url)) return originalFetch(input, init);

    const rawBody = typeof init.body === "string"
      ? init.body
      : input instanceof Request
        ? await input.clone().text()
        : "{}";
    const payload = JSON.parse(rawBody || "{}");
    const pull = await ensureDraftPullRequest(payload);
    return new Response(JSON.stringify({ ok: true, pullRequestUrl: pull.url, pullRequestNumber: pull.number }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
}
