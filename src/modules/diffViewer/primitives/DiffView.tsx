import React, { useState } from 'react';
import { generateDiff } from '../logic/diffCalculator';
import { FileDiff } from '../logic/types';
import { Columns, AlignLeft } from 'lucide-react';

interface DiffViewProps {
  fileName: string;
  originalCode: string;
  modifiedCode: string;
}

export function DiffView({ fileName, originalCode, modifiedCode }: DiffViewProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const diff: FileDiff = generateDiff(fileName, originalCode, modifiedCode);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden text-xs font-mono shadow-md">
      {/* Header */}
      <div className="p-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-200">{fileName}</span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
            +{diff.additions}
          </span>
          <span className="text-[10px] text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800">
            -{diff.deletions}
          </span>
        </div>
        <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'split' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3 h-3" /> Split View
          </button>
          <button
            onClick={() => setViewMode('unified')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'unified' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlignLeft className="w-3 h-3" /> Unified View
          </button>
        </div>
      </div>

      {/* Code Display Body */}
      <div className="overflow-x-auto max-h-[360px] p-1">
        {viewMode === 'unified' ? (
          <table className="w-full text-left border-collapse">
            <tbody>
              {diff.diffLines.map((line, idx) => (
                <tr
                  key={idx}
                  className={
                    line.type === 'add'
                      ? 'bg-emerald-950/40 text-emerald-200'
                      : line.type === 'delete'
                      ? 'bg-red-950/40 text-red-300'
                      : 'text-zinc-400'
                  }
                >
                  <td className="w-10 px-2 py-0.5 text-right text-zinc-600 select-none border-r border-zinc-800/60">
                    {line.oldLineNumber || ''}
                  </td>
                  <td className="w-10 px-2 py-0.5 text-right text-zinc-600 select-none border-r border-zinc-800/60">
                    {line.newLineNumber || ''}
                  </td>
                  <td className="w-6 text-center select-none font-bold">
                    {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                  </td>
                  <td className="px-2 py-0.5 whitespace-pre">{line.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 gap-1 divide-x divide-zinc-800">
            {/* Left Original */}
            <div className="overflow-x-auto">
              <div className="text-[10px] text-zinc-500 font-bold px-2 py-1 bg-zinc-950/50 border-b border-zinc-800">Original (Sebelum)</div>
              {diff.diffLines.filter((l) => l.type !== 'add').map((line, i) => (
                <div key={i} className={`flex px-2 py-0.5 ${line.type === 'delete' ? 'bg-red-950/50 text-red-300 font-semibold' : 'text-zinc-400'}`}>
                  <span className="w-8 text-right text-zinc-600 mr-2 select-none">{line.oldLineNumber}</span>
                  <span className="whitespace-pre">{line.content}</span>
                </div>
              ))}
            </div>

            {/* Right Modified */}
            <div className="overflow-x-auto">
              <div className="text-[10px] text-zinc-500 font-bold px-2 py-1 bg-zinc-950/50 border-b border-zinc-800">Modified (Sesudah)</div>
              {diff.diffLines.filter((l) => l.type !== 'delete').map((line, i) => (
                <div key={i} className={`flex px-2 py-0.5 ${line.type === 'add' ? 'bg-emerald-950/50 text-emerald-200 font-semibold' : 'text-zinc-400'}`}>
                  <span className="w-8 text-right text-zinc-600 mr-2 select-none">{line.newLineNumber}</span>
                  <span className="whitespace-pre">{line.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
