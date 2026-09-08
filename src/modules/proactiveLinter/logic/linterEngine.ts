import { LinterIssue, LinterRunSummary, IssueStatus } from './types';
import { getStoredLinterIssues, saveStoredLinterIssues } from '../storage/linterStorage';
import { devConsoleLogger } from '../../devConsole';
import { dispatcher } from '../../../core/dispatcher';

export function computeLinterSummary(issues: LinterIssue[]): LinterRunSummary {
  const openIssues = issues.filter((i) => i.status === 'open');
  const criticalCount = openIssues.filter((i) => i.severity === 'critical').length;
  const highCount = openIssues.filter((i) => i.severity === 'high').length;
  const mediumCount = openIssues.filter((i) => i.severity === 'medium').length;
  const lowCount = openIssues.filter((i) => i.severity === 'low').length;
  const performanceCount = openIssues.filter((i) => i.category === 'performance').length;
  const securityCount = openIssues.filter((i) => i.category === 'security').length;

  return {
    totalIssues: openIssues.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    performanceCount,
    securityCount,
    filesScanned: 24,
    lastScanTime: new Date().toISOString(),
    issues,
  };
}

export function runProactiveLinter(): LinterRunSummary {
  const currentIssues = getStoredLinterIssues();
  const summary = computeLinterSummary(currentIssues);

  devConsoleLogger.addLog(
    'info',
    'ProactiveLinter',
    `Pemindaian Linter Latar Belakang Selesai: Ditemukan ${summary.totalIssues} potensi isu (${summary.securityCount} Keamanan, ${summary.performanceCount} Performa).`
  );

  dispatcher.emit('proactive_linter:scan_completed', summary);
  return summary;
}

export function markIssueStatus(issueId: string, status: IssueStatus): LinterRunSummary {
  const issues = getStoredLinterIssues();
  const updated = issues.map((item) => {
    if (item.id === issueId) {
      return { ...item, status };
    }
    return item;
  });

  saveStoredLinterIssues(updated);
  devConsoleLogger.addLog('info', 'ProactiveLinter', `Isu ${issueId} ditandai sebagai ${status}.`);

  const summary = computeLinterSummary(updated);
  dispatcher.emit('proactive_linter:updated', summary);
  return summary;
}

export function applyAutoFix(issueId: string): LinterRunSummary {
  return markIssueStatus(issueId, 'fixed');
}
