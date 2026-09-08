export interface StyleDeltaRecord {
  id: string;
  timestamp: string;
  version: string;
  action: 'rule_added' | 'rule_modified' | 'developer_override' | 'rule_disabled';
  ruleTitle: string;
  category: string;
  impactScoreBefore: number;
  impactScoreAfter: number;
  changeDescription: string;
}

export interface SelfAuditMetrics {
  totalCycles: number;
  activeRulesCount: number;
  overriddenCount: number;
  typeSafetyScore: number;
  architectureScore: number;
  evolutionTrendPercent: number;
}
