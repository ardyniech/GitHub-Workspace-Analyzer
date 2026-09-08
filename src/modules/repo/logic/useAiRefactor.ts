import { useState, useEffect } from 'react';
import { RefactorProposal, FileCandidate } from './aiRefactorTypes';
import { fetchRefactorCandidates, generateRealRefactorProposal, applyRefactorProposal } from './aiRefactorEngine';

export function useAiRefactor(repoFullName: string, initialCommitContext?: string) {
  const [candidates, setCandidates] = useState<FileCandidate[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('Dekomposisi Modular (<125 Baris)');
  const [proposal, setProposal] = useState<RefactorProposal | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchRefactorCandidates().then((list) => {
      if (!mounted) return;
      setCandidates(list);
      if (list.length > 0 && !selectedFile) {
        setSelectedFile(list[0].path);
      }
    }).catch((err) => {
      console.error('[Module:Refactor] Error fetching candidates:', err);
    });
    return () => { mounted = false; };
  }, []);

  const runAnalysis = async (customFile?: string, customGoal?: string) => {
    const targetPath = customFile || selectedFile;
    if (!targetPath) {
      setError('Silakan pilih berkas target yang ingin direfaktor.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setIsApplied(false);

    try {
      const generated = await generateRealRefactorProposal({
        repoFullName,
        filePath: targetPath,
        goal: customGoal || selectedGoal,
        commitMessage: initialCommitContext,
      });
      setProposal(generated);
    } catch (err: any) {
      console.error('[Module:Refactor] Error analyzing file:', err);
      setError(err?.message || 'Gagal menganalisis kode untuk refaktor.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeApply = async () => {
    if (!proposal) return;
    setIsApplying(true);
    setError(null);

    try {
      await applyRefactorProposal(proposal);
      setIsApplied(true);
      // Refresh candidates list after modification
      const updated = await fetchRefactorCandidates();
      setCandidates(updated);
    } catch (err: any) {
      console.error('[Module:Refactor] Error applying refactor:', err);
      setError(err?.message || 'Gagal menerapkan refaktor.');
    } finally {
      setIsApplying(false);
    }
  };

  return {
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
  };
}
