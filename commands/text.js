// commands/text.js

import axios from 'axios'

export const textCommands = {
  '.style': async (sock, msg, from, args) => {
    const text = args.join(' ')
    if (!text) return sock.sendMessage(from, { text: '👽 Send some text to style.' }, { quoted: msg })

    const styles = [
      `𝔖𝔱𝔶𝔩𝔢𝔡 𝔗𝔢𝔵𝔱: ${text}`,
      `𝒮𝓉𝓎𝓁𝒾𝓈𝒽: ${text}`,
      `𝐁𝐨𝐥𝐝: ${text}`,
      `Ⓒⓘⓡⓒⓛⓔⓓ: ${text}`,
      `🅱🆄🅱🅱🅻🅴: ${text}`
    ]

    await sock.sendMessage(from, { text: styles.join('\n') }, { quoted: msg })
  },

  '.fancytext': async (sock, msg, from, args) => {
    const text = args.join(' ')
    if (!text) return sock.sendMessage(from, { text: '👽 Provide text to convert.' }, { quoted: msg })

    try {
      const res = await axios.get(`https://api.fancytexttool.com/api/v1/fancy?text=${encodeURIComponent(text)}`)
      const list = res.data.result.map((item, i) => `${i + 1}. ${item.fancy}`).join('\n')

      await sock.sendMessage(from, {
        text: `👽 *Fancy Text Results*\n\n${list}`
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Error fetching fancy texts.' }, { quoted: msg })
    }
  },

  '.emojimix': async (sock, msg, from, args) => {
    const input = args.join('').split('+')
    if (input.length !== 2) return sock.sendMessage(from, { text: '👽 Usage: .emojimix 😎+🔥' }, { quoted: msg })

    try {
      const url = `https://tenor.googleapis.com/v2/featured?key=your_tenor_api_key&ids=${input[0]}_${input[1]}`
      // Placeholder, real API may differ; you’d need a real emojimix API or manual image composition
      await sock.sendMessage(from, {
        text: `👽 Emojimix of ${input[0]} + ${input[1]} is under construction 👷‍♂️`
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to mix emojis.' }, { quoted: msg })
    }
  }
}
