import React, { useState, useEffect } from 'react';
import { repoApi } from '../storage/api';
import { useAuth } from '../../auth';
import { dispatcher } from '../../../core/dispatcher';
import { EditorActionBar } from './EditorActionBar';
import { runPreCommitTests, PreCommitReport, PreCommitTestModal } from '../../tester';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface RepoCodeEditorProps {
  repoFullName: string;
  filePath: string;
  isNewFile?: boolean;
  onBack: () => void;
}

export function RepoCodeEditor({ repoFullName, filePath, isNewFile, onBack }: RepoCodeEditorProps) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [sha, setSha] = useState('');
  const [commitMsg, setCommitMsg] = useState(isNewFile ? `Create ${filePath}` : `Update ${filePath}`);
  const [loading, setLoading] = useState(!isNewFile);
  const [pushing, setPushing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');
  const [commitUrl, setCommitUrl] = useState('');
  const [testReport, setTestReport] = useState<PreCommitReport | null>(null);

  useEffect(() => {
    if (isNewFile || !token) { setLoading(false); return; }
    setLoading(true);
    repoApi.fetchFileContent(repoFullName, filePath, token)
      .then((res) => { setContent(res.content); setSha(res.sha); })
      .catch((err) => setErrorText(err.message || 'Gagal memuat berkas'))
      .finally(() => setLoading(false));
  }, [repoFullName, filePath, token, isNewFile]);

  const handlePreCommit = () => {
    if (!token) return;
    const rep = runPreCommitTests([{ path: filePath, content }]);
    setTestReport(rep);
  };

  const executePush = async () => {
    setTestReport(null);
    setPushing(true);
    setStatus('idle');
    try {
      const res = await repoApi.commitFile(repoFullName, filePath, content, commitMsg, token, sha || undefined);
      setStatus('success');
      setCommitUrl(res?.commit?.html_url || '');
      if (res?.content?.sha) setSha(res.content.sha);
      dispatcher.emit('repo:commit_pushed', { repoFullName, filePath });
    } catch (err: any) {
      setStatus('error');
      setErrorText(err.message || 'Gagal melakukan commit/push.');
    } finally {
      setPushing(false);
    }
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
        onPush={handlePreCommit}
        pushing={pushing}
        status={status}
        errorText={errorText}
        commitUrl={commitUrl}
      />

      {testReport && (
        <PreCommitTestModal report={testReport} fileCount={1} onConfirmPush={executePush} onCancel={() => setTestReport(null)} />
      )}
    </div>
  );
}
