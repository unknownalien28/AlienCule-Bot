// commands/tools.js

import axios from 'axios'
import QRCode from 'qrcode'

export const toolsCommands = {
  '.short': async (sock, msg, from, args) => {
    const url = args[0]
    if (!url) return sock.sendMessage(from, { text: '👽 Please provide a URL.' }, { quoted: msg })

    try {
      const res = await axios.get(`https://api.shrtco.de/v2/shorten?url=${url}`)
      const shortUrl = res.data.result.full_short_link
      await sock.sendMessage(from, { text: `👽 Shortened URL: ${shortUrl}` }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to shorten the URL.' }, { quoted: msg })
    }
  },

  '.weather': async (sock, msg, from, args) => {
    const city = args.join(' ')
    if (!city) return sock.sendMessage(from, { text: '👽 Provide a city name.' }, { quoted: msg })

    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=3`)
      await sock.sendMessage(from, { text: `👽 Weather: ${res.data}` }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to get weather info.' }, { quoted: msg })
    }
  },

  '.time': async (sock, msg, from, args) => {
    const location = args.join(' ')
    if (!location) return sock.sendMessage(from, { text: '👽 Provide a location or city.' }, { quoted: msg })

    try {
      const res = await axios.get(`http://worldtimeapi.org/api/timezone`)
      const match = res.data.find(zone => zone.toLowerCase().includes(location.toLowerCase()))

      if (!match) return sock.sendMessage(from, { text: '👽 Timezone not found.' }, { quoted: msg })

      const timeRes = await axios.get(`http://worldtimeapi.org/api/timezone/${match}`)
      const time = timeRes.data.datetime
      await sock.sendMessage(from, { text: `👽 Time in ${location}: ${time}` }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Could not fetch time.' }, { quoted: msg })
    }
  },

  '.translate': async (sock, msg, from, args) => {
    const [lang, ...textArr] = args
    const text = textArr.join(' ')
    if (!lang || !text) return sock.sendMessage(from, { text: '👽 Usage: .translate <lang> <text>' }, { quoted: msg })

    try {
      const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`)
      const translated = res.data.responseData.translatedText
      await sock.sendMessage(from, { text: `👽 Translated: ${translated}` }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Failed to translate.' }, { quoted: msg })
    }
  },

  '.qr': async (sock, msg, from, args) => {
    const data = args.join(' ')
    if (!data) return sock.sendMessage(from, { text: '👽 Provide text to encode.' }, { quoted: msg })

    try {
      const qrData = await QRCode.toBuffer(data)
      await sock.sendMessage(from, {
        image: qrData,
        caption: '👽 Here is your QR Code!'
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Could not generate QR.' }, { quoted: msg })
    }
  }
}
