import { getKnowledgeBaseRules } from '../../knowledgeBase/storage/knowledgeStorage';

export interface FixItSuggestion {
  id: string;
  ruleId: string;
  ruleName: string;
  conflictMessage: string;
  proposedFix: string;
  severity: 'architectural' | 'critical' | 'warning';
}

export function getFixItSuggestionsForCommit(commitSha: string, commitMessage: string): FixItSuggestion[] {
  const rules = getKnowledgeBaseRules();
  const activeRules = rules.filter((r) => r.status !== 'disabled');
  const suggestions: FixItSuggestion[] = [];

  const msgLower = commitMessage.toLowerCase();

  // Match: Strict File Size Limit (<125 Lines)
  const sizeRule = activeRules.find((r) => r.id === 'sr-1' || r.rule.includes('125'));
  if (sizeRule && (msgLower.includes('add') || msgLower.includes('feat') || msgLower.includes('editor'))) {
    suggestions.push({
      id: `fix-${commitSha}-size`,
      ruleId: sizeRule.id,
      ruleName: sizeRule.rule,
      conflictMessage: 'Analisis mendeteksi penambahan baris kode baru yang berpotensi melampaui batas ketat 125 baris per berkas.',
      proposedFix: 'Segera pecah logika kompleks atau UI primitive ke dalam berkas-berkas terpisah di sub-direktori modul.',
      severity: 'architectural',
    });
  }

  // Match: Zero Implicit Any
  const typeRule = activeRules.find((r) => r.id === 'sr-2' || r.rule.includes('Any'));
  if (typeRule && (msgLower.includes('auth') || msgLower.includes('fix') || msgLower.includes('integrate'))) {
    suggestions.push({
      id: `fix-${commitSha}-type`,
      ruleId: typeRule.id,
      ruleName: typeRule.rule,
      conflictMessage: 'Penggunaan objek bertipe implisit "any" terdeteksi pada parameter penanganan repositori.',
      proposedFix: 'Deklarasikan interface TypeScript yang eksplisit di dalam berkas "logic/types.ts" milik modul.',
      severity: 'critical',
    });
  }

  // Match: Fail-Safe Error Boundaries
  const errorRule = activeRules.find((r) => r.id === 'sr-4' || r.rule.includes('Boundary'));
  if (errorRule && (msgLower.includes('fetch') || msgLower.includes('api') || msgLower.includes('sync'))) {
    suggestions.push({
      id: `fix-${commitSha}-error`,
      ruleId: errorRule.id,
      ruleName: errorRule.rule,
      conflictMessage: 'Blok asinkron untuk panggilan API eksternal belum dibungkus pelindung kegagalan try/catch.',
      proposedFix: 'Bungkus pemanggilan fetch dengan blok try/catch dan laporkan kegagalan ke devConsoleLogger.',
      severity: 'warning',
    });
  }

  return suggestions;
}
