// commands/ai.js

import axios from 'axios'
import fs from 'fs'
import { writeFile } from 'fs/promises'

// 🧠 Replace with your actual OpenAI API key
const OPENAI_KEY = 'sk-xxx' // ⛔ Replace this placeholder

export const aiCommands = {
  '.ai': async (sock, msg, args, from) => {
    if (!args.length) return sock.sendMessage(from, { text: '👽 Ask something...\nUsage: .ai <question>' }, { quoted: msg })
    const question = args.join(' ')
    try {
      const { data } = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: question }]
        },
        { headers: { Authorization: `Bearer ${OPENAI_KEY}` } }
      )
      const reply = data.choices[0].message.content.trim()
      await sock.sendMessage(from, { text: `👽 *AI says:*\n${reply}` }, { quoted: msg })
    } catch (e) {
      console.error(e)
      await sock.sendMessage(from, { text: '👽 AI request failed.' }, { quoted: msg })
    }
  },

  '.img': async (sock, msg, args, from) => {
    if (!args.length) return sock.sendMessage(from, { text: '👽 Describe what I should draw.\nUsage: .img <prompt>' }, { quoted: msg })

    const prompt = args.join(' ')
    try {
      const { data } = await axios.post(
        'https://api.openai.com/v1/images/generations',
        { prompt, n: 1, size: '512x512' },
        { headers: { Authorization: `Bearer ${OPENAI_KEY}` } }
      )
      const imageUrl = data.data[0].url
      await sock.sendMessage(from, { image: { url: imageUrl }, caption: `👽 AI Image for:\n${prompt}` }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to generate image.' }, { quoted: msg })
    }
  },

  '.gptvoice': async (sock, msg, args, from) => {
    if (!args.length) return sock.sendMessage(from, { text: '👽 What should I say?\nUsage: .gptvoice <text>' }, { quoted: msg })

    const text = args.join(' ')
    const voiceURL = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`
    const audioPath = `voice_${Date.now()}.mp3`

    try {
      const { data } = await axios.get(voiceURL, { responseType: 'arraybuffer' })
      await writeFile(audioPath, data)
      await sock.sendMessage(from, { audio: { url: audioPath }, mimetype: 'audio/mp4', ptt: true }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to generate voice.' }, { quoted: msg })
    }
  }
}
