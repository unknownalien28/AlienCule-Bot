// handlers.js
import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const FOOTER = process.env.FOOTER || '👽 Created by AlienCule'
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'Blaugrana Waves'
const CHANNEL_LINK = process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029Vb5t5EaEwEjnvkk6Yb1Z'

export async function handleMessage(sock, msg) {
  try {
    // Get message content, group/DM info
    const from = msg.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? msg.key.participant : from

    // Get plain text content
    let content = ''
    if (msg.message?.conversation) {
      content = msg.message.conversation
    } else if (msg.message?.extendedTextMessage?.text) {
      content = msg.message.extendedTextMessage.text
    }

    if (!content) return

    const command = content.trim().split(/ +/).shift().toLowerCase()
    const args = content.trim().split(/ +/).slice(1)

    // React to command
    await sock.sendMessage(from, {
      react: {
        text: '👽',
        key: msg.key
      }
    })

    // Basic commands
    if (command === '.ping') {
      await sock.sendMessage(from, {
        text: `👽 Pong! Bot is alive.\n\n🔗 Stay updated: *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
      }, { quoted: msg })
    }

    if (command === '.help') {
      await sock.sendMessage(from, {
        text: `${helpMenu}\n\n🔗 Stay updated: *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
      }, { quoted: msg })
    }

    // Save status command
    if (command === '.save') {
      await saveStatus(sock, msg, from)
    }

    // Add more commands here!

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

    // Download and save
    const stream = await downloadContentFromMessage(quoted[type], type === 'videoMessage' ? 'video' : 'image')
    const filename = `saved_status/status_${Date.now()}.${type === 'videoMessage' ? 'mp4' : 'jpg'}`
    const buffer = []
    for await (const chunk of stream) buffer.push(chunk)
    fs.mkdirSync('saved_status', { recursive: true })
    fs.writeFileSync(filename, Buffer.concat(buffer))

    await sock.sendMessage(from, {
      text: `👽 Status saved as *${filename}*.\n\n🔗 *${CHANNEL_NAME}*\n${CHANNEL_LINK}\n\n${FOOTER}`
    }, { quoted: msg })
  } catch (e) {
    console.error('❌ Saving status failed:', e)
    await sock.sendMessage(from, {
      text: `👽 Error saving status.\n\n${FOOTER}`
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
