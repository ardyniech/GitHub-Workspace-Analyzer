import { ExtendedStyleRule } from '../logic/types';
import { getStyleGuideStorage, saveStyleGuideStorage } from '../../autoImprovement/storage/styleGuideStorage';

const OVERRIDES_KEY = 'agent_kb_developer_overrides';

export function getKnowledgeBaseRules(): ExtendedStyleRule[] {
  try {
    const manifest = getStyleGuideStorage();
    const rawOverrides = localStorage.getItem(OVERRIDES_KEY);
    const overridesMap: Record<string, Partial<ExtendedStyleRule>> = rawOverrides ? JSON.parse(rawOverrides) : {};

    return manifest.rules.map((rule) => {
      const override = overridesMap[rule.id];
      return {
        ...rule,
        status: override?.status || 'active',
        rule: override?.rule || rule.rule,
        rationale: override?.rationale || rule.rationale,
        impactScore: override?.impactScore ?? rule.impactScore,
        overrideNote: override?.overrideNote,
        updatedBy: override?.updatedBy || 'ai',
        lastModified: override?.lastModified || rule.createdAt,
      };
    });
  } catch (err) {
    console.error('[Module:knowledgeBase] Error in getKnowledgeBaseRules:', err);
    return [];
  }
}

export function saveDeveloperOverride(ruleId: string, updates: Partial<ExtendedStyleRule>): void {
  try {
    const rawOverrides = localStorage.getItem(OVERRIDES_KEY);
    const overridesMap: Record<string, Partial<ExtendedStyleRule>> = rawOverrides ? JSON.parse(rawOverrides) : {};

    overridesMap[ruleId] = {
      ...overridesMap[ruleId],
      ...updates,
      updatedBy: 'developer',
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overridesMap));
  } catch (err) {
    console.error('[Module:knowledgeBase] Error in saveDeveloperOverride:', err);
  }
}
