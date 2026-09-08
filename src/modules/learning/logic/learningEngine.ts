import { learningStorage } from '../storage/learningStorage';
import { LearnedSkill, LearningCycleLog, LearningSource } from './types';
import { memoryStorage } from '../../memory/storage/memoryStorage';

export function runLearningCycle(
  source: LearningSource,
  observation: string,
  repoFullName?: string
): LearningCycleLog {
  const currentSkills = learningStorage.getSkills();
  const history = learningStorage.getHistory();

  let synthesis = '';
  const upgradedSkillIds: string[] = [];

  // Autonomous synthesis based on observation
  if (source === 'peer_review' || observation.toLowerCase().includes('bug')) {
    synthesis = `Sintesis Pembelajaran: Terdeteksi pola repetisi masalah logika/gaya. Peningkatan parameter verifikasi pra-kompilasi.`;
    const skill = currentSkills.find((s) => s.id === 'skill-strict-null-guards');
    if (skill) {
      skill.timesApplied += 1;
      skill.confidenceScore = Math.min(100, skill.confidenceScore + 2);
      skill.lastUpgradedAt = Date.now();
      upgradedSkillIds.push(skill.id);
    }
  } else if (source === 'audit_scan' || observation.toLowerCase().includes('security')) {
    synthesis = `Sintesis Pembelajaran: Mengidentifikasi kerentanan dependensi. Memperkuat strategi auto-fix manifest.`;
    const skill = currentSkills.find((s) => s.id === 'skill-dep-vulnerability-hardening');
    if (skill) {
      skill.timesApplied += 1;
      skill.confidenceScore = Math.min(100, skill.confidenceScore + 1);
      skill.lastUpgradedAt = Date.now();
      upgradedSkillIds.push(skill.id);
    }
  } else {
    synthesis = `Sintesis Pembelajaran: Pola kerja modular berhasil dipertahankan secara konsisten.`;
    const skill = currentSkills.find((s) => s.id === 'skill-modular-zero-mistake');
    if (skill) {
      skill.timesApplied += 1;
      skill.lastUpgradedAt = Date.now();
      upgradedSkillIds.push(skill.id);
    }
  }

  // Save upgraded skills
  learningStorage.saveSkills(currentSkills);

  // Record into persistent memory knowledge base
  memoryStorage.addMemory({
    category: 'tool_skill',
    title: `Auto-Learning: ${source.replace('_', ' ').toUpperCase()}`,
    content: `${observation}\n${synthesis}`,
    repoFullName,
    tags: ['AutoLearning', 'SkillImprovement', source],
  });

  const cycleLog: LearningCycleLog = {
    id: `cycle-${Date.now()}`,
    timestamp: Date.now(),
    source,
    repoFullName,
    observation,
    synthesis,
    skillsUpgraded: upgradedSkillIds,
  };

  learningStorage.saveHistory([cycleLog, ...history]);
  return cycleLog;
}
