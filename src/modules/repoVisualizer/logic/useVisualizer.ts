import { useState, useEffect } from 'react';
import { RepoVisualizerState } from './types';
import { getStoredVisualizerState } from '../storage/visualizerStorage';
import { addSuggestedRefactorNode, resetVisualizerState } from './visualizerEngine';
import { dispatcher } from '../../../core/dispatcher';

export function useVisualizer() {
  const [state, setState] = useState<RepoVisualizerState>(getStoredVisualizerState());

  useEffect(() => {
    const unsub = dispatcher.on('visualizer:updated', (data: RepoVisualizerState) => {
      setState(data);
    });
    return () => unsub();
  }, []);

  const triggerMockRefactor = () => {
    const randomId = `mod-refactor-${Math.floor(Math.random() * 1000)}`;
    const randomNum = Math.floor(Math.random() * 4);
    const options = [
      { label: 'modules/optimizationEngine', desc: 'Mesin otomatis kompresi bundle JS dan optimasi resource', methods: ['optimizeAssets', 'compressImages'] },
      { label: 'modules/securityAudit', desc: 'Pemindai otomatis file manifestasi untuk identifikasi OAuth token bocor', methods: ['auditTokens', 'sanitizeLogs'] },
      { label: 'modules/telemetryLogger', desc: 'Log metrik runtime performa renderer klien secara real-time', methods: ['logMetric', 'getReport'] },
      { label: 'modules/cacheManager', desc: 'Adapter cache terisolasi untuk state manajemen luring', methods: ['getCache', 'setCache'] },
    ];
    const picked = options[randomNum];

    addSuggestedRefactorNode(
      randomId,
      picked.label,
      'module',
      picked.desc,
      picked.methods,
      'core-dispatcher'
    );
  };

  return {
    state,
    triggerMockRefactor,
    reset: () => setState(resetVisualizerState()),
    refresh: () => setState(getStoredVisualizerState()),
  };
}
