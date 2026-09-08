import { useState, useRef } from 'react';
import { useAuth } from '../../auth';
import { repoApi } from '../../repo';
import { dispatcher } from '../../../core/dispatcher';
import { CopilotFile } from './copilotProposalParser';

export interface PushProgress {
  current: number;
  total: number;
  percent: number;
  currentPath: string;
}

export function useCopilotPush(repoFullName: string) {
  const { token, isLoggedIn } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [commitResult, setCommitResult] = useState<any>(null);
  const [progress, setProgress] = useState<PushProgress | null>(null);
  const [pushedFiles, setPushedFiles] = useState<string[]>([]);
  const cancelRequested = useRef(false);

  const pushAllFiles = async (files: CopilotFile[], commitMessage: string) => {
    if (!isLoggedIn || !token) {
      setStatus('error');
      setErrorMessage('Hubungkan GitHub Personal Access Token (PAT) Anda terlebih dahulu.');
      return;
    }
    if (!files || files.length === 0) return;

    cancelRequested.current = false;
    setStatus('loading');
    setErrorMessage('');
    setPushedFiles([]);
    const successList: string[] = [];
    let lastCommitResult: any = null;

    try {
      for (let i = 0; i < files.length; i++) {
        if (cancelRequested.current) {
          throw new Error('Proses commit dibatalkan oleh pengguna.');
        }

        const file = files[i];
        const pct = Math.round(((i + 1) / files.length) * 100);
        setProgress({ current: i + 1, total: files.length, percent: pct, currentPath: file.path });

        const fileInfo = await repoApi.fetchFileContent(repoFullName, file.path, token);
        const msg = files.length > 1
          ? `${commitMessage} (${file.path})`
          : (commitMessage || `Update ${file.path} via AI Copilot`);

        const res = await repoApi.commitFile(
          repoFullName,
          file.path,
          file.content,
          msg,
          token,
          fileInfo.sha || undefined
        );

        lastCommitResult = res;
        successList.push(file.path);
        setPushedFiles([...successList]);
      }

      setCommitResult(lastCommitResult);
      setStatus('success');
      setProgress(null);
      dispatcher.emit('repo:commit_pushed', { repoFullName, files: successList });
    } catch (err: any) {
      console.error(`[Module:AI] Error in useCopilotPush: ${err.message || err}`);
      setStatus('error');
      setProgress(null);
      const friendly = err.message || 'Gagal mempublikasikan commit ke repositori.';
      setErrorMessage(
        successList.length > 0
          ? `${successList.length} dari ${files.length} berkas berhasil di-push sebelum terhenti: ${friendly}`
          : friendly
      );
    }
  };

  const cancelPush = () => {
    cancelRequested.current = true;
  };

  const pushCode = (path: string, content: string, commitMessage: string) => {
    return pushAllFiles([{ path, content }], commitMessage);
  };

  const resetStatus = () => {
    setStatus('idle');
    setErrorMessage('');
    setCommitResult(null);
    setProgress(null);
    setPushedFiles([]);
  };

  return {
    token,
    isLoggedIn,
    status,
    errorMessage,
    commitResult,
    progress,
    pushedFiles,
    pushCode,
    pushAllFiles,
    cancelPush,
    resetStatus,
  };
}
