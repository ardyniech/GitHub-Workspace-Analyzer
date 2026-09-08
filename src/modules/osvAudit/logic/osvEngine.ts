import { OsvVulnerabilityItem, DependencyAuditSummary } from './types';
import { fetchOsvAuditForPackages } from '../storage/osvApi';

const DEFAULT_WORKSPACE_PACKAGES = [
  { name: '@google/genai', version: '2.4.0' },
  { name: 'express', version: '4.21.2' },
  { name: 'react', version: '19.0.1' },
  { name: 'recharts', version: '3.10.1' },
  { name: 'd3', version: '7.9.0' },
  { name: 'vite', version: '6.2.3' },
  { name: 'ws', version: '8.21.3' },
  { name: 'dotenv', version: '17.2.3' },
];

export async function runDependencySecurityAudit(customDeps?: Record<string, string>): Promise<DependencyAuditSummary> {
  let pkgList = DEFAULT_WORKSPACE_PACKAGES;

  if (customDeps && Object.keys(customDeps).length > 0) {
    pkgList = Object.entries(customDeps).map(([name, ver]) => ({
      name,
      version: ver.replace(/[\^~]/g, ''),
    }));
  }

  const alerts = await fetchOsvAuditForPackages(pkgList);

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const moderateCount = alerts.filter((a) => a.severity === 'MODERATE').length;
  const lowCount = alerts.filter((a) => a.severity === 'LOW').length;
  const vulnerableCount = alerts.length;

  const totalDeps = pkgList.length;
  const penalty = criticalCount * 25 + highCount * 15 + moderateCount * 8 + lowCount * 4;
  const healthScorePct = Math.max(0, Math.min(100, 100 - penalty));

  return {
    totalDependenciesChecked: totalDeps,
    vulnerableCount,
    criticalCount,
    highCount,
    moderateCount,
    lowCount,
    healthScorePct,
    lastAuditedAt: new Date().toISOString(),
    alerts,
  };
}

export function getSeverityBadgeStyle(severity: string): { bg: string; text: string; border: string } {
  switch (severity) {
    case 'CRITICAL':
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
    case 'HIGH':
      return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
    case 'MODERATE':
      return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
    default:
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  }
}
