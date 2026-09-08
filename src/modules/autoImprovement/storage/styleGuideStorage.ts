import { StyleGuideManifest, StyleRule, PrReviewOutcome } from '../logic/types';

const STORAGE_KEY = 'agent_style_guide_manifest';
const PR_HISTORY_KEY = 'agent_pr_review_outcomes';

const DEFAULT_INITIAL_RULES: StyleRule[] = [
  {
    id: 'sr-1',
    category: 'architecture',
    rule: 'Strict File Size Limit (<125 Lines)',
    rationale: 'Prevent monolithic file bloat & maintain clean modular cellular architecture.',
    impactScore: 98,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sr-2',
    category: 'type_safety',
    rule: 'Zero Implicit Any & Strict Props Interface',
    rationale: 'Guarantees 100% type safety and prevents runtime null pointer crashes.',
    impactScore: 95,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sr-3',
    category: 'ui_ux',
    rule: 'Touch Hit-Slop >=44px & Micro-Padding Ergonomics',
    rationale: 'Maintains touch target accessibility on mobile viewports while avoiding wasted space.',
    impactScore: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sr-4',
    category: 'error_handling',
    rule: 'Fail-Safe Error Boundaries & Humanized Messaging',
    rationale: 'Catches raw stack traces and presents actionable steps to end-users.',
    impactScore: 92,
    createdAt: new Date().toISOString(),
  },
];

export function getStyleGuideStorage(): StyleGuideManifest {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: StyleGuideManifest = {
        version: '1.2.0',
        lastUpdated: new Date().toISOString(),
        totalImprovementCycles: 3,
        rules: DEFAULT_INITIAL_RULES,
      };
      saveStyleGuideStorage(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Module:autoImprovement] Error in getStyleGuideStorage:', err);
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalImprovementCycles: 0,
      rules: DEFAULT_INITIAL_RULES,
    };
  }
}

export function saveStyleGuideStorage(manifest: StyleGuideManifest): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manifest));
  } catch (err) {
    console.error('[Module:autoImprovement] Error in saveStyleGuideStorage:', err);
  }
}

export function getPrOutcomesStorage(): PrReviewOutcome[] {
  try {
    const raw = localStorage.getItem(PR_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePrOutcomeStorage(outcome: PrReviewOutcome): void {
  try {
    const list = getPrOutcomesStorage();
    list.unshift(outcome);
    localStorage.setItem(PR_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.error('[Module:autoImprovement] Error in savePrOutcomeStorage:', err);
  }
}
