import dotenv from 'dotenv'
dotenv.config()

const FOOTER = process.env.FOOTER || '👾⚡️ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝘈𝘭𝘪𝘦𝘯 𝐂𝘶𝘭𝘦 👽🌌'
const CHANNEL_LINK = process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029Vb5t5EaEwEjnvkk6Yb1Z'
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'BLAUGRANA WAVES'

export const helpMenu = `
👽 *Alien Cule MultiBot Command Menu*

🛠️ *Core Commands*
• .ping – Check bot status
• .help – Show command menu
• .save – Save status

🎵 *Media & Downloads*
• .ytmp3 <url>
• .play <song>

🤖 *AI Zone*
• .ai <text>
• .img <prompt>

🧰 *Utilities*
• .short <url>
• .weather <city>
• .qr <text>

👥 *Group Admin*
• .kick @user
• .tagall
• .group close

🌌 *Anime & Fun*
• .meme
• .anime <name>
• .style <text>

—

🔗 *Join Our Channel:*  
${CHANNEL_NAME}  
${CHANNEL_LINK}

${FOOTER}
`
