// bot.js
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import { handleMessage } from './handlers.js' // Make sure handlers.js exports handleMessage as shown before

async function startBot() {
    // Setup multi-file auth state
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    // Fetch the latest supported WhatsApp version
    const { version } = await fetchLatestBaileysVersion()

    // Create Baileys socket
    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true, // Baileys prints QR in terminal
    })

    // Save credentials on update
    sock.ev.on('creds.update', saveCreds)

    // Connection updates
    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log("📸 Scan the QR code below to link your WhatsApp:")
            qrcode.generate(qr, { small: true }) // Print QR code in terminal
        }
        if (connection === 'close') {
            const shouldReconnect =
                (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('❌ Connection closed. Reconnecting:', shouldReconnect)
            if (shouldReconnect) startBot()
            else console.log('Logged out. Delete auth_info folder to re-link.')
        }
        if (connection === 'open') {
            console.log('✅ Successfully connected to WhatsApp')
        }
    })

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return
        if (msg.key && !msg.key.fromMe) {
            await handleMessage(sock, msg)
        }
    })
}

startBot()
