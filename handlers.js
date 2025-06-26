// handlers.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

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

export async function handleMessage(sock, msg) {
  try {
    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? msg.key.participant : from

    // Plain text extraction
    let content = ''
    if (msg.message?.conversation) {
      content = msg.message.conversation
    } else if (msg.message?.extendedTextMessage?.text) {
      content = msg.message.extendedTextMessage.text
    }
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

    // MAIN BUTTON MENU
    if (command === '.help' || command === '.menu') {
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
            buttonId: CHANNEL_LINK,
            buttonText: { displayText: '🔵🔴 𝐉𝐨𝐢𝐧 𝐁𝐋𝐀𝐔𝐆𝐑𝐀𝐍𝐀 𝐖𝐀𝐕𝐄𝐒' },
            type: 1
          },
          {
            buttonId: `https://wa.me/${OWNER_NUMBER}`,
            buttonText: { displayText: '📞 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐀𝐥𝐢𝐞𝐧 𝐂𝐮𝐥𝐞' },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: msg })
      return
    }

    // Example: Ping command
    if (command === '.ping') {
      await sock.sendMessage(from, {
        text: `👽 Pong! Bot is alive.\n\n🔗 Stay updated: *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
      }, { quoted: msg })
      return
    }

    // Example: Save status command
    if (command === '.save') {
      await saveStatus(sock, msg, from)
      return
    }

    // Add more commands below this line!

  } catch (e) {
    console.error('❌ Handler error:', e)
  }
}

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
