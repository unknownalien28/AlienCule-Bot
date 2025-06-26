import { downloadContentFromMessage, proto } from '@whiskeysockets/baileys'
import fs from 'fs'
import { logCommand } from './lib/logger.js'
import dotenv from 'dotenv'

dotenv.config()

const FOOTER = process.env.FOOTER || '👾⚡️ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝘈𝘭𝘪𝘦𝘯 𝐂𝘶𝘭𝘦 👽🌌'

export async function handleMessage(sock, msg) {
  try {
    const { remoteJid, participant, message } = msg.key
    const from = remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? participant : from

    if (!message?.conversation && !message?.extendedTextMessage?.text) return

    const type = Object.keys(message)[0]
    const content = message.conversation || message?.extendedTextMessage?.text || ''
    const command = content.trim().split(/ +/).shift().toLowerCase()
    const args = content.trim().split(/ +/).slice(1)

    // 👽 React to all commands
    await sock.sendMessage(from, { react: { text: '👽', key: msg.key } })

    // 📥 Log command usage
    logCommand(command, sender, from)

    // ⬇️ Command Switch
    switch (command) {
      case '.ping':
        await sock.sendMessage(from, { text: `👽 Pong! I'm alive.\n\n${FOOTER}` }, { quoted: msg })
        break

      case '.help':
        await sock.sendMessage(from, { text: helpMenu }, { quoted: msg })
        break

      case '.save':
        await saveStatus(sock, msg, from)
        break

      // 🔧 Add more cases here...

      default:
        // Unknown command
        break
    }
  } catch (e) {
    console.error('❌ Error in handler:', e)
  }
}

async function saveStatus(sock, msg, from) {
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    if (!quoted) {
      return sock.sendMessage(from, {
        text: `👽 Reply to a view-once image or video with *.save* to download it.\n\n${FOOTER}`
      }, { quoted: msg })
    }

    const type = Object.keys(quoted)[0]
    const stream = await downloadContentFromMessage(quoted[type], type.includes('video') ? 'video' : 'image')
    const filename = `saved_status/status_${Date.now()}.${type.includes('video') ? 'mp4' : 'jpg'}`
    const buffer = []
    for await (const chunk of stream) buffer.push(chunk)
    fs.writeFileSync(filename, Buffer.concat(buffer))
    await sock.sendMessage(from, {
      text: `👽 Status saved as *${filename}*\n\n${FOOTER}`
    }, { quoted: msg })
  } catch (e) {
    console.error('❌ Failed to save status:', e)
    await sock.sendMessage(from, { text: '👽 Error saving status.\n\n' + FOOTER }, { quoted: msg })
  }
}

// 🧾 Main Help Menu
const helpMenu = `
👽 *BLAUGRANA BOT MENU*

🛠️ *Bot Commands:*
• .ping - Check bot status
• .help - Show this help menu
• .save - Save a view-once or replied status

📡 *Channel:*
📍 BLAUGRANA WAVES  
🔗 ${process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029Vb5t5EaEwEjnvkk6Yb1Z'}

${FOOTER}
`
