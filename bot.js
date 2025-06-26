import pkg from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import * as qrcode from 'qrcode-terminal'
import dotenv from 'dotenv'
dotenv.config()

const {
    makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = pkg

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('\n📲 Scan the QR below to connect:')
            qrcode.generate(qr, { small: true })
        }
        if (connection === 'close') {
            const shouldReconnect =
                (lastDisconnect?.error instanceof Boom)
                    ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                    : true
            if (shouldReconnect) {
                console.log('Connection closed. Reconnecting...')
                startBot()
            } else {
                console.log('You are logged out. Delete the auth_info folder and scan again.')
            }
        } else if (connection === 'open') {
            console.log('✅ Connected to WhatsApp')
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return
        // Simple reply to every message
        if (msg.key && !msg.key.fromMe) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Hello from AlienCule-Bot! 👽' }, { quoted: msg })
        }
    })
}

startBot()
