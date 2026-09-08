export type LearningSource = 'audit_scan' | 'peer_review' | 'pre_commit_test' | 'user_interaction' | 'error_recovery';

export interface LearnedSkill {
  id: string;
  name: string;
  category: 'code_quality' | 'security_hardening' | 'pattern_optimization' | 'workflow_automation';
  triggerCondition: string;
  recommendedAction: string;
  confidenceScore: number; // 0 to 100
  timesApplied: number;
  lastUpgradedAt: number;
}

export interface LearningCycleLog {
  id: string;
  timestamp: number;
  source: LearningSource;
  repoFullName?: string;
  observation: string;
  synthesis: string;
  skillsUpgraded: string[];
}

export interface AutoLearningState {
  isAutoLearningActive: boolean;
  skills: LearnedSkill[];
  history: LearningCycleLog[];
  totalCyclesRun: number;
  lastCycleAt: number;
}
