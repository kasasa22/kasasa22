import fs from "fs";

const raw = JSON.parse(fs.readFileSync("output/raw-events.json"));

/**
 * Normalize events from all platforms
 */
function aggregate(raw) {
  const summary = {
    platforms: {
      github: { commits: 0, prs: 0, reviews: 0 },
      gitlab: { commits: 0, mrs: 0, reviews: 0 },
      gitea: { commits: 0, prs: 0, reviews: 0 }
    },
    totals: {
      commits: 0,
      prs: 0,
      reviews: 0
    },
    score: 0,
    updated: new Date().toISOString()
  };

  // GitHub
  for (const e of raw.github || []) {
    if (e.type === "PushEvent") {
      summary.platforms.github.commits += e.payload?.commits?.length || 1;
    }
    if (e.type === "PullRequestEvent") {
      summary.platforms.github.prs += 1;
    }
    if (e.type === "PullRequestReviewEvent") {
      summary.platforms.github.reviews += 1;
    }
  }

  // GitLab
  for (const e of raw.gitlab || []) {
    if (e.action_name === "pushed to") {
      summary.platforms.gitlab.commits += 1;
    }
    if (e.action_name?.includes("merge request")) {
      summary.platforms.gitlab.mrs += 1;
    }
  }

  // Gitea
  for (const e of raw.gitea || []) {
    if (e.type === "push") {
      summary.platforms.gitea.commits += e.commits?.length || 1;
    }
    if (e.type === "pull_request") {
      summary.platforms.gitea.prs += 1;
    }
  }

  // Totals
  summary.totals.commits =
    summary.platforms.github.commits +
    summary.platforms.gitlab.commits +
    summary.platforms.gitea.commits;

  summary.totals.prs =
    summary.platforms.github.prs +
    summary.platforms.gitlab.mrs +
    summary.platforms.gitea.prs;

  summary.totals.reviews =
    summary.platforms.github.reviews +
    summary.platforms.gitlab.reviews +
    summary.platforms.gitea.reviews;

  // Weighted Dev Score (customizable)
  summary.score =
    summary.totals.commits * 1 +
    summary.totals.prs * 5 +
    summary.totals.reviews * 3;

  return summary;
}

const aggregated = aggregate(raw);

fs.writeFileSync(
  "output/contributions.json",
  JSON.stringify(aggregated, null, 2)
);

console.log("✔ Aggregation complete");
