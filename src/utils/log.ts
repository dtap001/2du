import * as fs from 'fs'

export class Logger {
  private static logFilePath = `/tmp/2du-${
    new Date().toISOString().split('T')[0]
  }.log`

  static info(msg: string): void {
    const isDebugModeEnabled = process.env['DEV'] ?? false
    if (!isDebugModeEnabled) return
    const logLine = `${new Date().toISOString()} [INFO] => ${msg}\n`
    try {
      if (!fs.existsSync(Logger.logFilePath)) {
        fs.writeFileSync(Logger.logFilePath, logLine, 'utf-8')
        return
      }

      fs.appendFileSync(Logger.logFilePath, logLine, 'utf8')
    } catch (error) {
      console.error(
        `❌ Error during writing logfile at ${Logger.logFilePath}. Logline: ${logLine}:`,
        error,
      )
    }
  }
}
