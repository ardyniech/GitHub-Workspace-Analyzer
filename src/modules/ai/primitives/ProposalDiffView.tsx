import React, { useState, useEffect } from 'react';
import { repoApi } from '../../repo';
import { GitCompare, Code2, Loader2 } from 'lucide-react';

interface ProposalDiffViewProps {
  repoFullName: string;
  path: string;
  newContent: string;
  token?: string | null;
}

export function ProposalDiffView({ repoFullName, path, newContent, token }: ProposalDiffViewProps) {
  const [viewMode, setViewMode] = useState<'diff' | 'full'>('diff');
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    setLoading(true);
    repoApi
      .fetchFileContent(repoFullName, path, token)
      .then((res) => isMounted && setOriginalContent(res.content))
      .catch(() => isMounted && setOriginalContent(''))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [repoFullName, path, token]);

  const renderDiffLines = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-6 text-zinc-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Memuat perbandingan dari GitHub...</span>
        </div>
      );
    }

    const origLines = (originalContent || '').split('\n');
    const newLines = newContent.split('\n');
    const diffLines: { type: 'add' | 'del' | 'same'; text: string; num: number }[] = [];
    const maxLen = Math.max(origLines.length, newLines.length);

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i];
      const next = newLines[i];
      if (orig === undefined && next !== undefined) {
        diffLines.push({ type: 'add', text: `+ ${next}`, num: i + 1 });
      } else if (orig !== undefined && next === undefined) {
        diffLines.push({ type: 'del', text: `- ${orig}`, num: i + 1 });
      } else if (orig !== next) {
        diffLines.push({ type: 'del', text: `- ${orig}`, num: i + 1 });
        diffLines.push({ type: 'add', text: `+ ${next}`, num: i + 1 });
      } else {
        diffLines.push({ type: 'same', text: `  ${orig}`, num: i + 1 });
      }
    }

    return (
      <div className="font-mono text-[10.5px] leading-relaxed max-h-[220px] overflow-auto p-2 bg-zinc-950 text-zinc-200">
        {diffLines.map((line, idx) => (
          <div
            key={idx}
            className={`px-2 py-0.5 rounded-xs flex gap-2 ${
              line.type === 'add'
                ? 'bg-emerald-950/40 text-emerald-300 font-medium'
                : line.type === 'del'
                ? 'bg-rose-950/40 text-rose-300 opacity-80'
                : 'text-zinc-400'
            }`}
          >
            <span className="w-6 shrink-0 text-right opacity-30 select-none">{line.num}</span>
            <span className="whitespace-pre">{line.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-2.5 rounded-lg border border-zinc-200 overflow-hidden bg-white">
      <div className="px-2.5 py-1.5 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between text-[10px] font-semibold text-zinc-600">
        <span className="truncate max-w-[200px]">{path}</span>
        <div className="flex gap-1 bg-zinc-200 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer ${
              viewMode === 'diff' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <GitCompare className="w-3 h-3" /> <span>Git Diff</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer ${
              viewMode === 'full' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Code2 className="w-3 h-3" /> <span>Semua Kode</span>
          </button>
        </div>
      </div>
      {viewMode === 'diff' ? renderDiffLines() : (
        <pre className="p-2.5 bg-zinc-950 text-zinc-100 font-mono text-[10.5px] leading-relaxed max-h-[220px] overflow-auto whitespace-pre">
          <code>{newContent}</code>
        </pre>
      )}
    </div>
  );
}
