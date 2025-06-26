// commands/anime.js

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

export const animeCommands = {
  '.anime': async (sock, msg, from, args) => {
    const query = args.join(' ')
    if (!query) return sock.sendMessage(from, { text: '👽 Provide an anime name to search.' }, { quoted: msg })

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`)
      const anime = res.data.data[0]

      const info = `🎌 *${anime.title}*
🗓️ Aired: ${anime.aired.string}
📺 Episodes: ${anime.episodes}
📊 Score: ${anime.score}
📖 Synopsis: ${anime.synopsis}`

      await sock.sendMessage(from, {
        image: { url: anime.images.jpg.image_url },
        caption: info
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Anime not found or API error.' }, { quoted: msg })
    }
  },

  '.manga': async (sock, msg, from, args) => {
    const query = args.join(' ')
    if (!query) return sock.sendMessage(from, { text: '👽 Provide a manga name to search.' }, { quoted: msg })

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`)
      const manga = res.data.data[0]

      const info = `📚 *${manga.title}*
🗓️ Published: ${manga.published.string}
📖 Chapters: ${manga.chapters}
📊 Score: ${manga.score}
📖 Synopsis: ${manga.synopsis}`

      await sock.sendMessage(from, {
        image: { url: manga.images.jpg.image_url },
        caption: info
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Manga not found or API error.' }, { quoted: msg })
    }
  },

  '.animestyle': async (sock, msg, from) => {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      const type = quoted ? Object.keys(quoted)[0] : null

      if (!quoted || (type !== 'imageMessage' && type !== 'videoMessage')) {
        return sock.sendMessage(from, { text: '👽 Reply to an image with .animestyle' }, { quoted: msg })
      }

      const stream = await downloadContentFromMessage(quoted[type], type.includes('video') ? 'video' : 'image')
      const buffer = []
      for await (const chunk of stream) buffer.push(chunk)

      // Simulated anime filter API
      const form = new FormData()
      form.append('file', Buffer.concat(buffer), { filename: 'image.jpg' })

      const res = await axios.post('https://api.deepai.org/api/toonify', form, {
        headers: {
          ...form.getHeaders(),
          'api-key': 'your_deepai_api_key' // Replace with your API key
        }
      })

      if (!res.data.output_url) throw new Error()

      await sock.sendMessage(from, {
        image: { url: res.data.output_url },
        caption: '👽 Anime style generated!'
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Could not convert to anime style.' }, { quoted: msg })
    }
  }
}
