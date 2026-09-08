import { PreFlightState, PreFlightStatus } from './types';
import { getStoredPreFlightState, saveStoredPreFlightState } from '../storage/preFlightStorage';
import { dispatcher } from '../../../core/dispatcher';
import { devConsoleLogger } from '../../devConsole';

export function runPreFlightAudit(): void {
  const state = getStoredPreFlightState();
  
  devConsoleLogger.addLog('info', 'Pre-Flight', 'Memulai audit Pra-Push PR otonom...');
  dispatcher.emit('preflight:status', 'scanning');

  // Simulate progress steps
  let step = 0;
  const interval = setInterval(() => {
    step += 1;
    if (step === 1) {
      devConsoleLogger.addLog('info', 'Pre-Flight', 'Menganalisis dependensi arsitektur modular...');
    } else if (step === 2) {
      devConsoleLogger.addLog('info', 'Pre-Flight', 'Memindai kebocoran token sensitif dan celah keamanan...');
    } else if (step === 3) {
      devConsoleLogger.addLog('info', 'Pre-Flight', 'Memeriksa kestabilan try/catch pada blok asynchronous...');
    } else if (step >= 4) {
      clearInterval(interval);
      
      const updated: PreFlightState = {
        ...state,
        status: 'failed', // Blocked by critical issue and architectural violation
        score: 68,
        startedAt: new Date().toISOString(),
      };
      
      saveStoredPreFlightState(updated);
      devConsoleLogger.addLog('error', 'Pre-Flight', 'Audit Pra-Push gagal! Ditemukan 1 Pelanggaran Arsitektur dan 1 Isu Keamanan Kritis.');
      dispatcher.emit('preflight:updated', updated);
    }
  }, 1200);
}

export function autoFixPreFlightIssue(issueId: string): PreFlightState {
  const state = getStoredPreFlightState();
  
  // Find issue to fix
  const issueIndex = state.issues.findIndex((i) => i.id === issueId);
  if (issueIndex === -1) return state;
  
  const issue = state.issues[issueIndex];
  devConsoleLogger.addLog('info', 'Pre-Flight', `Menerapkan auto-fix senior level untuk: ${issue.ruleName}`);
  
  // Remove issue
  const remainingIssues = state.issues.filter((i) => i.id !== issueId);
  
  // Update file review status
  const updatedFiles = state.filesReviewed.map((f) => {
    if (f.filePath === issue.filePath) {
      const remainingForFile = remainingIssues.filter((i) => i.filePath === f.filePath).length;
      return {
        ...f,
        status: (remainingForFile === 0 ? 'passed' : 'warning') as 'passed' | 'failed' | 'warning',
        issuesCount: remainingForFile,
      };
    }
    return f;
  });
  
  // Recalculate score
  const hasCritical = remainingIssues.some((i) => i.severity === 'critical');
  const hasArch = remainingIssues.some((i) => i.severity === 'architectural');
  
  const newStatus: PreFlightStatus = remainingIssues.length === 0 
    ? 'passed' 
    : (hasCritical || hasArch ? 'failed' : 'failed'); // In pre-flight, any warning/critical blocker keeps failed until fixed
    
  const updated: PreFlightState = {
    ...state,
    issues: remainingIssues,
    filesReviewed: updatedFiles,
    status: remainingIssues.length === 0 ? 'passed' : 'failed',
    score: remainingIssues.length === 0 ? 100 : Math.min(95, state.score + 10),
  };
  
  saveStoredPreFlightState(updated);
  dispatcher.emit('preflight:updated', updated);
  
  return updated;
}

export function resetPreFlightState(): PreFlightState {
  localStorage.removeItem('agent_pr_pre_flight_state_v1');
  const fresh = getStoredPreFlightState();
  dispatcher.emit('preflight:updated', fresh);
  return fresh;
}
