import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import fs from 'fs'

const adapter = new JSONFile('./db.json')
const db = new Low(adapter)
await db.read()
db.data ||= { saves: {}, commands: {} }
await db.write()

export const databaseCommands = {
  '.save': saveToDB,
  '.get': getFromDB,
  '.addcmd': addCustomCmd,
  '.delcmd': deleteCustomCmd,
  '.listcmd': listCustomCmds
}

// 👽 .save <key>
async function saveToDB(sock, msg, args) {
  const key = args[0]
  if (!key) return sock.sendMessage(msg.key.remoteJid, { text: '👽 Usage: .save <key> (reply with text/media)' }, { quoted: msg })

  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted) return sock.sendMessage(msg.key.remoteJid, { text: '👽 Reply to a message to save.' }, { quoted: msg })

  const contentType = Object.keys(quoted)[0]
  const content = quoted[contentType]

  const fileType = contentType.includes('video') ? 'mp4' : contentType.includes('image') ? 'jpg' : 'bin'
  const buffer = []
  const stream = await sock.downloadContentFromMessage(content, contentType.includes('video') ? 'video' : 'image')
  for await (const chunk of stream) buffer.push(chunk)
  const data = Buffer.concat(buffer).toString('base64')

  db.data.saves[key] = { type: fileType, data }
  await db.write()

  await sock.sendMessage(msg.key.remoteJid, { text: `👽 Saved as "${key}".` }, { quoted: msg })
}

// 👽 .get <key>
async function getFromDB(sock, msg, args) {
  const key = args[0]
  if (!key || !db.data.saves[key]) {
    return sock.sendMessage(msg.key.remoteJid, { text: '👽 Not found or invalid key.' }, { quoted: msg })
  }

  const item = db.data.saves[key]
  const buffer = Buffer.from(item.data, 'base64')

  const type =
    item.type === 'mp4' ? 'video' :
    item.type === 'jpg' ? 'image' :
    'document'

  await sock.sendMessage(msg.key.remoteJid, { [type]: buffer, caption: `👽 Retrieved: ${key}` }, { quoted: msg })
}

// 👽 .addcmd <.cmd> <response>
async function addCustomCmd(sock, msg, args) {
  const trigger = args[0]
  const response = args.slice(1).join(' ')
  if (!trigger || !response) {
    return sock.sendMessage(msg.key.remoteJid, { text: '👽 Usage: .addcmd <.cmd> <reply>' }, { quoted: msg })
  }

  db.data.commands[trigger] = response
  await db.write()
  await sock.sendMessage(msg.key.remoteJid, { text: `👽 Custom command ${trigger} added.` }, { quoted: msg })
}

// 👽 .delcmd <.cmd>
async function deleteCustomCmd(sock, msg, args) {
  const trigger = args[0]
  if (!trigger || !db.data.commands[trigger]) {
    return sock.sendMessage(msg.key.remoteJid, { text: '👽 Command not found.' }, { quoted: msg })
  }

  delete db.data.commands[trigger]
  await db.write()
  await sock.sendMessage(msg.key.remoteJid, { text: `👽 Command ${trigger} deleted.` }, { quoted: msg })
}

// 👽 .listcmd
async function listCustomCmds(sock, msg) {
  const list = Object.entries(db.data.commands).map(([k, v]) => `• ${k} => ${v}`).join('\n') || '👽 No custom commands yet.'
  await sock.sendMessage(msg.key.remoteJid, { text: `👽 Custom Commands:\n${list}` }, { quoted: msg })
}
