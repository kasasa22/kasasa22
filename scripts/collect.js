import axios from "axios";
import fs from "fs";

const githubUser = "kasasa22";
const gitlabUserId = "22665548";

async function github() {
  try {
    const res = await axios.get(
      `https://api.github.com/users/${githubUser}/events`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    return res.data.filter(e => e.type === "PushEvent").length;
  } catch (err) {
    console.error("GitHub API error:", err.message);
    return 0;
  }
}

async function gitlab() {
  try {
    const res = await axios.get(
      `https://gitlab.com/api/v4/users/${gitlabUserId}/events`,
      { headers: { "PRIVATE-TOKEN": process.env.GITLAB_TOKEN } }
    );
    return res.data.length;
  } catch (err) {
    console.error("GitLab API error:", err.message);
    return 0;
  }
}

function calculateRank(total) {
  if (total > 5000) return "Top 1%";
  if (total > 2000) return "Top 5%";
  if (total > 1000) return "Top 10%";
  if (total > 500) return "Top 20%";
  return "Top 50%";
}

(async () => {
  const githubCount = await github();
  const gitlabCount = await gitlab();
  const total = githubCount + gitlabCount;

  const data = {
    github: githubCount,
    gitlab: gitlabCount,
    total: total,
    globalRank: calculateRank(total),
    updated: new Date().toISOString()
  };

  fs.writeFileSync("output/contributions.json", JSON.stringify(data, null, 2));
})();
