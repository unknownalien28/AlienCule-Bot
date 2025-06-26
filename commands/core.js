// commands/core.js
export async function ping(sock, msg, from) {
  await sock.sendMessage(from, { text: '👽 Pong! Bot is alive.' }, { quoted: msg })
}

export async function help(sock, msg, from) {
  const helpMenu = `👽 *Alien-Cule Bot Menu*

🛠️ *Core*:
• .ping - Check bot status
• .help - Show this help
• .info - Bot info
• .owner - Bot owner's contact

🎵 *Media*:
• .sticker - Image/vid to sticker
• .toimg - Sticker to image
• .tourl - Media to URL

📥 *Downloader*:
• .ytmp3 <url>
• .tiktok <url>

🧠 *AI*:
• .ai <text>
• .img <prompt>

👽 *Status Tools*:
• .save - Save viewed status
• .viewonce - Save view-once

⚙️ *Admin*:
• .kick @user
• .mute / .unmute
• .tagall

© Created by *Alien Cule* 👾`
  await sock.sendMessage(from, { text: helpMenu }, { quoted: msg })
}

export async function info(sock, msg, from) {
  await sock.sendMessage(from, {
    text: `👽 *Alien-Cule Bot v1.0*\n\nRunning smoothly on Termux!`,
  }, { quoted: msg })
}

export async function owner(sock, msg, from) {
  await sock.sendMessage(from, {
    text: `👽 *Contact Owner:* wa.me/2348100236360`,
  }, { quoted: msg })
}
