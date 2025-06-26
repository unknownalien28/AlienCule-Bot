// commands/fun.js

import axios from 'axios'

export const funCommands = {
  '.meme': async (sock, msg, from) => {
    try {
      const res = await axios.get('https://meme-api.com/gimme')
      const meme = res.data
      await sock.sendMessage(from, {
        image: { url: meme.url },
        caption: `👽 ${meme.title}\n🔗 ${meme.postLink}`
      }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Could not fetch meme.' }, { quoted: msg })
    }
  },

  '.joke': async (sock, msg, from) => {
    try {
      const res = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single')
      const joke = res.data.joke || '👽 Could not fetch a joke.'
      await sock.sendMessage(from, { text: `👽 ${joke}` }, { quoted: msg })
    } catch {
      await sock.sendMessage(from, { text: '👽 Joke error.' }, { quoted: msg })
    }
  },

  '.truth': async (sock, msg, from) => {
    const truths = [
      '👽 What is your biggest fear?',
      '👽 Have you ever lied to your best friend?',
      '👽 What is your guilty pleasure?',
    ]
    const rand = truths[Math.floor(Math.random() * truths.length)]
    await sock.sendMessage(from, { text: rand }, { quoted: msg })
  },

  '.dare': async (sock, msg, from) => {
    const dares = [
      '👽 Send your last photo from gallery!',
      '👽 Say something embarrassing in the group.',
      '👽 Call someone and sing a song!',
    ]
    const rand = dares[Math.floor(Math.random() * dares.length)]
    await sock.sendMessage(from, { text: rand }, { quoted: msg })
  },

  '.rate': async (sock, msg, from) => {
    const percent = Math.floor(Math.random() * 100)
    await sock.sendMessage(from, { text: `👽 I rate you ${percent}% alien.` }, { quoted: msg })
  },

  '.ship': async (sock, msg, from, args) => {
    if (args.length < 2) return sock.sendMessage(from, { text: '👽 Usage: .ship @user1 @user2' }, { quoted: msg })
    const percent = Math.floor(Math.random() * 100)
    await sock.sendMessage(from, { text: `👽 ${args[0]} 💖 ${args[1]} = ${percent}% compatibility!` }, { quoted: msg })
  },

  '.gay': async (sock, msg, from) => {
    const percent = Math.floor(Math.random() * 100)
    await sock.sendMessage(from, { text: `👽 You're ${percent}% gay 🌈 (for fun only!)` }, { quoted: msg })
  },

  '.hack': async (sock, msg, from, args) => {
    const user = args[0] || 'target'
    const stages = [
      `👽 Hacking ${user}'s WhatsApp...`,
      `👽 Extracting messages...`,
      `👽 Finding secrets...`,
      `👽 Done! Just kidding 😎`
    ]
    for (let i = 0; i < stages.length; i++) {
      await sock.sendMessage(from, { text: stages[i] }, { quoted: msg })
      await new Promise(res => setTimeout(res, 1000))
    }
  }
}
