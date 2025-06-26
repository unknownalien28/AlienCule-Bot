import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

// Load environment variables
const FOOTER = process.env.FOOTER || '👽 Created by Alien Cule'
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'Blaugrana Waves'
const CHANNEL_LINK = process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029Vb5t5EaEwEjnvkk6Yb1Z'

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

    // React to valid commands
    await sock.sendMessage(from, {
      react: {
        text: '👽',
        key: msg.key
      }
    })

    switch (command) {
      case '.ping':
        await sock.sendMessage(from, {
          text: `👽 Pong! Bot is alive.\n\n🔗 Stay updated: *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
        }, { quoted: msg })
        break

      case '.help':
        await sock.sendMessage(from, {
          text: `${helpMenu}\n\n🔗 Stay updated: *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
        }, { quoted: msg })
        break

      case '.save':
        await saveStatus(sock, msg, from)
        break

      // Add more commands here

      default:
        // Unknown commands can be ignored or logged
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
        text: `👽 Reply to a status with .save to download it.\n\n🔗 *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
      }, { quoted: msg })
    }

    const type = Object.keys(quoted)[0]
    const stream = await downloadContentFromMessage(quoted[type], type.includes('video') ? 'video' : 'image')
    const filename = `saved_status/status_${Date.now()}.${type.includes('video') ? 'mp4' : 'jpg'}`
    const buffer = []
    for await (const chunk of stream) buffer.push(chunk)
    fs.writeFileSync(filename, Buffer.concat(buffer))
    await sock.sendMessage(from, {
      text: `👽 Status saved as *${filename}*.\n\n🔗 *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
    }, { quoted: msg })
  } catch (e) {
    console.error('❌ Failed to save status:', e)
    await sock.sendMessage(from, {
      text: `👽 Error saving status.\n\n🔗 *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
    }, { quoted: msg })
  }
}

const helpMenu = `👽 *AlienCule Bot Commands*

🛠️ *Basic:*
• .ping - Check bot status
• .help - Show command list
• .save - Save a replied WhatsApp Status

⚡ More commands coming soon!
`
