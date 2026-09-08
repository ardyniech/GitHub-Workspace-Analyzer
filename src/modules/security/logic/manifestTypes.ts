export interface DependencyItem {
  name: string;
  version: string;
  isDev?: boolean;
}

export interface VulnerabilityItem {
  packageName: string;
  installedVersion: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  fixedIn?: string;
  isOutdated: boolean;
}

export interface ManifestAuditResult {
  manifestType: 'package.json' | 'requirements.txt' | 'none';
  manifestPath: string;
  rawContent: string;
  dependencies: DependencyItem[];
  vulnerabilities: VulnerabilityItem[];
  overallRisk: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  aiSummary: string;
  outdatedCount: number;
}
