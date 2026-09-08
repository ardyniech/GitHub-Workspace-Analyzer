export interface FileCandidate {
  path: string;
  lines: number;
  size: number;
  priority: 'high' | 'medium' | 'normal';
}

export interface RefactorChange {
  fileName: string;
  originalCode: string;
  refactoredCode: string;
  reason: string;
}

export interface RefactorProposal {
  id: string;
  repoFullName: string;
  targetFile?: string;
  commitContext?: string;
  title: string;
  summary: string;
  appliedMemories: string[];
  changes: RefactorChange[];
  dependencyUpdates: { name: string; currentVersion: string; proposedVersion: string }[];
  status: 'proposed' | 'applying' | 'applied';
  lineCountBefore?: number;
  lineCountAfter?: number;
  appliedCommitHash?: string;
}

