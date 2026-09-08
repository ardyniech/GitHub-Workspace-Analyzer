export interface DiffLine {
  type: 'add' | 'delete' | 'normal';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface FileDiff {
  fileName: string;
  originalCode: string;
  modifiedCode: string;
  diffLines: DiffLine[];
  additions: number;
  deletions: number;
}
