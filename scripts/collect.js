import axios from "axios";
import fs from "fs";

const githubUser = "kasasa22";
const gitlabUserId = "22665548";
const giteaUser = "kasasatrevor";

async function github() {
  const res = await axios.get(
    `https://api.github.com/users/${githubUser}/events`,
    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
  );
  return res.data.filter(e => e.type === "PushEvent").length;
}

async function gitlab() {
  const res = await axios.get(
    `https://gitlab.com/api/v4/users/${gitlabUserId}/events`,
    { headers: { "PRIVATE-TOKEN": process.env.GITLAB_TOKEN } }
  );
  return res.data.length;
}

async function gitea() {
  const res = await axios.get(
    `https://gitea.shamanpay.com/api/v1/users/${giteaUser}/events`,
    { headers: { Authorization: `token ${process.env.GITEA_TOKEN}` } }
  );
  return res.data.length;
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
  const giteaCount = await gitea();
  const total = githubCount + gitlabCount + giteaCount;

  const data = {
    github: githubCount,
    gitlab: gitlabCount,
    gitea: giteaCount,
    total: total,
    globalRank: calculateRank(total),
    updated: new Date().toISOString()
  };

  fs.writeFileSync("output/contributions.json", JSON.stringify(data, null, 2));
})();
