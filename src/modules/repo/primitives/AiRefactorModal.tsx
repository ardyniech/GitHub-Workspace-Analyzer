import React, { useEffect } from 'react';
import { RefactorProposal } from '../logic/aiRefactorTypes';
import { useAiRefactor } from '../logic/useAiRefactor';
import { RefactorTargetSelector } from './RefactorTargetSelector';
import { RefactorDiffPreview } from './RefactorDiffPreview';
import { AiRefactorModalHeader } from './AiRefactorModalHeader';
import { AiRefactorModalFooter } from './AiRefactorModalFooter';
import { AlertCircle, Sparkles } from 'lucide-react';

interface AiRefactorModalProps {
  proposal: RefactorProposal;
  onClose: () => void;
}

export function AiRefactorModal({ proposal: initialProposal, onClose }: AiRefactorModalProps) {
  const {
    candidates,
    selectedFile,
    setSelectedFile,
    selectedGoal,
    setSelectedGoal,
    proposal,
    setProposal,
    isAnalyzing,
    isApplying,
    isApplied,
    error,
    runAnalysis,
    executeApply,
  } = useAiRefactor(initialProposal.repoFullName, initialProposal.commitContext);

  useEffect(() => {
    if (initialProposal.changes && initialProposal.changes.length > 0) {
      setProposal(initialProposal);
      if (initialProposal.targetFile) setSelectedFile(initialProposal.targetFile);
    } else {
      runAnalysis(initialProposal.targetFile || selectedFile || undefined);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[92vh] overflow-hidden text-xs">
        <AiRefactorModalHeader onClose={onClose} />

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <RefactorTargetSelector
          candidates={candidates}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
          selectedGoal={selectedGoal}
          onSelectGoal={setSelectedGoal}
          isAnalyzing={isAnalyzing}
          onAnalyze={() => runAnalysis(selectedFile, selectedGoal)}
        />

        <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[50vh] pr-1">
          {isAnalyzing ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-400">
              <Sparkles className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs font-medium text-zinc-600">
                Memindai AST & merefaktor kode riil dengan standar SOP...
              </span>
            </div>
          ) : proposal ? (
            <RefactorDiffPreview proposal={proposal} />
          ) : (
            <div className="h-48 flex items-center justify-center text-zinc-400 text-xs">
              Pilih berkas dan klik "Cetuskan Refaktor AI" untuk memulai.
            </div>
          )}
        </div>

        <AiRefactorModalFooter
          isApplied={isApplied}
          isApplying={isApplying}
          isAnalyzing={isAnalyzing}
          hasChanges={Boolean(proposal && proposal.changes && proposal.changes.length > 0)}
          onClose={onClose}
          onApply={executeApply}
        />
      </div>
    </div>
  );
}
