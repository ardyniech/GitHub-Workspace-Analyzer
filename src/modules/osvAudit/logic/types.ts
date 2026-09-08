export type VulnerabilitySeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface OsvVulnerabilityItem {
  id: string;
  packageName: string;
  installedVersion: string;
  summary: string;
  severity: VulnerabilitySeverity;
  fixedVersion?: string;
  detailsUrl?: string;
  publishedAt?: string;
}

export interface DependencyAuditSummary {
  totalDependenciesChecked: number;
  vulnerableCount: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  lowCount: number;
  healthScorePct: number;
  lastAuditedAt: string;
  alerts: OsvVulnerabilityItem[];
}
