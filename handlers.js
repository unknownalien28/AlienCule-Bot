// handlers.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

// Import your list command (make sure the path is correct)
import listCommand from './commands/list.js'

const FOOTER = process.env.FOOTER || '👾⚡️ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝘈𝘭𝘪𝘦𝘯 𝐂𝘶𝘭𝘦 👽🌌'
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'BLAUGRANA WAVES'
const CHANNEL_LINK = process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029Vb5t5EaEwEjnvkk6Yb1Z'
const OWNER_NUMBER = process.env.OWNER_NUMBER || '2348100236360'

const mainMenu = `
👾 AlienCule Bot Main Menu 👾

• .help / .menu — Show this menu
• .list — Show all commands
• .about — About the bot

🛠 Group Admin: .kick, .add, .promote, .demote, .tagall, .mute, .unmute
🎵 Download: .ytmp3, .tiktok, .ig, .fb, .play
🤖 AI & Fun: .ai, .img, .gptvoice

More in .list — Enjoy!
`;

// Button handler
async function handleButton(sock, msg, buttonId, from) {
  switch (buttonId) {
    case 'aliencule_channel':
      await sock.sendMessage(from, {
        text: '🔵 *BLAUGRANA WAVES CHANNEL*:\nhttps://whatsapp.com/channel/0029Vb5t5EaEwEjnvkk6Yb1Z'
      }, { quoted: msg });
      break;
    case 'owner_contact':
      await sock.sendMessage(from, {
        text: '💬 *Contact Owner:*\nwa.me/2348100236360 (Alien Cule 👽)'
      }, { quoted: msg });
      break;
    default:
      await sock.sendMessage(from, {
        text: '❓ Unknown button action.'
      }, { quoted: msg });
  }
}

// Command handler
async function handleCommand(sock, msg, command, args, from) {
  switch (command) {
    case '.help':
    case '.menu':
      await sock.sendMessage(from, {
        text: mainMenu,
        footer: FOOTER,
        buttons: [
          {
            buttonId: '.list',
            buttonText: { displayText: '📜 Show All Commands' },
            type: 1
          },
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
      }, { quoted: msg });
      break;
    case '.list':
      await listCommand.execute(sock, msg, args, from);
      break;
    case '.ping':
      await sock.sendMessage(from, {
        text: `👽 Pong! Bot is alive.\n\n🔗 Stay updated: *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
      }, { quoted: msg });
      break;
    case '.save':
      await saveStatus(sock, msg, from);
      break;
    default:
      await sock.sendMessage(from, {
        text: '❓ Unknown command. Try *.list* or *.help*.'
      }, { quoted: msg });
  }
}

// Main handler
export async function handleMessage(sock, msg) {
  try {
    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? msg.key.participant : from

    // Detect button press
    if (msg.message?.buttonsResponseMessage) {
      const buttonId = msg.message.buttonsResponseMessage.selectedButtonId
      await handleButton(sock, msg, buttonId, from)
      return
    }

    // Extract plain text
    let content = ''
    if (msg.message?.conversation) content = msg.message.conversation
    else if (msg.message?.extendedTextMessage?.text) content = msg.message.extendedTextMessage.text
    if (!content) return

    const command = content.trim().split(/ +/).shift().toLowerCase()
    const args = content.trim().split(/ +/).slice(1)

    // Emoji react for all commands
    await sock.sendMessage(from, {
      react: {
        text: '👽',
        key: msg.key
      }
    })

    // Only handle messages starting with "."
    if (command.startsWith('.')) {
      await handleCommand(sock, msg, command, args, from)
    }
  } catch (e) {
    console.error('❌ Handler error:', e)
  }
}

// Status saver (kept as in your original)
async function saveStatus(sock, msg, from) {
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (!quoted) {
      return sock.sendMessage(from, {
        text: `👽 Reply to a status with .save to download it.\n\n🔗 *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
      }, { quoted: msg })
    }

    const type = Object.keys(quoted)[0]
    if (!['imageMessage', 'videoMessage'].includes(type)) {
      return sock.sendMessage(from, {
        text: `👽 Only images/videos can be saved.\n\n${FOOTER}`
      }, { quoted: msg })
    }

    const stream = await downloadContentFromMessage(quoted[type], type === 'videoMessage' ? 'video' : 'image')
    const filename = `saved_status/status_${Date.now()}.${type === 'videoMessage' ? 'mp4' : 'jpg'}`
    const buffer = []
    for await (const chunk of stream) buffer.push(chunk)
    fs.mkdirSync('saved_status', { recursive: true })
    fs.writeFileSync(filename, Buffer.concat(buffer))

    await sock.sendMessage(from, {
      text: `✅ Status saved as ${filename}\n\n${FOOTER}`
    }, { quoted: msg })
  } catch (e) {
    await sock.sendMessage(from, {
      text: `❌ Failed to save status.\n\n${FOOTER}`
    }, { quoted: msg })
    console.error('SaveStatus error:', e)
  }
}
