export interface AgentPerformanceDataPoint {
  date: string; // e.g. '01 Sep', '02 Sep'
  timestamp: number;
  peerReviewScore: number; // 0 to 100
  autoImprovementSuccessRate: number; // percentage 0 to 100
  totalAutoFixesApplied: number;
  totalReviewsCompleted: number;
}

export interface AgentPerformanceMetrics {
  overallSuccessRate: number;
  averageReviewScore: number;
  totalAutoFixes: number;
  totalReviews: number;
  trendData: AgentPerformanceDataPoint[];
}
