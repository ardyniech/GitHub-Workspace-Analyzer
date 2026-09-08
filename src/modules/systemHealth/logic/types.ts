export interface HealthMetricPoint {
  time: string;
  latencyMs: number;
  tokenEfficiencyPct: number;
  improvementSuccessPct: number;
}

export interface SystemHealthSummary {
  avgLatencyMs: number;
  tokenEfficiencyPct: number;
  overallSuccessRate: number;
  status: 'healthy' | 'degraded' | 'critical';
  totalRequests: number;
  activeModel: string;
}
