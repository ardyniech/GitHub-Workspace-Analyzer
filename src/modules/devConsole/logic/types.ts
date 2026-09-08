export type LogLevel = 'info' | 'warn' | 'error' | 'reasoning';

export interface DevConsoleLog {
  id: string;
  timestamp: number;
  level: LogLevel;
  moduleName: string;
  message: string;
  stackTrace?: string;
}
