// lib/logger.js

import fs from 'fs'
import path from 'path'

const commandLogFile = path.resolve('./logs/command-log.json')
const errorLogFile = path.resolve('./logs/error-log.json')

function ensureDir() {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
  }
}

export function logCommand({ user, command, args, group }) {
  ensureDir()
  const log = {
    user,
    command,
    args,
    group,
    timestamp: new Date().toISOString()
  }

  let logs = []

  try {
    if (fs.existsSync(commandLogFile)) {
      logs = JSON.parse(fs.readFileSync(commandLogFile, 'utf-8'))
    }
  } catch (err) {
    console.error('👽 Failed to read command log:', err)
  }

  logs.push(log)

  try {
    fs.writeFileSync(commandLogFile, JSON.stringify(logs, null, 2))
  } catch (err) {
    console.error('👽 Failed to write command log:', err)
  }
}

export function logError(errorInfo) {
  ensureDir()
  const log = {
    ...errorInfo,
    timestamp: new Date().toISOString()
  }

  let logs = []

  try {
    if (fs.existsSync(errorLogFile)) {
      logs = JSON.parse(fs.readFileSync(errorLogFile, 'utf-8'))
    }
  } catch (err) {
    console.error('👽 Failed to read error log:', err)
  }

  logs.push(log)

  try {
    fs.writeFileSync(errorLogFile, JSON.stringify(logs, null, 2))
  } catch (err) {
    console.error('👽 Failed to write error log:', err)
  }
}
