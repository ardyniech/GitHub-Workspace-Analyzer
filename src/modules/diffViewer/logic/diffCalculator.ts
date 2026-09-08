import { DiffLine, FileDiff } from './types';

export function generateDiff(fileName: string, originalCode: string, modifiedCode: string): FileDiff {
  const origLines = originalCode.split('\n');
  const modLines = modifiedCode.split('\n');

  const diffLines: DiffLine[] = [];
  let additions = 0;
  let deletions = 0;

  let oIdx = 0;
  let mIdx = 0;

  while (oIdx < origLines.length || mIdx < modLines.length) {
    const oLine = origLines[oIdx];
    const mLine = modLines[mIdx];

    if (oLine === mLine) {
      if (oLine !== undefined) {
        diffLines.push({
          type: 'normal',
          oldLineNumber: oIdx + 1,
          newLineNumber: mIdx + 1,
          content: oLine,
        });
      }
      oIdx++;
      mIdx++;
    } else {
      if (oLine !== undefined && !modLines.includes(oLine, mIdx)) {
        diffLines.push({
          type: 'delete',
          oldLineNumber: oIdx + 1,
          content: oLine,
        });
        deletions++;
        oIdx++;
      } else if (mLine !== undefined) {
        diffLines.push({
          type: 'add',
          newLineNumber: mIdx + 1,
          content: mLine,
        });
        additions++;
        mIdx++;
      } else {
        oIdx++;
        mIdx++;
      }
    }
  }

  return {
    fileName,
    originalCode,
    modifiedCode,
    diffLines,
    additions,
    deletions,
  };
}
