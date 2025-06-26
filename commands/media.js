// commands/media.js

import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'

export async function handleMediaCommands(sock, msg, command, args) {
  const from = msg.key.remoteJid
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  const type = quoted ? Object.keys(quoted)[0] : null

  switch (command) {
    case '.sticker':
      if (!quoted || !(type === 'imageMessage' || type === 'videoMessage')) {
        return sock.sendMessage(from, { text: '👽 Reply to an image or video with `.sticker`.' }, { quoted: msg })
      }

      const stream = await downloadContentFromMessage(quoted[type], type.includes('video') ? 'video' : 'image')
      const buffer = []
      for await (const chunk of stream) buffer.push(chunk)
      const stickerPath = path.join('temp', `sticker_${Date.now()}.webp`)
      fs.writeFileSync(stickerPath, Buffer.concat(buffer))

      await sock.sendMessage(from, {
        sticker: fs.readFileSync(stickerPath)
      }, { quoted: msg })
      fs.unlinkSync(stickerPath)
      break

    case '.toimg':
      if (!quoted || type !== 'stickerMessage') {
        return sock.sendMessage(from, { text: '👽 Reply to a sticker with `.toimg`.' }, { quoted: msg })
      }

      const stickerStream = await downloadContentFromMessage(quoted[type], 'image')
      const imgPath = path.join('temp', `img_${Date.now()}.png`)
      const stickerBuffer = []
      for await (const chunk of stickerStream) stickerBuffer.push(chunk)
      fs.writeFileSync(imgPath, Buffer.concat(stickerBuffer))

      await sock.sendMessage(from, {
        image: fs.readFileSync(imgPath),
        caption: '👽 Converted sticker to image'
      }, { quoted: msg })
      fs.unlinkSync(imgPath)
      break

    default:
      break
  }
}
