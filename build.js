// build.js
import fs from "fs";
import fetch from "node-fetch";
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

async function build() {
  if (!fs.existsSync("invites")) fs.mkdirSync("invites");

  for (const inviteId of config.invites) {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${inviteId}?with_counts=true`
    );
    const data = await res.json();

    const guildName = data.guild?.name || "Discord Server";
    const guildIcon = data.guild?.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`
      : "https://cdn.discordapp.com/embed/avatars/0.png";
    const inviter = data.inviter?.username || "Someone";
    const description = `You have been invited by ${inviter}.`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${guildName}</title>
  <meta property="og:title" content="${guildName}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${guildIcon}">
  <meta property="og:url" content="/invites/${inviteId}.html">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    body { font-family: sans-serif; background:#2c2f33; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; }
    .box { background:#23272a; padding:2em; border-radius:10px; text-align:center; max-width:400px; }
    button { margin:10px; padding:10px 20px; border:none; border-radius:6px; cursor:pointer; }
    .accept { background:#5865f2; color:white; }
    .dismiss { background:#99aab5; color:black; }
  </style>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has("join")) {
        window.location.href = "https://discord.gg/${inviteId}";
      }
    });
  </script>
</head>
<body>
  <div class="box">
    <img src="${guildIcon}" width="64" height="64" style="border-radius:50%"><br><br>
    <h2>${guildName}</h2>
    <p>Invited by ${inviter}</p>
    <button class="accept" onclick="window.location.href='?join'">Accept Invite</button>
    <button class="dismiss" onclick="history.back()">Dismiss</button>
  </div>
</body>
</html>`;

    fs.writeFileSync(`invites/${inviteId}.html`, html);
    console.log(`Built invites/${inviteId}.html`);
  }
}

build();
