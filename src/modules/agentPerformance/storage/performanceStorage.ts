import { AgentPerformanceDataPoint, AgentPerformanceMetrics } from '../logic/types';

const PERFORMANCE_STORAGE_KEY = 'agent_performance_data_v1';

const DEFAULT_TREND_DATA: AgentPerformanceDataPoint[] = [
  { date: '01 Sep', timestamp: Date.now() - 3600000 * 24 * 6, peerReviewScore: 78, autoImprovementSuccessRate: 82, totalAutoFixesApplied: 4, totalReviewsCompleted: 5 },
  { date: '02 Sep', timestamp: Date.now() - 3600000 * 24 * 5, peerReviewScore: 82, autoImprovementSuccessRate: 85, totalAutoFixesApplied: 6, totalReviewsCompleted: 7 },
  { date: '03 Sep', timestamp: Date.now() - 3600000 * 24 * 4, peerReviewScore: 86, autoImprovementSuccessRate: 89, totalAutoFixesApplied: 8, totalReviewsCompleted: 8 },
  { date: '04 Sep', timestamp: Date.now() - 3600000 * 24 * 3, peerReviewScore: 88, autoImprovementSuccessRate: 91, totalAutoFixesApplied: 9, totalReviewsCompleted: 10 },
  { date: '05 Sep', timestamp: Date.now() - 3600000 * 24 * 2, peerReviewScore: 92, autoImprovementSuccessRate: 94, totalAutoFixesApplied: 12, totalReviewsCompleted: 12 },
  { date: '06 Sep', timestamp: Date.now() - 3600000 * 24 * 1, peerReviewScore: 94, autoImprovementSuccessRate: 96, totalAutoFixesApplied: 14, totalReviewsCompleted: 15 },
  { date: '07 Sep', timestamp: Date.now(), peerReviewScore: 96, autoImprovementSuccessRate: 98, totalAutoFixesApplied: 16, totalReviewsCompleted: 16 },
];

export const agentPerformanceStorage = {
  getTrendData(): AgentPerformanceDataPoint[] {
    try {
      const raw = localStorage.getItem(PERFORMANCE_STORAGE_KEY);
      if (!raw) return DEFAULT_TREND_DATA;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TREND_DATA;
    } catch {
      return DEFAULT_TREND_DATA;
    }
  },

  saveTrendData(data: AgentPerformanceDataPoint[]): void {
    try {
      localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[Module:AgentPerformance] Error saving data:', e);
    }
  },

  calculateMetrics(data: AgentPerformanceDataPoint[]): AgentPerformanceMetrics {
    if (!data.length) {
      return { overallSuccessRate: 0, averageReviewScore: 0, totalAutoFixes: 0, totalReviews: 0, trendData: [] };
    }
    const sumScore = data.reduce((acc, curr) => acc + curr.peerReviewScore, 0);
    const sumRate = data.reduce((acc, curr) => acc + curr.autoImprovementSuccessRate, 0);
    const totalAutoFixes = data.reduce((acc, curr) => acc + curr.totalAutoFixesApplied, 0);
    const totalReviews = data.reduce((acc, curr) => acc + curr.totalReviewsCompleted, 0);

    return {
      averageReviewScore: Math.round(sumScore / data.length),
      overallSuccessRate: Math.round(sumRate / data.length),
      totalAutoFixes,
      totalReviews,
      trendData: data,
    };
  },
};
