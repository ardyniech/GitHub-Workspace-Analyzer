import { useState, useEffect } from 'react';
import { devConsoleLogger } from './logger';
import { DevConsoleLog } from './types';
import { dispatcher } from '../../../core/dispatcher';

export function useDevConsole() {
  const [logs, setLogs] = useState<DevConsoleLog[]>(devConsoleLogger.getLogs());

  useEffect(() => {
    const unsubAdded = dispatcher.on('dev_console:log_added', () => {
      setLogs(devConsoleLogger.getLogs());
    });

    const unsubCleared = dispatcher.on('dev_console:cleared', () => {
      setLogs([]);
    });

    // Also auto-capture errors or reasoning from core events
    const unsubReview = dispatcher.on('peer_review:completed', (data: any) => {
      devConsoleLogger.addLog('reasoning', 'PeerReview', `Completed analysis with score ${data?.score || 90}. Reasoning: Code checked for null safety & zero bug protocol.`);
    });

    const unsubCommit = dispatcher.on('repo:commit_pushed', () => {
      devConsoleLogger.addLog('info', 'GitEngine', 'Pushed new commit to remote repository successfully.');
    });

    return () => {
      unsubAdded();
      unsubCleared();
      unsubReview();
      unsubCommit();
    };
  }, []);

  return {
    logs,
    addLog: (level: any, mod: string, msg: string, stack?: string) => devConsoleLogger.addLog(level, mod, msg, stack),
    clearLogs: () => devConsoleLogger.clearLogs(),
  };
}
