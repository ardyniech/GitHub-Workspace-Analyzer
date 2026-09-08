import React, { useState } from 'react';
import { RefactorProposal } from '../logic/aiRefactorTypes';
import { applyRefactorProposal } from '../logic/aiRefactorEngine';
import { DiffView } from '../../diffViewer';
import { Button } from '../../../shared/atoms/Button';
import { Wand2, Brain, PackageCheck, CheckCircle2, X, ArrowRight, Loader2 } from 'lucide-react';

interface AiRefactorModalProps {
  proposal: RefactorProposal;
  onClose: () => void;
}

export function AiRefactorModal({ proposal, onClose }: AiRefactorModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise((res) => setTimeout(res, 800));
    await applyRefactorProposal(proposal);
    setIsApplying(false);
    setIsApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[90vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">{proposal.title}</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Berdasarkan memori & standar koding AI Agent pada {proposal.repoFullName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary & Memory Rules */}
        <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 flex flex-col gap-2">
          <p className="text-zinc-800 font-medium leading-relaxed">{proposal.summary}</p>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-purple-900 uppercase flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-600" /> Memori Agent & Standar yang Diacu:
            </span>
            <ul className="list-disc pl-4 text-[10px] text-purple-800 space-y-0.5">
              {proposal.appliedMemories.map((mem, i) => (
                <li key={i}>{mem}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dependency Updates if any */}
        {proposal.dependencyUpdates.length > 0 && (
          <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-zinc-700 uppercase flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5 text-blue-600" /> Usulan Pembaruan Dependensi:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {proposal.dependencyUpdates.map((dep, idx) => (
                <div key={idx} className="p-1.5 bg-white rounded-lg border border-zinc-200 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-zinc-800">{dep.name}</span>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                    <span>{dep.currentVersion}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-zinc-400" />
                    <span className="font-bold text-emerald-600">{dep.proposedVersion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diffs Preview */}
        <div className="flex-1 overflow-y-auto min-h-[160px] flex flex-col gap-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Preview Perubahan Kode (Diff):</span>
          {proposal.changes.map((chg, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-600 font-medium">Alasan: {chg.reason}</span>
              <DiffView fileName={chg.fileName} originalCode={chg.originalCode} modifiedCode={chg.refactoredCode} />
            </div>
          ))}
        </div>

        {/* Action Button Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isApplying}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={isApplying || isApplied}
            icon={isApplied ? <CheckCircle2 className="w-3.5 h-3.5" /> : isApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold"
          >
            {isApplied ? 'Telah Diterapkan!' : isApplying ? 'Menerapkan Refactor...' : 'Terapkan Refactor'}
          </Button>
        </div>
      </div>
    </div>
  );
}
