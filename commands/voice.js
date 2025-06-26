import fs from 'fs'
import gTTS from 'gtts'

export const voiceCommands = {
  '.gptvoice': async (sock, msg, from, args) => {
    try {
      if (!args.length) {
        await sock.sendMessage(from, {
          text: '👽 Provide text to convert to voice.\n\nExample:\n.gptvoice I am the Alien bot'
        }, { quoted: msg })
        return
      }

      const text = args.join(' ')
      const filepath = `tmp/voice_${Date.now()}.mp3`

      const speech = new gTTS(text, 'en')
      speech.save(filepath, async (err) => {
        if (err) {
          await sock.sendMessage(from, {
            text: '👽 Failed to generate voice.'
          }, { quoted: msg })
          console.error('gTTS Error:', err)
        } else {
          const audio = fs.readFileSync(filepath)
          await sock.sendMessage(from, {
            audio,
            mimetype: 'audio/mp4',
            ptt: true
          }, { quoted: msg })

          fs.unlinkSync(filepath)
        }
      })
    } catch (e) {
      console.error('👽 Error in .gptvoice:', e)
      await sock.sendMessage(from, {
        text: '👽 Something went wrong while processing voice command.'
      }, { quoted: msg })
    }
  }
}
