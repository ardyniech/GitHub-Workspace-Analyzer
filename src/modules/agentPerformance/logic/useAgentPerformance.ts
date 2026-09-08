import { useState, useEffect } from 'react';
import { agentPerformanceStorage } from '../storage/performanceStorage';
import { AgentPerformanceDataPoint, AgentPerformanceMetrics } from './types';
import { dispatcher } from '../../../core/dispatcher';

export function useAgentPerformance() {
  const [trendData, setTrendData] = useState<AgentPerformanceDataPoint[]>([]);
  const [metrics, setMetrics] = useState<AgentPerformanceMetrics>({
    overallSuccessRate: 0,
    averageReviewScore: 0,
    totalAutoFixes: 0,
    totalReviews: 0,
    trendData: [],
  });

  const refresh = () => {
    const data = agentPerformanceStorage.getTrendData();
    setTrendData(data);
    setMetrics(agentPerformanceStorage.calculateMetrics(data));
  };

  useEffect(() => {
    refresh();

    // Listen to real-time events to auto-update performance data
    const unsubReview = dispatcher.on('peer_review:completed', (data: any) => {
      const current = agentPerformanceStorage.getTrendData();
      if (current.length > 0) {
        const today = current[current.length - 1];
        const newScore = data?.score ? Math.round((today.peerReviewScore + data.score) / 2) : today.peerReviewScore;
        const updated = [...current];
        updated[updated.length - 1] = {
          ...today,
          peerReviewScore: newScore,
          totalReviewsCompleted: today.totalReviewsCompleted + 1,
        };
        agentPerformanceStorage.saveTrendData(updated);
        refresh();
      }
    });

    const unsubCommit = dispatcher.on('repo:commit_pushed', () => {
      const current = agentPerformanceStorage.getTrendData();
      if (current.length > 0) {
        const today = current[current.length - 1];
        const updated = [...current];
        updated[updated.length - 1] = {
          ...today,
          totalAutoFixesApplied: today.totalAutoFixesApplied + 1,
          autoImprovementSuccessRate: Math.min(100, today.autoImprovementSuccessRate + 1),
        };
        agentPerformanceStorage.saveTrendData(updated);
        refresh();
      }
    });

    return () => {
      unsubReview();
      unsubCommit();
    };
  }, []);

  return {
    trendData,
    metrics,
    refresh,
  };
}
