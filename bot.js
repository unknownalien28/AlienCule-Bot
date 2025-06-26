import baileys from '@whiskeysockets/baileys'
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = baileys
import { Boom } from '@hapi/boom'
import 'dotenv/config'
import * as fs from 'fs'

// Use a consistent auth state filename
const AUTH_FILE = './auth_info.json'
const { state, saveState } = useSingleFileAuthState(AUTH_FILE)

async function startSock() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    // Add any other Baileys config options here (logger, browser, etc.)
  })

  // Save updated credentials
  sock.ev.on('creds.update', saveState)

  // Connection update/reconnect logic
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error instanceof Boom)
          ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
          : true

      console.log('⛔ Connection closed.')
      if (shouldReconnect) {
        console.log('🔁 Attempting to reconnect...')
        startSock()
      } else {
        console.log('🚪 Logged out. Please delete auth_info.json and restart the bot to re-authenticate.')
      }
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp')
    }
  })

  // Dynamic handler import for hot reloading and flexibility
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    try {
      // Dynamically import handler for each new message (hot reload)
      const { handleMessage } = await import('./handlers.js')
      await handleMessage(sock, msg)
    } catch (err) {
      console.error('❌ Error handling message:', err)
    }
  })

  // Optional: handle unexpected errors globally
  process.on('unhandledRejection', err => {
    console.error('❗ Unhandled Promise Rejection:', err)
  })
  process.on('uncaughtException', err => {
    console.error('❗ Uncaught Exception:', err)
  })
}

// Start the bot
startSock()
