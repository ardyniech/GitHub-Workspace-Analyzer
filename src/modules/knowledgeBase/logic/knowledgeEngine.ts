import { ExtendedStyleRule } from './types';
import { getKnowledgeBaseRules, saveDeveloperOverride } from '../storage/knowledgeStorage';
import { getStyleGuideStorage, saveStyleGuideStorage } from '../../autoImprovement/storage/styleGuideStorage';
import { devConsoleLogger } from '../../devConsole';
import { dispatcher } from '../../../core/dispatcher';

export function addCustomStandard(
  category: ExtendedStyleRule['category'],
  ruleText: string,
  rationaleText: string,
  impactScore: number
): ExtendedStyleRule {
  const newRule: ExtendedStyleRule = {
    id: `kb-custom-${Date.now()}`,
    category,
    rule: ruleText,
    rationale: rationaleText,
    impactScore,
    status: 'custom',
    updatedBy: 'developer',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };

  const manifest = getStyleGuideStorage();
  manifest.rules.unshift(newRule);
  saveStyleGuideStorage(manifest);

  saveDeveloperOverride(newRule.id, {
    status: 'custom',
    rule: ruleText,
    rationale: rationaleText,
    impactScore,
  });

  devConsoleLogger.addLog('info', 'KnowledgeEngine', `Pengembang menambahkan standar koding kustom: "${ruleText}"`);
  dispatcher.emit('knowledge_base:updated', getKnowledgeBaseRules());

  return newRule;
}

export function updateRuleOverride(
  ruleId: string,
  updates: Partial<ExtendedStyleRule>,
  developerNote?: string
): void {
  saveDeveloperOverride(ruleId, {
    ...updates,
    status: updates.status || 'overridden',
    overrideNote: developerNote || 'Disunting oleh pengembang',
  });

  devConsoleLogger.addLog('reasoning', 'KnowledgeEngine', `Aturan ${ruleId} disunting/di-override oleh pengembang.`);
  dispatcher.emit('knowledge_base:updated', getKnowledgeBaseRules());
}

export function toggleRuleStatus(ruleId: string, currentStatus?: string): void {
  const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
  saveDeveloperOverride(ruleId, { status: newStatus });

  devConsoleLogger.addLog('info', 'KnowledgeEngine', `Aturan ${ruleId} diubah statusnya menjadi ${newStatus}.`);
  dispatcher.emit('knowledge_base:updated', getKnowledgeBaseRules());
}
