export interface RefactorChange {
  fileName: string;
  originalCode: string;
  refactoredCode: string;
  reason: string;
}

export interface RefactorProposal {
  id: string;
  repoFullName: string;
  commitContext?: string;
  title: string;
  summary: string;
  appliedMemories: string[];
  changes: RefactorChange[];
  dependencyUpdates: { name: string; currentVersion: string; proposedVersion: string }[];
  status: 'proposed' | 'applying' | 'applied';
}
