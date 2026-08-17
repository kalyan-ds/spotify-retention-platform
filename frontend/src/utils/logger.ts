import { config } from '../config/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

class Logger {
  private currentPriority: number;

  constructor() {
    this.currentPriority = LOG_LEVEL_PRIORITY[config.logLevel] || 2;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= this.currentPriority;
  }

  public debug(message: string, context?: Record<string, any>) {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, context || '');
    }
  }

  public info(message: string, context?: Record<string, any>) {
    if (this.shouldLog('info')) {
      console.info(`[INFO] [${new Date().toISOString()}] ${message}`, context || '');
    }
  }

  public warn(message: string, context?: Record<string, any>) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, context || '');
    }
  }

  public error(message: string, error?: any, context?: Record<string, any>) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error || '', context || '');
    }
  }
}

export const logger = new Logger();
