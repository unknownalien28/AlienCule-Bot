// lib/reply.js

import 'dotenv/config'

export async function reply(sock, to, msg, text) {
  const footer = process.env.FOOTER || ''
  await sock.sendMessage(to, {
    text: `${text}\n\n${footer}`
  }, { quoted: msg })
}
