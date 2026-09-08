export interface RepoTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: RepoTreeNode[];
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'core' | 'module' | 'shared' | 'ui';
  description: string;
  methods?: string[];
}

export interface ArchitectureRelation {
  source: string;
  target: string;
  type: 'uses' | 'subscribes' | 'registers';
  description: string;
}

export interface RepoVisualizerState {
  treeData: RepoTreeNode;
  nodes: ArchitectureNode[];
  relations: ArchitectureRelation[];
  lastUpdated: string;
}
