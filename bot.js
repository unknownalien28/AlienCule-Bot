import makeWASocket, { useSingleFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import * as fs from 'fs'
import * as path from 'path'
import { handleMessage } from './handlers.js'
import 'dotenv/config'

const { state, saveState } = useSingleFileAuthState('./auth.json')

async function startSock() {
  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on('creds.update', saveState)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    await handleMessage(sock, msg)
  })

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) {
        startSock()
      }
    } else if (connection === 'open') {
      console.log('👽 Bot connected.')
    }
  })
}

startSock()
