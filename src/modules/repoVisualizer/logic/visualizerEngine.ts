import { RepoVisualizerState, ArchitectureNode, ArchitectureRelation, RepoTreeNode } from './types';
import { getStoredVisualizerState, saveStoredVisualizerState } from '../storage/visualizerStorage';
import { dispatcher } from '../../../core/dispatcher';
import { devConsoleLogger } from '../../devConsole';

export function addSuggestedRefactorNode(
  nodeId: string,
  label: string,
  type: 'module' | 'core' | 'shared',
  description: string,
  methods: string[],
  relatedTo: string
): RepoVisualizerState {
  const state = getStoredVisualizerState();

  // Guard against duplicate
  if (state.nodes.some((n) => n.id === nodeId)) return state;

  // Add new Architecture node
  const newNode: ArchitectureNode = { id: nodeId, label, type, description, methods };
  state.nodes.push(newNode);

  // Add relationship
  const newRelation: ArchitectureRelation = {
    source: nodeId,
    target: relatedTo,
    type: 'uses',
    description: 'Saran refactoring modular otonom',
  };
  state.relations.push(newRelation);

  // Add to file tree (dynamically under src/modules or core depending on type)
  const modulesFolder = state.treeData.children?.find((c) => c.id === 'modules');
  if (modulesFolder && modulesFolder.children) {
    const cleanName = label.split('/').pop() || label;
    modulesFolder.children.push({
      id: nodeId,
      name: cleanName,
      type: 'folder',
      path: `src/modules/${cleanName}`,
    });
  }

  state.lastUpdated = new Date().toISOString();
  saveStoredVisualizerState(state);

  devConsoleLogger.addLog('info', 'Visualizer', `Visualisasi diperbarui real-time. Modul saran: "${label}" ditambahkan.`);
  dispatcher.emit('visualizer:updated', state);

  return state;
}

export function resetVisualizerState(): RepoVisualizerState {
  localStorage.removeItem('agent_repo_visualization_state_v1');
  const fresh = getStoredVisualizerState();
  dispatcher.emit('visualizer:updated', fresh);
  return fresh;
}
