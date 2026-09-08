import { LearnedSkill, LearningCycleLog } from '../logic/types';

const LEARNING_STORAGE_KEY = 'agent_auto_learning_v1';
const LEARNING_HISTORY_KEY = 'agent_learning_history_v1';

const INITIAL_SKILLS: LearnedSkill[] = [
  {
    id: 'skill-strict-null-guards',
    name: 'Strict Null Guarding & Safe Traversal',
    category: 'code_quality',
    triggerCondition: 'Objek bersarang atau data API GitHub tanpa kepastian field',
    recommendedAction: 'Gunakan optional chaining (?.) dan default fallback eksplisit',
    confidenceScore: 95,
    timesApplied: 14,
    lastUpgradedAt: Date.now() - 3600000 * 20,
  },
  {
    id: 'skill-dep-vulnerability-hardening',
    name: 'Automated Manifest Hardening',
    category: 'security_hardening',
    triggerCondition: 'Terdeteksi CVE atau paket out-of-date pada package.json / requirements.txt',
    recommendedAction: 'Auto-upgrade ke versi patch terbaru dan validasi breaking changes',
    confidenceScore: 92,
    timesApplied: 8,
    lastUpgradedAt: Date.now() - 3600000 * 10,
  },
  {
    id: 'skill-modular-zero-mistake',
    name: 'Universal Modular Cellular Decoupling',
    category: 'workflow_automation',
    triggerCondition: 'Komunikasi antar modul atau ukuran file mendekati 100 baris',
    recommendedAction: 'Dekomposisi ke custom hook/primitives dan kirim event via core/dispatcher',
    confidenceScore: 98,
    timesApplied: 25,
    lastUpgradedAt: Date.now() - 3600000 * 2,
  },
];

export const learningStorage = {
  getSkills(): LearnedSkill[] {
    try {
      const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
      if (!raw) return INITIAL_SKILLS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  },

  saveSkills(skills: LearnedSkill[]): void {
    try {
      localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(skills));
    } catch (e) {
      console.error('[Module:Learning] Error saving skills:', e);
    }
  },

  getHistory(): LearningCycleLog[] {
    try {
      const raw = localStorage.getItem(LEARNING_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveHistory(history: LearningCycleLog[]): void {
    try {
      localStorage.setItem(LEARNING_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error('[Module:Learning] Error saving history:', e);
    }
  },

  clearAll(): void {
    this.saveSkills(INITIAL_SKILLS);
    this.saveHistory([]);
  },
};
