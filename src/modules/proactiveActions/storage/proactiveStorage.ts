import { ProactiveActionItem } from '../logic/types';

const PROACTIVE_STORAGE_KEY = 'agent_proactive_actions_history_v1';

const INITIAL_PROACTIVE_ACTIONS: ProactiveActionItem[] = [
  {
    id: 'proactive-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: 'type_safety',
    title: 'Autonomously Replaced Implicit Any with Explicit Interfaces',
    description: 'Sistem secara otomatis mendeklarasikan `PromptScoreRecord` dan `HealthMetricPoint` untuk menjamin 100% type safety.',
    rationale: 'Mencegah runtime TypeError dan meningkatkan autocompletion IDE bagi tim pengembang.',
    filesAffected: ['src/modules/ai/storage/promptScoringStorage.ts', 'src/modules/systemHealth/logic/types.ts'],
    verificationStatus: 'verified',
    impactLevel: 'high',
  },
  {
    id: 'proactive-2',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    category: 'architecture',
    title: 'Cellular Modular Refactoring for Header Actions',
    description: 'Mendekomposisi `AiChatHeader` menjadi sub-komponen `AiChatActions` kaku (<125 baris) secara independen.',
    rationale: 'Kepatuhan terhadap SOP Zero Mistake & aturan isolasi file kaku agar bebas regresi UI.',
    filesAffected: ['src/modules/ai/primitives/AiChatActions.tsx', 'src/modules/ai/primitives/AiChatHeader.tsx'],
    verificationStatus: 'verified',
    impactLevel: 'high',
  },
  {
    id: 'proactive-3',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: 'ergonomics',
    title: 'Touch Slop Optimization on Compact Control Buttons',
    description: 'Menambahkan padding sentuh tak terlihat (hit-slop >=44px) tanpa merusak kerapatan visual 8-12px.',
    rationale: 'Menjamin aksesibilitas perangkat seluler tanpa memboroskan ruang layar utama.',
    filesAffected: ['src/shared/atoms/Button.tsx'],
    verificationStatus: 'learned',
    impactLevel: 'medium',
  },
  {
    id: 'proactive-4',
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
    category: 'performance',
    title: 'Debounced Chart Canvas Resize Observer',
    description: 'Menerapkan debounce pada listener resize grafik Recharts untuk mencegah re-render berlebihan.',
    rationale: 'Menjaga responsivitas UI 60fps saat pengembang mengubah ukuran jendela browser.',
    filesAffected: ['src/modules/systemHealth/primitives/HealthChart.tsx'],
    verificationStatus: 'verified',
    impactLevel: 'medium',
  },
];

export function getProactiveActions(): ProactiveActionItem[] {
  try {
    const raw = localStorage.getItem(PROACTIVE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROACTIVE_STORAGE_KEY, JSON.stringify(INITIAL_PROACTIVE_ACTIONS));
      return INITIAL_PROACTIVE_ACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROACTIVE_ACTIONS;
  }
}

export function saveProactiveAction(action: ProactiveActionItem): void {
  try {
    const list = getProactiveActions();
    list.unshift(action);
    localStorage.setItem(PROACTIVE_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.error('[Module:ProactiveActions] Error saving action:', err);
  }
}

export function updateActionVerification(id: string, status: 'verified' | 'learned'): void {
  try {
    const list = getProactiveActions();
    const updated = list.map((item) => (item.id === id ? { ...item, verificationStatus: status } : item));
    localStorage.setItem(PROACTIVE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('[Module:ProactiveActions] Error updating verification:', err);
  }
}
