import { useState, useEffect } from 'react';
import { RepoVisualizerState } from './types';
import { getStoredVisualizerState } from '../storage/visualizerStorage';
import { addSuggestedRefactorNode, resetVisualizerState } from './visualizerEngine';
import { dispatcher } from '../../../core/dispatcher';

export function useVisualizer() {
  const [state, setState] = useState<RepoVisualizerState>(getStoredVisualizerState());
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    const unsub = dispatcher.on('visualizer:updated', (data: RepoVisualizerState) => {
      setState(data);
    });
    const unsubRefactor = dispatcher.on('visualizer:apply_refactor', (data: { title?: string; description?: string }) => {
      const randomId = `mod-refactor-${Math.floor(Math.random() * 1000)}`;
      addSuggestedRefactorNode(
        randomId,
        data?.title ? data.title.replace('Refaktor Arsitektur: ', '') : 'modules/optimizedArchitecture',
        'module',
        data?.description || 'Modul hasil refaktor otonom agen yang dioptimalkan',
        ['executeOptimizer', 'validateIsolation'],
        'core-dispatcher'
      );
    });
    return () => {
      unsub();
      unsubRefactor();
    };
  }, []);

  const dispatchRefactorTask = () => {
    setIsDispatching(true);
    const options = [
      { label: 'modules/optimizationEngine', desc: 'Mesin otomatis kompresi bundle JS dan optimasi memori runtime', methods: ['optimizeAssets', 'compressImages'] },
      { label: 'modules/securityAudit', desc: 'Pemindai otomatis file manifestasi untuk identifikasi OAuth token bocor', methods: ['auditTokens', 'sanitizeLogs'] },
      { label: 'modules/telemetryLogger', desc: 'Log metrik runtime performa renderer klien secara real-time', methods: ['logMetric', 'getReport'] },
      { label: 'modules/cacheManager', desc: 'Adapter cache terisolasi untuk state manajemen luring', methods: ['getCache', 'setCache'] },
    ];
    const picked = options[Math.floor(Math.random() * options.length)];

    dispatcher.emit('agent_task:create_and_run', {
      title: `Refaktor: ${picked.label}`,
      description: `Refaktor arsitektur repositori: Dekomposisi ${picked.label} agar file <125 baris & terisolasi di dispatcher. ${picked.desc}`,
      category: 'refactoring',
      priority: 'high',
      status: 'pending',
      estimatedSeconds: 30,
    });

    setTimeout(() => setIsDispatching(false), 1200);
  };

  return {
    state,
    isDispatching,
    dispatchRefactorTask,
    triggerMockRefactor: dispatchRefactorTask,
    reset: () => setState(resetVisualizerState()),
    refresh: () => setState(getStoredVisualizerState()),
  };
}
