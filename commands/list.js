// commands/list.js

import { categorizedCommands } from './categorizedCommands.js'

const FOOTER = process.env.FOOTER || '👾⚡️ Created by Alien Cule 👽🌌'

export default {
  name: '.list',
  description: 'Show all commands categorized.',
  async execute(sock, msg, args, from) {
    let text = '👽 *AlienCule Bot Command List*\n\n'

    for (const [category, cmds] of Object.entries(categorizedCommands)) {
      text += `*${category}:*\n${cmds.map(c => `• ${c}`).join('\n')}\n\n`
    }

    await sock.sendMessage(from, {
      text,
      footer: FOOTER,
      buttons: [
        {
          buttonId: 'aliencule_channel',
          buttonText: { displayText: '🔵 Join BLAUGRANA WAVES' },
          type: 1
        },
        {
          buttonId: 'owner_contact',
          buttonText: { displayText: '💬 Contact AlienCule' },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: msg })
  }
}
