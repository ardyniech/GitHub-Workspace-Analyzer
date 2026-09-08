import { useState, useEffect, useMemo, useCallback } from 'react';
import { RepoRecommendation, RepoRecommendationStats, QuickActionItem } from './types';
import { generateRepoRecommendations, BASE_QUICK_ACTIONS } from './recommendationEngine';
import {
  getStoredRecommendationState,
  markRecommendationCompleted,
  markRecommendationDismissed,
} from '../storage/recommendationStorage';
import {
  dispatchRecommendationExecution,
  dispatchQuickActionExecution,
} from './recommendationDispatcher';
import { dispatcher } from '../../../core/dispatcher';

export function useRepoRecommendation(repoFullName: string) {
  const [recommendations, setRecommendations] = useState<RepoRecommendation[]>([]);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const reload = useCallback(() => {
    try {
      const base = generateRepoRecommendations(repoFullName);
      const stored = getStoredRecommendationState(repoFullName);
      const updated = base.map((r) => {
        if (stored.completedIds.includes(r.id)) return { ...r, status: 'completed' as const };
        if (stored.dismissedIds.includes(r.id)) return { ...r, status: 'dismissed' as const };
        return r;
      });
      setRecommendations(updated);
    } catch (err: any) {
      console.error('[Module:repoRecommendation] Error in reload:', err?.message || err);
    }
  }, [repoFullName]);

  useEffect(() => {
    reload();
  }, [reload]);

  const executeRecommendation = (rec: RepoRecommendation) => {
    if (executingId) return;
    setExecutingId(rec.id);
    setRecommendations((prev) =>
      prev.map((item) => (item.id === rec.id ? { ...item, status: 'executing' as const } : item))
    );

    dispatchRecommendationExecution(rec);

    setTimeout(() => {
      markRecommendationCompleted(repoFullName, rec.id);
      setRecommendations((prev) =>
        prev.map((item) => (item.id === rec.id ? { ...item, status: 'completed' as const } : item))
      );
      setExecutingId(null);
      dispatcher.emit('notify:push', {
        type: 'success',
        title: 'Tugas Selesai',
        message: `Rekomendasi "${rec.title}" telah dieksekusi dan dicatat.`,
      });
    }, 1800);
  };

  const executeQuickAction = (action: QuickActionItem) => {
    dispatchQuickActionExecution(action);
  };

  const dismissRecommendation = (id: string) => {
    markRecommendationDismissed(repoFullName, id);
    setRecommendations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'dismissed' as const } : item))
    );
  };

  const stats: RepoRecommendationStats = useMemo(() => {
    const total = recommendations.length;
    const completed = recommendations.filter((r) => r.status === 'completed').length;
    const criticalCount = recommendations.filter((r) => r.impact === 'critical' && r.status === 'idle').length;
    const readinessScore = total > 0 ? Math.round(((completed + 1) / (total + 1)) * 100) : 100;
    return { total, completed, criticalCount, readinessScore };
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((r) => {
      if (r.status === 'dismissed') return false;
      if (selectedCategory === 'all') return true;
      return r.category === selectedCategory;
    });
  }, [recommendations, selectedCategory]);

  return {
    recommendations: filteredRecommendations,
    rawRecommendations: recommendations,
    quickActions: BASE_QUICK_ACTIONS,
    stats,
    executingId,
    selectedCategory,
    setSelectedCategory,
    executeRecommendation,
    executeQuickAction,
    dismissRecommendation,
    refresh: reload,
  };
}
