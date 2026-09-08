import { RepoVisualizerState } from '../logic/types';

const VISUALIZER_KEY = 'agent_repo_visualization_state_v1';

const DEFAULT_STATE: RepoVisualizerState = {
  treeData: {
    id: 'root',
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        id: 'core',
        name: 'core',
        type: 'folder',
        path: 'src/core',
        children: [
          { id: 'main', name: 'main.ts', type: 'file', path: 'src/core/main.ts' },
          { id: 'loader', name: 'loader.ts', type: 'file', path: 'src/core/loader.ts' },
          { id: 'dispatcher', name: 'dispatcher.ts', type: 'file', path: 'src/core/dispatcher.ts' },
        ],
      },
      {
        id: 'shared',
        name: 'shared',
        type: 'folder',
        path: 'src/shared',
        children: [
          { id: 'atoms', name: 'atoms', type: 'folder', path: 'src/shared/atoms' },
          { id: 'utils', name: 'utils', type: 'folder', path: 'src/shared/utils' },
        ],
      },
      {
        id: 'modules',
        name: 'modules',
        type: 'folder',
        path: 'src/modules',
        children: [
          { id: 'mod-ai', name: 'ai', type: 'folder', path: 'src/modules/ai' },
          { id: 'mod-task', name: 'agentTaskQueue', type: 'folder', path: 'src/modules/agentTaskQueue' },
          { id: 'mod-lint', name: 'proactiveLinter', type: 'folder', path: 'src/modules/proactiveLinter' },
        ],
      },
    ],
  },
  nodes: [
    { id: 'core-dispatcher', label: 'core/dispatcher', type: 'core', description: 'Event Bus terpusat untuk komunikasi antar-sel', methods: ['emit()', 'on()'] },
    { id: 'core-loader', label: 'core/loader', type: 'core', description: 'Registrasi otonom seluruh sub-modul', methods: ['loadAllModules()'] },
    { id: 'mod-ai', label: 'modules/ai', type: 'module', description: 'Hub dialog Asisten AI Copilot', methods: ['AiChat', 'AiChatActions'] },
    { id: 'mod-task-queue', label: 'modules/agentTaskQueue', type: 'module', description: 'Dasbor antrean tugas latar belakang otonom', methods: ['useTaskQueue', 'reorderTask'] },
    { id: 'mod-linter', label: 'modules/proactiveLinter', type: 'module', description: 'Linter latar belakang performa dan keamanan', methods: ['linterEngine', 'LinterIssueCard'] },
    { id: 'shared-atoms', label: 'shared/atoms', type: 'shared', description: 'Atom visual sistem desain terstandarisasi', methods: ['Button', 'Card', 'Loading'] },
  ],
  relations: [
    { source: 'mod-ai', target: 'core-dispatcher', type: 'uses', description: 'Komunikasi antar modul via event bus' },
    { source: 'mod-task-queue', target: 'core-dispatcher', type: 'uses', description: 'Menyiarkan pembaruan antrean tugas' },
    { source: 'mod-linter', target: 'core-dispatcher', type: 'uses', description: 'Mempublikasikan peringatan linter' },
    { source: 'core-loader', target: 'mod-ai', type: 'registers', description: 'Memasang runtime modul obrolan' },
    { source: 'core-loader', target: 'mod-task-queue', type: 'registers', description: 'Memasang modul antrean tugas' },
    { source: 'core-loader', target: 'mod-linter', type: 'registers', description: 'Memasang modul pemantau linter' },
    { source: 'mod-ai', target: 'shared-atoms', type: 'uses', description: 'Merender elemen UI standard' },
    { source: 'mod-task-queue', target: 'shared-atoms', type: 'uses', description: 'Merender kartu antrean & tombol' },
  ],
  lastUpdated: new Date().toISOString(),
};

export function getStoredVisualizerState(): RepoVisualizerState {
  try {
    const raw = localStorage.getItem(VISUALIZER_KEY);
    if (!raw) {
      localStorage.setItem(VISUALIZER_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Module:repoVisualizer] Error reading stored visualizer state:', err);
    return DEFAULT_STATE;
  }
}

export function saveStoredVisualizerState(state: RepoVisualizerState): void {
  try {
    localStorage.setItem(VISUALIZER_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[Module:repoVisualizer] Error saving visualizer state:', err);
  }
}
