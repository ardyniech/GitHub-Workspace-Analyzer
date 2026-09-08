import { FileCandidate, RefactorProposal } from '../logic/aiRefactorTypes';

export const refactorApi = {
  async fetchCandidates(): Promise<FileCandidate[]> {
    try {
      const res = await fetch('/api/refactor/candidates');
      if (!res.ok) throw new Error('Gagal memindai berkas kandidat.');
      const data = await res.json();
      return data.candidates || [];
    } catch (err: any) {
      console.error('[Module:Refactor] Error in fetchCandidates:', err?.message || err);
      return [];
    }
  },

  async readFile(filePath: string): Promise<string> {
    const res = await fetch(`/api/refactor/read?path=${encodeURIComponent(filePath)}`);
    if (!res.ok) throw new Error(`Gagal membaca berkas: ${filePath}`);
    const data = await res.json();
    return data.content;
  },

  async analyze(options: {
    filePath: string;
    content?: string;
    goal?: string;
    commitContext?: string;
    repoFullName: string;
  }): Promise<RefactorProposal> {
    const res = await fetch('/api/refactor/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: options.filePath,
        content: options.content,
        goal: options.goal,
        commitContext: options.commitContext,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Analisis refaktor AI gagal.');
    }

    const data = await res.json();
    return {
      id: data.id,
      repoFullName: options.repoFullName,
      targetFile: options.filePath,
      commitContext: options.commitContext,
      title: data.title,
      summary: data.summary,
      appliedMemories: data.appliedRules || [],
      changes: [
        {
          fileName: options.filePath,
          originalCode: data.changes?.[0]?.originalCode || options.content || '',
          refactoredCode: data.refactoredCode,
          reason: data.reason,
        },
      ],
      dependencyUpdates: data.dependencyUpdates || [],
      status: 'proposed',
      lineCountBefore: data.lineCountBefore,
      lineCountAfter: data.lineCountAfter,
    };
  },

  async apply(filePath: string, refactoredCode: string, commitMessage: string): Promise<{
    success: boolean;
    commitHash: string;
    message: string;
    lines: number;
  }> {
    const res = await fetch('/api/refactor/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, refactoredCode, commitMessage }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal menerapkan refaktor ke sistem berkas.');
    }

    return res.json();
  },
};
