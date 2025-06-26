// commands/downloader.js

import axios from 'axios'
import ytdl from 'ytdl-core'
import fs from 'fs'
import yts from '@neeraj-x0/ytsearch'

export const downloaderCommands = {
  '.ytmp3': async (sock, msg, args, from) => {
    if (!args[0]) return sock.sendMessage(from, { text: '👽 Send a YouTube URL.\nUsage: .ytmp3 <url>' }, { quoted: msg })

    try {
      const info = await ytdl.getInfo(args[0])
      const title = info.videoDetails.title
      const path = `yt_${Date.now()}.mp3`
      ytdl(args[0], { filter: 'audioonly' })
        .pipe(fs.createWriteStream(path))
        .on('finish', async () => {
          await sock.sendMessage(from, { document: { url: path }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: msg })
        })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to download audio.' }, { quoted: msg })
    }
  },

  '.ytmp4': async (sock, msg, args, from) => {
    if (!args[0]) return sock.sendMessage(from, { text: '👽 Send a YouTube URL.\nUsage: .ytmp4 <url>' }, { quoted: msg })

    try {
      const info = await ytdl.getInfo(args[0])
      const title = info.videoDetails.title
      const path = `yt_${Date.now()}.mp4`
      ytdl(args[0], { quality: '18' }) // mp4 360p
        .pipe(fs.createWriteStream(path))
        .on('finish', async () => {
          await sock.sendMessage(from, { video: { url: path }, caption: `👽 ${title}` }, { quoted: msg })
        })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to download video.' }, { quoted: msg })
    }
  },

  '.ytsearch': async (sock, msg, args, from) => {
    if (!args.length) return sock.sendMessage(from, { text: '👽 Provide search query.\nUsage: .ytsearch <query>' }, { quoted: msg })

    const search = await yts(args.join(' '))
    const top = search[0]
    const result = `👽 *${top.title}*\n📺 ${top.url}\n🕐 ${top.duration}\n📅 ${top.uploaded}`
    await sock.sendMessage(from, { text: result }, { quoted: msg })
  },

  '.play': async (sock, msg, args, from) => {
    if (!args.length) return sock.sendMessage(from, { text: '👽 Provide a song name.\nUsage: .play <song>' }, { quoted: msg })

    const search = await yts(args.join(' '))
    const top = search[0]
    const path = `play_${Date.now()}.mp3`
    ytdl(top.url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(path))
      .on('finish', async () => {
        await sock.sendMessage(from, { document: { url: path }, mimetype: 'audio/mpeg', fileName: `${top.title}.mp3` }, { quoted: msg })
      })
  },

  '.tiktok': async (sock, msg, args, from) => {
    if (!args[0]) return sock.sendMessage(from, { text: '👽 Provide a TikTok link.\nUsage: .tiktok <url>' }, { quoted: msg })

    const api = `https://api.akuari.my.id/downloader/tiktokdl?link=${args[0]}`
    const { data } = await axios.get(api)
    const video = data.respon?.video?.nowm
    if (video) {
      await sock.sendMessage(from, { video: { url: video }, caption: '👽 TikTok video (no watermark)' }, { quoted: msg })
    } else {
      await sock.sendMessage(from, { text: '👽 Failed to fetch TikTok video.' }, { quoted: msg })
    }
  },

  '.ig': async (sock, msg, args, from) => {
    if (!args[0]) return sock.sendMessage(from, { text: '👽 Provide an Instagram URL.\nUsage: .ig <url>' }, { quoted: msg })

    try {
      const api = `https://api.akuari.my.id/downloader/igdl?link=${args[0]}`
      const { data } = await axios.get(api)
      for (const result of data.respon) {
        await sock.sendMessage(from, { video: { url: result.url }, caption: '👽 Instagram media' }, { quoted: msg })
      }
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to fetch Instagram media.' }, { quoted: msg })
    }
  },

  '.fb': async (sock, msg, args, from) => {
    if (!args[0]) return sock.sendMessage(from, { text: '👽 Provide a Facebook URL.\nUsage: .fb <url>' }, { quoted: msg })

    const api = `https://api.akuari.my.id/downloader/fbdl?link=${args[0]}`
    const { data } = await axios.get(api)
    const url = data.respon?.hd
    if (url) {
      await sock.sendMessage(from, { video: { url }, caption: '👽 Facebook video' }, { quoted: msg })
    } else {
      await sock.sendMessage(from, { text: '👽 Failed to fetch Facebook video.' }, { quoted: msg })
    }
  },

  '.mediafire': async (sock, msg, args, from) => {
    if (!args[0]) return sock.sendMessage(from, { text: '👽 Provide a Mediafire URL.\nUsage: .mediafire <url>' }, { quoted: msg })

    try {
      const api = `https://api.akuari.my.id/downloader/mediafiredl?link=${args[0]}`
      const { data } = await axios.get(api)
      const file = data.respon
      await sock.sendMessage(from, {
        document: { url: file.link },
        mimetype: file.mime,
        fileName: file.filename,
        caption: `👽 ${file.filename} (${file.size})`
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to download from Mediafire.' }, { quoted: msg })
    }
  }
}
