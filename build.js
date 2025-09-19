// build.js
import fs from "fs";
import fetch from "node-fetch";

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

async function build() {
  if (!fs.existsSync("invites")) fs.mkdirSync("invites");

  const generated = []; // store {id, html} for optional index.html

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
  <meta property="og:url" content="https://discord.gg/${inviteId}">
  <meta name="twitter:card" content="summary_large_image">
  <script>
    window.location.href = "https://discord.gg/${inviteId}";
  </script>
</head>
<body>
</body>
</html>`;

    fs.writeFileSync(`invites/${inviteId}.html`, html);
    console.log(`Built invites/${inviteId}.html`);

    generated.push({ id: inviteId, html });
  }

  // Optional index.html at root
  if (typeof config.index === "number" && generated[config.index]) {
    fs.writeFileSync("index.html", generated[config.index].html);
    console.log(`Built index.html (from invite ${generated[config.index].id})`);
  }
}

build();
