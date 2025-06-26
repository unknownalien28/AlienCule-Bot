// commands/admin.js

import { getGroupAdmins } from '../lib/utils.js'

export const adminCommands = {
  '.kick': async (sock, msg, args, from, sender, isGroup, metadata) => {
    if (!isGroup) return sock.sendMessage(from, { text: '👽 This command is for groups only.' }, { quoted: msg })

    const groupAdmins = getGroupAdmins(metadata.participants)
    if (!groupAdmins.includes(sender)) return sock.sendMessage(from, { text: '👽 You must be a group admin.' }, { quoted: msg })

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
    if (!mentioned) return sock.sendMessage(from, { text: '👽 Mention the user to kick.' }, { quoted: msg })

    await sock.groupParticipantsUpdate(from, mentioned, 'remove')
  },

  '.add': async (sock, msg, args, from, sender, isGroup, metadata) => {
    if (!isGroup) return sock.sendMessage(from, { text: '👽 This command is for groups only.' }, { quoted: msg })

    const groupAdmins = getGroupAdmins(metadata.participants)
    if (!groupAdmins.includes(sender)) return sock.sendMessage(from, { text: '👽 You must be a group admin.' }, { quoted: msg })

    if (!args[0]) return sock.sendMessage(from, { text: '👽 Provide a number to add.' }, { quoted: msg })

    const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    await sock.groupParticipantsUpdate(from, [number], 'add')
  },

  '.promote': async (sock, msg, args, from, sender, isGroup, metadata) => {
    if (!isGroup) return sock.sendMessage(from, { text: '👽 This command is for groups only.' }, { quoted: msg })

    const groupAdmins = getGroupAdmins(metadata.participants)
    if (!groupAdmins.includes(sender)) return sock.sendMessage(from, { text: '👽 You must be a group admin.' }, { quoted: msg })

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
    if (!mentioned) return sock.sendMessage(from, { text: '👽 Mention the user to promote.' }, { quoted: msg })

    await sock.groupParticipantsUpdate(from, mentioned, 'promote')
  },

  '.demote': async (sock, msg, args, from, sender, isGroup, metadata) => {
    if (!isGroup) return sock.sendMessage(from, { text: '👽 This command is for groups only.' }, { quoted: msg })

    const groupAdmins = getGroupAdmins(metadata.participants)
    if (!groupAdmins.includes(sender)) return sock.sendMessage(from, { text: '👽 You must be a group admin.' }, { quoted: msg })

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
    if (!mentioned) return sock.sendMessage(from, { text: '👽 Mention the user to demote.' }, { quoted: msg })

    await sock.groupParticipantsUpdate(from, mentioned, 'demote')
  },

  '.tagall': async (sock, msg, args, from, sender, isGroup, metadata) => {
    if (!isGroup) return sock.sendMessage(from, { text: '👽 This command is for groups only.' }, { quoted: msg })

    const groupAdmins = getGroupAdmins(metadata.participants)
    if (!groupAdmins.includes(sender)) return sock.sendMessage(from, { text: '👽 You must be a group admin.' }, { quoted: msg })

    const mentions = metadata.participants.map(p => p.id)
    const text = mentions.map(u => `👽 @${u.split('@')[0]}`).join('\n')
    await sock.sendMessage(from, {
      text,
      mentions
    }, { quoted: msg })
  }
}
