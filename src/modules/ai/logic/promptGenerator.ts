import { getKnowledgeBaseRules } from '../../knowledgeBase/storage/knowledgeStorage';
import { memoryStorage } from '../../memory/storage/memoryStorage';
import { calculatePromptEffectiveness, recordPromptUsage } from '../storage/promptScoringStorage';

export interface DynamicPromptItem {
  id: string;
  label: string;
  prompt: string;
  category: string;
  effectivenessScore: number;
  highlight?: boolean;
}

export function generateDynamicPrompts(repoFullName?: string): DynamicPromptItem[] {
  const repoName = repoFullName || 'repositori ini';
  const rules = getKnowledgeBaseRules().filter((r) => r.status !== 'disabled');
  const memories = memoryStorage.getMemories();

  const rawList: Omit<DynamicPromptItem, 'effectivenessScore'>[] = [];

  // 1. Style Rules Recommendations
  rules.slice(0, 3).forEach((rule, idx) => {
    rawList.push({
      id: `prompt-rule-${rule.id}`,
      label: `💡 Terapkan Aturan: ${rule.rule}`,
      prompt: `Berdasarkan rekomendasi koding agent [${rule.rule}]: ${rule.rationale}, audit dan refactor berkas utama di ${repoName} agar mematuhi standar ini.`,
      category: 'Style Standard',
      highlight: idx === 0,
    });
  });

  // 2. Memory Recommendations
  if (memories.length > 0) {
    const latestMem = memories[0];
    rawList.push({
      id: `prompt-mem-${latestMem.id}`,
      label: `🧠 Memori Agent: ${latestMem.title}`,
      prompt: `Berdasarkan catatan memori agent (${latestMem.title}: "${latestMem.content}"), lanjutkan optimasi dan pengembangan pada ${repoName}.`,
      category: 'Memory Followup',
      highlight: false,
    });
  }

  // 3. Testing & Security
  rawList.push({
    id: `prompt-sec-global`,
    label: `🛡️ Security & Dependency Audit`,
    prompt: `Lakukan Security Scan & Dependency Audit otomatis pada ${repoName}. Analisis kredensial, versi dependensi, dan berikan perbaikannya.`,
    category: 'Security',
    highlight: false,
  });

  rawList.push({
    id: `prompt-test-global`,
    label: `🧪 Auto-Generate Unit Test Suite`,
    prompt: `Buatkan berkas pengujian otomatis (Unit Test Suite) untuk modul utama di ${repoName} dengan penanganan error boundaries & strict type safety.`,
    category: 'Testing',
    highlight: false,
  });

  // Enrich with effectiveness scores & sort descending
  const enriched = rawList.map((item) => {
    const score = calculatePromptEffectiveness(item.id);
    return { ...item, effectivenessScore: score };
  });

  return enriched.sort((a, b) => b.effectivenessScore - a.effectivenessScore);
}

export function executePromptWithScoring(promptItem: DynamicPromptItem, onSend: (text: string) => void): void {
  recordPromptUsage(promptItem.id, true);
  onSend(promptItem.prompt);
}
