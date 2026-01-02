import fs from "fs";

const data = JSON.parse(fs.readFileSync("output/contributions.json"));

// Calculate bar widths (max width 300px, scale based on largest value)
const maxCount = Math.max(data.github, data.gitlab, data.gitea, 1);
const scale = Math.min(5, 300 / maxCount);

const svg = `
<svg width="500" height="250" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { fill: #c9d1d9; font-family: monospace; font-size: 14px; }
    .title { font-size: 16px; font-weight: bold; }
    .label { fill: #8b949e; }
    .count { fill: #58a6ff; font-size: 12px; }
    .rank { fill: #238636; font-weight: bold; }
    rect { rx: 3; }
    .github { fill: #238636; }
    .gitlab { fill: #fc6d26; }
    .gitea { fill: #609926; }
  </style>

  <text x="20" y="25" class="title">📊 Cross-Platform Contributions</text>

  <text x="20" y="60" class="label">GitHub</text>
  <rect x="100" y="45" width="${data.github * scale}" height="18" class="github"/>
  <text x="${105 + data.github * scale}" y="59" class="count">${data.github}</text>

  <text x="20" y="95" class="label">GitLab</text>
  <rect x="100" y="80" width="${data.gitlab * scale}" height="18" class="gitlab"/>
  <text x="${105 + data.gitlab * scale}" y="94" class="count">${data.gitlab}</text>

  <text x="20" y="130" class="label">Gitea</text>
  <rect x="100" y="115" width="${data.gitea * scale}" height="18" class="gitea"/>
  <text x="${105 + data.gitea * scale}" y="129" class="count">${data.gitea}</text>

  <text x="20" y="170" class="label">Total: <tspan class="count">${data.total}</tspan></text>
  <text x="20" y="195" class="label">Global Rank: <tspan class="rank">${data.globalRank}</tspan></text>

  <text x="20" y="230" class="label" style="font-size: 11px;">Updated: ${data.updated}</text>
</svg>
`;

fs.writeFileSync("output/contributions.svg", svg);
