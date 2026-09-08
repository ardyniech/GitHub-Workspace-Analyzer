import { useState, useEffect } from 'react';
import { dispatcher } from '../../../core/dispatcher';
import { learningStorage } from '../storage/learningStorage';
import { runLearningCycle } from './learningEngine';
import { LearnedSkill, LearningCycleLog } from './types';

export function useAutoLearning(repoFullName?: string) {
  const [skills, setSkills] = useState<LearnedSkill[]>([]);
  const [history, setHistory] = useState<LearningCycleLog[]>([]);
  const [isAutoActive, setIsAutoActive] = useState(true);

  const refresh = () => {
    setSkills(learningStorage.getSkills());
    setHistory(learningStorage.getHistory());
  };

  useEffect(() => {
    refresh();

    // Listen to autonomous triggers across modules
    const unsubAudit = dispatcher.on('security:scan_complete', (data: any) => {
      if (isAutoActive) {
        runLearningCycle('audit_scan', `Scan keamanan selesai: Terdeteksi ${data?.vulnerableCount || 0} dependensi rentan.`, data?.repoFullName || repoFullName);
        refresh();
      }
    });

    const unsubReview = dispatcher.on('peer_review:completed', (data: any) => {
      if (isAutoActive) {
        runLearningCycle('peer_review', `Peer review selesai dengan skor ${data?.score}/100 dan ${data?.findingsCount || 0} temuan.`, data?.repoFullName || repoFullName);
        refresh();
      }
    });

    const unsubCommit = dispatcher.on('repo:commit_pushed', (data: any) => {
      if (isAutoActive) {
        runLearningCycle('user_interaction', `Commit & Push berhasil ke ${data?.filePath}. Memperkuat memori pola commit.`, data?.repoFullName || repoFullName);
        refresh();
      }
    });

    return () => {
      unsubAudit();
      unsubReview();
      unsubCommit();
    };
  }, [repoFullName, isAutoActive]);

  const triggerManualCycle = (observationText: string) => {
    const log = runLearningCycle('user_interaction', observationText, repoFullName);
    refresh();
    dispatcher.emit('notify:push', {
      type: 'success',
      title: 'Auto-Learning Cycle Selesai',
      message: `Agent berhasil menyerap wawasan baru & meng-upgrade skill otomatis.`,
    });
    return log;
  };

  const resetAll = () => {
    learningStorage.clearAll();
    refresh();
  };

  return {
    skills,
    history,
    isAutoActive,
    setIsAutoActive,
    triggerManualCycle,
    resetAll,
    refresh,
  };
}
