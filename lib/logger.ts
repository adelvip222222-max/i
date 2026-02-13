// Production-ready logging utility
import { Log } from '@/models';
import { connectDB } from './db';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private async saveToDatabase(level: LogLevel, message: string, context?: Record<string, any>) {
    // Only save INFO, WARN, ERROR to database (not debug)
    if (level === 'debug') return;
    
    // Don't save to database during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') return;
    
    try {
      await connectDB();
      await Log.create({
        level: level.toUpperCase() as 'INFO' | 'WARN' | 'ERROR',
        message,
        context,
        timestamp: new Date(),
      });
    } catch (error) {
      // Fallback to console if database save fails - don't throw to avoid infinite loops
      if (this.isDevelopment) {
        console.error('Failed to save log to database:', error);
      }
    }
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    
    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      log += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (error) {
      log += `\nError: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        log += `\nStack: ${error.stack}`;
      }
    }
    
    return log;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedLog = this.formatLog(entry);

    // Console output
    if (level === 'error') {
      console.error(formattedLog);
    } else if (level === 'warn') {
      console.warn(formattedLog);
    } else if (level === 'debug' && this.isDevelopment) {
      console.debug(formattedLog);
    } else {
      console.log(formattedLog);
    }

    // Save to database (async, non-blocking)
    this.saveToDatabase(level, message, context).catch(() => {});
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  // Specific logging methods for common scenarios
  apiRequest(method: string, path: string, statusCode: number, duration: number) {
    this.info('API Request', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  dbQuery(operation: string, collection: string, duration: number) {
    this.debug('Database Query', {
      operation,
      collection,
      duration: `${duration}ms`,
    });
  }

  authEvent(event: string, userId?: string, success: boolean = true) {
    this.info('Authentication Event', {
      event,
      userId,
      success,
    });
  }

  securityEvent(event: string, details: Record<string, any>) {
    this.warn('Security Event', {
      event,
      ...details,
    });
  }
}

export const logger = new Logger();
