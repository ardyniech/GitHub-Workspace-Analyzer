export interface PromptScoreRecord {
  promptId: string;
  usageCount: number;
  successCount: number;
  lastUsedAt: string;
}

const SCORING_STORAGE_KEY = 'agent_prompt_effectiveness_scores_v1';

export function getPromptScores(): Record<string, PromptScoreRecord> {
  try {
    const raw = localStorage.getItem(SCORING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordPromptUsage(promptId: string, isSuccessful: boolean = true): void {
  try {
    const scores = getPromptScores();
    const existing = scores[promptId] || { promptId, usageCount: 0, successCount: 0, lastUsedAt: new Date().toISOString() };

    scores[promptId] = {
      promptId,
      usageCount: existing.usageCount + 1,
      successCount: existing.successCount + (isSuccessful ? 1 : 0),
      lastUsedAt: new Date().toISOString(),
    };

    localStorage.setItem(SCORING_STORAGE_KEY, JSON.stringify(scores));
  } catch (err) {
    console.error('[Module:AI] Error recording prompt usage:', err);
  }
}

export function calculatePromptEffectiveness(promptId: string): number {
  const scores = getPromptScores();
  const rec = scores[promptId];
  if (!rec || rec.usageCount === 0) return 92; // Default baseline confidence score
  return Math.min(100, Math.round((rec.successCount / rec.usageCount) * 100));
}
