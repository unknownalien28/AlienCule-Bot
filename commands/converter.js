import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { Sticker } from 'wa-sticker-formatter'
import path from 'path'

export const converterCommands = {
  '.toaudio': handleToAudio,
  '.tomp3': handleToMp3,
  '.tovideo': handleToVideo,
  '.tovn': handleToVn,
  '.emojimix': handleEmojimix
}

async function handleToAudio(sock, msg) {
  await convertMedia(sock, msg, 'mp3', '🎵 Converted to audio')
}

async function handleToMp3(sock, msg) {
  await convertMedia(sock, msg, 'mp3', '🎧 Saved as MP3')
}

async function handleToVideo(sock, msg) {
  await convertMedia(sock, msg, 'mp4', '🎥 Converted to video')
}

async function handleToVn(sock, msg) {
  await convertMedia(sock, msg, 'ogg', '🎙️ Converted to voice note', { opus: true })
}

async function convertMedia(sock, msg, format, caption, options = {}) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted) {
    return sock.sendMessage(msg.key.remoteJid, { text: '👽 Reply to a media message to convert.' }, { quoted: msg })
  }

  const type = Object.keys(quoted)[0]
  const stream = await downloadContentFromMessage(quoted[type], type.includes('video') ? 'video' : 'audio')
  const inputPath = `temp/input_${Date.now()}`
  const outputPath = `temp/output_${Date.now()}.${format}`

  const buffer = []
  for await (const chunk of stream) buffer.push(chunk)
  fs.writeFileSync(inputPath, Buffer.concat(buffer))

  ffmpeg(inputPath)
    .toFormat(format)
    .audioCodec(options.opus ? 'libopus' : undefined)
    .save(outputPath)
    .on('end', async () => {
      const sendOpts = format === 'mp4'
        ? { video: fs.readFileSync(outputPath), caption }
        : { audio: fs.readFileSync(outputPath), mimetype: 'audio/ogg', ptt: options.opus, caption }

      await sock.sendMessage(msg.key.remoteJid, sendOpts, { quoted: msg })
      fs.unlinkSync(inputPath)
      fs.unlinkSync(outputPath)
    })
    .on('error', async () => {
      await sock.sendMessage(msg.key.remoteJid, { text: '👽 Conversion failed.' }, { quoted: msg })
    })
}

async function handleEmojimix(sock, msg, args) {
  if (!args || args.length < 1 || !args[0].includes('+')) {
    return sock.sendMessage(msg.key.remoteJid, { text: '👽 Usage: .emojimix 😎+🔥' }, { quoted: msg })
  }

  try {
    const [emoji1, emoji2] = args[0].split('+')
    const url = `https://tenor.googleapis.com/v2/featured?q=${emoji1}${emoji2}&key=AIzaSyAJ7ax-FakeKeyHere&client_key=wa-bot`
    const res = await fetch(url)
    const json = await res.json()
    const gifUrl = json.results?.[0]?.media_formats?.gif?.url

    if (!gifUrl) throw new Error('No result')

    const sticker = new Sticker(gifUrl, {
      pack: 'Alien_Cule',
      author: '👽',
      type: 'full',
      categories: ['🤖'],
      quality: 70
    })

    await sock.sendMessage(msg.key.remoteJid, await sticker.toMessage(), { quoted: msg })
  } catch (e) {
    await sock.sendMessage(msg.key.remoteJid, { text: '👽 Couldn’t mix emojis.' }, { quoted: msg })
  }
}
