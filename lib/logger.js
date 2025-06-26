import fs from 'fs'
import path from 'path'

const logPath = './database/command_logs.json'

export function logCommand(command, sender, chat, timestamp = new Date().toISOString()) {
  const logEntry = { command, sender, chat, timestamp }

  try {
    let data = []
    if (fs.existsSync(logPath)) {
      const raw = fs.readFileSync(logPath)
      data = JSON.parse(raw)
    }

    data.push(logEntry)
    fs.writeFileSync(logPath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('❌ Failed to log command:', err)
  }
}
