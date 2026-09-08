import { DevConsoleLog, LogLevel } from './types';
import { dispatcher } from '../../../core/dispatcher';

class DevConsoleLogger {
  private logs: DevConsoleLog[] = [];
  private maxLogs = 100;

  constructor() {
    this.addLog('info', 'DevConsole', 'Hidden Developer Console Initialized.');
  }

  public addLog(level: LogLevel, moduleName: string, message: string, stackTrace?: string) {
    const entry: DevConsoleLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      level,
      moduleName,
      message,
      stackTrace,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    dispatcher.emit('dev_console:log_added', entry);
  }

  public getLogs(): DevConsoleLog[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    dispatcher.emit('dev_console:cleared', true);
  }
}

export const devConsoleLogger = new DevConsoleLogger();
