import { ProactiveActionItem, ProactiveSummary } from './types';
import { getProactiveActions, updateActionVerification } from '../storage/proactiveStorage';

export function computeProactiveSummary(): ProactiveSummary {
  const actions = getProactiveActions();
  return {
    totalActions: actions.length,
    verifiedCount: actions.filter((a) => a.verificationStatus === 'verified').length,
    learnedCount: actions.filter((a) => a.verificationStatus === 'learned').length,
    highImpactCount: actions.filter((a) => a.impactLevel === 'high').length,
  };
}

export function fetchFilteredProactiveActions(categoryFilter?: string): ProactiveActionItem[] {
  const actions = getProactiveActions();
  if (!categoryFilter || categoryFilter === 'all') return actions;
  return actions.filter((a) => a.category === categoryFilter);
}

export function markActionVerified(id: string): void {
  updateActionVerification(id, 'verified');
}

export function markActionLearned(id: string): void {
  updateActionVerification(id, 'learned');
}
