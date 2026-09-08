import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { dispatcher } from '../../../core/dispatcher';
import { useCodeEditor } from '../logic/useCodeEditor';
import { EditorActionBar } from './EditorActionBar';
import { runPreCommitTests, PreCommitReport, PreCommitTestModal } from '../../tester';
import { usePeerReview, PeerReviewModal, PeerReviewFinding } from '../../peerReview';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface RepoCodeEditorProps {
  repoFullName: string;
  filePath: string;
  isNewFile?: boolean;
  onBack: () => void;
}

export function RepoCodeEditor({ repoFullName, filePath, isNewFile, onBack }: RepoCodeEditorProps) {
  const { token } = useAuth();
  const { content, setContent, commitMsg, setCommitMsg, loading, pushing, status, errorText, commitUrl, executeCommit } =
    useCodeEditor(repoFullName, filePath, isNewFile, token);

  const [testReport, setTestReport] = useState<PreCommitReport | null>(null);
  const { report: reviewReport, reviewing, reviewFileCode, clearReport: clearReviewReport } = usePeerReview(repoFullName);

  const handlePreCommit = () => {
    if (!token) return;
    setTestReport(runPreCommitTests([{ path: filePath, content }]));
  };

  const handleApplyFix = (finding: PeerReviewFinding) => {
    if (finding.snippet && finding.suggestion) {
      const prompt = `Berikut file "${filePath}":\n\`\`\`\n${content}\n\`\`\`\nMohon perbaiki masalah "${finding.title}": ${finding.suggestion} pada bagian:\n\`\`\`\n${finding.snippet}\n\`\`\`\nKirimkan kode perbaikan lengkap.`;
      dispatcher.emit('ai:send_prompt', { prompt });
      clearReviewReport();
    }
  };

  const handleConfirmPush = async () => {
    setTestReport(null);
    clearReviewReport();
    await executeCommit();
  };

  const handleAskAi = () => {
    const prompt = `Tolong bantu saya menyempurnakan berkas "${filePath}". Berikut isi berkas:\n\`\`\`\n${content.slice(0, 2500)}\n\`\`\`\nBerikan usulan perubahan lengkap yang siap di-commit.`;
    dispatcher.emit('ai:send_prompt', { prompt });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-zinc-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-xs">Mengambil kode dari GitHub...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> <span>Kembali ke Daftar Berkas</span>
        </button>
        <span className="text-[10.5px] font-mono font-bold text-zinc-700 truncate max-w-[220px]">
          {isNewFile ? `+ ${filePath}` : filePath}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[180px] p-2.5 bg-zinc-950 text-zinc-100 font-mono text-[11px] rounded-lg border border-zinc-700 leading-relaxed outline-none resize-none focus:border-zinc-500"
        placeholder={isNewFile ? 'Tulis kode berkas baru di sini...' : 'Ketik atau edit kode...'}
      />

      <EditorActionBar
        commitMsg={commitMsg}
        setCommitMsg={setCommitMsg}
        onAskAi={handleAskAi}
        onPeerReview={() => reviewFileCode(filePath, content)}
        onPush={handlePreCommit}
        reviewing={reviewing}
        pushing={pushing}
        status={status}
        errorText={errorText}
        commitUrl={commitUrl}
      />

      {testReport && (
        <PreCommitTestModal report={testReport} fileCount={1} onConfirmPush={handleConfirmPush} onCancel={() => setTestReport(null)} />
      )}

      {reviewReport && (
        <PeerReviewModal report={reviewReport} onClose={clearReviewReport} onProceedAnyway={handlePreCommit} onApplyFix={handleApplyFix} />
      )}
    </div>
  );
}
