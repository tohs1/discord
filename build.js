// build.js
import fs from "fs";
import fetch from "node-fetch";

const invites = [
  "abc123", // replace with your invite codes
  "def456"
];

async function build() {
  if (!fs.existsSync("invites")) fs.mkdirSync("invites");

  for (const inviteId of invites) {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${inviteId}?with_counts=true`
    );
    const data = await res.json();

    const guildName = data.guild?.name || "Discord Server";
    const guildIcon = data.guild?.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`
      : "https://cdn.discordapp.com/embed/avatars/0.png";
    const inviter = data.inviter?.username || "Someone";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Join ${guildName} on Discord</title>
  <meta property="og:title" content="Join ${guildName} on Discord">
  <meta property="og:description" content="You have been invited by ${inviter}.">
  <meta property="og:image" content="${guildIcon}">
  <meta property="og:url" content="https://yourusername.github.io/invites/${inviteId}.html">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    body { font-family: sans-serif; background:#2c2f33; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; }
    .box { background:#23272a; padding:2em; border-radius:10px; text-align:center; }
    button { margin:10px; padding:10px 20px; border:none; border-radius:6px; cursor:pointer; }
    .accept { background:#5865f2; color:white; }
    .dismiss { background:#99aab5; color:black; }
  </style>
</head>
<body>
  <div class="box">
    <img src="${guildIcon}" width="64" height="64" style="border-radius:50%"><br><br>
    <h2>${guildName}</h2>
    <p>Invited by ${inviter}</p>
    <button class="accept" onclick="window.location.href='https://discord.com/invite/${inviteId}'">Accept Invite</button>
    <button class="dismiss" onclick="history.back()">Dismiss</button>
    <button class="accept" onclick="window.location.href='https://discord.com/invite/${inviteId}?join'">Join Now</button>
  </div>
</body>
</html>`;

    fs.writeFileSync(`invites/${inviteId}.html`, html);
    console.log(`Built invites/${inviteId}.html`);
  }
}

build();
