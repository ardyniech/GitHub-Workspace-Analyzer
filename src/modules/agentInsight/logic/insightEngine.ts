import { SemanticContextSummary, FileWeightItem } from './types';
import { getStoredFileWeights } from '../storage/insightStorage';

export function computeSemanticContext(repoFullName?: string): SemanticContextSummary {
  const files = getStoredFileWeights();
  const sorted = [...files].sort((a, b) => b.weightPct - a.weightPct);
  const totalTokens = sorted.reduce((acc, f) => acc + f.tokenCount, 0);

  return {
    repoFullName: repoFullName || 'SOP Cellular Architecture Workspace',
    totalContextTokens: totalTokens + 4200,
    maxContextTokens: 128000,
    topCategory: sorted[0]?.category || 'core_logic',
    primaryFocus: 'Cellular Modular Refactoring & Self-Auditing Architecture',
    reasoningOverview: 'AI Copilot mengutamakan berkas konfigurasi core/loader, manifest aturan AGENTS.md, serta modul UI aktif dalam memicu keputusan rekayasa.',
    files: sorted,
  };
}

export function filterFileWeightsByCategory(category: string, repoFullName?: string): FileWeightItem[] {
  const summary = computeSemanticContext(repoFullName);
  if (!category || category === 'all') return summary.files;
  return summary.files.filter((f) => f.category === category);
}
