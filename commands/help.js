const categories = {
  bot: ['.ping', '.help', '.info', '.owner'],
  group: ['.kick', '.add', '.promote', '.demote', '.mute', '.unmute', '.group open', '.group close', '.tagall'],
  media: ['.sticker', '.toimg', '.tovid', '.tourl', '.ss <url>'],
  downloader: ['.ytmp3 <url>', '.ytmp4 <url>', '.ytsearch <query>', '.play <song name>', '.tiktok <url>', '.ig <url>', '.fb <url>', '.mediafire <url>'],
  ai: ['.ai <query>', '.img <prompt>', '.bard <query>', '.gptvoice <text>'],
  fun: ['.meme', '.joke', '.quote', '.truth', '.dare', '.rate @user', '.ship @user1 @user2', '.gay @user', '.hack @user'],
  converter: ['.toaudio', '.tomp3', '.tovideo', '.tovn', '.emojimix 😎+🔥'],
  tools: ['.short <url>', '.weather <city>', '.time <location>', '.translate <lang> <text>', '.qr <text>', '.readqr'],
  anime: ['.anime <name>', '.manga <name>', '.animestyle <img>'],
  text: ['.style <text>', '.fancytext <text>'],
  database: ['.addcmd <cmd>', '.delcmd <cmd>', '.listcmd', '.save', '.get <file>'],
  owner: ['.restart', '.shutdown', '.eval <code>', '.exec <cmd>', '.block @user', '.unblock @user', '.banlist']
}

export const help = {
  command: ['help'],
  description: 'Show command list or a specific category',
  category: 'bot',
  async run(sock, msg, args) {
    const from = msg.key.remoteJid
    const input = args[0]?.toLowerCase()

    if (input && categories[input]) {
      const cmds = categories[input].map(cmd => `• ${cmd}`).join('\n')
      return sock.sendMessage(from, {
        text: `👽 *${input.toUpperCase()} Commands:*\n${cmds}`
      }, { quoted: msg })
    }

    let menu = '👽 *Alien Command Menu*\n\n'
    menu += 'Type: *.help <category>* to view commands in that category.\n\n'
    for (const cat in categories) {
      menu += `👾 *${cat.toUpperCase()}*: ${categories[cat].length} cmds\n`
    }
    menu += `\n👣 *Created by Alien Cule*`

    await sock.sendMessage(from, { text: menu }, { quoted: msg })
  }
}
