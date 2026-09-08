import { FileWeightItem } from '../logic/types';

const INSIGHT_STORAGE_KEY = 'agent_insight_file_weights_v1';

const INITIAL_FILE_WEIGHTS: FileWeightItem[] = [
  {
    path: 'src/core/loader.ts',
    weightPct: 92,
    tokenCount: 420,
    category: 'config',
    relevanceReason: 'Central module loader and runtime registry for zero-regression dispatching.',
  },
  {
    path: 'src/modules/ai/primitives/AiChat.tsx',
    weightPct: 88,
    tokenCount: 1450,
    category: 'ui_layout',
    relevanceReason: 'Primary orchestration container for Copilot modals and active messaging state.',
  },
  {
    path: 'src/modules/selfAudit/logic/selfAuditEngine.ts',
    weightPct: 81,
    tokenCount: 680,
    category: 'core_logic',
    relevanceReason: 'Engine calculating 30-day coding style evolution and manifest compliance scores.',
  },
  {
    path: 'src/modules/systemHealth/primitives/HealthChart.tsx',
    weightPct: 76,
    tokenCount: 510,
    category: 'ui_layout',
    relevanceReason: 'Recharts visualization canvas rendering real-time API latency and token efficiency.',
  },
  {
    path: 'src/modules/proactiveActions/storage/proactiveStorage.ts',
    weightPct: 69,
    tokenCount: 890,
    category: 'schema',
    relevanceReason: 'Persistence store tracking autonomous agent refactoring history and rationale.',
  },
  {
    path: 'AGENTS.md',
    weightPct: 95,
    tokenCount: 1820,
    category: 'docs',
    relevanceReason: 'System operating procedure (SOP) containing zero-mistake directives and cellular rules.',
  },
];

export function getStoredFileWeights(): FileWeightItem[] {
  try {
    const raw = localStorage.getItem(INSIGHT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INSIGHT_STORAGE_KEY, JSON.stringify(INITIAL_FILE_WEIGHTS));
      return INITIAL_FILE_WEIGHTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FILE_WEIGHTS;
  }
}

export function saveStoredFileWeights(weights: FileWeightItem[]): void {
  try {
    localStorage.setItem(INSIGHT_STORAGE_KEY, JSON.stringify(weights));
  } catch (err) {
    console.error('[Module:AgentInsight] Error saving file weights:', err);
  }
}
