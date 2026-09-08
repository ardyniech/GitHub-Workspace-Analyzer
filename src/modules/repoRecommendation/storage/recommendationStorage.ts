const STORAGE_KEY_PREFIX = 'github_repo_recommendations_';

export interface StoredRecommendationState {
  completedIds: string[];
  dismissedIds: string[];
  lastUpdated: number;
}

export function getStoredRecommendationState(repoFullName: string): StoredRecommendationState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${repoFullName}`);
    if (!raw) {
      return { completedIds: [], dismissedIds: [], lastUpdated: Date.now() };
    }
    return JSON.parse(raw);
  } catch (err: any) {
    console.error(`[Module:repoRecommendation] Error in getStoredRecommendationState:`, err?.message || err);
    return { completedIds: [], dismissedIds: [], lastUpdated: Date.now() };
  }
}

export function saveStoredRecommendationState(repoFullName: string, state: StoredRecommendationState): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${repoFullName}`, JSON.stringify(state));
  } catch (err: any) {
    console.error(`[Module:repoRecommendation] Error in saveStoredRecommendationState:`, err?.message || err);
  }
}

export function markRecommendationCompleted(repoFullName: string, recId: string): void {
  const current = getStoredRecommendationState(repoFullName);
  if (!current.completedIds.includes(recId)) {
    current.completedIds.push(recId);
    current.lastUpdated = Date.now();
    saveStoredRecommendationState(repoFullName, current);
  }
}

export function markRecommendationDismissed(repoFullName: string, recId: string): void {
  const current = getStoredRecommendationState(repoFullName);
  if (!current.dismissedIds.includes(recId)) {
    current.dismissedIds.push(recId);
    current.lastUpdated = Date.now();
    saveStoredRecommendationState(repoFullName, current);
  }
}
